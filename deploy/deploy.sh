#!/bin/bash
set -euxo pipefail

cd "$(dirname "$0")"
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
