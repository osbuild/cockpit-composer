#!/bin/bash

# Make sure the folder exists
mkdir -p /run/weldr
# Set permissions
chmod u=rwX,g=rwX,o=--- /run/weldr

# Run lorax-composer
lorax-composer --group root /blueprints &

# Execute the CMD
exec "$@"
