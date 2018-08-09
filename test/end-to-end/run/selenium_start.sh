#!/bin/bash

set -e
TICKS=120

function wait_curl(){
    LINK=$1
    GREP_CMD=$2
    FOUND=""
    FULLLINK="http://localhost:4444$LINK"
    for foo in `seq $TICKS`; do
        if curl -s --connect-timeout 1 $FULLLINK | grep "$GREP_CMD" >/dev/null; then
            echo "$FULLLINK ('$GREP_CMD' available on page)" >&2
            FOUND="yes"
            break
        else
            sleep 0.5
        fi
    done
    if [ -z "$FOUND" ]; then
        echo "ERROR: $FULLLINK ('$GREP_CMD' not available)" >&2
        return 1
    fi
}

# Make sure docker is up and running
systemctl start docker

docker run  -d -p 4444:4444 --name selenium-hub selenium/hub:3
wait_curl /grid/console "Grid Console"
docker run -d --link selenium-hub:hub selenium/node-chrome:3
wait_curl /grid/console "browserName: chrome"
# HACK: Fedora 27's python2-selenium does not work with :3
docker run -d --link selenium-hub:hub selenium/node-firefox:2.53.1
wait_curl /grid/console "browserName: firefox"