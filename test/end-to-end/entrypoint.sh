#!/bin/bash

# Rewrite config to use service name as hostname of API and Web
cd /end2end/ || exit 1

# start Xvnc
Xvnc -SecurityTypes None :1 > /dev/null 2>&1 &
sleep 3

# start selenium server
java -jar selenium-server-standalone-3.11.0.jar > /dev/null 2>&1 &
sleep 5 # wait to initialize

echo "Running with config.json settings:"
cat ./wdio.conf.js

until curl --unix-socket /run/weldr/api.socket http://localhost/api/status | grep "\"db_supported\": *true"; do \
    sleep 1; \
    echo "Waiting for backend API to become ready before testing ..."; \
done;

# Execute the CMD
exec "$@"
