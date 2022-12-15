#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gtoubol <marvin@42.fr>                     +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/12/13 09:12:10 by gtoubol           #+#    #+#              #
#    Updated: 2022/12/13 09:12:10 by gtoubol          ###   ########.fr        #
#                                                                              #
#******************************************************************************#

# base image with all dependencies installation
# ----------------------------------------------------------------------
FROM alpine:latest AS backend-base

RUN apk update							\
	&& apk add --no-cache npm git		\
	&& npm i -g @nestjs/cli

RUN mkdir -p /root/srcs

# install the node_module folder
# ----------------------------------------------------------------------
FROM backend-base AS backend-installer

COPY ./install.sh /tmp/install.sh
ENTRYPOINT ["/bin/sh", "/tmp/install.sh"]

# run the backend
# ----------------------------------------------------------------------
FROM backend-base AS backend-runner

WORKDIR /root/srcs
ENTRYPOINT ["npm", "run", "start:dev"]
