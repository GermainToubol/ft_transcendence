#!/bin/sh

install() {
	echo "-- Modules Not installed --"
	cd /root
	nest new -g --package-manager npm --strict anonymous
	echo "-- start copy --"
	cp -R /root/anonymous/node_modules /root/srcs/node_modules
	touch /root/srcs/.installed
	echo "-- end copy --"
}

if [[ ! -f "/root/srcs/.installed" ]]; then
	install;
else
	echo "-- already installed --"
fi
