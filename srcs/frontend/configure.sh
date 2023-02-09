#!/bin/sh

# This script aims to pass the required environment variables to
# the builted software extension

SRC_ROOT="$1"

cat > "${SRC_ROOT}/config.ts" <<EOF
export const BACK_SERVER = '${DOMAIN}'
export const INTRA_PATH = '${INTRA_OAUTH}'
EOF
