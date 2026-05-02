# BSDAC API
A full-stack app for hosting and playing rap tracks created for Big Smash Day and Cube.

# Repo Layout

- `client/`: React frontend
- `server/`: Express backend
- `infra/`: Pulumi AWS resources
- `deploy/`: production Docker Compose and Caddy config
- `.github/workflows/deploy-prod.yml`: production image build and deploy workflow

# Developer Quickstart
Requirements:
- Docker
- Docker Compose plugin
- Node `20.20.2`

This repo pins Node in `.nvmrc` and `.node-version`. Before running npm commands, install and use that version locally:
```console
nvm install
nvm use
```

To spin up the stack in Docker:
```console
docker compose up -d
```

To keep `package-lock.json` aligned with the Docker builds, refresh dependencies with that pinned Node toolchain:
```console
npm install
```

To create local aws resources:
```console
./scripts/create-dynamodb-tables.sh
./scripts/create-s3-bucket.sh
```

Default local stack behavior:

- Traefik listens on `http://localhost`
- frontend serves on container port `80` and is exposed on host port `9001`
- backend serves on container port `80` and is exposed on host port `9002`
- LocalStack provides S3 and DynamoDB on `http://localhost:4566`

Local-only AWS endpoint overrides:

- The backend uses `DYNAMODB_ENDPOINT` and `S3_ENDPOINT` only when those env vars are explicitly set.
- In `docker-compose.yml`, they point to LocalStack at `http://localstack:4566`.
- From the host shell, the setup scripts talk to LocalStack at `http://localhost:4566`.
- Production-style runtime should omit those endpoint overrides entirely and let the AWS SDK talk to real AWS.

To tear down the local Docker stack:
```console
docker compose down
```

# Deploying
Infra is deployed using [Pulumi](https://www.pulumi.com/docs/get-started/install/).

Production stack:

- one EC2 host
- Elastic IP
- Route53
- Caddy in Docker for HTTPS + routing
- backend IAM role access to DynamoDB and S3
- ECR for frontend and backend images
- GitHub Actions deploy through AWS Systems Manager
- runtime config from AWS Systems Manager Parameter Store

AWS credentials are still required on your local machine for Pulumi itself, but the app runtime should use the EC2 instance role rather than static app AWS keys.

Stack config can be as small as:

```yaml
config:
  aws:region: ap-southeast-2
  bsdac-api:domainName: bsdac.com
  bsdac-api:instanceType: t4g.micro
```

Notes:
- `domainName` is optional. If omitted, Pulumi will still create the host and output the public IP.
- EC2 security group opens `80` and `443`.
- No public SSH access is intended; use AWS Systems Manager Session Manager.
- Default instance type is `t4g.micro`.
- Upload memory pressure remains a caveat on `t4g.micro` because the backend uses `multer.memoryStorage()`.

To deploy:
```console
pulumi up
```

And to tear down:
```console
pulumi destroy
```

Production runtime files:
- `deploy/README.md`
- `deploy/docker-compose.prod.yml`
- `deploy/Caddyfile`
- `deploy/deploy.sh`

Production deploy details:
- [deploy/README.md](deploy/README.md)

GitHub Actions deploy behavior:

- production deploy runs on `push` to `master`
- merging a PR into `master` triggers that deploy workflow
- opening or updating a PR does not deploy by itself
- deploy can also be run manually with `workflow_dispatch`
