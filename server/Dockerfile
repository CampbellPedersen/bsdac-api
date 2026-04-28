FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

ARG NPM_VERSION=10.8.2

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm i -g npm@${NPM_VERSION}
RUN npm ci

ADD . /app/

RUN npm run build

FROM --platform=$BUILDPLATFORM node:20-alpine as packages

ARG NPM_VERSION=10.8.2

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm i -g npm@${NPM_VERSION}
RUN npm ci --omit=dev

FROM --platform=$TARGETPLATFORM node:20-alpine

COPY --from=packages /app/node_modules /node_modules
COPY --from=builder /app/build /build

CMD ["node", "./build/server.js"]
