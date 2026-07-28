# 🚀 VPS Deployment Steps - Revalidation Fix

**Status:** ⚠️ OUTDATED - See DOCKER_DEPLOYMENT_GUIDE.md for current deployment

> **Note:** This document is kept for historical reference. For current deployment instructions, see:
> - `DOCKER_DEPLOYMENT_GUIDE.md` - Complete Docker deployment guide
> - `PRE_DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist

Quick guide to deploy the revalidation fix to your VPS using Docker.

---

## 📋 What Was Fixed

- ✅ Fixed "Revalidation failed" error in Sanity Studio
- ✅ Added proper webhook URL detection (production vs development)
- ✅ Added webhook secret for security
- ✅ Improved error messages and logging

---

## 🔧 Step-by-Step Deployment (Docker)

### Step 1: Push Changes to Git (Local Machine)

```bash
# Commit and push changes
git add .
git commit -m "Fix: Revalidation failed error in Sanity Studio"
git push origin main
```

### Step 2: SSH into Your VPS

```bash
ssh root@your-vps-ip
```

### Step 3: Navigate to Project Directory

```bash
cd /path/to/gacha-guide-cms
```

### Step 4: Pull Latest Changes

```bash
git pull origin main
```

### Step 5: Update Environment Variables

```bash
nano .env.local
```

Add this line at the end:
```bash
WEBHOOK_SECRET=gachabuild-revalidate-2025
```

Save and exit:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 6: Rebuild and Deploy with Docker

```bash
# Stop existing containers
docker-compose -f docker-compose.production.yml down

# Rebuild and start containers
docker-compose -f docker-compose.production.yml up -d --build
```

This will take 5-10 minutes. Docker will:
1. Build the Next.js frontend image
2. Build the Sanity Studio image
3. Start Nginx reverse proxy
4. Start all containers

### Step 7: Monitor Deployment

```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# View frontend logs
docker-compose -f docker-compose.production.yml logs -f frontend

# View all logs
docker-compose -f docker-compose.production.yml logs -f
```

Press `Ctrl + C` to stop viewing logs.

---

## ✅ Verify the Fix

### 1. Test Sanity Studio

1. Open: `https://studio.duetnightabyss.gachabuild.com`
2. Login to Sanity Studio
3. Open any character (e.g., Zhiliu)
4. Click the **"🚀 Push Build / Revalidate"** button
5. You should see:
   ```
   ✅ Site revalidation triggered successfully!
   
   Revalidated 12 paths
   ```

### 2. Check Browser Console

1. Open browser console (F12)
2. Look for these logs:
   ```
   🚀 Revalidating: { type: 'character', slug: 'zhiliu', webhookUrl: 'https://duetnightabyss.gachabuild.com/api/revalidate' }
   ✅ Revalidation result: { success: true, results: [...] }
   ```

### 3. Verify Content Update

1. Make a small change to a character in Sanity Studio
2. Click "Publish"
3. Click "🚀 Push Build / Revalidate"
4. Wait 5-10 seconds
5. Visit the character page: `https://duetnightabyss.gachabuild.com/characters/zhiliu`
6. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
7. Verify your changes are visible

---

## 🐛 Troubleshooting

### Issue: "Revalidation failed: 401 Unauthorized"

**Solution:** Check that `WEBHOOK_SECRET` is set correctly in `.env.local`

```bash
# On VPS
cat .env.local | grep WEBHOOK_SECRET
```

Should show:
```
WEBHOOK_SECRET=gachabuild-revalidate-2025
```

If not set, add it and rebuild:
```bash
nano .env.local
# Add: WEBHOOK_SECRET=gachabuild-revalidate-2025
docker-compose -f docker-compose.production.yml up -d --build
```

### Issue: "Revalidation failed: Network error"

**Solution:** Check that Docker containers are running

```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# Should show all containers as "Up"
# If not, restart:
docker-compose -f docker-compose.production.yml restart
```

### Issue: Containers not starting

**Solution:** Check Docker logs

```bash
# View all logs
docker-compose -f docker-compose.production.yml logs

# View specific container logs
docker-compose -f docker-compose.production.yml logs frontend
docker-compose -f docker-compose.production.yml logs sanity-studio
docker-compose -f docker-compose.production.yml logs nginx
```

### Issue: Changes not visible on website

**Solution:**
1. Wait 10-20 seconds after revalidation
2. Hard refresh the page (Ctrl+Shift+R)
3. Clear browser cache
4. Check if CDN cache needs to be cleared

---

## 📝 Files Changed

- `sanity/actions/revalidateAction.ts` - Fixed revalidation logic
- `src/app/api/revalidate/route.ts` - Improved error handling
- `.env.local` - Added WEBHOOK_SECRET

---

## 🔗 Related Documentation

- `REVALIDATION_FIX.md` - Detailed explanation of the fix
- `deploy-revalidation-fix.sh` - Automated deployment script

---

## ⚡ Quick Commands Reference (Docker)

```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to project
cd /path/to/gacha-guide-cms

# Pull changes
git pull origin main

# Stop containers
docker-compose -f docker-compose.production.yml down

# Rebuild and start
docker-compose -f docker-compose.production.yml up -d --build

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Restart containers
docker-compose -f docker-compose.production.yml restart

# Stop all containers
docker-compose -f docker-compose.production.yml down

# Remove all containers and volumes
docker-compose -f docker-compose.production.yml down -v
```

---

**Status:** ✅ Ready to deploy with Docker
**Estimated Time:** 10-15 minutes (including Docker build)

