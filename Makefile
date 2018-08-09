# Extract the version from package.json
VERSION=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 1)
RELEASE=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 2)
PACKAGE_NAME := $(shell python3 -c "import json; print(json.load(open('package.json'))['name'])")
ifeq ($(TEST_OS),)
TEST_OS = rhel-7-6
endif
export TEST_OS CURDIR
VM_IMAGE=$(CURDIR)/test/images/$(TEST_OS)
ifdef TEST_COV
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

dist-gzip: NODE_ENV=production
dist-gzip: po-pull all
	mkdir -p $(PACKAGE_NAME)-$(VERSION)
	cp -r public/ LICENSE.txt README.md $(PACKAGE_NAME)-$(VERSION)
	tar -czf $(PACKAGE_NAME)-$(VERSION).tar.gz $(PACKAGE_NAME)-$(VERSION)
	rm -rf $(PACKAGE_NAME)-$(VERSION)

$(PACKAGE_NAME).spec: $(PACKAGE_NAME).spec.in
	sed -e 's|@VERSION@|$(VERSION)|' \
	    -e 's|@RELEASE@|$(RELEASE)|' \
	    < $(PACKAGE_NAME).spec.in > $(PACKAGE_NAME).spec

cockpit-composer.spec: cockpit-composer.spec.in
	sed -e 's|@VERSION@|$(VERSION)|' \
	    -e 's|@RELEASE@|$(RELEASE)|' \
	    < cockpit-composer.spec.in > cockpit-composer.spec

srpm: dist-gzip $(PACKAGE_NAME).spec
	/usr/bin/rpmbuild -bs \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_srcrpmdir $(CURDIR)" \
	  $(PACKAGE_NAME).spec

cockpit-composer-srpm: dist-gzip cockpit-composer.spec
	/usr/bin/rpmbuild -bs \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_srcrpmdir $(CURDIR)" \
	  cockpit-composer.spec

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

cockpit-composer-rpm: dist-gzip cockpit-composer.spec
	mkdir -p "`pwd`/output"
	mkdir -p "`pwd`/rpmbuild"
	/usr/bin/rpmbuild -bb \
	  --define "_sourcedir `pwd`" \
	  --define "_specdir `pwd`" \
	  --define "_builddir `pwd`/rpmbuild" \
	  --define "_srcrpmdir `pwd`" \
	  --define "_rpmdir `pwd`/output" \
	  --define "_buildrootdir `pwd`/build" \
	  cockpit-composer.spec
	find `pwd`/output -name '*.rpm' -printf '%f\n' -exec mv {} . \;
	rm -r "`pwd`/rpmbuild"

tag:
	@[ -n "$(NEWTAG)" ] || (echo "Run 'make NEWTAG=X.Y.Z tag' to tag a new release"; exit 1)
	@git log --no-merges --pretty="format:- %s (%ae)" $(VERSION).. |sed -e 's/@.*)/)/' > clog.tmp
	git tag -s -e -F clog.tmp $(NEWTAG); rm -f clog.tmp

buildrpm_image:
	sudo docker build -f Dockerfile.buildrpm --cache-from welder/buildrpm:latest -t welder/buildrpm:latest .

eslint:
	npm run eslint

stylelint:
	npm run stylelint

unit-test:
	npm run test:cov

test_rpmbuild: buildrpm_image
	sudo docker run --rm --name buildrpm -v `pwd`:/welder welder/buildrpm:latest make rpm srpm

test_rpmbuild_cockpit-composer: buildrpm_image
	sudo docker run --rm --name buildrpm -v `pwd`:/welder welder/buildrpm:latest make cockpit-composer-rpm cockpit-composer-srpm

# build VMs
$(VM_IMAGE): cockpit-composer-rpm bots
	# VM running cockpit and composer
	bots/image-customize -v \
		-r 'sed -i "s,devel/candidate-trees,nightly," /etc/yum.repos.d/nightly.repo' \
		-i `pwd`/cockpit-composer-*.noarch.rpm \
		-s $(CURDIR)/test/end-to-end/run/vm.install \
		$(TEST_OS)
	# VM running end to end test
	bots/image-customize -v \
		-r 'mkdir -p /root/webdriver_report' \
		-i xclip \
		-u test/end-to-end/:/root/ \
		-r 'cd /root/end-to-end && npm install' \
		fedora-28
	# VM running as selenium server
	bots/image-customize -v \
		-u test/end-to-end/run/selenium_start.sh:/root/ \
		selenium

# convenience target for the above
vm: $(VM_IMAGE)
	echo $(VM_IMAGE)

# run the end to end test
check: $(VM_IMAGE)
	PYTHONPATH=`pwd`/bots/machine test/end-to-end/run/check-application $(TEST_OS)

# checkout Cockpit's bots/ directory for standard test VM images and API to launch them
# must be from cockpit's master, as only that has current and existing images; but testvm.py API is stable
bots:
	git fetch --depth=1 https://github.com/cockpit-project/cockpit.git
	git checkout --force FETCH_HEAD -- bots/
	git reset bots

.PHONY: metadata.db vm prepare check bots tag welder-web.spec cockpit-composer.spec
