# GachaBuild3 - Project Overview & Architecture

**Project:** Duet Night Abyss Game Wiki  
**Domain:** https://duetnightabyss.gachabuild.com  
**Tech Stack:** Next.js 15, Sanity CMS, Docker, Nginx  
**Deployment:** VPS with Docker Compose + SSL

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                      │
│              (Port 80/443 - SSL Termination)                │
└────────────┬─────────────────────────────┬──────────────────┘
             │                             │
             │ /                           │ /studio
             ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   Next.js Frontend      │   │  Sanity Studio (CMS)    │
│   Port: 3000            │   │  Port: 3333             │
│   Service: frontend     │   │  Service: sanity-studio │
│   Mode: Production      │   │  Mode: Static Build     │
└─────────────────────────┘   └─────────────────────────┘
             │
             │ API Calls
             ▼
┌─────────────────────────────────────────────────────────────┐
│              Sanity.io Cloud CMS                            │
│         Project ID: u9m27k7u                                │
│         Dataset: production                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Gachabuild3/
├── src/                          # Next.js application source
│   ├── app/                      # Next.js 15 App Router pages
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Utilities and Sanity client
│   └── data/                     # Static data
│
├── sanity/                       # Sanity Studio configuration
│   ├── schemas/                  # Content schemas (character, weapon, guide)
│   ├── actions/                  # Custom actions (translate, revalidate)
│   └── studio.tsx                # Studio entry point
│
├── public/                       # Static assets
│   ├── characters/               # Character images
│   └── weapons/                  # Weapon images
│
├── scripts/                      # Utility scripts
│   ├── i18n/                     # Translation scripts
│   └── assets/                   # Asset management
│
├── Dockerfile                    # Next.js frontend build
├── Dockerfile.studio             # Sanity Studio static build
├── docker-compose.production.yml # Production Docker Compose
├── nginx-ssl.conf                # Nginx reverse proxy config
├── sanity.config.ts              # Sanity Studio config (CRITICAL: basePath)
└── .env                          # Environment variables (not in git)
```

---

## 🔧 How It's Built

### Frontend (Next.js)

**Dockerfile:** Multi-stage build
- Stage 1: Install dependencies
- Stage 2: Build Next.js app
- Stage 3: Production runtime with standalone output

**Build Command:**
```bash
docker compose -f docker-compose.production.yml build frontend
```

**Key Settings:**
- Output: Standalone (optimized for Docker)
- Port: 3000
- Mode: Production

### Sanity Studio (CMS)

**Dockerfile.studio:** Multi-stage static build
- Stage 1 (builder): Node.js - builds static HTML/CSS/JS
- Stage 2 (runtime): Nginx Alpine - serves static files

**Build Command:**
```bash
docker compose -f docker-compose.production.yml build sanity-studio
```

**Critical Configuration:**
```typescript
// sanity.config.ts
export default defineConfig({
  basePath: '/studio',  // ⚠️ CRITICAL - must match nginx path!
  projectId: 'u9m27k7u',
  dataset: 'production',
  // ...
})
```

**Why Static Build:**
- ✅ No dev server host checking issues
- ✅ Fast, reliable nginx serving
- ✅ Production-ready
- ❌ DON'T use `sanity dev` in production!

---

## 🚀 How It Runs

### Production Stack

**3 Docker Containers:**

1. **frontend** (Next.js)
   - Image: Custom (built from Dockerfile)
   - Port: 3000 (internal)
   - Network: gachabuild-network
   - Restart: unless-stopped

2. **sanity-studio** (Static CMS)
   - Image: Custom (Nginx + built Sanity files)
   - Port: 3333 (internal)
   - Network: gachabuild-network
   - Restart: unless-stopped

3. **nginx** (Reverse Proxy)
   - Image: nginx:alpine
   - Ports: 80 (HTTP), 443 (HTTPS)
   - SSL: Mounted from ./ssl/
   - Network: gachabuild-network
   - Restart: unless-stopped

### Request Flow

```
User Request → Nginx (443) → Routes:
                              ├─ / → frontend:3000 (Next.js)
                              └─ /studio → sanity-studio:3333 (Static files)
```

### SSL/TLS

- Certificates: Let's Encrypt via Certbot
- Location: `/etc/letsencrypt/live/duetnightabyss.gachabuild.com/`
- Mounted to: `./ssl/` in project root
- Auto-renewal: Certbot handles it

---

## 🔄 How to Update

### 1. Code Changes Only (No Dependencies)

**On VPS:**
```bash
cd /root/Gachabuild3
git pull origin master
docker compose -f docker-compose.production.yml restart
```

**Time:** ~30 seconds

---

### 2. Frontend Code Changes

**On VPS:**
```bash
cd /root/Gachabuild3
git pull origin master
docker compose -f docker-compose.production.yml build frontend
docker compose -f docker-compose.production.yml up -d frontend
```

**Time:** ~3-5 minutes (build time)

---

### 3. Sanity Studio Changes

**⚠️ IMPORTANT:** Requires rebuild if:
- `sanity.config.ts` changed
- `basePath` changed
- Schemas changed
- Dependencies changed

**On VPS:**
```bash
cd /root/Gachabuild3
git pull origin master
docker compose -f docker-compose.production.yml build --no-cache sanity-studio
docker compose -f docker-compose.production.yml up -d sanity-studio
```

**Time:** ~2-3 minutes (build time)

---

### 4. Nginx Config Changes

**On VPS:**
```bash
cd /root/Gachabuild3
git pull origin master
docker compose -f docker-compose.production.yml restart nginx

# Verify config is valid
docker compose -f docker-compose.production.yml exec nginx nginx -t
```

**Time:** ~5 seconds

---

### 5. Full Rebuild (Everything)

**When to use:**
- Major version upgrades
- Docker configuration changes
- Complete reset needed

**On VPS:**
```bash
cd /root/Gachabuild3
git pull origin master
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml build --no-cache
docker compose -f docker-compose.production.yml up -d
```

**Time:** ~5-10 minutes

---

### 6. Dependency Updates

**Package.json changed:**
```bash
cd /root/Gachabuild3
git pull origin master

# Rebuild affected services
docker compose -f docker-compose.production.yml build --no-cache frontend
docker compose -f docker-compose.production.yml build --no-cache sanity-studio
docker compose -f docker-compose.production.yml up -d
```

---

## 🔑 Environment Variables

**Location:** `/root/Gachabuild3/.env` (on VPS)

**Required Variables:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to Update:**
```bash
cd /root/Gachabuild3
nano .env  # Edit variables
docker compose -f docker-compose.production.yml restart  # Apply changes
```

---

## 🛠️ Common Maintenance Tasks

### View Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Specific service
docker compose -f docker-compose.production.yml logs -f frontend
docker compose -f docker-compose.production.yml logs -f sanity-studio
docker compose -f docker-compose.production.yml logs -f nginx
```

### Check Status

```bash
docker compose -f docker-compose.production.yml ps
```

### Restart Services

```bash
# All services
docker compose -f docker-compose.production.yml restart

# Specific service
docker compose -f docker-compose.production.yml restart frontend
```

### SSL Certificate Renewal

```bash
# Renew certificates (Certbot auto-renews, but can be done manually)
sudo certbot renew

# Copy new certs to project
cd /root/Gachabuild3
sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/duetnightabyss.gachabuild.com/privkey.pem ssl/key.pem

# Restart nginx
docker compose -f docker-compose.production.yml restart nginx
```

---

## 🐛 Troubleshooting Quick Reference

### Frontend Not Loading

```bash
# Check if running
docker compose -f docker-compose.production.yml ps frontend

# Check logs
docker compose -f docker-compose.production.yml logs frontend

# Restart
docker compose -f docker-compose.production.yml restart frontend
```

### Sanity Studio Blank Page

**Most Common Cause:** Missing `basePath: '/studio'` in `sanity.config.ts`

**Fix:**
```bash
cd /root/Gachabuild3
grep "basePath" sanity.config.ts  # Should show: basePath: '/studio',

# If missing, pull latest code and rebuild
git pull origin master
docker compose -f docker-compose.production.yml build --no-cache sanity-studio
docker compose -f docker-compose.production.yml up -d sanity-studio
```

### SSL Certificate Errors

```bash
# Check certificate validity
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run
```

### Nginx Configuration Errors

```bash
# Test config
docker compose -f docker-compose.production.yml exec nginx nginx -t

# View error logs
docker compose -f docker-compose.production.yml logs nginx
```

---

## 📊 Monitoring & Health Checks

### URLs to Monitor

- **Main Site:** https://duetnightabyss.gachabuild.com
- **Studio:** https://duetnightabyss.gachabuild.com/studio
- **Health Check:** https://duetnightabyss.gachabuild.com/health

### Check Container Health

```bash
docker compose -f docker-compose.production.yml ps
docker stats
```

### Disk Space

```bash
df -h
docker system df  # Docker disk usage
docker system prune  # Clean up unused data (use with caution)
```

---

## 🔐 Security Notes

- SSL certificates auto-renew via Certbot
- `.env` file is git-ignored (never commit!)
- Nginx headers configured for security (HSTS, XSS protection, etc.)
- API token stored in environment variables only
- All traffic forced to HTTPS

---

## 📚 Key Documentation Files

1. **SANITY_STUDIO_DEPLOYMENT_GUIDE.md** - Complete Sanity Studio setup
2. **SANITY_STUDIO_QUICK_FIX.md** - Quick troubleshooting
3. **PROJECT_OVERVIEW.md** - This file (architecture & updates)
4. **DEPLOYMENT_GUIDE.md** - Initial deployment instructions

---

## ⚠️ Critical Things to Remember

1. **Sanity Studio MUST use static build** - Never run `sanity dev` in production
2. **`basePath: '/studio'` is REQUIRED** in `sanity.config.ts`
3. **Always rebuild after config changes** - Restart alone won't pick up new configs
4. **Use `--no-cache` when debugging** - Ensures fresh build
5. **Environment variables** - Required for both build and runtime

---

## 🎯 Quick Command Reference

```bash
# Common location
cd /root/Gachabuild3

# Pull latest code
git pull origin master

# Full restart (no rebuild)
docker compose -f docker-compose.production.yml restart

# Rebuild specific service
docker compose -f docker-compose.production.yml build --no-cache <service-name>
docker compose -f docker-compose.production.yml up -d <service-name>

# View logs
docker compose -f docker-compose.production.yml logs -f <service-name>

# Check status
docker compose -f docker-compose.production.yml ps

# Stop everything
docker compose -f docker-compose.production.yml down

# Start everything
docker compose -f docker-compose.production.yml up -d
```

---

**Last Updated:** October 24, 2025  
**Status:** Production Stable ✅  
**Deployment:** VPS Docker Compose with SSL

