---
title: "Update Procedures"
description: "Step-by-step procedures for updating different components of the GachaBuild system"
last_updated: "2025-10-27"
related_files: ["README.md", "backup.md"]
tags: ["updates", "deployment", "docker", "maintenance"]
---

# Update Procedures

This document outlines the exact procedures for updating different components of the GachaBuild system based on what you built.

## 🔄 Update Types & Procedures

### 1. Code Changes Only (No Dependencies)

**When to use:** Minor code changes, content updates, configuration tweaks

**On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master
docker compose -f docker-compose.production.yml restart
```

**Time:** ~30 seconds  
**Downtime:** Minimal (rolling restart)

---

### 2. Frontend Code Changes

**When to use:** React components, Next.js pages, styling changes

**On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master
docker compose -f docker-compose.production.yml build frontend
docker compose -f docker-compose.production.yml up -d frontend
```

**Time:** ~3-5 minutes (build time)  
**Downtime:** ~30 seconds (container restart)

---

### 3. Sanity Studio Changes

**⚠️ IMPORTANT:** Requires rebuild if:
- `sanity.config.ts` changed
- `basePath` changed  
- Schemas changed
- Dependencies changed

**On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master
docker compose -f docker-compose.production.yml build --no-cache sanity-studio
docker compose -f docker-compose.production.yml up -d sanity-studio
```

**Time:** ~2-3 minutes (build time)  
**Downtime:** ~30 seconds (Studio only)

---

### 4. Nginx Config Changes

**When to use:** Proxy settings, SSL config, routing changes

**On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master
docker compose -f docker-compose.production.yml restart nginx

# Verify config is valid
docker compose -f docker-compose.production.yml exec nginx nginx -t
```

**Time:** ~5 seconds  
**Downtime:** ~5 seconds

---

### 5. Full Rebuild (Everything)

**When to use:**
- Major version upgrades
- Docker configuration changes
- Complete reset needed
- After significant changes

**On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml build --no-cache
docker compose -f docker-compose.production.yml up -d
```

**Time:** ~5-10 minutes  
**Downtime:** ~5-10 minutes (full rebuild)

---

### 6. Dependency Updates

**When to use:** Package.json changed, new npm packages added

**On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master

# Rebuild affected services
docker compose -f docker-compose.production.yml build --no-cache frontend
docker compose -f docker-compose.production.yml build --no-cache sanity-studio
docker compose -f docker-compose.production.yml up -d
```

**Time:** ~5-8 minutes  
**Downtime:** ~2-3 minutes

---

## 🔑 Environment Variable Updates

**Location:** `/path/to/gacha-guide-cms/.env` (on VPS)

**Required Variables:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to Update:**
```bash
cd /path/to/gacha-guide-cms
nano .env  # Edit variables
docker compose -f docker-compose.production.yml restart  # Apply changes
```

---

## ✅ Post-Update Verification

After any update, verify the system is working:

### 1. Check Container Status
```bash
docker compose -f docker-compose.production.yml ps
```

### 2. Test Endpoints
```bash
# Main site
curl -I https://duetnightabyss.gachabuild.com

# Sanity Studio
curl -I https://duetnightabyss.gachabuild.com/studio
```

### 3. Check Logs for Errors
```bash
docker compose -f docker-compose.production.yml logs -f --tail=50
```

### 4. Verify SSL Certificate
```bash
openssl s_client -connect duetnightabyss.gachabuild.com:443 -servername duetnightabyss.gachabuild.com < /dev/null
```

---

## 🚨 Rollback Procedures

If an update causes issues:

### 1. Quick Rollback (Git)
```bash
cd /path/to/gacha-guide-cms
git log --oneline -5  # See recent commits
git checkout HEAD~1   # Go back one commit
docker compose -f docker-compose.production.yml restart
```

### 2. Full Rollback with Rebuild
```bash
cd /path/to/gacha-guide-cms
git checkout HEAD~1   # Or specific commit hash
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml build --no-cache
docker compose -f docker-compose.production.yml up -d
```

### 3. Emergency Restore from Backup
See [Backup & Restore Guide](./backup.md) for detailed procedures.

---

## 📋 Update Checklist

Before updating:
- [ ] Check current system status
- [ ] Review what changed in the update
- [ ] Ensure you have recent backups
- [ ] Plan for appropriate downtime window

During update:
- [ ] Follow the correct procedure for your change type
- [ ] Monitor logs during deployment
- [ ] Verify container startup

After update:
- [ ] Test all critical endpoints
- [ ] Check for any error logs
- [ ] Verify SSL certificate is working
- [ ] Test Sanity Studio functionality
- [ ] Monitor system for 10-15 minutes

---

## 🔧 Troubleshooting Updates

### Build Failures
```bash
# Clear Docker cache and retry
docker system prune -f
docker compose -f docker-compose.production.yml build --no-cache
```

### Container Won't Start
```bash
# Check detailed logs
docker compose -f docker-compose.production.yml logs service-name

# Check resource usage
docker stats
df -h
```

### SSL Issues After Update
```bash
# Verify certificate files
ls -la ssl/
openssl x509 -in ssl/cert.pem -noout -dates

# Restart nginx
docker compose -f docker-compose.production.yml restart nginx
```

### Sanity Studio Not Loading
```bash
# Verify basePath configuration in sanity.config.ts
# Should be: basePath: '/studio'

# Rebuild studio
docker compose -f docker-compose.production.yml build --no-cache sanity-studio
docker compose -f docker-compose.production.yml up -d sanity-studio
```
