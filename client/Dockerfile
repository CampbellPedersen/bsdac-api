FROM node:20.20.2-alpine3.23 AS builder

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY tsconfig.json /app/tsconfig.json
COPY public /app/public
COPY src /app/src

RUN npm run build

FROM node:20.20.2-alpine3.23

RUN npm i -g serve

COPY --from=builder /app/build ./public

CMD ["serve", "-s", "public", "-l", "80"]
