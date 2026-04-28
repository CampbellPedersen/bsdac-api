FROM --platform=$BUILDPLATFORM node:20.20.2-alpine3.23 AS builder

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY tsconfig.json /app/tsconfig.json
COPY public /app/public
COPY src /app/src

RUN npm run build

FROM --platform=$TARGETPLATFORM node:20.20.2-alpine3.23

RUN npm i -g http-server

COPY --from=builder /app/build ./public

CMD http-server -p 80
