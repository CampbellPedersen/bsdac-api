#!/usr/bin/env bash

# Fail fast on script
# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

function cleanup() {
    # Stop and remove the running container instance
    if [[ $(docker ps | grep test-db-postgres) ]]; then
        echo 'Cleaning up containers...'
        docker stop test-db-postgres >/dev/null 2>&1
        docker rm test-db-postgres >/dev/null 2>&1
    fi
    if [[ $(docker network list | grep test-network) ]]; then
        echo 'Cleaning up networks...'
        docker network rm test-network >/dev/null 2>&1
    fi
}

cleanup