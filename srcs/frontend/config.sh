#!/bin/sh

# Configuration script  #######################################################
#
# Read the environment variables and translate them into a `config.ts' file
#
#  ############################################################################

conf_writer() {
	cat <<-EOF > 'src/config.ts'
export const BACK_SERVER = "${DOMAIN}";
export const INTRA_PATH = "${INTRA_OAUTH}";
EOF
}

main() {
	echo "Create 'config.ts'...";
	conf_writer;
}

main
