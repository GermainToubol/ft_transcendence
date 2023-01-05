#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gtoubol <marvin@42.fr>                     +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/12/15 17:06:48 by gtoubol           #+#    #+#              #
#    Updated: 2022/12/15 17:06:48 by gtoubol          ###   ########.fr        #
#                                                                              #
#******************************************************************************#

FROM node:alpine AS backend-base

RUN npm i -g @nestjs/cli
RUN mkdir -p /root/srcs /var/front

WORKDIR /root/srcs
ENTRYPOINT ["sh", "-c", "npm install && npm run start:dev"]
