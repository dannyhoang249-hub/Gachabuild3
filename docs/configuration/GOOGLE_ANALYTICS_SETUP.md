# 📊 Google Analytics Setup Guide

Complete step-by-step guide to set up Google Analytics 4 (GA4) for your Duet Night Abyss website.

---

## Part 1: Create Google Analytics Account

### Step 1: Go to Google Analytics
1. Visit: https://analytics.google.com/
2. Sign in with your Google account
3. Click **"Start measuring"** or **"Admin"** (gear icon)

### Step 2: Create an Account
1. Click **"Create Account"** (if first time) or **"+ Create"** → **"Account"**
2. Enter Account name: `Duet Night Abyss` or `GachaBuild`
3. Configure data-sharing settings (optional, recommended to enable all)
4. Click **"Next"**

### Step 3: Create a Property
1. Property name: `Duet Night Abyss`
2. Reporting time zone: Select your timezone
3. Currency: Select your currency (USD, VND, etc.)
4. Click **"Next"**

### Step 4: Configure Business Information
1. Industry category: **"Games"** or **"Online Communities"**
2. Business size: Select appropriate size
3. How you intend to use Google Analytics: Select relevant options
   - ✅ Measure customer engagement
   - ✅ Measure advertising ROI
4. Click **"Create"**

### Step 5: Accept Terms of Service
1. Select your country
2. Read and accept the Google Analytics Terms of Service
3. Accept data processing terms if in EU/UK
4. Click **"I Accept"**

### Step 6: Set Up Data Stream
1. Choose platform: **"Web"**
2. Website URL: `https://duetnightabyss.gachabuild.com`
3. Stream name: `Duet Night Abyss - Main Site`
4. Click **"Create stream"**

### Step 7: Get Your Measurement ID
After creating the stream, you'll see:
- **Measurement ID**: `G-XXXXXXXXXX` (this is what you need!)
- Copy this ID - you'll need it for the next part

---

## Part 2: Add Google Analytics to Your Website

### What I'll Help You Implement:
1. Create Google Analytics component
2. Add tracking script to your app
3. Configure environment variables
4. Track page views automatically
5. Track custom events (optional)

### Files to Create/Modify:
- `src/components/GoogleAnalytics.tsx` - GA component
- `src/app/layout.tsx` - Add GA to root layout
- `.env.local` - Store your Measurement ID
- `env.example` - Update with GA variable

---

## Part 3: Environment Variable Setup

After you get your Measurement ID (`G-XXXXXXXXXX`), you'll need to add it to:

### Local Development (.env.local)
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### VPS Production (.env on server)
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Part 4: Verify Installation

### Method 1: Google Analytics Real-Time Report
1. Go to Google Analytics: https://analytics.google.com/
2. Select your property: **Duet Night Abyss**
3. In the left sidebar, click **Reports** → **Real-time**
4. Open your website in a new tab
5. You should see yourself appear in the real-time report within 30 seconds

### Method 2: Google Tag Assistant
1. Install Chrome extension: **Google Tag Assistant**
2. Visit your website
3. Click the extension icon
4. It will show if GA4 is firing correctly

### Method 3: Browser Console
1. Open your website
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. Look for messages like: `[GA] Initialized` or similar
5. Go to **Network** tab
6. Filter by "collect" or "analytics"
7. You should see requests to `google-analytics.com`

---

## Part 5: What Will Be Tracked

### Automatic Tracking:
- ✅ Page views (every page visit)
- ✅ User sessions
- ✅ Device type (mobile/desktop)
- ✅ Location (country, city)
- ✅ Browser and OS
- ✅ Traffic sources (where users come from)

### Enhanced Tracking (Configured):
- ✅ Scroll depth
- ✅ Outbound clicks
- ✅ File downloads
- ✅ Video engagement

### Custom Events (Can be added later):
- Character page views
- Search queries
- Filter usage
- Tier list interactions
- Navigation clicks

---

## Part 6: Deployment Steps

### Local Testing (After I implement it):
```bash
# Add your GA ID to .env.local
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX" >> .env.local

# Restart dev server
npm run dev

# Visit http://localhost:3000
# Check browser console for GA messages
```

### VPS Deployment:
```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to project
cd /root/Gachabuild3

# Pull latest changes (after I commit)
git pull origin master

# Add GA ID to .env file
nano .env
# Add: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# Save: Ctrl+O, Enter, Ctrl+X

# Rebuild containers
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

---

## Part 7: Common Issues & Solutions

### Issue 1: GA Not Tracking
**Solution:**
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
- Check browser console for errors
- Ensure ad blockers are disabled for testing
- Wait 24-48 hours for data to appear in standard reports (real-time should work immediately)

### Issue 2: Multiple GA Tags Detected
**Solution:**
- Ensure GA component is only included once in layout
- Check for conflicting GA scripts in public/index.html or other files

### Issue 3: Localhost Tracking
**Solution:**
- GA will track localhost by default
- To disable: Use conditional rendering based on environment

### Issue 4: Not Seeing Data in Reports
**Solution:**
- Real-time reports show data within 30 seconds
- Standard reports can take 24-48 hours
- Check that tracking ID is correct
- Verify website is getting actual traffic

---

## Part 8: GDPR/Privacy Compliance

### Cookie Consent (Recommended for EU users):
You may want to add a cookie consent banner. Popular options:
- **CookieYes** - Free tier available
- **Cookiebot** - GDPR compliant
- **Custom banner** - I can help implement this

### Privacy Policy:
Update your privacy policy to mention:
- Use of Google Analytics
- Data collection practices
- Cookie usage
- User rights (opt-out, data deletion)

---

## Quick Reference

### Your Information:
- **Website**: https://duetnightabyss.gachabuild.com
- **GA Property**: Duet Night Abyss
- **Measurement ID**: `G-XXXXXXXXXX` (replace with your actual ID)

### Important Links:
- **GA Dashboard**: https://analytics.google.com/
- **GA Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Next.js GA Guide**: https://nextjs.org/docs/app/building-your-application/optimizing/analytics

---

## Next Steps After This Guide:

1. ✅ I'll create the Google Analytics component
2. ✅ I'll integrate it into your app
3. ✅ I'll update environment variable examples
4. ✅ I'll commit and push to GitHub
5. 🎯 You get your GA Measurement ID from Google
6. 🎯 You deploy to VPS with the new code
7. 🎯 You add your GA ID to VPS .env file
8. 🎯 You verify tracking is working

Ready? Let me know when you have your Measurement ID and I'll implement everything!

