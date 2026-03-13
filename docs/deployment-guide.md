# Deployment Guide — Trasmambang Platform

Production deployment on a **2 CPU / 4 GB RAM VPS** with Docker, Caddy (auto-HTTPS), Cloudflare R2 (media storage), and GitHub Actions CI/CD.

```
Push to main → GitHub Actions → SSH into VPS → git pull + docker compose up
```

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Config Changes](#2-project-config-changes)
3. [VPS Initial Setup](#3-vps-initial-setup)
4. [Cloudflare R2 Setup](#4-cloudflare-r2-setup)
5. [GitHub Actions CI/CD](#5-github-actions-cicd)
6. [First Deployment](#6-first-deployment)
7. [Ongoing Operations](#7-ongoing-operations)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

### What You Need

| Item | Details |
|------|---------|
| **VPS** | 2 CPU, 4 GB RAM, 40+ GB SSD — Ubuntu 22.04 or 24.04 LTS |
| **Domain** | e.g. `trasmambang.com`, pointed to VPS IP via A record |
| **Cloudflare Account** | For R2 storage (free tier: 10 GB/month) |
| **GitHub Repo** | With Actions enabled |

### VPS Providers (Budget Options)

- **Hetzner** — €4.50/mo (CX22: 2 vCPU, 4 GB)
- **Contabo** — €6.99/mo (VPS S: 4 vCPU, 8 GB)
- **DigitalOcean** — $24/mo (2 vCPU, 4 GB)
- **Vultr** — $24/mo (2 vCPU, 4 GB)

---

## 2. Project Config Changes

These changes need to be made in the codebase **before deploying**.

### 2.1 Add `output: 'standalone'` to Next.js

**File: `next.config.js`**

```diff
 const nextConfig = {
+  output: 'standalone',
   async rewrites() {
```

> **Why?** The Dockerfile copies `.next/standalone` for production. Without this, the build fails.

### 2.2 Create `.dockerignore`

**File: `.dockerignore`** (create in project root)

```
node_modules
.next
.git
.gitignore
.env
.env.local
.env.prod
docs/
test-results/
playwright-report/
blob-report/
*.md
!README.md
.DS_Store
.vscode
.idea
```

### 2.3 Update Dockerfile

**File: `Dockerfile`** — replace with:

```dockerfile
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
```

### 2.4 Update `docker-compose.prod.yml`

**File: `docker-compose.prod.yml`** — replace with:

```yaml
services:
  caddy:
    image: caddy:2-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"          # HTTP/3
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data       # SSL certs
      - caddy_config:/config
    depends_on:
      payload:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 128M

  payload:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
        PAYLOAD_SECRET: ${PAYLOAD_SECRET}
        NEXT_PUBLIC_SERVER_URL: https://${DOMAIN}
    restart: always
    expose:
      - "3000"                 # Only accessible via Caddy, not publicly
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      NEXT_PUBLIC_SERVER_URL: https://${DOMAIN}
      NODE_ENV: production
      # Cloudflare R2
      R2_BUCKET: ${R2_BUCKET:-}
      R2_ENDPOINT: ${R2_ENDPOINT:-}
      R2_ACCESS_KEY_ID: ${R2_ACCESS_KEY_ID:-}
      R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY:-}
      # PostHog
      NEXT_PUBLIC_POSTHOG_KEY: ${NEXT_PUBLIC_POSTHOG_KEY:-}
      NEXT_PUBLIC_POSTHOG_HOST: ${NEXT_PUBLIC_POSTHOG_HOST:-}
      # Cron
      CRON_SECRET: ${CRON_SECRET:-}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 1536M         # 1.5 GB for Payload + Next.js

  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-payload}
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 512M

volumes:
  pg_data:
  caddy_data:
  caddy_config:
```

### 2.5 Create Caddyfile

**File: `Caddyfile`** (create in project root)

```
{$DOMAIN} {
    reverse_proxy payload:3000

    encode gzip

    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
        -Server
    }
}
```

> **Note:** Replace `{$DOMAIN}` with your actual domain, e.g. `trasmambang.com`. Or keep it as-is and set `DOMAIN` env var in your `.env.prod`. Caddy will **automatically provision SSL** from Let's Encrypt.

### 2.6 Update `.env.prod.example`

**File: `.env.prod.example`** — replace with:

```env
# ─── Domain ───
DOMAIN=yourdomain.com

# ─── Database ───
POSTGRES_USER=postgres
POSTGRES_PASSWORD=generate_a_secure_password_here
POSTGRES_DB=payload

# ─── Payload CMS ───
PAYLOAD_SECRET=generate_a_long_random_secret_here_min_32_chars
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
CRON_SECRET=generate_another_secret_here

# ─── Cloudflare R2 Storage ───
R2_BUCKET=your-bucket-name
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key

# ─── Analytics (PostHog) ───
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 2.7 Install & Configure Cloudflare R2 Storage Adapter

**Install:**

```bash
pnpm add @payloadcms/storage-s3
```

**File: `src/plugins/index.ts`** — add at top:

```typescript
import { s3Storage } from '@payloadcms/storage-s3'
```

Add to the `plugins` array (at the end, before the closing `]`):

```typescript
// Cloudflare R2 storage (only in production when R2_BUCKET is set)
...(process.env.R2_BUCKET
  ? [
      s3Storage({
        collections: {
          media: {
            prefix: 'media',
          },
        },
        bucket: process.env.R2_BUCKET,
        config: {
          endpoint: process.env.R2_ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          },
          region: 'auto',
        },
      }),
    ]
  : []),
```

> **How it works:** In local dev (no `R2_BUCKET` env var), files save to `public/media/` as before. In production, the plugin intercepts uploads and stores them in R2. No changes to `Media.ts` needed.

### 2.8 Create GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]
  workflow_dispatch:        # Allow manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT || 22 }}
          script_stop: true
          command_timeout: 25m
          script: |
            set -e

            cd ~/trasmambang-platform

            echo "==> Pulling latest code..."
            git fetch origin main
            git reset --hard origin/main

            echo "==> Building and restarting containers..."
            docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

            echo "==> Waiting for health check..."
            sleep 15
            curl -sf http://localhost:3000/api/health || echo "WARNING: Health check failed"

            echo "==> Cleaning up old images..."
            docker image prune -f

            echo "==> Deploy complete!"
```

### 2.9 Create Deploy Script (optional manual deploys)

**File: `scripts/deploy.sh`**

```bash
#!/bin/bash
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$APP_DIR"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building containers..."
docker compose -f "$COMPOSE_FILE" build --no-cache

echo "==> Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "==> Waiting for app to start..."
sleep 15

echo "==> Health check..."
if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ App is healthy!"
else
    echo "⚠️  Health check failed. Check logs:"
    echo "    docker compose -f $COMPOSE_FILE logs payload --tail=50"
fi

echo "==> Pruning old Docker images..."
docker image prune -f

echo "==> Done!"
```

```bash
chmod +x scripts/deploy.sh
```

---

## 3. VPS Initial Setup

SSH into your fresh VPS as root and run these steps.

### 3.1 Create Deploy User

```bash
# Create user
adduser deploy
usermod -aG sudo deploy

# Setup SSH key auth
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Disable password login (after verifying key login works!)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 3.2 Install Docker

```bash
# Switch to deploy user
su - deploy

# Install Docker (official script)
curl -fsSL https://get.docker.com | sudo sh

# Add deploy user to docker group (no sudo needed for docker commands)
sudo usermod -aG docker deploy

# Log out and back in for group change to take effect
exit
su - deploy

# Verify
docker --version
docker compose version
```

### 3.3 Configure Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp    # HTTP (Caddy redirect)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 443/udp   # HTTP/3
sudo ufw enable
sudo ufw status
```

### 3.4 Add Swap (Recommended for 4 GB VPS)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

### 3.5 Clone Repository

```bash
# As deploy user
cd ~
git clone https://github.com/YOUR_USERNAME/trasmambang-platform.git
cd trasmambang-platform

# Create .env.prod from example
cp .env.prod.example .env.prod
```

### 3.6 Configure `.env.prod`

Edit `.env.prod` with your actual values:

```bash
nano .env.prod
```

**Generate secure secrets:**

```bash
# Generate PAYLOAD_SECRET (32+ chars)
openssl rand -base64 32

# Generate POSTGRES_PASSWORD
openssl rand -base64 24

# Generate CRON_SECRET
openssl rand -base64 24
```

---

## 4. Cloudflare R2 Setup

### 4.1 Create R2 Bucket

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **R2 Object Storage** → **Create bucket**
3. Name: `trasmambang-media` (or your preference)
4. Location: **Automatic**
5. Click **Create bucket**

### 4.2 Enable Public Access

1. In your bucket → **Settings** → **Public access**
2. Enable: **Allow Access** via `r2.dev` subdomain
3. Copy the public URL (e.g. `https://pub-xxxx.r2.dev`)
4. (Optional) Set up a custom domain like `media.trasmambang.com`

### 4.3 Create API Token

1. Go to **R2** → **Manage R2 API Tokens** → **Create API Token**
2. Permissions: **Object Read & Write**
3. Specify bucket: Select your bucket
4. Click **Create API Token**
5. **Copy immediately** (shown only once):
   - Access Key ID → `R2_ACCESS_KEY_ID`
   - Secret Access Key → `R2_SECRET_ACCESS_KEY`

### 4.4 Get Endpoint URL

1. In your bucket → **Settings**
2. Copy the **S3 API endpoint**
3. Format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
4. This is your `R2_ENDPOINT`

### 4.5 Update `.env.prod`

```env
R2_BUCKET=trasmambang-media
R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=paste-your-access-key
R2_SECRET_ACCESS_KEY=paste-your-secret-key
```

---

## 5. GitHub Actions CI/CD

### 5.1 Generate SSH Key for Deployment

On your **local machine** (not the VPS):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""
```

### 5.2 Add Public Key to VPS

```bash
# Copy public key to VPS
ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@YOUR_VPS_IP
```

Or manually:

```bash
# On VPS as deploy user
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
```

### 5.3 Add GitHub Secrets

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your VPS IP address (e.g. `123.45.67.89`) |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contents of `~/.ssh/deploy_key` (the **private** key) |
| `VPS_PORT` | `22` (or your custom SSH port) |

### 5.4 Test the Workflow

```bash
# Push to main to trigger
git add .
git commit -m "chore: add deployment config"
git push origin main
```

Or trigger manually: **Actions** → **Deploy to VPS** → **Run workflow**

---

## 6. First Deployment

### 6.1 DNS Setup

Add an **A record** in your domain registrar/DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `YOUR_VPS_IP` | 300 |
| A | `www` | `YOUR_VPS_IP` | 300 |

### 6.2 Manual First Deploy

SSH into VPS and do the first build manually (to verify everything works):

```bash
ssh deploy@YOUR_VPS_IP
cd ~/trasmambang-platform

# Make sure .env.prod is configured
cat .env.prod

# Build and start
docker compose -f docker-compose.prod.yml up -d --build

# Watch the logs
docker compose -f docker-compose.prod.yml logs -f
```

### 6.3 Verify

1. **HTTPS**: Open `https://yourdomain.com` — should show home page
2. **Admin**: Open `https://yourdomain.com/admin` — should show login
3. **Create first user**: Sign up via the admin panel
4. **Upload test**: Upload an image in admin → verify it's stored in R2

---

## 7. Ongoing Operations

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f payload
docker compose -f docker-compose.prod.yml logs -f postgres
docker compose -f docker-compose.prod.yml logs -f caddy
```

### Rollback

```bash
# Revert to previous commit
git log --oneline -5           # Find the commit hash
git reset --hard <COMMIT_HASH>
docker compose -f docker-compose.prod.yml up -d --build
```

### Database Backup

```bash
# Manual backup
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U postgres payload > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker compose -f docker-compose.prod.yml exec -T postgres \
  psql -U postgres payload < backup_20260311.sql
```

### Automated Daily Backups (Cron)

```bash
# As deploy user
crontab -e

# Add this line (daily at 3 AM):
0 3 * * * cd ~/trasmambang-platform && docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres payload | gzip > ~/backups/payload_$(date +\%Y\%m\%d).sql.gz && find ~/backups -name "*.sql.gz" -mtime +7 -delete
```

```bash
mkdir -p ~/backups
```

### Monitor Resources

```bash
# Live resource usage
docker stats

# Disk usage
docker system df
```

### Clean Up Docker

```bash
# Remove unused images (safe)
docker image prune -f

# Full cleanup (removes all unused data)
docker system prune -f
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart only payload (no rebuild)
docker compose -f docker-compose.prod.yml restart payload

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build payload
```

---

## 8. Troubleshooting

### Build Fails — Out of Memory

The 4 GB VPS might run tight during builds. Solutions:

```bash
# 1. Ensure swap is enabled
free -h

# 2. Stop running containers during build
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# 3. The Dockerfile already sets NODE_OPTIONS="--max-old-space-size=3072"
```

### Caddy Certificate Error

```bash
# Check Caddy logs
docker compose -f docker-compose.prod.yml logs caddy

# Common fix: DNS not propagated yet. Verify:
dig yourdomain.com +short
# Should return your VPS IP
```

### Database Connection Issues

```bash
# Check if postgres is healthy
docker compose -f docker-compose.prod.yml ps

# Check postgres logs
docker compose -f docker-compose.prod.yml logs postgres

# Connect to postgres directly
docker compose -f docker-compose.prod.yml exec postgres psql -U postgres payload
```

### R2 Upload Fails

```bash
# Verify env vars are set
docker compose -f docker-compose.prod.yml exec payload env | grep R2

# Common issues:
# - Wrong endpoint (must include https://)
# - API token doesn't have write permission
# - Bucket name mismatch
```

### Health Check Fails

The health endpoint might not exist by default. Create one:

**File: `src/app/(payload)/api/health/route.ts`**

```typescript
export const GET = () => Response.json({ status: 'ok' }, { status: 200 })
```

### Container Keeps Restarting

```bash
# Check exit code
docker compose -f docker-compose.prod.yml ps -a

# Check logs for errors
docker compose -f docker-compose.prod.yml logs payload --tail=100
```

---

## Resource Budget (2 CPU / 4 GB RAM)

| Service | Memory Limit | Typical Usage |
|---------|-------------|---------------|
| Payload + Next.js | 1,536 MB | 300–800 MB |
| PostgreSQL | 512 MB | 50–200 MB |
| Caddy | 128 MB | 10–30 MB |
| OS + overhead | ~1,824 MB | 200–500 MB |
| **Total** | **4,000 MB** | |

> With 2 GB swap, builds will complete even if memory spikes.
