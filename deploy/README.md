# Production Deploy Files

Files in this directory support the current single-host EC2 production deploy.

## Layout

- `docker-compose.prod.yml`: runtime stack
- `Caddyfile`: HTTPS reverse proxy

## Production Model

Production uses:

- one EC2 host
- ECR for frontend and backend images
- GitHub Actions to build and push `linux/arm64` images
- AWS Systems Manager Run Command to trigger deploys on EC2
- AWS Systems Manager Parameter Store for backend runtime config

The production compose file uses `image:` references, not `build:`. By default, images are tagged with the triggering Git commit SHA. The workflow also supports a manual `image_tag` override on `workflow_dispatch`.

## GitHub Actions Flow

Workflow file:

- `.github/workflows/deploy-prod.yml`

On push to `master`, the workflow:

1. checks out the repo
2. configures AWS credentials through GitHub OIDC
3. logs in to ECR
4. builds frontend image for `linux/arm64`
5. builds backend image for `linux/arm64`
6. pushes both images to ECR using `github.sha` by default, or a manual `image_tag` override when provided
7. resolves the running EC2 instance by tag `Name=bsdac-app-host`
8. sends an SSM command to that instance
9. waits for the SSM command to finish
10. prints SSM stdout and stderr into the Actions log
11. fails the job if the EC2-side deploy fails

Practical trigger note:

- merging a PR into `master` triggers this workflow because it creates a push to `master`
- opening or updating a PR does not trigger production deploy

The build uses GitHub Actions cache through Buildx:

- `cache-from: type=gha`
- `cache-to: type=gha,mode=max`

This speeds up repeated builds without changing the deployed image tag semantics.

## EC2 Deploy Flow

The SSM command on the host:

1. ensures `/opt/bsdac` exists
2. clones the repo to `/opt/bsdac` if it is not already a git checkout
3. resets origin to `https://github.com/CampbellPedersen/bsdac-api.git`
4. fetches the exact triggering commit SHA
5. checks out that exact SHA
6. logs Docker in to ECR using the EC2 instance role
7. reads backend runtime config from `/bsdac/prod/*` in Parameter Store
8. runs `docker compose -f docker-compose.prod.yml pull`
9. runs `docker compose -f docker-compose.prod.yml up -d`

By default, the host deploy uses repo files from the same commit as the ECR image tag. If a manual `image_tag` override is used, repo checkout SHA and image tag can intentionally differ.

## Runtime Config

Production runtime config comes from AWS Systems Manager Parameter Store.

- production deploy does not require a host-local env file
- SSM deploy fetches required backend values from `/bsdac/prod/*`
- `docker compose` receives those values from the deploy environment
- repo checkout can be recreated without restoring a local env file

Parameters currently expected:

- `/bsdac/prod/LOGIN_EMAIL`
- `/bsdac/prod/LOGIN_PASSWORD_SHA256`
- `/bsdac/prod/DYNAMODB_TABLE_NAME`
- `/bsdac/prod/S3_BUCKET_NAME`

Notes:

- `AWS_REGION` still comes from the workflow and deploy environment
- production should not set `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`
- production should not set `DYNAMODB_ENDPOINT` or `S3_ENDPOINT`
- GitHub Actions resolves the deploy target by EC2 tag instead of a hardcoded instance ID variable

That removes the manual host secret-file step and makes fresh-host deploys safer.

## Manual Host Verification

Useful checks on the EC2 host:

```console
cd /opt/bsdac/deploy
sudo docker compose -f docker-compose.prod.yml ps
sudo docker compose -f docker-compose.prod.yml logs --tail=100
```

If Compose variables are needed manually:

```console
export AWS_ACCOUNT_ID=<account-id>
export AWS_REGION=ap-southeast-2
export IMAGE_TAG=<full-git-sha>
```

If running Compose with `sudo`, pass variables inline:

```console
sudo AWS_ACCOUNT_ID=<account-id> AWS_REGION=ap-southeast-2 IMAGE_TAG=<full-git-sha> docker compose -f /opt/bsdac/deploy/docker-compose.prod.yml ps
```

## Rerun Behavior

ECR repositories are configured with immutable tags.

That means:

- each commit SHA can only be pushed once
- rerunning the workflow for the same commit will try to push the same tags again
- that rerun can fail at the ECR push step even if the images already exist

Practical implication:

- for image rebuilds, push a new commit
- for host-only fixes, either deploy manually on EC2 using the existing image tag or update the workflow later to skip already-existing tags

## `t4g.micro`

- production images are built off-host
- images are built for `linux/arm64`
- EC2 only pulls and runs them

Default Pulumi instance type is `t4g.micro`.

Remaining caveat:

- backend upload route uses `multer.memoryStorage()`
- uploaded audio is buffered in backend memory before S3 upload
- large or concurrent uploads still reduce runtime safety margin on `t4g.micro`

## Notes

- frontend served by `frontend` container
- `/api/*` proxied to `backend`
- production should not set `DYNAMODB_ENDPOINT` or `S3_ENDPOINT`
- backend should rely on EC2 instance role credentials
- new hosts install Docker, Git, AWS CLI, and Docker Compose plugin in userdata
