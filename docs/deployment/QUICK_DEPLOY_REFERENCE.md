# ⚡ Quick Deploy Reference - Revalidation Fix

**Copy and paste these commands on your VPS to deploy the fix.**

---

## 🚀 Deploy Commands (Copy & Paste)

```bash
# 1. SSH to VPS
ssh root@your-vps-ip

# 2. Navigate to project
cd /path/to/gacha-guide-cms

# 3. Pull latest changes
git pull origin feature/content-v1

# 4. Update .env.local (IMPORTANT!)
nano .env.local
```

**Add this line to .env.local:**
```
WEBHOOK_SECRET=gachabuild-revalidate-2025
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

```bash
# 5. Deploy with Docker
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build

# 6. Monitor (optional)
docker-compose -f docker-compose.production.yml logs -f frontend
```

**Press `Ctrl+C` to stop viewing logs**

---

## ✅ Test Revalidation

1. Go to: `https://studio.duetnightabyss.gachabuild.com`
2. Open any character
3. Click "🚀 Push Build / Revalidate"
4. Should see: "✅ Site revalidation triggered successfully!"

---

## 🔍 Check Status

```bash
# Check if containers are running
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart if needed
docker-compose -f docker-compose.production.yml restart
```

---

## 📝 What Changed

- ✅ Fixed "Revalidation failed: Failed to fetch" error
- ✅ Fixed "Refused to connect - CSP violation" error
- ✅ Added CSP header to Sanity Studio nginx config
- ✅ Added CORS headers for cross-origin requests
- ✅ Added webhook secret for security
- ✅ Better error messages and logging
- ✅ Auto-detect production/development

---

## 📚 Full Documentation

- `DEPLOYMENT_SUMMARY_REVALIDATION_FIX.md` - Complete deployment guide
- `REVALIDATION_FIX.md` - Technical details
- `VPS_DEPLOYMENT_STEPS.md` - Step-by-step instructions

---

**Estimated Time:** 12-15 minutes
**Latest Commit:** `1828161`
**Branch:** `feature/content-v1`

---

## ⚠️ Important Note

**You MUST rebuild the Sanity Studio container** because the CSP configuration is in the Dockerfile.studio nginx config. Simply restarting won't work - you need to rebuild!

## 🔧 What Was Fixed

**CSP Blocked URLs:**
- ✅ `https://core.sanity-cdn.com/bridge.js` - Sanity bridge script
- ✅ `https://duetnightabyss.gachabuild.com/api/revalidate` - Revalidation API

**CSP Directives Updated:**
- `script-src` - Added `https://*.sanity-cdn.com` and `https://core.sanity-cdn.com`
- `style-src` - Added `https://*.sanity-cdn.com`
- `font-src` - Added `https://*.sanity-cdn.com`
- `img-src` - Added `blob:` for Sanity image handling
- `connect-src` - Added `https://*.sanity-cdn.com` and `https://duetnightabyss.gachabuild.com`

