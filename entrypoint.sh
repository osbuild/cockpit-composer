#!/bin/bash

# Make sure the folder exists
mkdir -p /run/weldr
# Set permissions and owership
chmod u=rwX,g=rX,o=--- /run/weldr
chown root:weldr /run/weldr

# Run lorax-composer
lorax-composer /blueprints &

# Execute the CMD
exec "$@"
