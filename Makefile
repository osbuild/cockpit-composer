# Extract the version from package.json
VERSION=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 1)
RELEASE=$(shell $(CURDIR)/rpmversion.sh | cut -d - -f 2)

all: npm-install
	NODE_ENV=$(NODE_ENV) npm run build

npm-install:
	npm install

install: all
	mkdir -p /usr/share/cockpit/welder
	cp -r public/* /usr/share/cockpit/welder

dist-gzip: NODE_ENV=production
dist-gzip: all
	mkdir -p welder-web-$(VERSION)
	cp -r public/ LICENSE.txt README.md welder-web-$(VERSION)
	tar -czf welder-web-$(VERSION).tar.gz welder-web-$(VERSION)
	rm -rf welder-web-$(VERSION)

welder-web.spec: welder-web.spec.in
	sed -e 's|@VERSION@|$(VERSION)|' \
	    -e 's|@RELEASE@|$(RELEASE)|' \
	    < welder-web.spec.in > welder-web.spec

cockpit-composer.spec: cockpit-composer.spec.in
	sed -e 's|@VERSION@|$(VERSION)|' \
	    -e 's|@RELEASE@|$(RELEASE)|' \
	    < cockpit-composer.spec.in > cockpit-composer.spec

srpm: dist-gzip welder-web.spec
	/usr/bin/rpmbuild -bs \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_srcrpmdir $(CURDIR)" \
	  welder-web.spec

cockpit-composer-srpm: dist-gzip cockpit-composer.spec
	/usr/bin/rpmbuild -bs \
	  --define "_sourcedir $(CURDIR)" \
	  --define "_srcrpmdir $(CURDIR)" \
	  cockpit-composer.spec

rpm: dist-gzip welder-web.spec
	mkdir -p "`pwd`/output"
	mkdir -p "`pwd`/rpmbuild"
	/usr/bin/rpmbuild -bb \
	  --define "_sourcedir `pwd`" \
	  --define "_specdir `pwd`" \
	  --define "_builddir `pwd`/rpmbuild" \
	  --define "_srcrpmdir `pwd`" \
	  --define "_rpmdir `pwd`/output" \
	  --define "_buildrootdir `pwd`/build" \
	  welder-web.spec
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

# targets used by Jenkins to execute rpmbuild sanity tests
test_rpmbuild: srpm rpm
test_rpmbuild_cockpit-composer: cockpit-composer-srpm cockpit-composer-rpm

eslint:
	npm run eslint

stylelint:
	npm run stylelint

unit-test:
	npm run test:cov

metadata.db:
	sudo docker build -f Dockerfile.metadata -t welder/import-metadata .
	sudo docker run --name import-metadata welder/import-metadata:latest
	sudo docker cp import-metadata:/metadata.db .
	sudo docker rm import-metadata

shared:
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f ./test/end-to-end/Dockerfile --cache-from welder/web-e2e-tests:latest -t welder/web-e2e-tests:latest ./test/end-to-end/; \
	else \
	    sudo docker build -f ./test/end-to-end/Dockerfile -t welder/web-e2e-tests:latest ./test/end-to-end/ ; \
	fi;

lorax-test: shared
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.lorax --cache-from welder/web-lorax:latest -t welder/web-lorax:latest . ; \
	else \
	    sudo docker build -f Dockerfile.lorax -t welder/web-lorax:latest . ; \
	fi;

	sudo docker run -d --name web --restart=always -v bdcs-socket:/run/weldr -v `pwd`/public:/usr/share/cockpit/welder --network host welder/web-lorax:latest

	sudo mkdir -p failed-image
	sudo docker run --rm --name welder_end_to_end --network host \
	    -v `pwd`/.nyc_output/:/tmp/.nyc_output \
	    -v `pwd`/failed-image:/tmp/failed-image \
	    -v bdcs-socket:/run/weldr \
	    welder/web-e2e-tests:latest npm run test
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-lorax' | sudo xargs --no-run-if-empty docker rm -f

build-rpm:
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.buildrpm --cache-from welder/buildrpm:latest -t welder/buildrpm:latest .; \
	else \
	    sudo docker build -f Dockerfile.buildrpm -t welder/buildrpm:latest .; \
	fi;

	sudo docker run --rm --name buildrpm -v `pwd`:/welder welder/buildrpm:latest

bdcs-test: shared metadata.db build-rpm
	sudo docker ps --quiet --all --filter 'ancestor=welder/bdcs-api-img' | sudo xargs --no-run-if-empty docker rm -f
	sudo docker run -d --name api --restart=always -v bdcs-recipes-volume:/recipes -v `pwd`:/mddb -v bdcs-socket:/run/weldr --security-opt label=disable welder/bdcs-api-img:latest

	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.cockpit --cache-from welder/web-bdcs:latest -t welder/web-bdcs:latest .; \
	else \
	    sudo docker build -f Dockerfile.cockpit -t welder/web-bdcs:latest .; \
	fi;
	# don't interfere with host-installed cockpit
	sudo systemctl stop cockpit.socket cockpit.service || true

	sudo docker run -d --name web -v bdcs-socket:/run/weldr --restart=always --network host welder/web-bdcs:latest

# Clean generated intermediate tar file and useless RPM file
# RPM file is inside docker image already
	rm -f welder-web*.rpm welder-web*.tar.gz

	sudo docker run --rm --name welder_end_to_end --network host \
	    -v `pwd`/failed-image:/tmp/failed-image -v bdcs-socket:/run/weldr \
	    welder/web-e2e-tests:latest npm run test
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-bdcs' | sudo xargs --no-run-if-empty docker rm -f

ci: npm-install eslint stylelint unit-test lorax-test bdcs-test

ci_after_success:
	[ -f ./node_modules/codecov/bin/codecov ] || npm install codecov
	[ -f ./node_modules/nyc/bin/nyc.js ] || npm install nyc@11.1.0

	[ -f ./coverage/lcov.info ] && cat ./coverage/lcov.info | ./node_modules/codecov/bin/codecov
	[ -d .nyc_output/ ] && ./node_modules/nyc/bin/nyc.js report --reporter=lcov && ./node_modules/codecov/bin/codecov

# NOTE: this is executed on a RHEL 7 or CentOS 7 host which is
# VM or bare metal. All required repositories must be configured, e.g.
# https://copr.fedorainfracloud.org/coprs/g/weldr/lorax-composer/repo/epel-7/group_weldr-lorax-composer-epel-7.repo
test_with_lorax_composer: rpm
# install required RPM packages
	sudo yum -y install lorax-composer cockpit-ws cockpit-kubernetes welder-web*.rpm

# execute lorax-composer in the background to serve as the API backend
	sudo /usr/sbin/lorax-composer /var/lib/lorax/composer/ &

# don't require Cockpit authentication when logging in
	sudo /bin/sh -c 'echo -e "[Negotiate]\nCommand = /usr/libexec/cockpit-stub\n[WebService]\nShell = /shell/simple.html" > /etc/cockpit/cockpit.conf'
	sudo setenforce 0

# restart cockpit
	sudo systemctl restart cockpit

# build e2e test images
	sudo docker build -f ./test/end-to-end/Dockerfile -t welder/web-e2e-tests:latest ./test/end-to-end/

# wait for the backend to become ready
	until sudo curl --unix-socket /run/weldr/api.socket http://localhost:4000/api/status | grep '"db_supported": true'; do \
	    sleep 1; \
	    echo "Waiting for backend API to become ready before testing ..."; \
	done;

# execute the test suite
	sudo mkdir -p failed-image
	sudo docker run --rm --name welder_end_to_end --network host -v /run/weldr:/run/weldr   \
	                -v `pwd`/failed-image:/tmp/failed-image                                 \
	                welder/web-e2e-tests:latest                                             \
	                npm run test

.PHONY: metadata.db ci ci_after_success test_with_lorax_composer
