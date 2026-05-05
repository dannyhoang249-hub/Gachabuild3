# ✅ Pre-Deployment Checklist

**Use this checklist before every deployment to ensure everything is ready.**

---

## 📋 1. Code & Repository

### Local Development
- [ ] All changes committed to git
- [ ] No uncommitted changes (`git status` is clean)
- [ ] All tests passing locally
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors (or acceptable warnings)

### Git Repository
- [ ] All changes pushed to GitHub
- [ ] Pushed to correct branch (`main`)
- [ ] Verify push successful (`git log origin/main`)
- [ ] No merge conflicts
- [ ] Branch is up to date with remote

**Commands:**
```bash
git status
git add .
git commit -m "Your commit message"
git push origin main
git log origin/main -1
```

---

## 🗄️ 2. Sanity CMS Data

### Data Integrity
- [ ] All weapons have images (run `npm run check:sanity`)
- [ ] All characters have images
- [ ] No draft documents in production
- [ ] No duplicate entries
- [ ] All required fields populated

### Verification Commands
```bash
# Check all Sanity data
npm run check:sanity

# Verify weapons
npm run verify:weapons

# Check weapon structure
npm run check:weapons
```

**Expected Results:**
```
✅ All 45 weapons have images
✅ All 24 characters have images
✅ No missing data
```

---

## 🔐 3. Environment Variables

### Required Variables in `.env.local` on VPS

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u`
- [ ] `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] `SANITY_API_TOKEN=<your-token>`
- [ ] `WEBHOOK_SECRET=gachabuild-revalidate-2025`
- [ ] `NODE_ENV=production`
- [ ] `NEXT_TELEMETRY_DISABLED=1`

### Optional Variables
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID=<your-ga-id>` (if using Google Analytics)
- [ ] `OPENAI_API_KEY=<your-key>` (if using translations)

### Verification
```bash
# On VPS, check .env.local exists
cat .env.local

# Verify all required variables are present
grep "SANITY_API_TOKEN" .env.local
grep "WEBHOOK_SECRET" .env.local
```

---

## 🐳 4. Docker Configuration

### Files to Check

- [ ] `docker-compose.production.yml` has all environment variables in `environment:` section
- [ ] `Dockerfile` is up to date
- [ ] `Dockerfile.studio` is up to date
- [ ] `next.config.docker.ts` has Sanity remotePatterns
- [ ] `nginx-ssl.conf` has correct CSP headers (if using nginx)

### Verify Docker Compose Environment Section

```yaml
# docker-compose.production.yml should have:
services:
  frontend:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID:-u9m27k7u}
      - NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET:-production}
      - SANITY_API_TOKEN=${SANITY_API_TOKEN}
      - WEBHOOK_SECRET=${WEBHOOK_SECRET}
      - NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_TELEMETRY_DISABLED=1
```

---

## 🌐 5. Nginx Configuration (if applicable)

### Check Nginx Config

- [ ] Using correct config file (`nginx-ssl.conf` for production)
- [ ] CSP headers allow Google Analytics domains
- [ ] CSP headers allow Sanity domains
- [ ] SSL certificates are valid
- [ ] Proxy settings are correct

### Verify CSP Headers Include:

```nginx
script-src 'self' 'unsafe-inline' 'unsafe-eval' 
  https://www.googletagmanager.com 
  https://www.google-analytics.com 
  https://*.sanity.io;

connect-src 'self' 
  https://www.google-analytics.com 
  https://analytics.google.com
  https://*.sanity.io;
```

---

## 📦 6. Dependencies

### Package Management

- [ ] `package.json` has all required dependencies
- [ ] `package-lock.json` is up to date
- [ ] No security vulnerabilities (`npm audit`)
- [ ] All dependencies compatible with Node 20

### Check for Issues
```bash
# Check for vulnerabilities
npm audit

# If critical issues, fix them:
npm audit fix

# Verify build still works
npm run build
```

---

## 🧪 7. Testing

### Local Testing

- [ ] Homepage loads correctly
- [ ] Character list page works
- [ ] Weapon list page works
- [ ] Tier list page works
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Character detail pages load
- [ ] Weapon detail pages load
- [ ] Images load from Sanity CDN
- [ ] No console errors in browser

### Build Testing
```bash
# Test production build locally
npm run build
npm start

# Visit http://localhost:3000
# Test all major features
```

---

## 📝 8. Documentation

### Updated Documentation

- [ ] README.md is up to date
- [ ] Deployment guides reflect current setup
- [ ] Environment variable documentation is current
- [ ] Any new features are documented
- [ ] Changelog updated (if applicable)

---

## 🚀 9. VPS Preparation

### VPS Status

- [ ] VPS is accessible via SSH
- [ ] Docker is installed and running
- [ ] Docker Compose is installed
- [ ] Sufficient disk space available
- [ ] Sufficient memory available
- [ ] Ports 80, 443, 3000, 3333 are available

### Check VPS Resources
```bash
# SSH into VPS
ssh root@your-vps-ip

# Check disk space
df -h

# Check memory
free -h

# Check Docker is running
docker --version
docker-compose --version
```

---

## 🔄 10. Backup

### Before Deployment

- [ ] Current deployment is working
- [ ] Database backup created (if applicable)
- [ ] `.env.local` file backed up
- [ ] Docker volumes backed up (if needed)
- [ ] Know how to rollback if needed

### Backup Commands
```bash
# Backup .env.local
cp .env.local .env.local.backup

# Backup docker volumes (if needed)
docker-compose -f docker-compose.production.yml down
docker run --rm -v gachabuild3_data:/data -v $(pwd):/backup alpine tar czf /backup/volumes-backup.tar.gz /data
```

---

## 📊 11. Monitoring & Logging

### Prepare for Monitoring

- [ ] Know how to access logs
- [ ] Know how to check container status
- [ ] Have monitoring tools ready (if any)
- [ ] Browser console ready for testing
- [ ] Network tab ready for debugging

### Monitoring Commands
```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f docker-compose.production.yml logs -f frontend
```

---

## ⏱️ 12. Timing & Communication

### Deployment Timing

- [ ] Deployment scheduled during low-traffic period
- [ ] Team/users notified of deployment (if applicable)
- [ ] Estimated downtime communicated
- [ ] Rollback plan ready

### Estimated Times
- **Build time:** 5-10 minutes
- **Container startup:** 1-2 minutes
- **Total deployment:** 10-15 minutes
- **Verification:** 5 minutes

---

## 🎯 Final Checks

### Right Before Deployment

- [ ] All above sections completed
- [ ] No critical issues found
- [ ] Rollback plan ready
- [ ] Time allocated for deployment
- [ ] Ready to monitor deployment

### Quick Verification Script
```bash
# Run this before deploying
echo "Checking git status..."
git status

echo "Checking Sanity data..."
npm run check:sanity

echo "Checking environment variables..."
cat .env.local | grep -E "SANITY|WEBHOOK|GA_MEASUREMENT"

echo "All checks complete!"
```

---

## 🚨 Red Flags - DO NOT DEPLOY IF:

- ❌ Build fails locally
- ❌ TypeScript errors present
- ❌ Sanity data has missing images
- ❌ Environment variables missing
- ❌ Git has uncommitted changes
- ❌ VPS is not accessible
- ❌ Docker is not running on VPS
- ❌ Insufficient disk space on VPS
- ❌ Critical security vulnerabilities in dependencies

---

## ✅ Ready to Deploy!

If all items are checked, you're ready to deploy!

**Next Steps:**
1. Follow `DOCKER_DEPLOYMENT_GUIDE.md`
2. Monitor deployment closely
3. Run post-deployment verification
4. Test all major features
5. Monitor logs for errors

---

## 📞 Emergency Contacts

**If deployment fails:**
1. Check logs: `docker-compose logs -f`
2. Refer to `DEPLOYMENT_TROUBLESHOOTING.md`
3. Rollback if necessary: `git checkout <previous-commit>`
4. Contact team/support if needed

---

**Last Updated:** October 30, 2025  
**For:** Docker deployment on VPS  
**Branch:** main

