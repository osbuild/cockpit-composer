# Extract the version from package.json
VERSION=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 1)
RELEASE=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 2)
PACKAGE_NAME := $(shell awk '/"name":/ {gsub(/[",]/, "", $$2); print $$2}' package.json)
TEST_OS ?= fedora-31
export TEST_OS
VM_IMAGE=$(CURDIR)/test/images/$(TEST_OS)
ifneq (,$(wildcard ~/.config/codecov-token))
BUILD_RUN = npm run build -- --with-coverage
else
BUILD_RUN = npm run build
endif
TARFILE=$(PACKAGE_NAME)-$(VERSION).tar.gz
# stamp file to check if/when npm install ran
NODE_MODULES_TEST=package-lock.json
# one example file in dist/ from webpack to check if that already ran
WEBPACK_TEST=public/dist/index.html

WEBLATE_REPO=tmp/weblate-repo
WEBLATE_REPO_URL=https://github.com/osbuild/cockpit-composer-weblate.git
WEBLATE_REPO_BRANCH=master

all: $(WEBPACK_TEST)

$(WEBPACK_TEST): $(NODE_MODULES_TEST) $(shell find {core,components,data,pages,utils} -type f) package.json webpack.config.js $(patsubst %,dist/po.%.js,$(LINGUAS))
	NODE_ENV=$(NODE_ENV) $(BUILD_RUN)

$(WEBLATE_REPO):
	git clone --depth=1 -b $(WEBLATE_REPO_BRANCH) $(WEBLATE_REPO_URL) $(WEBLATE_REPO)

po-pull: $(WEBLATE_REPO)
	cp $(WEBLATE_REPO)/*.po ./po/
	NODE_ENV=$(NODE_ENV) npm run translations:po2json

po-push: po/cockpit-composer.pot $(WEBLATE_REPO)
	cp ./po/cockpit-composer.pot $(WEBLATE_REPO)
	git -C $(WEBLATE_REPO) commit -m "Update source file" -- cockpit-composer.pot
	git -C $(WEBLATE_REPO) push

po/cockpit-composer.pot: $(WEBPACK_TEST)
	NODE_ENV=$(NODE_ENV) npm run translations:extract
	NODE_ENV=$(NODE_ENV) npm run translations:json2pot

install: all
	mkdir -p /usr/share/cockpit/composer
	cp -r public/* /usr/share/cockpit/composer
	mkdir -p /usr/share/metainfo/
	cp io.weldr.cockpit-composer.metainfo.xml /usr/share/metainfo/

# this requires a built source tree and avoids having to install anything system-wide
devel-install: $(WEBPACK_TEST)
	mkdir -p ~/.local/share/cockpit
	ln -s `pwd`/public/dist ~/.local/share/cockpit/composer


dist-gzip: $(TARFILE)

# when building a distribution tarball, call webpack with a 'production' environment
# we don't ship node_modules for license and compactness reasons; we ship a
# pre-built dist/ (so it's not necessary) and ship packge-lock.json (so that
# node_modules/ can be reconstructed if necessary)
$(TARFILE): NODE_ENV=production
$(TARFILE): $(WEBPACK_TEST) $(PACKAGE_NAME).spec
	if type appstream-util >/dev/null 2>&1; then appstream-util validate-relax --nonet *.metainfo.xml; fi
	mv node_modules node_modules.release
	touch -r package.json $(NODE_MODULES_TEST)
	touch public/dist/*
	tar czf $(PACKAGE_NAME)-$(VERSION).tar.gz --transform 's,^,$(PACKAGE_NAME)/,' \
		--exclude $(PACKAGE_NAME).spec.in \
		$$(git ls-files) package-lock.json $(PACKAGE_NAME).spec public/dist/
	mv node_modules.release node_modules

$(PACKAGE_NAME).spec: $(PACKAGE_NAME).spec.in
	sed -e 's|@VERSION@|$(VERSION)|' \
	    -e 's|@RELEASE@|$(RELEASE)|' \
	    < $(PACKAGE_NAME).spec.in > $(PACKAGE_NAME).spec

srpm: dist-gzip $(PACKAGE_NAME).spec
	/usr/bin/rpmbuild -bs \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_srcrpmdir $(CURDIR)" \
	  $(PACKAGE_NAME).spec

rpm: dist-gzip $(PACKAGE_NAME).spec
	mkdir -p "`pwd`/output"
	mkdir -p "`pwd`/rpmbuild"
	/usr/bin/rpmbuild -bb \
	  --define "_sourcedir `pwd`" \
	  --define "_specdir `pwd`" \
	  --define "_builddir `pwd`/rpmbuild" \
	  --define "_srcrpmdir `pwd`" \
	  --define "_rpmdir `pwd`/output" \
	  --define "_buildrootdir `pwd`/build" \
	  $(PACKAGE_NAME).spec
	find `pwd`/output -name '*.rpm' -printf '%f\n' -exec mv {} . \;
	rm -r "`pwd`/rpmbuild"

tag:
	@[ -n "$(NEWTAG)" ] || (echo "Run 'make NEWTAG=X.Y.Z tag' to tag a new release"; exit 1)
	@git log --no-merges --pretty="format:- %s (%ae)" $(VERSION).. |sed -e 's/@.*)/)/' > clog.tmp
	git tag -s -e -F clog.tmp $(NEWTAG); rm -f clog.tmp

eslint:
	npm run eslint

stylelint:
	npm run stylelint

buildrpm_image:
	sudo docker build -f Dockerfile.buildrpm --cache-from welder/buildrpm:latest -t welder/buildrpm:latest .

test_rpmbuild: buildrpm_image
	sudo docker run --rm --name buildrpm -v `pwd`:/composer welder/buildrpm:latest make rpm srpm

# build VMs
$(VM_IMAGE): rpm bots
	rm -f $(VM_IMAGE) $(VM_IMAGE).qcow2
	bots/image-customize -v \
		-i `pwd`/$(PACKAGE_NAME)-*.noarch.rpm \
		-i composer-cli \
		-u $(CURDIR)/test/files:/home/admin \
		-s $(CURDIR)/test/vm.install \
		$(TEST_OS)

# convenience target for the above
vm: $(VM_IMAGE)
	echo $(VM_IMAGE)

# run the CDP integration test
check: $(VM_IMAGE) test/common machine
	test/common/run-tests --test-dir=test/verify --enable-network

# run test with browser interactively
debug-check:
	TEST_SHOW_BROWSER=true $(MAKE) check

# run flake8 on files inside test/verify
flake8:
	flake8 test/verify/*

# checkout Cockpit's bots for standard test VM images and API to launch them
# must be from master, as only that has current and existing images; but testvm.py API is stable
# support CI testing against a bots change
bots:
	git clone --quiet --reference-if-able $${XDG_CACHE_HOME:-$$HOME/.cache}/cockpit-project/bots https://github.com/cockpit-project/bots.git
	if [ -n "$$COCKPIT_BOTS_REF" ]; then git -C bots fetch --quiet --depth=1 origin "$$COCKPIT_BOTS_REF"; git -C bots checkout --quiet FETCH_HEAD; fi
	@echo "checked out bots/ ref $$(git -C bots rev-parse HEAD)"

machine: bots
	rsync -avR --exclude="bots/machine/machine_core/__pycache__/" bots/machine/testvm.py bots/machine/identity bots/machine/cloud-init.iso bots/machine/machine_core bots/task/testmap.py test

# checkout Cockpit's test API; this has no API stability guarantee, so check out a stable tag
# this needs a recent adjustment for firefox 77 and working with
# network-enabled tests, so checkout a SHA until cockpit 221 releases
test/common:
	#git fetch --depth=1 https://github.com/cockpit-project/cockpit.git 221
	#git checkout --force FETCH_HEAD -- test/common
	git fetch https://github.com/cockpit-project/cockpit.git
	git checkout --force 48c716de7ebd -- test/common
	git reset test/common


$(NODE_MODULES_TEST): package.json
	# if it exists already, npm install won't update it; force that so that we always get up-to-date packages
	rm -f package-lock.json
	# unset NODE_ENV, skips devDependencies otherwise
	env -u NODE_ENV npm install
	env -u NODE_ENV npm prune

# The po-refresh bot expects these specific Makefile targets
update-po:
upload-pot: po-push
download-po: po-pull
clean-po:
	rm po/*.po

.PHONY: tag vm check debug-check flake8 devel-install
