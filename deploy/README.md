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

- build `linux/arm64` images off-host
- push those images to ECR
- make EC2 pull and run exact tags
- stop building images on EC2

### Opinionated Choice

For this repo, the recommended migration path is:

1. change production compose from `build:` to `image:`
2. create ECR repositories in `ap-southeast-2`
3. grant the EC2 instance role permission to pull from ECR
4. add GitHub Actions to build and push `linux/arm64` images
5. trigger deploy remotely so EC2 pulls and restarts with the new tag

This is the preferred path over building images on a local machine because it removes a manual step that tends to be brittle and annoying over time.

This is better than copying local images to EC2 manually because:

- tags are explicit
- deploys are repeatable
- EC2 host stays small
- same image can be reused for rollback

Important:

- pushing a new image to ECR does not make EC2 automatically run it
- EC2 keeps running the currently pulled image until a deploy command pulls and restarts containers
- use explicit image tags instead of relying on mutable tags like `latest`

### One-Time AWS Setup

Pulumi should handle most of the one-time AWS setup for this path.

Pulumi should provision:

1. two ECR repositories:
   - frontend
   - backend
2. IAM permissions so the EC2 instance role can pull from ECR
3. any additional IAM permissions needed for deploy automation
4. optional SSM Parameter Store parameters or Secrets Manager secret containers if runtime config is moved there later

Outside Pulumi:

1. configure GitHub Actions with AWS credentials or an assumed role that can push images
2. configure GitHub Actions to trigger deploys remotely after pushing images

Suggested repository names:

- `bsdac-frontend`
- `bsdac-backend`

### GitHub Actions Build And Push Flow

Assume:

- AWS account id is `<account-id>`
- region is `ap-southeast-2`
- image tag is something explicit like git SHA, for example `<tag>`

GitHub Actions should:

- authenticate to AWS
- log in to ECR
- build the frontend image for `linux/arm64`
- build the backend image for `linux/arm64`
- push both images to ECR using explicit tags

Typical tags should be immutable and easy to trace, for example:

- git SHA
- release tag
- timestamp plus short SHA

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

### Remote Deploy Action

GitHub Actions should trigger the deploy remotely after pushing images.

The EC2 host still needs to run the pull and restart commands, but that should happen through remote execution rather than an interactive login session.

The remote action on EC2 is:

```console
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

That remote action should replace the current `./deploy.sh` behavior for the micro path.

### How To Trigger Deploys

You do not have to log into the EC2 host interactively every time.

Practical options:

- use AWS Systems Manager Run Command from GitHub Actions to run the deploy commands remotely
- use AWS Systems Manager Run Command from your local machine only as a fallback

Recommended path for this repo:

- update the desired image tag
- have GitHub Actions send an SSM Run Command to make EC2 pull and restart

Fallback path if GitHub Actions are unavailable:

- build and push images from your local machine
- update the desired image tag
- send the same SSM Run Command from your machine

Conceptually, the remote deploy command looks like:

```console
aws ssm send-command \
  --instance-ids <instance-id> \
  --document-name AWS-RunShellScript \
  --parameters commands='["cd /opt/bsdac/deploy","docker compose -f docker-compose.prod.yml pull","docker compose -f docker-compose.prod.yml up -d"]'
```

This keeps deploys explicit without requiring an interactive shell session on the host.

### Recommended Specific Operating Model

Recommended operating model:

- add ECR repositories and EC2 pull permissions
- switch production compose from `build:` to `image:`
- build and push `linux/arm64` images from GitHub Actions
- update `IMAGE_TAG`
- have GitHub Actions trigger pull and restart on EC2

Fallback operating model:

- keep the same ECR and compose shape
- build and push from your local machine only if needed
- trigger the same remote deploy command manually

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
