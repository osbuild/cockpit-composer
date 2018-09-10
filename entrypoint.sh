#!/bin/bash

# Create /run/weldr with the correct owner and permissions. This directory is
# shared between containers and docker creates it with root permissions.
mkdir -p /run/weldr
chmod u=rwX,g=rX,o=--- /run/weldr
chown root:weldr /run/weldr

# Run lorax-composer
lorax-composer /blueprints &

# Execute the CMD
exec "$@"
