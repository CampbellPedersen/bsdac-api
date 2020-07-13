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

# Deploying
Infra is deployed using [Pulumi](https://www.pulumi.com/docs/get-started/install/). AWS credentials are required on your local machine. The needed `Pulumi.prod.yaml` file is in the following format:

```yaml
config:
  aws:region: ap-southeast-2
  bsdac-api:awsAccessKeyId: ""
  bsdac-api:awsRegion: ap-southeast-2
  bsdac-api:awsSecretAccessKey: ""
  bsdac-api:domainName: ""
  bsdac-api:loginEmail: ""
  bsdac-api:loginPasswordSha256: ""
  bsdac-api:servicePort: "80"
```

To deploy:
```console
pulumi up
```

And to tear down:
```console
pulumi destroy
```