
set -u -e

export GOPATH="$(pwd)"
export GOBIN="$(pwd)/bin"
PACKAGE="main"

go install main
echo "${GOBIN}/${PACKAGE}"