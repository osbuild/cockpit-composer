#!/bin/bash

# Rewrite config.json to use service name as hostname of API and Web
cd /end2end/ || exit 1

sed -i "s,\"root\": \"http://localhost:3000/\",\"root\": \"http://web:3000/\"," config.json
sed -i "s,\"uri\": \"http://localhost:4000/\",\"uri\": \"http://api:4000/\"," config.json

echo "Running with config.json settings:"
cat ./config.json

# Execute the CMD
exec "$@"
