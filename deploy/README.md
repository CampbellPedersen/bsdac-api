# Production Deploy Files

Files here support simple single-host EC2 deploy.

## Layout

- `docker-compose.prod.yml`: runtime stack
- `Caddyfile`: HTTP reverse proxy
- `.env.example`: backend env template

## Assumptions

- repo cloned onto EC2 host
- run from `deploy/`
- app uses EC2 IAM role for AWS access
- no public SSH
- Caddy handles HTTPS for `bsdac.com` and `www.bsdac.com`

## First Run

```console
cp .env.example .env
./deploy.sh
```

## Path To `t4g.micro`

If production should move to `t4g.micro`, do not keep the current on-host build flow.

Why:

- current deploy runs `docker compose -f docker-compose.prod.yml up -d --build`
- frontend production build can OOM on `t4g.micro`
- app runtime may be fine on `t4g.micro`, but deploy-time build pressure is not

Recommended path:

- build `linux/arm64` images on local machine
- push those images to ECR
- make EC2 pull and run exact tags
- stop building images on EC2

### Opinionated Choice

For this repo, the recommended path is:

1. build images locally with Docker Buildx for `linux/arm64`
2. push images to ECR in `ap-southeast-2`
3. change production compose from `build:` to `image:`
4. on EC2, authenticate Docker to ECR
5. deploy with `docker compose pull && docker compose up -d`

This is better than copying local images to EC2 manually because:

- tags are explicit
- deploys are repeatable
- EC2 host stays small
- same image can be reused for rollback

### One-Time AWS Setup

1. Create two ECR repositories:
   - frontend
   - backend
2. Grant the EC2 instance role permission to pull from ECR.
3. Use local AWS credentials on your machine to push images.

Suggested repository names:

- `bsdac-frontend`
- `bsdac-backend`

### Local Build And Push Flow

Assume:

- AWS account id is `<account-id>`
- region is `ap-southeast-2`
- image tag is something explicit like git SHA, for example `<tag>`

Login to ECR from local machine:

```console
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com
```

Build and push frontend:

```console
docker buildx build \
  --platform linux/arm64 \
  -t <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/bsdac-frontend:<tag> \
  --push \
  ./client
```

Build and push backend:

```console
docker buildx build \
  --platform linux/arm64 \
  -t <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/bsdac-backend:<tag> \
  --push \
  ./server
```

### Production Compose Shape

Production compose should move away from:

```yaml
frontend:
  build:
    context: ../client

backend:
  build:
    context: ../server
```

Toward:

```yaml
frontend:
  image: <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/bsdac-frontend:<tag>

backend:
  image: <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/bsdac-backend:<tag>
```

Best practical version is to keep the tag in `.env`, for example:

```dotenv
IMAGE_TAG=<tag>
AWS_ACCOUNT_ID=<account-id>
AWS_REGION=ap-southeast-2
```

Then compose can reference:

```yaml
image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bsdac-frontend:${IMAGE_TAG}
```

and:

```yaml
image: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bsdac-backend:${IMAGE_TAG}
```

### EC2 Pull And Run Flow

After cloning repo and creating `deploy/.env` on EC2:

Login Docker to ECR on EC2:

```console
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-2.amazonaws.com
```

Then deploy:

```console
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

That should replace the current `./deploy.sh` behavior for the micro path.

### Recommended Specific Operating Model

Short term:

- build locally
- push to ECR manually
- update `IMAGE_TAG` on EC2
- pull and restart

Long term:

- keep same ECR shape
- move local build/push steps into GitHub Actions later

### Remaining `t4g.micro` Caveat

Even after moving builds off-host, `t4g.micro` still has less runtime margin.

Main known app-level caveat:

- backend upload route uses `multer.memoryStorage()`
- uploaded file is buffered in backend memory before S3 upload
- large or concurrent uploads still make `t4g.micro` less safe than `t4g.small`

## Notes

- frontend served by `frontend` container
- `/api/*` proxied to `backend`
- production should not set `DYNAMODB_ENDPOINT` or `S3_ENDPOINT`
- production should not set static AWS keys unless forced by some exceptional case
- EC2 user-data now installs Docker Compose plugin automatically on new hosts
- `ssm-user` is added to docker group on new hosts, though a fresh SSM session may be needed before group membership is visible
