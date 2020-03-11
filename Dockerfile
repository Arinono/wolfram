FROM node:latest as builder

WORKDIR /source
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

FROM node:alpine

WORKDIR /app
COPY --from=builder /source/dist .
COPY --from=builder /source/package.json .
COPY --from=builder /source/yarn.lock .
RUN yarn --production

CMD [ "node", "/app/src/index.js" ]
