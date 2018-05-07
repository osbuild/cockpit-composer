#!/bin/bash

set -e

# NOTE: execute from the root directory of the project

# create the MDDB database if it doesn't exist
# ARG1 - OPTIONAL - a content store directory for exports

# needs bdcs.rpm installed
IMPORT=`ls /usr/libexec/weldr/bdcs-*/bdcs-import`
SCHEMA=`ls /usr/share/bdcs-*/schema.sql`
METADATA="metadata.db"
DNF="/usr/bin/dnf"

[ -f "$DNF" ] || DNF="/usr/bin/yum"

if [ -z "$1" ]; then
    IMPORT_REPO=`mktemp -d /tmp/bdcs-import.repo.XXXXXX`
    REMOVE_IMPORT_REPO=1
else
    IMPORT_REPO="$1"
    REMOVE_IMPORT_REPO=0
fi

sqlite3 "$METADATA" < "$SCHEMA"

DNF_ROOT=`mktemp -d /tmp/dnf.root.XXXXXX`
DNF_DOWNLOAD=`mktemp -d /tmp/dnf.download.XXXXXX`

# download all the RPMs
sudo $DNF install -y --nogpgcheck --releasever=26 \
                 --downloadonly --downloaddir=$DNF_DOWNLOAD \
                 --installroot=$DNF_ROOT httpd

# then import all RPMs
for F in $DNF_DOWNLOAD/*.rpm; do
    $IMPORT $METADATA $IMPORT_REPO file://$F
done

# cleanup temporary directories and files
sudo rm -rf $DNF_ROOT $DNF_DOWNLOAD
[ "$REMOVE_IMPORT_REPO" == 1 ] && rm -rf $IMPORT_REPO
