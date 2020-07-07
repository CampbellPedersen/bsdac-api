# bsdac-api
An API built in Typescript for retrieving resources dedicated to Big Smash Day and Cube.

# Roadmap

## Now
- Raps
  - Basic details (Title, artist, BSDAC number)
  - Audio streaming

## Later
- Results
  - Leaderboards
  - PRs
- Information
  - Side Event List

# Developer Quickstart
Requirements:
- Docker
- Docker Compose

To spin up the stack in Docker:
```console
docker-compose up -d
```

To create local aws resources:
```console
./server/scripts/create-dynamodb-tables.sh
./server/scripts/create-s3-bucket.sh
```

To tear down the local Docker stack:
```console
docker-compose down
```