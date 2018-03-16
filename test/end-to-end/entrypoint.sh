#!/bin/bash

# Rewrite config.json to use service name as hostname of API and Web
cd /end2end/ || exit 1

if [ -n "$API_URI" ]; then
    sed -i "s,\"uri\": \"http://localhost:4000/\",\"uri\": \"$API_URI\"," config.json
fi

if [ "$COCKPIT_TEST" ]; then
    sed -i "s,\"root\": \"http://localhost:3000/\",\"root\": \"http://localhost:9090/welder\"," config.json
fi

echo "Running with config.json settings:"
cat ./config.json

# Execute the CMD
exec "$@"
