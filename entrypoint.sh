#!/bin/bash

export API_URL=${API_URL:-}

# Rewrite config.json to use relative URLs for the API requests
cd /welder/ || exit 1
if [ -z "$API_URL" ]; then
    sed -i "s,var welderApiRelative=.*,var welderApiRelative=true;," ./public/js/config.js
else
    # Split the API url into scheme host port (ALL MUST BE PRESENT)
    SCHEME=${API_URL%%://*}
    NO_SCHEME=${API_URL##$SCHEME://}
    HOST=${NO_SCHEME%%:*}
    P1=${NO_SCHEME##*:}
    PORT=${P1%%/}

    if [ -z "$SCHEME" ] || [ -z "$HOST" ] || [ -z "$PORT" ]; then
        echo "ERROR PARSING API_URL=$API_URL";
        exit 1;
    fi

    sed -i "s,var welderApiScheme=.*,var welderApiScheme=$SCHEME;," ./public/js/config.js
    sed -i "s,var welderApiHost=.*,var welderApiHost=\"$HOST\";," ./public/js/config.js
    sed -i "s,var welderApiPort=.*,var welderApiPort=$PORT;," ./public/js/config.js
fi
echo "Running with config.js settings:"
cat ./public/js/config.js

# Execute the CMD
exec "$@"
