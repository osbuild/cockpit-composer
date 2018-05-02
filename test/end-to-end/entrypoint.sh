#!/bin/bash

# Rewrite config to use service name as hostname of API and Web
cd /end2end/ || exit 1

# start Xvnc
Xvnc -SecurityTypes None :1 > /dev/null 2>&1 &
sleep 3

# start selenium server
java -jar selenium-server-standalone-3.11.0.jar > /dev/null 2>&1 &
sleep 5 # wait to initialize

if [ "$COCKPIT_TEST" ]; then
    sed -i "s|baseUrl: 'http://localhost:3000/'|baseUrl: 'http://localhost:9090/welder'|" wdio.conf.js
fi

echo "Running with config.json settings:"
cat ./wdio.conf.js

# Execute the CMD
exec "$@"
