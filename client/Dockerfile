FROM node:12.16.0-alpine AS builder

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY tsconfig.json /app/tsconfig.json
COPY public /app/public
COPY src /app/src

RUN npm run build

FROM node:12.16.0-alpine

RUN npm i http-server -g

COPY --from=builder /app/build ./public

CMD http-server -p 80