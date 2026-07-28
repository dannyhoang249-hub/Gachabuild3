# ⚡ Quick Deploy Commands - VPS Deployment

**Date:** October 30, 2025  
**Commit:** b891a93  
**Branch:** main

---

## 🚀 One-Command Deployment

```bash
# SSH to VPS, pull changes, and deploy
ssh root@your-vps-ip "cd /path/to/gacha-guide-cms && git pull origin main && docker-compose -f docker-compose.production.yml down && docker-compose -f docker-compose.production.yml up -d --build"
```

---

## 📋 Step-by-Step Commands

### 1. SSH to VPS
```bash
ssh root@your-vps-ip
```

### 2. Navigate and Pull
```bash
cd /path/to/gacha-guide-cms
git pull origin main
```

### 3. Deploy
```bash
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

### 4. Check Status
```bash
docker-compose -f docker-compose.production.yml ps
```

### 5. View Logs
```bash
docker-compose -f docker-compose.production.yml logs -f
```

---

## 🔍 Verification Commands

### Check Containers
```bash
docker-compose -f docker-compose.production.yml ps
```

### Check Frontend Logs
```bash
docker-compose -f docker-compose.production.yml logs frontend
```

### Check Nginx Logs
```bash
docker-compose -f docker-compose.production.yml logs nginx
```

### Check Environment Variables
```bash
docker-compose -f docker-compose.production.yml exec frontend printenv | grep SANITY
docker-compose -f docker-compose.production.yml exec frontend printenv | grep WEBHOOK
docker-compose -f docker-compose.production.yml exec frontend printenv | grep GA_MEASUREMENT
```

### Test Website
```bash
curl -I https://duetnightabyss.gachabuild.com
```

### Check Sitemap
```bash
curl https://duetnightabyss.gachabuild.com/sitemap.xml
```

### Check Robots.txt
```bash
curl https://duetnightabyss.gachabuild.com/robots.txt
```

---

## 🛠️ Troubleshooting Commands

### Restart All Containers
```bash
docker-compose -f docker-compose.production.yml restart
```

### Restart Specific Container
```bash
docker-compose -f docker-compose.production.yml restart frontend
docker-compose -f docker-compose.production.yml restart nginx
docker-compose -f docker-compose.production.yml restart sanity-studio
```

### Rebuild Without Cache
```bash
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

### Clean Up Old Images
```bash
docker image prune -f
```

### Check Disk Space
```bash
df -h
```

### Check Docker Disk Usage
```bash
docker system df
```

---

## 📊 Monitoring Commands

### Real-time Logs (All Services)
```bash
docker-compose -f docker-compose.production.yml logs -f
```

### Real-time Logs (Frontend Only)
```bash
docker-compose -f docker-compose.production.yml logs -f frontend
```

### Last 100 Lines of Logs
```bash
docker-compose -f docker-compose.production.yml logs --tail=100
```

### Check Container Resource Usage
```bash
docker stats
```

---

## 🔄 Update Commands

### Quick Update (Code Changes Only)
```bash
cd /path/to/gacha-guide-cms
git pull origin main
docker-compose -f docker-compose.production.yml restart
```

### Full Update (With Rebuild)
```bash
cd /path/to/gacha-guide-cms
git pull origin main
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

### Update Environment Variables
```bash
nano .env.local
# Make changes
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

---

## 🧹 Cleanup Commands

### Stop All Containers
```bash
docker-compose -f docker-compose.production.yml down
```

### Stop and Remove Volumes
```bash
docker-compose -f docker-compose.production.yml down -v
```

### Remove Unused Images
```bash
docker image prune -a -f
```

### Full Docker Cleanup
```bash
docker system prune -a -f
```

---

## 📱 Quick Tests

### Test Homepage
```bash
curl -s https://duetnightabyss.gachabuild.com | grep "<title>"
```

### Test Character Page
```bash
curl -s https://duetnightabyss.gachabuild.com/characters/berenica | grep "<title>"
```

### Test Build Guides
```bash
curl -s https://duetnightabyss.gachabuild.com/guides/builds | grep "<title>"
```

### Test Sitemap
```bash
curl -s https://duetnightabyss.gachabuild.com/sitemap.xml | grep "<url>"
```

### Check SSL Certificate
```bash
echo | openssl s_client -servername duetnightabyss.gachabuild.com -connect duetnightabyss.gachabuild.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🎯 What Changed in This Update

### New Features
- ✅ Build guide system with proficiency gate
- ✅ CSV export functionality
- ✅ Weapon element system
- ✅ Enhanced SEO (95/100 score)
- ✅ Build guide pages
- ✅ Updated navigation

### Files Changed
- 41 files changed
- 7,757 insertions
- 134 deletions

### New Pages
- `/guides/builds` - Build guides list
- `/builds/[slug]` - Individual build guides

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads: https://duetnightabyss.gachabuild.com
- [ ] Character pages work
- [ ] Weapon pages work
- [ ] Build guides page: https://duetnightabyss.gachabuild.com/guides/builds
- [ ] Tier list works
- [ ] Search works
- [ ] Sanity Studio: https://studio.duetnightabyss.gachabuild.com
- [ ] Sitemap: https://duetnightabyss.gachabuild.com/sitemap.xml
- [ ] Robots.txt: https://duetnightabyss.gachabuild.com/robots.txt
- [ ] No console errors (F12)
- [ ] Mobile responsive
- [ ] SSL certificate valid

---

## 🆘 Emergency Rollback

If something goes wrong:

```bash
cd /path/to/gacha-guide-cms

# Check previous commit
git log --oneline -5

# Rollback to previous commit (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# Redeploy
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 📞 Support

### Documentation
- `docs/deployment/DEPLOYMENT_SUMMARY_OCT_30_2025.md` - Full deployment guide
- `docs/reports/SEO_AUDIT_REPORT.md` - SEO details
- `docs/deployment/DOCKER_DEPLOYMENT_GUIDE.md` - Docker guide
- `docs/deployment/DEPLOYMENT_TROUBLESHOOTING.md` - Troubleshooting

### GitHub
- Repository: https://github.com/dannyhoang249-hub/gacha-guide-cms.git
- Branch: main
- Latest Commit: b891a93

---

## 🎉 Success Indicators

After deployment, you should see:

1. **All containers running:**
   ```
   gachabuild3-frontend-1        Up
   gachabuild3-sanity-studio-1   Up
   gachabuild3-nginx-1           Up
   ```

2. **Website accessible:**
   - Homepage loads
   - No 404 errors
   - Images load correctly

3. **Build guides working:**
   - List page loads
   - Individual guides load
   - Navigation works

4. **SEO tags present:**
   - View page source
   - Check for meta tags
   - Check for structured data

---

**Deployment Time:** ~10-15 minutes  
**Status:** ✅ READY  
**Last Updated:** October 30, 2025

