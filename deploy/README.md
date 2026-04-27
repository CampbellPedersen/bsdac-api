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
- no TLS yet

## First Run

```console
cp .env.example .env
docker compose -f docker-compose.prod.yml up -d --build
```

## Notes

- frontend served by `frontend` container
- `/api/*` proxied to `backend`
- production should not set `DYNAMODB_ENDPOINT` or `S3_ENDPOINT`
- production should not set static AWS keys unless forced by some exceptional case
