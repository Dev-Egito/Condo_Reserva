#!/bin/sh
set -eu

cd /app
npm run build --workspace=shared

cd /app/api
npx prisma generate
npx prisma migrate deploy

cd /app
exec npm run dev --workspace=api
