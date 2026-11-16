#!/bin/sh
# Same steps as Umami's scripts/start-docker.sh, plus one: replace the seeded
# admin password (admin / umami) with ADMIN_PASSWORD, only while it is still
# the default. A password changed later in Umami is never overwritten.
set -e
export PATH="$PWD/node_modules/.bin:$PATH"

node scripts/check-db.js
node scripts/railway-admin-password.mjs
node scripts/update-tracker.js

export HOSTNAME=0.0.0.0
exec node server.js
