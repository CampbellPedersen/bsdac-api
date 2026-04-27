# bsdac-api
A full-stack app for hosting and playing rap tracks created for Big Smash Day and Cube.

# Developer Quickstart
Requirements:
- Docker
- Docker Compose
- Node `20`
- npm `10.8.2`

To spin up the stack in Docker:
```console
docker-compose up -d
```

To keep `package-lock.json` compatible with the Docker builds, refresh dependencies with the same npm line used in the images:
```console
nvm use
npx npm@10.8.2 install
```

To create local aws resources:
```console
./scripts/create-dynamodb-tables.sh
./scripts/create-s3-bucket.sh
```

Local-only AWS endpoint overrides:

- The backend uses `DYNAMODB_ENDPOINT` and `S3_ENDPOINT` only when those env vars are explicitly set.
- In `docker-compose.yml`, they point to LocalStack at `http://localstack:4566`.
- From the host shell, the setup scripts talk to LocalStack at `http://localhost:4566`.
- Production-style runtime should omit those endpoint overrides entirely and let the AWS SDK talk to real AWS.

To tear down the local Docker stack:
```console
docker-compose down
```

# Deploying
Infra is deployed using [Pulumi](https://www.pulumi.com/docs/get-started/install/).

Current production stack:

- one EC2 host
- Elastic IP
- Route53
- Caddy in Docker for HTTPS + routing
- backend IAM role access to DynamoDB and S3

AWS credentials are still required on your local machine for Pulumi itself, but the app runtime should use the EC2 instance role rather than static app AWS keys.

Current stack config can be as small as:

```yaml
config:
  aws:region: ap-southeast-2
  bsdac-api:domainName: bsdac.com
  bsdac-api:instanceType: t3.small
```

Notes:
- `domainName` is optional. If omitted, Pulumi will still create the host and output the public IP.
- Current EC2 security group opens `80` and `443`.
- No public SSH access is intended; use AWS Systems Manager Session Manager.
- The old config keys like `awsAccessKeyId`, `awsSecretAccessKey`, `dynamodbEndpoint`, and `sslCertificateArn` were part of the retired Fargate-era stack and are no longer used by the active Pulumi program.

To deploy:
```console
pulumi up
```

And to tear down:
```console
pulumi destroy
```

Production runtime files now live in:
- `deploy/README.md`
- `deploy/docker-compose.prod.yml`
- `deploy/Caddyfile`
- `deploy/.env.example`
- `deploy/deploy.sh`
