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
