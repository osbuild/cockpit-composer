set -eux

cd "${SOURCE}"

# tests need cockpit's bots/ libraries and test infrastructure
git init
rm -f bots  # common local case: existing bots symlink
make bots test/common

# make sure dev dependencies are present so the tests run properly
npm ci

# disable detection of affected tests; testing takes too long as there is no parallelization
mv .git dot-git

. /run/host/usr/lib/os-release
export TEST_OS="${ID}-${VERSION_ID/./-}"

if [ "$TEST_OS" = "centos-9" ]; then
    TEST_OS="${TEST_OS}-stream"
fi

# Chromium sometimes gets OOM killed on testing farm
export TEST_BROWSER=firefox

# make it easy to check in logs
echo "TEST_ALLOW_JOURNAL_MESSAGES: ${TEST_ALLOW_JOURNAL_MESSAGES:-}"
echo "TEST_AUDIT_NO_SELINUX: ${TEST_AUDIT_NO_SELINUX:-}"

GATEWAY="$(python3 -c 'import socket; print(socket.gethostbyname("_gateway"))')"
RC=0
./test/common/run-tests \
    --test-dir test/verify \
    --nondestructive \
    --machine "${GATEWAY}":22 \
    --browser "${GATEWAY}":9090 \
|| RC=$?

echo $RC > "$LOGS/exitcode"
cp --verbose Test* "$LOGS" || true
exit $RC
