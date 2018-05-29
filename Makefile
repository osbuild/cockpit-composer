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

shared: metadata.db
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.nodejs --cache-from welder/web-nodejs:latest -t welder/web-nodejs:latest . ; \
	    sudo docker build -f ./test/end-to-end/Dockerfile --cache-from welder/web-e2e-tests:latest -t welder/web-e2e-tests:latest ./test/end-to-end/; \
	else \
	    sudo docker build -f Dockerfile.nodejs -t welder/web-nodejs:latest . ; \
	    sudo docker build -f ./test/end-to-end/Dockerfile -t welder/web-e2e-tests:latest ./test/end-to-end/ ; \
	fi;

	sudo mkdir -p failed-image
	sudo docker network inspect welder >/dev/null 2>&1 || sudo docker network create welder
	sudo docker ps --quiet --all --filter 'ancestor=welder/bdcs-api-img' | sudo xargs --no-run-if-empty docker rm -f
	sudo docker run -d --name api --restart=always -p 4000:4000 -v bdcs-recipes-volume:/recipes -v `pwd`:/mddb --network welder --security-opt label=disable welder/bdcs-api-img:latest

end-to-end-test: shared
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build --cache-from welder/web:latest -t welder/web:latest . ; \
	else \
	    sudo docker build -t welder/web:latest . ; \
	fi;

	sudo docker build -f Dockerfile.with-coverage -t welder/web-with-coverage:latest .
	sudo docker run -d --name web -p 3000:3000 --restart=always --network welder welder/web-with-coverage:latest

	until curl http://localhost:4000/api/status | grep 'db_supported":true'; do \
	    sleep 1; \
	    echo "Waiting for backend API to become ready before testing ..."; \
	done;

	sudo docker run --rm --name welder_end_to_end --network host \
	    -v `pwd`/.nyc_output/:/tmp/.nyc_output \
	    -v `pwd`/failed-image:/tmp/failed-image \
	    welder/web-e2e-tests:latest npm run test
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-with-coverage' | sudo xargs --no-run-if-empty docker rm -f

build-rpm:
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.buildrpm --cache-from welder/buildrpm:latest -t welder/buildrpm:latest .; \
	else \
	    sudo docker build -f Dockerfile.buildrpm -t welder/buildrpm:latest .; \
	fi;

	sudo docker run --rm --name buildrpm -v `pwd`:/welder welder/buildrpm:latest

cockpit-test: shared build-rpm
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.cockpit --cache-from welder/web-cockpit:latest -t welder/web-cockpit:latest .; \
	else \
	    sudo docker build -f Dockerfile.cockpit -t welder/web-cockpit:latest .; \
	fi;
	# don't interfere with host-installed cockpit
	sudo systemctl stop cockpit.socket cockpit.service || true

	sudo docker run -d --name web --restart=always --network host welder/web-cockpit:latest

# Clean generated intermediate tar file and useless RPM file
# RPM file is inside docker image already
	rm -f welder-web*.rpm welder-web*.tar.gz

	until curl http://localhost:4000/api/status | grep 'db_supported":true'; do \
	    sleep 1; \
	    echo "Waiting for backend API to become ready before testing ..."; \
	done;

	sudo docker run --rm --name welder_end_to_end --network host \
	    -v `pwd`/failed-image:/tmp/failed-image \
	    -e COCKPIT_TEST=1 \
	    welder/web-e2e-tests:latest npm run test
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-cockpit' | sudo xargs --no-run-if-empty docker rm -f

ci: npm-install eslint stylelint unit-test end-to-end-test cockpit-test

ci_after_success:
	[ -f ./node_modules/codecov/bin/codecov ] || npm install codecov
	[ -f ./node_modules/nyc/bin/nyc.js ] || npm install nyc@11.1.0

	cat ./coverage/lcov.info | ./node_modules/codecov/bin/codecov
	./node_modules/nyc/bin/nyc.js report --reporter=lcov && ./node_modules/codecov/bin/codecov

# NOTE: this is executed on a RHEL 7 or CentOS 7 host which is
# VM or bare metal. All required repositories must be configured, e.g.
# https://copr.fedorainfracloud.org/coprs/g/weldr/lorax-composer/repo/epel-7/group_weldr-lorax-composer-epel-7.repo
test_with_lorax_composer: rpm
# install required RPM packages
	sudo yum -y install lorax-composer cockpit-ws cockpit-kubernetes welder-web*.rpm

# don't require Cockpit authentication when logging in
	sudo /bin/sh -c 'echo -e "[Negotiate]\nCommand = /usr/libexec/cockpit-stub\n[WebService]\nShell = /shell/simple.html" > /etc/cockpit/cockpit.conf'
	sudo setenforce 0

# patch application to use UNIX socket with lorax-composer
	sudo sed -i "s|welderApiPort=.*|welderApiPort='/run/weldr/api.socket';|" /usr/share/cockpit/welder/js/config.js
	sudo systemctl restart cockpit

# build e2e test images with increased timeouts
	sed -i "s|waitforTimeout: 30000|waitforTimeout: 90000|" ./test/end-to-end/wdio.conf.js
	sudo docker build -f Dockerfile.nodejs -t welder/web-nodejs:latest .
	sudo docker build -f ./test/end-to-end/Dockerfile -t welder/web-e2e-tests:latest ./test/end-to-end/

# execute lorax-composer in the background to serve as the API backend
# making the socket accessible to the cockpit-ws group
	sudo mkdir /recipes
	sudo lorax-composer --group cockpit-ws /recipes &

# wait for the backend to become ready
	until sudo curl --unix-socket /run/weldr/api.socket http://localhost:4000/api/status | grep 'db_supported": true'; do \
	    sleep 1; \
	    echo "Waiting for backend API to become ready before testing ..."; \
	done;

# execute the test suite
	sudo mkdir -p failed-image
	sudo docker run --rm --name welder_end_to_end --network host -v /run/weldr:/run/weldr   \
	                -v `pwd`/failed-image:/tmp/failed-image                                 \
	                -e COCKPIT_TEST=1 welder/web-e2e-tests:latest                           \
	                npm run test

.PHONY: metadata.db ci ci_after_success test_with_lorax_composer
