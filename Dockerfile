FROM node:18.17.1-alpine3.17 as builder
COPY . .
RUN npm ci && npm run build


FROM node:18.17.1-alpine3.17
WORKDIR /usr/src/app
COPY --from=builder  package*.json  ./
COPY --from=builder  dist  ./dist
CMD  npm ci --omit=dev && \
  npx wait-port rabbit:5672 && \
  npm start