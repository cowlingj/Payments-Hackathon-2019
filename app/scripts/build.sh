export GOPATH="$(pwd)"
export GOBIN="$(pwd)/bin"

go install main
echo "${GOBIN}/main"