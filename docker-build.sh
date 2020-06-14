#!/usr/bin/env bash

# Fail fast on script
# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

# Build and tag containers
docker build -t bsdac-api .