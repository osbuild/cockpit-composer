eslint:
	npm run eslint

stylelint:
	npm run stylelint

unit-test:
	npm run test:cov

end-to-end-test:
	git clone https://github.com/weldr/welder-deployment
	make -C welder-deployment/ weld-f25

	sudo docker build -f ./test/end-to-end/Dockerfile -t weld/end-to-end:latest ./test/end-to-end/

	git clone ../welder-web welder-deployment/welder-web
	make -C welder-deployment/ repos
	
	if [ ! -d ./welder-deployment/mddb ]; then \
		mkdir ./welder-deployment/mddb; \
	fi; \
	sudo docker-compose -f welder-deployment/docker-compose.yml build
	wget https://s3.amazonaws.com/weldr/metadata.db -O welder-deployment/mddb/metadata.db
	sudo docker-compose -f welder-deployment/docker-compose.yml -p welder up -d

	sudo docker run --rm --name welder_end_to_end --network welder_default \
	    -v test-result-volume:/result -v `pwd`/welder-deployment/mddb:/mddb -e MDDB='/mddb/metadata.db' \
	    weld/end-to-end:latest \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test
