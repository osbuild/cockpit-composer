eslint:
	npm run eslint

stylelint:
	npm run stylelint

test:
	npm run test

end-to-end-test:
	git clone https://github.com/weldr/welder-deployment
	make -C welder-deployment/ weld-f25

	sudo docker build -f ./test/end-to-end/Dockerfile -t weld/end-to-end:latest ./test/end-to-end/


	make -C welder-deployment/ repos
	sudo docker-compose -f welder-deployment/docker-compose.yml build
	wget https://s3.amazonaws.com/atodorov/metadata_centos7.db.gz -O welder-deployment/metadata.db.gz
	gunzip ./welder-deployment/metadata.db.gz
	make -C welder-deployment/ import-metadata
	sudo docker-compose -f welder-deployment/docker-compose.yml -p welder up -d

	sudo docker run --rm --name welder_end_to_end --network welder_default \
	    -v test-result-volume:/result -v bdcs-mddb-volume:/mddb -e MDDB='/mddb/metadata.db' \
	    weld/end-to-end:latest \
	    xvfb-run -a -s '-screen 0 1024x768x24' npm run test
