#!/bin/bash

# Rewrite config.json to use service name as hostname of API and Web
cd /end2end/ || exit 1

sed -i "s,\"uri\": \"http://localhost:4000/\",\"uri\": \"http://api:4000/\"," config.json

if [ -z "$COCKPIT_TEST" ]; then
    sed -i "s,\"root\": \"http://localhost:3000/\",\"root\": \"http://web:3000/\"," config.json
else
    sed -i "s,\"root\": \"http://localhost:3000/\",\"root\": \"http://web:9090/welder\"," config.json
fi

echo "Running with config.json settings:"
cat ./config.json

# Execute the CMD
exec "$@"
