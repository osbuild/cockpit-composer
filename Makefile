# generate version number from the latest git tag; if the topmost commit is
# tagged (at release time), just use that; if there are commits after that,
# append a ".x" suffix to indicate that's a development snapshot
# if there is no tag (yet), use 0 as version
RELEASEVER=$(shell (git describe --exclude '*jenkins*' || echo 0) | sed 's/-[0-9]\+-g.*/.x/')

all:
	NODE_ENV=$(NODE_ENV) npm run build

npm-install:
	npm install

install: all
	mkdir -p /usr/share/cockpit/welder
	cp -r public/* /usr/share/cockpit/welder

dist-gzip: NODE_ENV=production
dist-gzip: all
	mkdir -p _install/usr/share/cockpit
	cp -r public/ _install/usr/share/cockpit/welder
	# remove evil file name that breaks rpmbuild (https://github.com/patternfly/patternfly/issues/917)
	find _install -name 'Logo_Horizontal_Reversed.svg alias' -delete
	cp welder-web.spec _install/
	tar -C _install/ -czf welder-web-$(RELEASEVER).tar.gz .
	rm -rf _install

srpm: dist-gzip
	rpmbuild -bs \
	  --define "_sourcedir `pwd`" \
	  --define "_srcrpmdir `pwd`" \
	  --define "releasever $(RELEASEVER)" \
	  welder-web.spec

rpm: dist-gzip
	mkdir -p "`pwd`/output"
	mkdir -p "`pwd`/rpmbuild"
	rpmbuild -bb \
	  --define "_sourcedir `pwd`" \
	  --define "_specdir `pwd`" \
	  --define "_builddir `pwd`/rpmbuild" \
	  --define "_srcrpmdir `pwd`" \
	  --define "_rpmdir `pwd`/output" \
	  --define "_buildrootdir `pwd`/build" \
	  --define "releasever $(RELEASEVER)" \
	  welder-web.spec
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

lorax-composer-api:
	sudo docker build -f Dockerfile.lorax-composer -t welder/lorax-composer-api .
	sudo docker rm -f api || true
	sudo docker run -d --name api --restart=always -v lorax-composer-volume:/recipes -v /run/weldr:/run welder/lorax-composer-api:latest

bdcs-api:
	sudo docker rm -f api || true
	sudo docker run -d --name api --restart=always -p 4000:4000 -v bdcs-recipes-volume:/bdcs-recipes -v `pwd`:/mddb --network welder --security-opt label=disable welder/bdcs-api-rs:latest

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

end-to-end-test: shared bdcs-api
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build --cache-from welder/web:latest -t welder/web:latest . ; \
	else \
	    sudo docker build -t welder/web:latest . ; \
	fi;

	sudo docker build -f Dockerfile.with-coverage -t welder/web-with-coverage:latest .
	sudo docker run -d --name web -p 3000:3000 --restart=always --network welder welder/web-with-coverage:latest

	sudo docker run --rm --name welder_end_to_end --network host \
	    -v `pwd`/.nyc_output/:/tmp/.nyc_output \
	    -v `pwd`/failed-image:/tmp/failed-image \
	    welder/web-e2e-tests:latest \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test -- --verbose
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-with-coverage' | sudo xargs --no-run-if-empty docker rm -f

build-rpm:
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.buildrpm --cache-from welder/buildrpm:latest -t welder/buildrpm:latest .; \
	else \
	    sudo docker build -f Dockerfile.buildrpm -t welder/buildrpm:latest .; \
	fi;

	sudo docker run --rm --name buildrpm -v `pwd`:/welder welder/buildrpm:latest

cockpit-test-common: shared build-rpm
	if [ -n "$$TRAVIS" ]; then \
	    sudo docker build -f Dockerfile.cockpit --cache-from welder/web-cockpit:latest -t welder/web-cockpit:latest .; \
	else \
	    sudo docker build -f Dockerfile.cockpit -t welder/web-cockpit:latest .; \
	fi;
	# don't interfere with host-installed cockpit
	sudo systemctl stop cockpit.socket cockpit.service || true
	# Clean generated intermidiate tar file and useless RPM file, it is inside docker image already
	rm -f welder-web*.rpm welder-web.tar.gz

cockpit-test: cockpit-test-common bdcs-api
	sudo docker run -d --name web --restart=always --network host welder/web-cockpit:latest
	sudo docker run --rm --name welder_end_to_end --network host \
	    -v `pwd`/failed-image:/tmp/failed-image \
	    -e COCKPIT_TEST=1 \
	    welder/web-e2e-tests:latest \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test -- --verbose
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-cockpit' | sudo xargs --no-run-if-empty docker rm -f

cockpit-test-lorax: cockpit-test-common lorax-composer-api
	sudo docker run -d --name web --restart=always -v /run/weldr:/run/weldr -e PORT=/run/weldr/weldr/api.socket \
	    --network host welder/web-cockpit:latest
	sudo docker run --rm --name welder_end_to_end --network host -v /run/weldr:/run/weldr  \
	    -e COCKPIT_TEST=1 -e API_URI='http://unix:/run/weldr/weldr/api.socket:' \
	    welder/web-e2e-tests:latest \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test -- --verbose
	sudo docker ps --quiet --all --filter 'ancestor=welder/web-cockpit' | sudo xargs --no-run-if-empty docker rm -f

ci: npm-install eslint stylelint unit-test end-to-end-test cockpit-test

ci_after_success:
	[ -f ./node_modules/codecov/bin/codecov ] || npm install codecov
	[ -f ./node_modules/nyc/bin/nyc.js ] || npm install nyc@11.1.0

	cat ./coverage/lcov.info | ./node_modules/codecov/bin/codecov
	./node_modules/nyc/bin/nyc.js report --reporter=lcov && ./node_modules/codecov/bin/codecov
