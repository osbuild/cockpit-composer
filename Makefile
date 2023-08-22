# Extract the version from package.json
VERSION=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 1)
RELEASE=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 2)
TEST_OS ?= fedora-37
export TEST_OS
VM_IMAGE=$(CURDIR)/test/images/$(TEST_OS)

build:
	npm ci
	npm run build:prod

spec:
	sed -e 's|@VERSION@|$(VERSION)|' \
	    -e 's|@RELEASE@|$(RELEASE)|' \
	    < cockpit-composer.spec.in > cockpit-composer.spec


# when building a distribution tarball, call webpack with a 'production' environment
# we don't ship node_modules for license and compactness reasons; we ship a
# pre-built public/ (so it's not necessary) and ship packge-lock.json (so that
# node_modules/ can be reconstructed if necessary)
dist-gzip: NODE_ENV=production
dist-gzip: build spec
	touch -r package.json package-lock.json
	touch public/*
	tar czf cockpit-composer-$(VERSION).tar.gz --transform 's,^,cockpit-composer/,' \
		--exclude cockpit-composer.spec.in \
		$$(git ls-files) translations/compiled/* package-lock.json cockpit-composer.spec public/

srpm: dist-gzip
	rpmbuild -bs \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_srcrpmdir $(CURDIR)" \
	  cockpit-composer.spec

rpm: dist-gzip
	mkdir -p "$(CURDIR)/output"
	mkdir -p "$(CURDIR)/rpmbuild"
	rpmbuild -bb \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_specdir $(CURDIR)" \
	  --define "_builddir $(CURDIR)/rpmbuild" \
	  --define "_srcrpmdir $(CURDIR)" \
	  --define "_rpmdir $(CURDIR)/output" \
	  cockpit-composer.spec
	find $(CURDIR)/output -name '*.rpm' -printf '%f\n' -exec mv {} . \;
	rm -r "$(CURDIR)/rpmbuild"

ifeq ("$(TEST_SCENARIO)","pybridge")
COCKPIT_PYBRIDGE_REF = main
COCKPIT_WHEEL = cockpit-0-py3-none-any.whl

$(COCKPIT_WHEEL):
	pip wheel git+https://github.com/cockpit-project/cockpit.git@${COCKPIT_PYBRIDGE_REF}

VM_DEPENDS = $(COCKPIT_WHEEL)
VM_CUSTOMIZE_FLAGS = --install $(COCKPIT_WHEEL)
endif

vm: rpm bots $(VM_DEPENDS)
	rm -f $(VM_IMAGE) $(VM_IMAGE).qcow2
	bots/image-customize -v \
		$(VM_CUSTOMIZE_FLAGS) \
		--resize 20G \
		-i `pwd`/cockpit-composer-*.noarch.rpm \
		-i composer-cli \
		-u $(CURDIR)/test/files:/home/admin \
		-u $(CURDIR)/test/osbuild-mock.repo:/etc/yum.repos.d \
		-s $(CURDIR)/test/vm.install \
		$(TEST_OS)

# run the CDP integration test
check: vm test/common machine
	test/common/run-tests --nondestructive-memory-mb 2048 --test-dir=test/verify --enable-network ${RUN_TESTS_OPTIONS}

lint:
	npm run lint

# run flake8 on files inside test/verify
flake8:
	flake8 test/verify/*

# checkout Cockpit's bots for standard test VM images and API to launch them
# must be from main, as only that has current and existing images; but testvm.py API is stable
# support CI testing against a bots change
bots:
	git clone --quiet --reference-if-able $${XDG_CACHE_HOME:-$$HOME/.cache}/cockpit-project/bots https://github.com/cockpit-project/bots.git
	if [ -n "$$COCKPIT_BOTS_REF" ]; then git -C bots fetch --quiet --depth=1 origin "$$COCKPIT_BOTS_REF"; git -C bots checkout --quiet FETCH_HEAD; fi
	@echo "checked out bots/ ref $$(git -C bots rev-parse HEAD)"

machine: bots
	rsync -avR --exclude="bots/machine/machine_core/__pycache__/" bots/machine/testvm.py bots/machine/identity bots/machine/cloud-init.iso bots/machine/machine_core bots/lib test

# checkout Cockpit's test API; this has no API stability guarantee, so check out a stable tag
test/common:
	git fetch --depth=1 https://github.com/cockpit-project/cockpit.git 290+chromium-sizzle
	git checkout --force FETCH_HEAD -- test/common
	git reset test/common

#
# Coverity
#
# Download the coverity analysis tool and run it on the repository,
# archive the analysis result and upload it to coverity. The target
# to do all of that is `coverity-submit`.
#
# Individual targets exists for the respective steps.
#
# Needs COVERITY_TOKEN and COVERITY_EMAIL to be set for downloading
# the analysis tool and submitting the final results

BUILDDIR ?= .

$(BUILDDIR)/:
	mkdir -p "$@"

$(BUILDDIR)/%/:
	mkdir -p "$@"

COVERITY_URL=https://scan.coverity.com/download/linux64
COVERITY_TARFILE=coverity-tool.tar.gz

COVERITY_BUILDDIR = $(BUILDDIR)/coverity
COVERITY_TOOLTAR = $(COVERITY_BUILDDIR)/$(COVERITY_TARFILE)
COVERITY_TOOLDIR = $(COVERITY_BUILDDIR)/cov-analysis-linux64
COVERITY_ANALYSIS = $(COVERITY_BUILDDIR)/cov-analysis-cockpit-composer.xz

.PHONY: coverity-token
coverity-token:
	$(if $(COVERITY_TOKEN),,$(error COVERITY_TOKEN must be set))

.PHONY: coverity-email
coverity-email:
	$(if $(COVERITY_EMAIL),,$(error COVERITY_EMAIL must be set))


.PHONY: coverity-download
coverity-download: | coverity-token $(COVERITY_BUILDDIR)/
	@$(RM) -rf "$(COVERITY_TOOLDIR)" "$(COVERITY_TOOLTAR)"
	@echo "Downloading $(COVERITY_TARFILE) from $(COVERITY_URL)..."
	@wget -q "$(COVERITY_URL)" --post-data "project=cockpit-composer-coverity&token=$(COVERITY_TOKEN)" -O "$(COVERITY_TOOLTAR)"
	@echo "Extracting $(COVERITY_TARFILE)..."
	@mkdir -p "$(COVERITY_TOOLDIR)"
	@tar -xzf "$(COVERITY_TOOLTAR)" --strip 1 -C "$(COVERITY_TOOLDIR)"

$(COVERITY_TOOLTAR): | $(COVERITY_BUILDDIR)/
	@$(MAKE) --no-print-directory coverity-download

.PHONY: coverity-check
coverity-check: $(COVERITY_TOOLTAR)
	@echo "Running coverity suite..."
	@$(COVERITY_TOOLDIR)/bin/cov-build \
		--dir "$(COVERITY_BUILDDIR)/cov-int" \
		--no-command \
		--fs-capture-search "$(BUILDDIR)" \
		--fs-capture-search-exclude-regex "$(COVERITY_BUILDDIR)"
	@echo "Compressing analysis results..."
	@tar -caf "$(COVERITY_ANALYSIS)" -C "$(COVERITY_BUILDDIR)" "cov-int"

$(COVERITY_ANALYSIS): | $(COVERITY_BUILDDIR)/
	@$(MAKE) --no-print-directory coverity-check

.PHONY: coverity-submit
coverity-submit: $(COVERITY_ANALYSIS) | coverity-email coverity-token
	@echo "Submitting $(COVERITY_ANALYSIS)..."
	@curl --form "token=$(COVERITY_TOKEN)" \
		--form "email=$(COVERITY_EMAIL)" \
		--form "file=@$(COVERITY_ANALYSIS)" \
		--form "version=main" \
		--form "description=$$(git describe)" \
		https://scan.coverity.com/builds?project=cockpit-composer-coverity

.PHONY: coverity-clean
coverity-clean:
	@$(RM) -rfv "$(COVERITY_BUILDDIR)/cov-int" "$(COVERITY_ANALYSIS)"

.PHONY: coverity-clean-all
coverity-clean-all: coverity-clean
	@$(RM) -rfv "$(COVERITY_BUILDDIR)"
