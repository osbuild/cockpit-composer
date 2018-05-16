#!/bin/sh

# Generate the version and release strings to use in the spec file.
# The output of this script is "<VERSION>-<RELEASE>",
# e.g. something gross but fully guildelines compliant like "0.0.1-39.0.20180516gita13e5bd%{?dist}"

# Try to git describe. If that fails, just fall back to the version in package.json
gitdesc="$(git describe --exclude '*jenkins*' 2>/dev/null)"
if [ $? -ne 0 ]; then
    echo "$(jq -r .version package.json)-1%{?dist}"
else
    # Git describe will output either "<version>" for an exact match,
    # or "<version>-<number of commits since version>-g<hash>" if HEAD is newer than the tag
    # Check for the case without any extra junk
    if ! echo "$gitdesc" | grep -q -- - ;then
        echo "${gitdesc}-1%{?dist}"
    else
        version="$(echo "$gitdesc" | sed 's/-.*//')"
        pkgrel="$(echo "$gitdesc" | sed 's/.*-\([[:digit:]]\+\)-g.*/\1/')"
        snapinfo_commit="$(echo "$gitdesc" | sed 's/.*-g//')"
        today="$(date +%Y%m%d)"
        echo "${version}-${pkgrel}.0.${today}git${snapinfo_commit}%{?dist}"
    fi
fi
