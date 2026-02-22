FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
ARG APP_NAME
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=$APP_NAME --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
ARG APP_NAME
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args if needed for environment variables
# ARG DATABASE_URL
# ENV DATABASE_URL=$DATABASE_URL

RUN pnpm turbo run build --filter=$APP_NAME...

FROM base AS runner
ARG APP_NAME
ENV APP_NAME=$APP_NAME
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/$APP_NAME/next.config.mjs .
COPY --from=installer /app/apps/$APP_NAME/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/.next/static ./apps/$APP_NAME/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP_NAME/public ./apps/$APP_NAME/public

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD node apps/$APP_NAME/server.js
