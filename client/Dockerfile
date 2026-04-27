FROM node:20-alpine AS builder

ARG NPM_VERSION=10.8.2

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i -g npm@${NPM_VERSION}
RUN npm ci

COPY tsconfig.json /app/tsconfig.json
COPY public /app/public
COPY src /app/src

RUN npm run build

FROM node:20-alpine

ARG NPM_VERSION=10.8.2

RUN npm i -g npm@${NPM_VERSION}
RUN npm i -g http-server

COPY --from=builder /app/build ./public

CMD http-server -p 80
