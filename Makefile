all:
	NODE_ENV=$(NODE_ENV) npm run build

install: all
	mkdir -p /usr/share/cockpit/welder-web
	cp -r public/* /usr/share/cockpit/welder-web

dist-gzip: NODE_ENV=production
dist-gzip: all
	mkdir -p _install/usr/share/cockpit
	cp -r public/ _install/usr/share/cockpit/welder-web
	cp welder-web.spec _install/
	tar -C _install/ -czf welder-web.tar.gz .
	rm -rf _install

srpm: dist-gzip
	rpmbuild -bs \
	  --define "_sourcedir `pwd`" \
	  --define "_srcrpmdir `pwd`" \
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
	  welder-web.spec
	find `pwd`/output -name '*.rpm' -printf '%f\n' -exec mv {} . \;
	rm -r "`pwd`/rpmbuild"

eslint:
	npm run eslint

stylelint:
	npm run stylelint

unit-test:
	npm run test:cov

end-to-end-test:
	sudo docker build -f Dockerfile.nodejs --cache-from welder/web-nodejs:latest -t welder/web-nodejs:latest .

	sudo docker network create welder
	sudo docker build --cache-from welder/web:latest -t welder/web:latest .
	sudo docker build -f ./test/end-to-end/Dockerfile --cache-from welder/web-e2e-tests:latest -t welder/web-e2e-tests:latest ./test/end-to-end/

	wget --progress=dot:giga https://s3.amazonaws.com/weldr/metadata.db
	sudo docker run -d --name api --restart=always -p 4000:4000 -v bdcs-recipes-volume:/bdcs-recipes -v `pwd`:/mddb --network welder --security-opt label=disable welder/bdcs-api-rs:latest
	sudo docker run -d --name web --restart=always -p 80:3000 --network welder welder/web:latest

	sudo docker run --rm --name welder_end_to_end --network welder \
	    -v test-result-volume:/result -v `pwd`:/mddb -e MDDB='/mddb/metadata.db' \
	    welder/web-e2e-tests:latest \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test
