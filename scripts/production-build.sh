#!/bin/bash

# Think ID - Production Preparation & Build Script
# This script ensures the database is migrated and the monorepo is built for production.

set -e

echo "🚀 Starting production build process..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# 2. Generate Prisma Client
echo "💎 Generating Prisma client..."
pnpm db:generate

# 3. Build all applications
echo "🏗️ Building applications with Turbo..."
pnpm build

# 4. Database Migration (Optional: usually run in a separate step or init container)
# echo "🔄 Running database migrations..."
# pnpm db:migrate

echo "✅ Production preparation complete!"
echo "Next steps:"
echo "1. Ensure your .env file is configured based on .env.example"
echo "2. Run 'next start' or use the 'standalone' output in your Docker container."
