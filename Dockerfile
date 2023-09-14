FROM node:18.17.1-alpine3.17 as builder
COPY . .
RUN npm ci && npm run build


FROM node:18.17.1-alpine3.17
WORKDIR /usr/src/app
COPY --from=builder  package*.json  ./
COPY --from=builder  dist  ./dist
RUN npm ci --omit=dev
CMD ["npm", "start"]
