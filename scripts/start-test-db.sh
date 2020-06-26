#!/usr/bin/env bash

# Fail fast on script
# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

function container_is_running() {
    # Check if the container is running
    set +e
    docker inspect -f '{{.State.Running}}' test-db-dynamodb >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        return 1
    fi
    return 0
    set -e
}

function cleanup() {
    # Stop and remove the running container instance
    if [[ $(docker ps | grep test-db-dynamodb) ]]; then
        echo 'Cleaning up containers...'
        docker stop test-db-dynamodb >/dev/null 2>&1
        docker rm test-db-dynamodb >/dev/null 2>&1
    fi
    if [[ $(docker network list | grep test-network) ]]; then
        echo 'Cleaning up networks...'
        docker network rm test-network >/dev/null 2>&1
    fi
}

cleanup
echo "Starting test-db container..."
docker run --name test-db-dynamodb -it -d -p 8000:8000 amazon/dynamodb-local >/dev/null 2>&1

for i in {1..10}; do
    echo 'Checking if DynamoDB container is up (attempt '$i')...'
    if container_is_running; then
        echo 'DynamoDB container is up!'
        break
    else
        # Fail if docker container is not running after 10s
        if [ $i -eq 10 ]; then
            echo 'DynamoDB docker container failed to start after 10s'
            cleanup
            exit 1
        fi
        sleep 1
    fi
done