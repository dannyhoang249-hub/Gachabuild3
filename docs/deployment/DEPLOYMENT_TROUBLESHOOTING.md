# 🔧 Deployment Troubleshooting Guide

**Complete troubleshooting guide based on real issues encountered during deployment.**

---

## 🚨 Critical: Which Nginx Config File is Used?

### ⚠️ MOST IMPORTANT LESSON

**Your production uses `nginx-ssl.conf`, NOT `nginx.conf`!**

Check `docker-compose.production.yml`:
```yaml
nginx:
  volumes:
    - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro  # ← This is what's actually used!
```

**ALWAYS verify which config file is mounted before making changes!**

---

## 📋 Before Making Any Nginx Changes

### Step 1: Check Which Config is Used

```bash
# Check docker-compose.production.yml
grep "nginx.conf" docker-compose.production.yml

# You'll see something like:
# - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
#   ^^^^^^^^^^^^^^^^  This is the actual file being used!
```

### Step 2: Edit the CORRECT File

```bash
# If it says nginx-ssl.conf, edit that file:
nano nginx-ssl.conf

# NOT nginx.conf!
```

### Step 3: Verify Changes are in the Container

```bash
# After restarting nginx, verify the config inside container:
docker-compose -f docker-compose.production.yml exec nginx cat /etc/nginx/nginx.conf | grep "Content-Security-Policy"

# If you don't see your changes, you edited the wrong file!
```

---

## 🔍 Google Analytics Troubleshooting

### Issue: GA Not Tracking (Shows as "blocked:csp")

**Symptoms:**
- Console shows: `[GA] Initialized with ID: G-VSW1YM39N5` ✅
- Network tab shows: `js?id=G-VSW1YM39N5 (blocked:csp)` ❌
- No requests to google-analytics.com
- GA Real-time shows 0 users

**Root Cause:**
Content Security Policy (CSP) is blocking Google Analytics scripts.

**Solution Checklist:**

1. **Check which nginx config is used:**
   ```bash
   grep "nginx.conf" docker-compose.production.yml
   ```

2. **Edit the CORRECT nginx config file** (nginx-ssl.conf in production):
   ```nginx
   add_header Content-Security-Policy "default-src 'self'; 
     script-src 'self' 'unsafe-inline' 'unsafe-eval' 
       https://www.googletagmanager.com 
       https://www.google-analytics.com 
       https://*.sanity.io;
     style-src 'self' 'unsafe-inline' 
       https://fonts.googleapis.com;
     font-src 'self' data: 
       https://fonts.gstatic.com;
     connect-src 'self' 
       https://www.google-analytics.com 
       https://analytics.google.com;
     img-src 'self' data: blob: https: http:;" always;
   ```

3. **Restart nginx:**
   ```bash
   docker-compose -f docker-compose.production.yml restart nginx
   ```

4. **Verify CSP is correct:**
   ```bash
   curl -I https://duetnightabyss.gachabuild.com | grep -i "content-security"
   ```

5. **Test in browser (Incognito):**
   - Hard refresh: `Ctrl+Shift+R`
   - Network tab should show: `js?id=G-VSW1YM39N5` with status `200` (not "blocked:csp")

---

## 🐳 Environment Variables Not Working

### Issue: Variable in .env but Not in Container

**Symptoms:**
```bash
# Variable is in .env
cat .env | grep GA_MEASUREMENT_ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-VSW1YM39N5  ✅

# But NOT in container
docker-compose exec frontend printenv | grep GA_MEASUREMENT_ID
(empty)  ❌
```

**Root Cause:**
The variable is not configured in `docker-compose.production.yml`.

**Solution:**

1. **Check docker-compose.production.yml:**
   ```yaml
   services:
     frontend:
       environment:
         - NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}  # ← Must be here!
   ```

2. **If missing, add it and recreate container:**
   ```bash
   # Edit docker-compose.production.yml
   nano docker-compose.production.yml
   
   # Add the environment variable
   # Then recreate container (restart is NOT enough!)
   docker-compose -f docker-compose.production.yml stop frontend
   docker-compose -f docker-compose.production.yml rm -f frontend
   docker-compose -f docker-compose.production.yml up -d frontend
   ```

3. **Verify it's now in the container:**
   ```bash
   docker-compose -f docker-compose.production.yml exec frontend printenv | grep GA_MEASUREMENT_ID
   ```

**Remember:** The 3-File Rule for environment variables:
1. ✅ `env.example` - Documentation
2. ✅ `docker-compose.production.yml` - Docker config (CRITICAL!)
3. ✅ `.env` - Actual values on VPS

---

## 🔍 Search Suggestions Not Appearing

### Issue: Search Bar Shows No Suggestions

**Root Cause:**
Import JSON files are empty.

**Solution:**

1. **Check if data files are empty:**
   ```bash
   ls -lh import/character_import.json
   # If 2 bytes → empty!
   ```

2. **Copy from full backup files:**
   ```bash
   cp import/character_import_full.json import/character_import.json
   cp import/weapon_import_full.json import/weapon_import.json
   ```

3. **Rebuild containers:**
   ```bash
   docker-compose -f docker-compose.production.yml down
   docker-compose -f docker-compose.production.yml build --no-cache
   docker-compose -f docker-compose.production.yml up -d
   ```

---

## 🐛 Build Fails with Suspense Error

### Issue: "useSearchParams() should be wrapped in a suspense boundary"

**Root Cause:**
Next.js 15 requires `useSearchParams()` to be wrapped in `<Suspense>`.

**Solution:**
Already fixed in `src/components/GoogleAnalytics.tsx`. Make sure you have the latest code:
```bash
git pull origin master
```

---

## 📝 Deployment Checklist

### Before Every Deployment:

- [ ] **Pull latest code:** `git pull origin master`
- [ ] **Check which nginx config is used:** `grep nginx.conf docker-compose.production.yml`
- [ ] **Verify .env has all required variables:** `cat .env`
- [ ] **Check docker-compose.yml has all env vars in `environment:` section**
- [ ] **Rebuild containers:** `docker-compose down && docker-compose build --no-cache && docker-compose up -d`
- [ ] **Verify services are running:** `docker-compose ps`
- [ ] **Check logs for errors:** `docker-compose logs -f frontend`

### After Deployment:

- [ ] **Hard refresh website:** `Ctrl+Shift+R`
- [ ] **Check console for errors:** Press `F12` → Console
- [ ] **Verify GA is working:** Network tab → filter "collect"
- [ ] **Check GA Real-time:** https://analytics.google.com/
- [ ] **Test search suggestions:** Type in search bar
- [ ] **Test all major features**

---

## 🚨 Common Mistakes & How to Avoid

### Mistake 1: Editing Wrong Nginx Config ❌
**What happened:**
- Edited `nginx.conf`
- But production uses `nginx-ssl.conf`
- Changes had no effect!

**How to avoid:**
```bash
# ALWAYS check first:
grep "nginx.conf" docker-compose.production.yml
# Then edit the file it shows!
```

---

### Mistake 2: Only Restarting Container (Not Recreating) ❌
**What happened:**
- Added env var to .env
- Used `docker-compose restart`
- Container kept old environment!

**How to avoid:**
```bash
# DON'T do this:
docker-compose restart frontend  ❌

# DO this instead:
docker-compose stop frontend
docker-compose rm -f frontend
docker-compose up -d frontend  ✅
```

---

### Mistake 3: Forgetting docker-compose.yml Environment Section ❌
**What happened:**
- Added var to `.env`
- Forgot to add to `docker-compose.production.yml`
- Container never received the variable!

**How to avoid:**
Use the 3-File Rule checklist every time:
1. [ ] Added to `env.example`
2. [ ] Added to `docker-compose.production.yml` environment section
3. [ ] Added to `.env` on VPS

---

### Mistake 4: Not Testing in Incognito Mode ❌
**What happened:**
- GA looked broken
- But it was just ad blocker blocking it!
- Wasted time debugging the code

**How to avoid:**
Always test in Incognito mode first to rule out extensions:
```
Ctrl+Shift+N (Windows/Linux)
Cmd+Shift+N (Mac)
```

---

## 🔍 Quick Diagnostic Commands

### Check if GA is Working:
```bash
# 1. Check if GA ID is in environment
docker-compose -f docker-compose.production.yml exec frontend printenv | grep GA_MEASUREMENT_ID

# 2. Check if GA script is in HTML
curl -s https://duetnightabyss.gachabuild.com | grep "G-VSW1YM39N5"

# 3. Check CSP headers
curl -I https://duetnightabyss.gachabuild.com | grep -i "content-security"

# 4. Check which nginx config is loaded
docker-compose -f docker-compose.production.yml exec nginx cat /etc/nginx/nginx.conf | head -20
```

### Check if Search Data is Loaded:
```bash
# Check file sizes
ls -lh import/*.json

# Should see:
# character_import.json: ~15K
# weapon_import.json: ~9.7K
```

### Check Container Status:
```bash
# All containers running?
docker-compose -f docker-compose.production.yml ps

# Any errors in logs?
docker-compose -f docker-compose.production.yml logs --tail=50 frontend
docker-compose -f docker-compose.production.yml logs --tail=50 nginx
```

---

## 📊 Troubleshooting Flowchart

### Google Analytics Not Working?

```
Is "[GA] Initialized" in console?
├─ NO → Check environment variable
│        docker-compose exec frontend printenv | grep GA_MEASUREMENT_ID
│        ├─ Empty? → Add to docker-compose.yml + recreate container
│        └─ Has value? → Check browser console for errors
│
└─ YES → Check Network tab
         ├─ See "(blocked:csp)"? → Fix CSP in nginx-ssl.conf (not nginx.conf!)
         ├─ No requests at all? → Check ad blocker / try Incognito mode
         └─ See "collect" requests? → Check GA dashboard settings
```

### Search Suggestions Not Working?

```
Type in search bar
├─ Error in console? → Check browser console
├─ No suggestions? → Check import files
│        ls -lh import/character_import.json
│        ├─ 2 bytes (empty)? → Copy from *_full.json files
│        └─ Has data? → Check browser console for errors
│
└─ Works? → Great!
```

---

## 🎯 Key Takeaways

1. **Always verify which nginx config file is actually being used** (`docker-compose.production.yml`)
2. **Environment variables need 3 places:** env.example, docker-compose.yml, .env
3. **Recreate containers, don't just restart them** when changing env vars
4. **Test in Incognito mode** to rule out browser extensions
5. **Check Network tab for "(blocked:csp)"** when debugging loading issues
6. **Verify changes are actually in the container** after deployment

---

## 📚 Related Documentation

- `HOW_TO_ADD_ENVIRONMENT_VARIABLES.md` - Complete guide for env vars
- `GOOGLE_ANALYTICS_SETUP.md` - GA setup from scratch
- `CONSOLE_ERRORS_FIXED.md` - List of fixes applied
- `DEPLOYMENT.md` - General deployment guide

---

**Last Updated:** October 26, 2025  
**Based on:** Real troubleshooting session fixing GA and search issues

**Remember:** When something doesn't work, check:
1. Are you editing the right file?
2. Did you recreate the container?
3. Is it actually loaded in the container?
4. Is something blocking it (CSP, ad blocker)?

