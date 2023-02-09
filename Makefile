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


all: 	clean
		docker-compose -f $(CONF) up --build --force-recreate -d


clean:
		docker-compose -f $(CONF) down


fclean: clean
		@echo "rm volumes:"
		@for volume in "$$(docker volume ls -q)"; do	\
			if [ -n "$${volume}" ]; then				\
				docker volume rm $${volume};			\
			fi;											\
		done;


re: fclean all


connect:
		docker-compose -f $(CONF) exec -it backend sh || exit 0

connectfront:
		docker compose -f $(CONF) exec -it frontend sh || exit 0


status:
		docker-compose -f $(CONF) ps


logs:
		docker-compose -f $(CONF) logs -f


.PHONY: all clean fclean re connect status logs
