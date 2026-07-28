#!/bin/bash

# GachaBuild Update Script
set -e

echo "🔄 Updating GachaBuild..."

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d

# Clean up old images
docker image prune -f

echo "✅ Update completed successfully!"
