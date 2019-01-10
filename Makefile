# Extract the version from package.json
VERSION=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 1)
RELEASE=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 2)
PACKAGE_NAME := $(shell awk '/"name":/ {gsub(/[",]/, "", $$2); print $$2}' package.json)
TEST_OS ?= fedora-29
BROWSER ?= firefox
export TEST_OS BROWSER
VM_IMAGE=$(CURDIR)/test/images/$(TEST_OS)
ifneq (,$(wildcard ~/.config/codecov-token))
BUILD_RUN = node run build --with-coverage
else
BUILD_RUN = npm run build
endif

all: npm-install
	NODE_ENV=$(NODE_ENV) $(BUILD_RUN)

npm-install-zanata: npm-install
	npm install --no-save zanata-js

po-pull: npm-install-zanata
	NODE_ENV=$(NODE_ENV) npm run translations:pull
	NODE_ENV=$(NODE_ENV) npm run translations:po2json

po-push: npm-install-zanata
	NODE_ENV=$(NODE_ENV) npm run translations:push

npm-install:
	npm install

install: all
	mkdir -p /usr/share/cockpit/welder
	cp -r public/* /usr/share/cockpit/welder
	mkdir -p /usr/share/metainfo/
	cp io.weldr.cockpit-composer.metainfo.xml /usr/share/metainfo/

dist-gzip: NODE_ENV=production
dist-gzip: all $(PACKAGE_NAME).spec
	mkdir -p $(PACKAGE_NAME)-$(VERSION)
	cp -r public/ LICENSE.txt README.md $(PACKAGE_NAME).spec io.weldr.cockpit-composer.metainfo.xml $(PACKAGE_NAME)-$(VERSION)
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
	sudo docker run --rm --name buildrpm -v `pwd`:/welder welder/buildrpm:latest make rpm srpm

local-clean:
	rm -rf test/images tmp $(PACKAGE_NAME).spec $(PACKAGE_NAME)*.rpm $(PACKAGE_NAME)*.tar.gz test/end-to-end/wdio_report

# build VMs
$(VM_IMAGE): local-clean rpm bots
	# VM running cockpit, composer, and end to end test container
	bots/image-customize -v \
		-i `pwd`/$(PACKAGE_NAME)-*.noarch.rpm \
		-s $(CURDIR)/test/vm.install \
		$(TEST_OS)

# convenience target for the above
vm: $(VM_IMAGE)
	echo $(VM_IMAGE)

# run the end to end test
check: $(VM_IMAGE)
	PYTHONPATH=`pwd`/bots/machine test/check-application -v -b $(BROWSER) -C 2 -M 2048 $(TEST_OS)

# debug end to end test
debug-check:
	DEBUG_TEST=true $(MAKE) check

# checkout Cockpit's bots/ directory for standard test VM images and API to launch them
# must be from cockpit's master, as only that has current and existing images; but testvm.py API is stable
bots:
	git fetch --depth=1 https://github.com/cockpit-project/cockpit.git
	git checkout --force FETCH_HEAD -- bots/
	git reset bots

# The po-refresh bot expects these specific Makefile targets
update-po:
upload-pot: po-push
download-po: po-pull

.PHONY: tag local-clean vm check
