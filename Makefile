# Extract the version from package.json
VERSION=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 1)
RELEASE=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 2)
PACKAGE_NAME := $(shell awk '/"name":/ {gsub(/[",]/, "", $$2); print $$2}' package.json)
TEST_OS ?= fedora-31
BROWSER ?= firefox
export TEST_OS BROWSER
VM_IMAGE=$(CURDIR)/test/images/$(TEST_OS)
ifneq (,$(wildcard ~/.config/codecov-token))
BUILD_RUN = npm run build -- --with-coverage
else
BUILD_RUN = npm run build
endif

WEBLATE_REPO=tmp/weblate-repo
WEBLATE_REPO_URL=https://github.com/weldr/cockpit-composer-weblate.git
WEBLATE_REPO_BRANCH=master

all: npm-install
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

po/cockpit-composer.pot: npm-install
	NODE_ENV=$(NODE_ENV) npm run translations:extract
	NODE_ENV=$(NODE_ENV) npm run translations:json2pot

npm-install:
	npm install

install: all
	mkdir -p /usr/share/cockpit/composer
	cp -r public/* /usr/share/cockpit/composer
	mkdir -p /usr/share/metainfo/
	cp io.weldr.cockpit-composer.metainfo.xml /usr/share/metainfo/

# this requires a built source tree and avoids having to install anything system-wide
devel-install:
	mkdir -p ~/.local/share/cockpit
	ln -s `pwd`/public/dist ~/.local/share/cockpit/composer

dist-gzip: NODE_ENV=production
dist-gzip: all $(PACKAGE_NAME).spec
	mkdir -p $(PACKAGE_NAME)-$(VERSION)
	cp -r public/ test/ LICENSE.txt README.md $(PACKAGE_NAME).spec io.weldr.cockpit-composer.metainfo.xml $(PACKAGE_NAME)-$(VERSION)
	tar -czf $(PACKAGE_NAME)-$(VERSION).tar.gz $(PACKAGE_NAME)-$(VERSION)
	rm -rf $(PACKAGE_NAME)-$(VERSION)

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

local-clean:
	rm -rf test/images tmp $(PACKAGE_NAME).spec $(PACKAGE_NAME)*.rpm $(PACKAGE_NAME)*.tar.gz test/end-to-end/wdio_report

# build VMs
$(VM_IMAGE): local-clean rpm bots
	# VM running cockpit, composer, and end to end test container
	bots/image-customize -v \
		-r "echo $(BROWSER) > /tmp/BROWSER" \
		-i `pwd`/$(PACKAGE_NAME)-*.noarch.rpm \
		-s $(CURDIR)/test/vm.install \
		$(TEST_OS)

# convenience target for the above
vm: $(VM_IMAGE)
	echo $(VM_IMAGE)

# run the end to end test
check: $(VM_IMAGE)
	PYTHONPATH=`pwd`/bots/machine test/check-application -v -b $(BROWSER) -C 2 $(TEST_OS)

# debug end to end test
debug-check:
	DEBUG_TEST=true $(MAKE) check

# checkout Cockpit's bots for standard test VM images and API to launch them
# must be from master, as only that has current and existing images; but testvm.py API is stable
# support CI testing against a bots change
bots:
	git clone --quiet --reference-if-able $${XDG_CACHE_HOME:-$$HOME/.cache}/cockpit-project/bots https://github.com/cockpit-project/bots.git
	if [ -n "$$COCKPIT_BOTS_REF" ]; then git -C bots fetch --quiet --depth=1 origin "$$COCKPIT_BOTS_REF"; git -C bots checkout --quiet FETCH_HEAD; fi
	@echo "checked out bots/ ref $$(git -C bots rev-parse HEAD)"

# The po-refresh bot expects these specific Makefile targets
update-po:
upload-pot: po-push
download-po: po-pull
clean-po:
	rm po/*.po

.PHONY: tag local-clean vm check devel-install
