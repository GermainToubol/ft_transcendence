#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gtoubol <marvin@42.fr>                     +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/12/15 18:02:18 by gtoubol           #+#    #+#              #
#    Updated: 2022/12/15 18:02:18 by gtoubol          ###   ########.fr        #
#                                                                              #
#******************************************************************************#

FROM node:alpine AS frontend-base

RUN mkdir -p /root/srcs
COPY ./config.sh /tmp
WORKDIR /root/srcs

ENTRYPOINT ["sh", "-c", "sh /tmp/config.sh && npm install && npm run dev"]
