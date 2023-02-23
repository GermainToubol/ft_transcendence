FROM node:16-alpine3.16

RUN apk update && apk add bash

WORKDIR /frontend
COPY package.json .
COPY yarn.lock .
RUN yarn
RUN yarn upgrade

VOLUME [ "/frontend" ]
