# 📝 How to Add Environment Variables - Complete Guide

**⚠️ IMPORTANT: Follow ALL steps or environment variables won't work!**

This guide documents the correct way to add environment variables to avoid the Google Analytics setup mistake.

---

## ❌ What Went Wrong (The Mistake)

When setting up Google Analytics, we made this mistake:

1. ✅ Added `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-VSW1YM39N5` to `.env` file
2. ❌ **FORGOT** to add it to `docker-compose.production.yml`
3. ❌ Container couldn't read the environment variable
4. ❌ Google Analytics didn't work

**Result:** We wasted time troubleshooting because we skipped step 2!

---

## ✅ The Correct Way to Add Environment Variables

### For Docker Production Deployment:

**You MUST update 3 files:**

1. **`env.example`** - Template for documentation
2. **`.env`** - Actual values on VPS (NOT in Git)
3. **`docker-compose.production.yml`** - Docker configuration

---

## 📋 Step-by-Step Checklist

### Step 1: Update `env.example` (Documentation)

**File:** `env.example`

Add your new environment variable with a description:

```bash
# =============================================================================
# YOUR NEW FEATURE (e.g., GOOGLE ANALYTICS)
# =============================================================================
# Description of what this variable does
# Format: EXPECTED_FORMAT
NEXT_PUBLIC_YOUR_VARIABLE_NAME=your_value_here
```

**Example:**
```bash
# =============================================================================
# GOOGLE ANALYTICS (OPTIONAL)
# =============================================================================
# Get your Measurement ID from Google Analytics 4
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id_here
```

---

### Step 2: Update `docker-compose.production.yml` (Critical!)

**File:** `docker-compose.production.yml`

Add the variable to the `frontend` service's `environment` section:

```yaml
services:
  frontend:
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID:-u9m27k7u}
      - NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET:-production}
      - SANITY_API_TOKEN=${SANITY_API_TOKEN}
      - NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}  # ← ADD THIS LINE
      - NEXT_TELEMETRY_DISABLED=1
```

**⚠️ THIS IS THE STEP WE FORGOT! Without this, Docker won't pass the variable to the container!**

---

### Step 3: Add to `.env` on VPS (Production)

**On your VPS**, add the actual value to `.env`:

```bash
ssh root@your-vps-ip
cd /path/to/gacha-guide-cms
nano .env

# Add this line:
NEXT_PUBLIC_YOUR_VARIABLE_NAME=actual_value_here

# Save: Ctrl+O, Enter, Ctrl+X
```

---

### Step 4: Update `.env.local` (Local Development - Optional)

**For local testing**, add to `.env.local`:

```bash
# On your local machine
cd /Users/dung/Desktop/Gachabuild3
echo "NEXT_PUBLIC_YOUR_VARIABLE_NAME=actual_value_here" >> .env.local
```

---

### Step 5: Deploy to Production

**After updating all files:**

```bash
# 1. Commit and push code changes
git add env.example docker-compose.production.yml
git commit -m "Add NEXT_PUBLIC_YOUR_VARIABLE_NAME environment variable"
git push origin master

# 2. On VPS - Pull and redeploy
ssh root@your-vps-ip
cd /path/to/gacha-guide-cms
git pull origin master

# 3. Make sure .env has the variable
echo "NEXT_PUBLIC_YOUR_VARIABLE_NAME=actual_value" >> .env

# 4. Recreate containers (IMPORTANT!)
docker-compose -f docker-compose.production.yml stop frontend
docker-compose -f docker-compose.production.yml rm -f frontend
docker-compose -f docker-compose.production.yml up -d frontend

# 5. Verify it worked
docker-compose -f docker-compose.production.yml exec frontend printenv | grep YOUR_VARIABLE_NAME
```

---

## 🔍 Verification Checklist

After adding a new environment variable, verify:

- [ ] ✅ Variable is in `env.example` with description
- [ ] ✅ Variable is in `docker-compose.production.yml` environment section
- [ ] ✅ Variable is in `.env` on VPS with actual value
- [ ] ✅ Container was recreated (not just restarted)
- [ ] ✅ `printenv` shows the variable inside container
- [ ] ✅ Application can access the variable

---

## 🚨 Common Mistakes to Avoid

### Mistake 1: Only Adding to .env ❌
```bash
# Added to .env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-VSW1YM39N5

# But forgot docker-compose.production.yml
# Result: Container can't see it!
```

**Fix:** ALWAYS update `docker-compose.production.yml`!

---

### Mistake 2: Only Restarting Container ❌
```bash
# Added variable to .env and docker-compose.yml
# But only restarted:
docker-compose -f docker-compose.production.yml restart frontend  # ❌ WRONG

# Result: Container still has OLD environment!
```

**Fix:** REMOVE and RECREATE container:
```bash
docker-compose -f docker-compose.production.yml stop frontend
docker-compose -f docker-compose.production.yml rm -f frontend
docker-compose -f docker-compose.production.yml up -d frontend  # ✅ CORRECT
```

---

### Mistake 3: Forgetting env.example ❌
```bash
# Added to .env and docker-compose.yml
# But forgot env.example

# Result: Other developers don't know about this variable!
```

**Fix:** Always document in `env.example`!

---

### Mistake 4: Wrong Variable Name Format ❌
```bash
# For client-side Next.js variables, MUST start with NEXT_PUBLIC_
GA_MEASUREMENT_ID=...  # ❌ Won't work in browser

NEXT_PUBLIC_GA_MEASUREMENT_ID=...  # ✅ Works in browser
```

---

## 📚 Types of Environment Variables

### Client-Side Variables (Browser Accessible)
**Format:** Must start with `NEXT_PUBLIC_`

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_FEATURE_FLAG=...
```

**Usage in code:**
```typescript
// Can use in browser
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
```

---

### Server-Side Variables (Server Only)
**Format:** No prefix needed

```bash
SANITY_API_TOKEN=...
DATABASE_URL=...
SECRET_KEY=...
```

**Usage in code:**
```typescript
// Only available in server-side code (API routes, getServerSideProps, etc.)
const apiToken = process.env.SANITY_API_TOKEN;
```

---

## 🎯 Quick Reference: Adding a New Variable

**Files to Update:**

1. **`env.example`** → Documentation
   ```bash
   NEXT_PUBLIC_NEW_VAR=example_value
   ```

2. **`docker-compose.production.yml`** → Docker config (CRITICAL!)
   ```yaml
   environment:
     - NEXT_PUBLIC_NEW_VAR=${NEXT_PUBLIC_NEW_VAR}
   ```

3. **`.env` on VPS** → Actual value
   ```bash
   NEXT_PUBLIC_NEW_VAR=real_value
   ```

4. **Deploy:**
   ```bash
   git push
   # On VPS:
   git pull
   docker-compose -f docker-compose.production.yml stop frontend
   docker-compose -f docker-compose.production.yml rm -f frontend
   docker-compose -f docker-compose.production.yml up -d frontend
   ```

---

## 💡 Pro Tips

### Tip 1: Use Default Values
In `docker-compose.production.yml`:
```yaml
- NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID:-u9m27k7u}
#                                                             ^^^^^^^^^ default value
```

### Tip 2: Check Variables Before Deploy
```bash
# On VPS, verify all variables are set:
cat .env
grep "environment:" -A 10 docker-compose.production.yml
```

### Tip 3: Test Locally First
```bash
# Test with .env.local before deploying to VPS
npm run dev
# Check console for your variable
```

### Tip 4: Document Every Variable
Always explain in `env.example`:
- What it's for
- Where to get the value
- Expected format
- Whether it's optional or required

---

## 🔐 Security Notes

### Never Commit Sensitive Values

❌ **DON'T:**
```bash
# In any committed file
SANITY_API_TOKEN=skDcoIdy72AGDXfWwhsw...  # ❌ NEVER!
```

✅ **DO:**
```bash
# In env.example (committed)
SANITY_API_TOKEN=your_sanity_api_token_here

# In .env (NOT committed, in .gitignore)
SANITY_API_TOKEN=skDcoIdy72AGDXfWwhsw...  # ✅ Safe
```

---

## 📖 Example: Adding a New API Key

Let's say you want to add `NEXT_PUBLIC_MAPS_API_KEY`:

**1. Update `env.example`:**
```bash
# =============================================================================
# GOOGLE MAPS API (OPTIONAL)
# =============================================================================
# Get API key from: https://console.cloud.google.com/
# Format: AIzaSy...
NEXT_PUBLIC_MAPS_API_KEY=your_google_maps_api_key_here
```

**2. Update `docker-compose.production.yml`:**
```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID:-u9m27k7u}
  - NEXT_PUBLIC_GA_MEASUREMENT_ID=${NEXT_PUBLIC_GA_MEASUREMENT_ID}
  - NEXT_PUBLIC_MAPS_API_KEY=${NEXT_PUBLIC_MAPS_API_KEY}  # ← ADD THIS
```

**3. Commit and push:**
```bash
git add env.example docker-compose.production.yml
git commit -m "Add Google Maps API key support"
git push origin master
```

**4. On VPS:**
```bash
cd /path/to/gacha-guide-cms
git pull origin master
echo "NEXT_PUBLIC_MAPS_API_KEY=AIzaSy..." >> .env
docker-compose -f docker-compose.production.yml stop frontend
docker-compose -f docker-compose.production.yml rm -f frontend
docker-compose -f docker-compose.production.yml up -d frontend
```

**5. Verify:**
```bash
docker-compose -f docker-compose.production.yml exec frontend printenv | grep MAPS_API_KEY
```

---

## ✅ Summary

**Remember the 3-File Rule:**

1. 📄 **env.example** - Documentation (committed to Git)
2. 🐳 **docker-compose.production.yml** - Docker config (committed to Git)
3. 🔒 **.env** - Real values (NOT in Git, only on VPS)

**And always:**
- ✅ Update all 3 files
- ✅ Recreate container (don't just restart)
- ✅ Verify with `printenv`
- ✅ Test the application

---

## 🆘 Troubleshooting

**Problem:** Variable not showing in container

**Solution:**
```bash
# 1. Check if variable is in docker-compose.yml
grep "YOUR_VARIABLE" docker-compose.production.yml

# 2. Check if variable is in .env
grep "YOUR_VARIABLE" .env

# 3. Recreate container (don't just restart!)
docker-compose -f docker-compose.production.yml stop frontend
docker-compose -f docker-compose.production.yml rm -f frontend
docker-compose -f docker-compose.production.yml up -d frontend

# 4. Verify
docker-compose -f docker-compose.production.yml exec frontend printenv | grep YOUR_VARIABLE
```

---

**Follow this guide every time you add an environment variable and you'll never have problems! 🎉**

