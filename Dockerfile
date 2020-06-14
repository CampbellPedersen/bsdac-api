FROM node:12.16.0-alpine AS builder

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install

ADD . /app/

RUN npm run build

FROM node:12.16.0-alpine as packages

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm install --production

FROM node:12.16.0-alpine

COPY --from=packages /app/node_modules /node_modules
COPY --from=builder /app/build /build

CMD ["node", "./build/index.js"]