---
title: "Deployment Guide"
description: "Platform-specific deployment instructions for Vercel, Netlify, and VPS"
last_updated: "2025-10-27"
related_files: ["README.md", "environment-setup.md", "ssl-setup.md"]
tags: ["deployment", "vercel", "netlify", "vps", "docker"]
---

# Deployment Guide

Platform-specific deployment instructions for the duetnightabyss.gachabuild.com system.

## 🚀 Vercel Deployment

### 1. Set Environment Variables

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all variables from `.env.local` (see [Environment Setup](./environment-setup.md))

### 2. Deploy Application

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Configure Webhook

1. Get your Vercel deploy hook URL from Project Settings → Git → Deploy Hooks
2. Add to Sanity webhook configuration:
   ```
   URL: https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxx
   ```

### 4. Verify Deployment

- Check build logs in Vercel dashboard
- Test revalidation endpoint: `https://yourdomain.com/api/revalidate`
- Verify i18n routing works

## 🌐 Netlify Deployment

### 1. Set Environment Variables

1. Go to Netlify Dashboard → Site → Site settings → Environment Variables
2. Add all required variables

### 2. Configure Build Settings

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### 4. Configure Webhook

1. Get build hook URL from Site Settings → Build & Deploy → Build hooks
2. Add to Sanity webhook configuration

## 🖥️ VPS/Custom Server Deployment

### 1. Server Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose -y

# Install Node.js (for local builds)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Build Application

```bash
# Clone repository
git clone https://github.com/your-username/gachabuild3.git
cd gachabuild3

# Install dependencies
npm install

# Build application
npm run build
```

### 3. Docker Setup

Create `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    restart: unless-stopped

  sanity-studio:
    build:
      context: .
      dockerfile: Dockerfile.studio
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - sanity-studio
    restart: unless-stopped
```

### 4. Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream studio {
        server sanity-studio:3333;
    }

    server {
        listen 80;
        server_name duetnightabyss.gachabuild.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name duetnightabyss.gachabuild.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location /studio {
            proxy_pass http://studio;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 5. Deploy with Docker

```bash
# Start services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

### 6. SSL Setup

See [SSL Setup Guide](./ssl-setup.md) for detailed SSL certificate configuration.

## 🔄 Continuous Deployment

### GitHub Actions (Vercel)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitHub Actions (VPS)

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /path/to/gachabuild3
            git pull origin main
            npm install
            npm run build
            docker-compose -f docker-compose.production.yml up -d --build
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints

Add to your Next.js app:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      sanity: 'connected',
      translation: 'available',
      assets: 'accessible'
    }
  })
}
```

### Monitoring Script

```bash
#!/bin/bash
# health-check.sh

DOMAIN="https://duetnightabyss.gachabuild.com"

# Check main site
if curl -f -s "$DOMAIN/api/health" > /dev/null; then
    echo "✅ Main site is healthy"
else
    echo "❌ Main site is down"
    # Send alert (email, Slack, etc.)
fi

# Check Sanity Studio
if curl -f -s "$DOMAIN/studio" > /dev/null; then
    echo "✅ Sanity Studio is accessible"
else
    echo "❌ Sanity Studio is down"
fi
```

## 🔧 Maintenance Commands

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart services
docker-compose -f docker-compose.production.yml restart
```

### Backup and Restore

```bash
# Backup Sanity data
npm run sanity:export

# Backup environment configuration
cp .env.local .env.backup

# Restore from backup
npm run sanity:import backup.tar.gz
```

## 🚨 Troubleshooting

**Common Deployment Issues:**

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Review build logs for specific errors

2. **SSL Certificate Issues:**
   - Verify certificate files are correctly mounted
   - Check certificate expiration dates
   - Ensure DNS records point to correct server

3. **Docker Container Issues:**
   - Check container logs: `docker-compose logs service-name`
   - Verify port availability
   - Check resource usage: `docker stats`

4. **Webhook Failures:**
   - Verify webhook URL is accessible
   - Check HMAC signature validation
   - Review webhook logs in Sanity

See [Troubleshooting Guide](./troubleshooting.md) for detailed solutions.
