#!/usr/bin/env bash

# Fail fast on script
# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

function container_is_running() {
    # Check if the container is running
    set +e
    docker inspect -f '{{.State.Running}}' test-db-postgres >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        return 1
    fi
    return 0
    set -e
}

function database_exists() {
    # Poke the postgresql db to see if it is active
    set +e
    docker exec test-db-postgres psql -h localhost -U postgres -p 5432 -lqt >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        return 1
    fi
    return 0
    set -e
}

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
echo "Starting test-db container..."
docker run --name test-db-postgres -e POSTGRES_DB=postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -it -d -p 5432:5432 postgres:12.1-alpine postgres -N 200 >/dev/null 2>&1

for i in {1..10}; do
    echo 'Checking if Postgresql container is up (attempt '$i')...'
    if container_is_running && database_exists; then
        echo 'Postgresql container is up!'
        break
    else
        # Fail if docker container is not running after 10s
        if [ $i -eq 10 ]; then
            echo 'Postgres docker container failed to start after 10s'
            cleanup
            exit 1
        fi
        sleep 1
    fi
done