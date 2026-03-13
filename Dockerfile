# Multi-stage build for Payload CMS + Next.js
FROM node:22.17.0-alpine AS base

# --- Install dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# --- Build application ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Payload CMS needs these at build time (Next.js bakes server config during build)
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Increase memory for build on 4GB VPS
ENV NODE_OPTIONS="--max-old-space-size=3072"

RUN corepack enable pnpm && pnpm run build

# --- Production image ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
