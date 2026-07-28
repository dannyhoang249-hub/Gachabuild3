# 🚀 Docker Deployment Guide - Updated for Main Branch

**Date:** October 30, 2025  
**Status:** ✅ READY FOR DEPLOYMENT  
**Branch:** main  
**Docker:** Production-ready configuration

---

## 📋 What's Included

This deployment includes:
- ✅ Complete Sanity CMS integration (45 weapons, 24 characters)
- ✅ All missing images fixed (Siren's Kiss, Zhiliu, Outsider)
- ✅ Enhanced verification scripts
- ✅ Improved error handling and logging
- ✅ Google Analytics integration
- ✅ Webhook revalidation system
- ✅ Multi-language support (i18n)
- ✅ SEO optimization

---

## 🔧 Prerequisites

### On Your VPS:
- Docker and Docker Compose installed
- Git installed
- Port 80 and 443 available (for HTTP/HTTPS)
- Port 3000 available (for Next.js)
- Port 3333 available (for Sanity Studio)

### Required Credentials:
- Sanity API Token
- Webhook Secret
- Google Analytics Measurement ID (optional)
- OpenAI API Key (optional, for translations)

---

## 📦 Step-by-Step Deployment

### Step 1: Clone or Pull Repository

**If first time deploying:**
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Clone the repository
cd /root
git clone https://github.com/dannyhoang249-hub/gacha-guide-cms.git
cd gacha-guide-cms
```

**If updating existing deployment:**
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to project
cd /root/Gachabuild3

# Pull latest changes from main branch
git pull origin main

# Verify you're on main branch
git branch
```

---

### Step 2: Set Up Environment Variables

```bash
# Create .env.local file
nano .env.local
```

**Add the following content:**
```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-actual-sanity-api-token-here

# Webhook Secret for Revalidation
WEBHOOK_SECRET=gachabuild-revalidate-2025

# Google Analytics (GA4) - Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR-ID-HERE

# OpenAI API Key for translation - Optional
OPENAI_API_KEY=your-openai-key-here

# Node Environment
NODE_ENV=production

# Disable Next.js Telemetry
NEXT_TELEMETRY_DISABLED=1
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

**Verify the file:**
```bash
cat .env.local
```

---

### Step 3: Build and Deploy with Docker

```bash
# Stop existing containers (if any)
docker-compose -f docker-compose.production.yml down

# Build and start containers (this takes 5-10 minutes)
docker-compose -f docker-compose.production.yml up -d --build
```

**What this does:**
1. Builds the Next.js frontend Docker image
2. Builds the Sanity Studio Docker image
3. Starts Nginx reverse proxy
4. Starts all containers in detached mode

---

### Step 4: Monitor Deployment

```bash
# Check container status (all should show "Up")
docker-compose -f docker-compose.production.yml ps

# Expected output:
# NAME                          STATUS
# gachabuild3-frontend-1        Up
# gachabuild3-sanity-studio-1   Up
# gachabuild3-nginx-1           Up

# View frontend logs
docker-compose -f docker-compose.production.yml logs -f frontend

# View all logs
docker-compose -f docker-compose.production.yml logs -f
```

Press `Ctrl + C` to stop viewing logs.

---

## ✅ Post-Deployment Verification

### 1. Check Website is Running

Visit your website:
```
https://duetnightabyss.gachabuild.com
```

**Verify:**
- [ ] Website loads correctly
- [ ] Favicon appears in browser tab
- [ ] Character list page loads (`/characters`)
- [ ] Weapon list page loads (`/weapons`)
- [ ] Tier list page loads (`/tier-list`)

### 2. Test Sanity Studio

Visit Sanity Studio:
```
https://studio.duetnightabyss.gachabuild.com
```

**Verify:**
- [ ] Login works
- [ ] Can view characters and weapons
- [ ] Can edit content
- [ ] Revalidation button works

**Test Revalidation:**
1. Open any character in Sanity Studio
2. Click "🚀 Push Build / Revalidate" button
3. Should see: "✅ Site revalidation triggered successfully!"

### 3. Check Environment Variables in Container

```bash
# Verify environment variables are loaded
docker-compose -f docker-compose.production.yml exec frontend printenv | grep SANITY
docker-compose -f docker-compose.production.yml exec frontend printenv | grep WEBHOOK
docker-compose -f docker-compose.production.yml exec frontend printenv | grep GA_MEASUREMENT
```

### 4. Test Google Analytics (if configured)

1. Open browser console (F12)
2. Visit your website
3. Look for: `[GA] Initialized with ID: G-YOUR-ID`
4. Check Network tab for requests to `google-analytics.com`
5. Verify in GA Real-time dashboard

### 5. Test Search Functionality

1. Go to homepage
2. Type in search bar
3. Should see character/weapon suggestions
4. Click a suggestion to navigate

---

## 🐛 Troubleshooting

### Issue: Containers Not Starting

```bash
# Check logs for errors
docker-compose -f docker-compose.production.yml logs

# Check specific container
docker-compose -f docker-compose.production.yml logs frontend
docker-compose -f docker-compose.production.yml logs sanity-studio
docker-compose -f docker-compose.production.yml logs nginx

# Restart containers
docker-compose -f docker-compose.production.yml restart
```

### Issue: Website Shows Old Data

```bash
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
# Or clear browser cache

# If still showing old data, rebuild:
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

### Issue: Environment Variables Not Working

```bash
# Verify .env.local exists and has correct values
cat .env.local

# Verify variables are in docker-compose.production.yml
grep "WEBHOOK_SECRET" docker-compose.production.yml

# Recreate container (restart is NOT enough!)
docker-compose -f docker-compose.production.yml stop frontend
docker-compose -f docker-compose.production.yml rm -f frontend
docker-compose -f docker-compose.production.yml up -d frontend
```

### Issue: Revalidation Failed

```bash
# Check webhook secret is set
docker-compose -f docker-compose.production.yml exec frontend printenv | grep WEBHOOK_SECRET

# Should show: WEBHOOK_SECRET=gachabuild-revalidate-2025

# If not set, add to .env.local and recreate container
nano .env.local
# Add: WEBHOOK_SECRET=gachabuild-revalidate-2025
docker-compose -f docker-compose.production.yml up -d --force-recreate frontend
```

### Issue: Google Analytics Not Working

```bash
# Check if GA ID is set
docker-compose -f docker-compose.production.yml exec frontend printenv | grep GA_MEASUREMENT_ID

# Check CSP headers allow GA
curl -I https://duetnightabyss.gachabuild.com | grep -i "content-security"

# Check nginx config has GA domains
docker-compose -f docker-compose.production.yml exec nginx cat /etc/nginx/nginx.conf | grep "google"
```

### Issue: Images Not Loading from Sanity

```bash
# Check if Sanity CDN is allowed in next.config
# Should have remotePatterns for cdn.sanity.io

# Verify in container
docker-compose -f docker-compose.production.yml exec frontend cat /app/next.config.ts | grep "cdn.sanity.io"
```

---

## 🔄 Updating Deployment

### For Code Changes:

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

### For Environment Variable Changes:

```bash
# Edit .env.local
nano .env.local

# Recreate containers (restart is NOT enough!)
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

### For Nginx Config Changes:

```bash
# Edit nginx-ssl.conf (NOT nginx.conf!)
nano nginx-ssl.conf

# Restart nginx only
docker-compose -f docker-compose.production.yml restart nginx

# Verify changes
docker-compose -f docker-compose.production.yml exec nginx nginx -t
```

---

## 📝 Quick Commands Reference

```bash
# SSH to VPS
ssh root@your-vps-ip

# Navigate to project
cd /root/Gachabuild3

# Pull latest changes
git pull origin main

# Stop containers
docker-compose -f docker-compose.production.yml down

# Build and start
docker-compose -f docker-compose.production.yml up -d --build

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart specific service
docker-compose -f docker-compose.production.yml restart frontend

# Restart all services
docker-compose -f docker-compose.production.yml restart

# Remove all containers and volumes
docker-compose -f docker-compose.production.yml down -v

# Rebuild without cache
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

---

## 📊 Container Architecture

```
┌─────────────────────────────────────────┐
│         Nginx Reverse Proxy             │
│         (Port 80, 443)                  │
│  - SSL/TLS termination                  │
│  - Reverse proxy to services            │
│  - CSP headers                          │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
┌─────▼─────┐ ┌────▼──────┐
│ Frontend  │ │  Sanity   │
│ (Next.js) │ │  Studio   │
│ Port 3000 │ │ Port 3333 │
└───────────┘ └───────────┘
```

---

## 🎯 Environment Variables Checklist

Make sure these are set in `.env.local`:

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- [ ] `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (production)
- [ ] `SANITY_API_TOKEN` - Sanity API token with write access
- [ ] `WEBHOOK_SECRET` - Secret for revalidation endpoint
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID (optional)
- [ ] `OPENAI_API_KEY` - OpenAI key for translations (optional)
- [ ] `NODE_ENV` - Set to production
- [ ] `NEXT_TELEMETRY_DISABLED` - Set to 1

---

## 🔒 Security Checklist

- [ ] `.env.local` file has correct permissions (600)
- [ ] Webhook secret is strong and unique
- [ ] Sanity API token has appropriate permissions
- [ ] SSL certificates are valid and up to date
- [ ] CSP headers are properly configured
- [ ] No sensitive data in git repository

---

## 📚 Related Documentation

- `DEPLOYMENT_TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `SANITY_CMS_FINAL_REPORT.md` - CMS integration details
- `FIXES_SUMMARY.md` - Recent fixes and improvements
- `nginx-ssl.conf` - Nginx configuration file

---

**Status:** ✅ READY FOR DEPLOYMENT  
**Estimated Time:** 10-15 minutes  
**Branch:** main  
**Last Updated:** October 30, 2025
