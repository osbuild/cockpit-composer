#!/bin/bash

# Generate the version and release strings to use in the spec file.
# The output of this script is "<VERSION>-<RELEASE>",
# where <RELEASE> is 1 for the actual release tag, 2 for one commit after the
# release, and so on.

# Try to git describe. If that fails, just fall back to the version in package.json
gitdesc="$(git describe --exclude '*jenkins*' 2>/dev/null)"
if [ $? -ne 0 ]; then
    echo "$(jq -r .version package.json)-1%{?dist}"
else
    # Git describe will output either "<version>" for an exact match,
    # or "<version>-<number of commits since version>-g<hash>" if HEAD is newer than the tag
    if ! echo "$gitdesc" | grep -q -- - ;then
        echo "${gitdesc}-1%{?dist}"
    else
        # Add 1 to the number of commits
        version="$(echo "$gitdesc" | sed 's/-.*//')"
        pkgrel="$(("$(echo "$gitdesc" | sed 's/.*-\([[:digit:]]\+\)-g.*/\1/')" + 1))"
        echo "${version}-${pkgrel}%{?dist}"
    fi
fi
