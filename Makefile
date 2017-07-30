eslint:
	npm run eslint

stylelint:
	npm run stylelint

build-test:
	npm run build

unit-test:
	npm run test:cov

end-to-end-test:
	sudo docker run --rm --name end_to_end --network welder \
	    -v test-result-volume:/result -v `pwd`:/mddb -e MDDB='/mddb/metadata.db' \
	    welder/end-to-end:${TRAVIS_BUILD_NUMBER} \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test

e2e-before-install:
	sudo docker pull welder/fedora:latest
	sudo docker pull welder/bdcs-api-rs:latest
	wget https://s3.amazonaws.com/weldr/metadata.db
	sudo docker network create welder
	sudo docker build --cache-from welder/welder-web:latest -t welder/welder-web:latest .
	sudo docker build --cache-from welder/end-to-end:latest -t welder/end-to-end:latest test/end-to-end/
	sudo docker tag welder/welder-web:latest welder/welder-web:${TRAVIS_BUILD_NUMBER}
	sudo docker tag welder/end-to-end:latest welder/end-to-end:${TRAVIS_BUILD_NUMBER}

e2e-install:
	sudo docker run -d --name api --restart=always -p 4000:4000 -v bdcs-recipes-volume:/bdcs-recipes -v `pwd`:/mddb --network welder --security-opt label=disable welder/bdcs-api-rs:latest
	sudo docker run -d --name web --restart=always -p 80:3000 --network welder welder/welder-web:${TRAVIS_BUILD_NUMBER}
