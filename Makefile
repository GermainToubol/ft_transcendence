#******************************************************************************#
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gtoubol <marvin@42.fr>                     +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/12/13 08:55:36 by gtoubol           #+#    #+#              #
#    Updated: 2022/12/13 08:55:36 by gtoubol          ###   ########.fr        #
#                                                                              #
#******************************************************************************#
CONF =	./srcs/docker-compose.yml
SHELL	= '/bin/bash'
DOMAIN	= transcendence.42.fr
CERT	= $(addprefix ./srcs/cert_utils/$(DOMAIN), .cnf .crt .csr .key)

.PHONY: all
all: 	clean certificates
		docker compose -f $(CONF) up --build -d

.PHONY: clean
clean:
		docker compose -f $(CONF) down

.PHONY: fclean
fclean: clean
		@echo "rm volumes:"
		@for volume in "$$(docker volume ls -q)"; do	\
			if [ -n "$${volume}" ]; then				\
				docker volume rm $${volume};			\
			fi;											\
		done;

.PHONY: re
re: fclean all

.PHONY: certificates
certificates: $(CERT)

$(CERT):
		cd srcs/cert_utils && yes "no" | ./utils.sh $(DOMAIN)
