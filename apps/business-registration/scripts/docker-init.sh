#!/bin/sh
set -e

echo "Installing required packages..."
apk add --no-cache bash curl postgresql-client || true

echo "Waiting for PostgreSQL to become available..."
until pg_isready -h db -p 5432 -U myuser -d think_business_registration >/dev/null 2>&1; do
  echo "Postgres unavailable - sleeping 2s"
  sleep 2
done

echo "Preparing package manager (pnpm) and installing dependencies..."
corepack enable || true
corepack prepare pnpm@latest --activate || true
if [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile --reporter=silent || true
fi

echo "Running Prisma migrations (deploy -> fallback: db push)..."
if npx prisma migrate deploy --schema=prisma/schema.prisma; then
  echo "Migrations deployed successfully"
else
  echo "migrate deploy failed, attempting prisma db push"
  npx prisma db push --schema=prisma/schema.prisma
fi

echo "Done."
