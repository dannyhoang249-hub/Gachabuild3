---
title: "Maintenance & Monitoring"
description: "Common maintenance tasks, monitoring, and update procedures for the GachaBuild project."
last_updated: "2025-10-27"
related_files: ["updates.md", "backup.md"]
tags: ["maintenance", "monitoring", "updates", "logs"]
---

# Maintenance & Monitoring

This section covers common maintenance tasks, monitoring procedures, and how to keep the GachaBuild project running smoothly.

## 🛠️ Common Maintenance Tasks

### View Logs

```bash
# Tail logs for all services
docker compose -f docker-compose.production.yml logs -f

# View logs for a specific service
docker compose -f docker-compose.production.yml logs -f frontend
docker compose -f docker-compose.production.yml logs -f sanity-studio
docker compose -f docker-compose.production.yml logs -f nginx
```

### Check Service Status

```bash
# List all running containers and their status
docker compose -f docker-compose.production.yml ps
```

### Restart Services

```bash
# Restart all services
docker compose -f docker-compose.production.yml restart

# Restart a specific service
docker compose -f docker-compose.production.yml restart frontend
```

### SSL Certificate Renewal

Certbot handles auto-renewal. To manually renew and apply:

```bash
# 1. Run the renewal process
sudo certbot renew

# 2. Copy the new certificates to the project's SSL directory
cd /root/Gachabuild3
sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/privkey.pem ssl/key.pem

# 3. Restart the Nginx container to apply the new certificates
docker compose -f docker-compose.production.yml restart nginx
```

## 📊 Monitoring & Health Checks

### URLs to Monitor

- **Main Site:** `https://duetnightabyss.gachabuild.com`
- **Sanity Studio:** `https://duetnightabyss.gachabuild.com/studio`
- **Health Check API:** `https://duetnightabyss.gachabuild.com/api/health` (if implemented)

### Check Container Health

```bash
# Check container status and uptime
docker compose -f docker-compose.production.yml ps

# View live resource usage (CPU, Memory)
docker stats
```

### Check Disk Space

```bash
# View overall disk usage on the host
df -h

# View disk usage specifically for Docker
docker system df

# Clean up unused Docker data (images, containers, networks)
# Use with caution in production
docker system prune
```

## 📚 Related Documentation

- **[Update Procedures](./updates.md)**: Detailed steps for deploying updates.
- **[Backup Strategies](./backup.md)**: How to back up and restore data.
