FROM --platform=$BUILDPLATFORM node:20.20.2-alpine3.23 AS builder

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm ci

ADD . /app/

RUN npm run build

FROM --platform=$BUILDPLATFORM node:20.20.2-alpine3.23 as packages

WORKDIR /app
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm ci --omit=dev

FROM --platform=$TARGETPLATFORM node:20.20.2-alpine3.23

COPY --from=packages /app/node_modules /node_modules
COPY --from=builder /app/build /build

CMD ["node", "./build/server.js"]
