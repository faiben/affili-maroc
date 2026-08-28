#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking if seed is needed..."
USER_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.count().then(c => { console.log(c); process.exit(); }).catch(() => { console.log(0); process.exit(); });
" 2>/dev/null || echo "0")

echo "User count: $USER_COUNT"
if [ "$USER_COUNT" = "0" ]; then
  echo "Seeding database..."
  npx prisma db seed
fi

echo "Starting application..."
exec node server.js
