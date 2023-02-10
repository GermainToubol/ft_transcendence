FROM node:16-alpine3.16

RUN npm --version

RUN apk update && apk add bash

WORKDIR /frontend
COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
VOLUME [ "/frontend" ]
