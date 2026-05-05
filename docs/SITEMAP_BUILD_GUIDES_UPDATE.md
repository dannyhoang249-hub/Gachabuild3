# Sitemap Update - Build Guides Integration

## Overview

Updated the sitemap to include build guide pages under the guides hub, improving SEO and discoverability.

---

## Changes Made

### File Modified: `src/app/sitemap.ts`

#### 1. Added Import

```typescript
import { getBuildGuideSlugs } from '@/lib/data'
```

#### 2. Added Guides Hub Page

```typescript
{
  url: `${baseUrl}/guides/builds`,
  lastModified: new Date(),
  changeFrequency: 'daily' as const,
  priority: 0.9,
}
```

**Priority**: 0.9 (High) - Build guides are a major feature
**Change Frequency**: Daily - Updated when new characters are added or algorithm changes

#### 3. Added Individual Build Guide Pages

```typescript
// Build guide pages
const buildGuideSlugs = await getBuildGuideSlugs()
const buildGuidePages = buildGuideSlugs.map((slug) => ({
  url: `${baseUrl}/builds/${slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}))
```

**Priority**: 0.8 (High) - Important content pages
**Change Frequency**: Weekly - Updated when algorithm runs or balance patches occur

#### 4. Updated Guides Hub Priority

Changed `/guides` priority from 0.7 to 0.8 to reflect increased importance with build guides.

---

## Sitemap Structure

### Current Sitemap Hierarchy

```
Priority 1.0 - Homepage (/)
Priority 0.9 - Tier List (/tier-list)
Priority 0.9 - Characters Listing (/characters)
Priority 0.9 - Build Guides Listing (/guides/builds) ← NEW
Priority 0.8 - Guides Hub (/guides) ← UPDATED
Priority 0.8 - Weapons Listing (/weapons)
Priority 0.8 - Character Pages (/characters/[slug])
Priority 0.8 - Build Guide Pages (/builds/[slug]) ← NEW
Priority 0.7 - Weapon Pages (/weapon/[slug])
Priority 0.6 - Patch Notes (/patch)
```

### Total Pages in Sitemap

- **Static Pages**: 7 (including guides hub and build guides listing)
- **Character Pages**: 24
- **Weapon Pages**: 48
- **Build Guide Pages**: 24 ← NEW
- **Total**: ~103 pages

---

## SEO Benefits

### 1. Improved Discoverability

- ✅ Build guides now indexed by search engines
- ✅ Each character has a dedicated build guide URL
- ✅ Clear hierarchy: Guides Hub → Build Guides → Individual Guides

### 2. Better Crawling

- ✅ High priority (0.8-0.9) signals importance to search engines
- ✅ Daily/weekly change frequency encourages regular crawling
- ✅ Proper URL structure (`/builds/[character-slug]`)

### 3. Rich Content

- ✅ 24 new content-rich pages
- ✅ Unique content per character (weapon pairs, teams, tips)
- ✅ Dynamic data from Sanity CMS

---

## URL Structure

### Build Guides Listing

```
https://duetnightabyss.gachabuild.com/guides/builds
```

**Purpose**: Overview of all build guides with search/filter
**Priority**: 0.9
**Change Frequency**: Daily

### Individual Build Guides

```
https://duetnightabyss.gachabuild.com/builds/berenica
https://duetnightabyss.gachabuild.com/builds/daphne
https://duetnightabyss.gachabuild.com/builds/fina
... (24 total)
```

**Purpose**: Detailed build guide for specific character
**Priority**: 0.8
**Change Frequency**: Weekly

---

## Testing

### Verify Sitemap Generation

```bash
# Start dev server
npm run dev

# Visit sitemap
http://localhost:3000/sitemap.xml
```

**Expected Output**: XML file with all pages including build guides

### Verify Build Guide URLs

```bash
# Check build guides listing
http://localhost:3000/guides/builds

# Check individual build guide
http://localhost:3000/builds/berenica
```

**Expected**: Both pages load successfully with data

---

## Production Deployment

### Before Deployment

1. ✅ Verify sitemap.xml generates correctly
2. ✅ Test build guide pages load
3. ✅ Check all 24 build guides are accessible
4. ✅ Verify no 404 errors

### After Deployment

1. **Submit to Google Search Console**
   ```
   https://duetnightabyss.gachabuild.com/sitemap.xml
   ```

2. **Monitor Indexing**
   - Check Google Search Console for indexing status
   - Verify build guide pages appear in search results
   - Monitor crawl errors

3. **Update robots.txt** (if needed)
   ```
   Sitemap: https://duetnightabyss.gachabuild.com/sitemap.xml
   ```

---

## Maintenance

### When to Update Sitemap

1. **New Character Added**
   - Sitemap automatically includes new build guide
   - No manual update needed (dynamic generation)

2. **Algorithm Update**
   - Build guides regenerated
   - `lastModified` date updates automatically

3. **URL Structure Change**
   - Update `sitemap.ts` manually
   - Redeploy application

### Monitoring

- Check Google Search Console weekly
- Monitor 404 errors for build guide URLs
- Verify all build guides are indexed

---

## Related Files

- `src/app/sitemap.ts` - Sitemap generation
- `src/lib/data.ts` - `getBuildGuideSlugs()` function
- `src/lib/queries.ts` - `BUILD_GUIDE_SLUGS_QUERY`
- `src/app/builds/[slug]/page.tsx` - Individual build guide page
- `src/app/guides/builds/page.tsx` - Build guides listing page

---

## SEO Recommendations

### 1. Add Structured Data

Consider adding JSON-LD structured data to build guide pages:

```typescript
// In src/app/builds/[slug]/page.tsx
export async function generateMetadata({ params }) {
  // ... existing metadata
  
  // Add structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Guide",
    "name": `${characterName} Build Guide`,
    "description": `Optimal weapon pairs and team compositions for ${characterName}`,
    "author": {
      "@type": "Organization",
      "name": "GachaBuild"
    }
  }
}
```

### 2. Optimize Meta Descriptions

Ensure each build guide has unique, descriptive meta descriptions:

```typescript
description: `Complete build guide for ${characterName} including optimal weapon pairs (${topWeapon1}, ${topWeapon2}), team compositions, and playstyle tips for Solo, Farm, and Boss modes.`
```

### 3. Add Breadcrumbs

Already implemented in `BuildGuideClient.tsx`:

```
Home → Guides → Build Guides → [Character Name]
```

### 4. Internal Linking

- ✅ Link from character pages to build guides
- ✅ Link from build guides to weapon pages
- ✅ Link from build guides to team member pages

---

## Analytics Tracking

### Recommended Events to Track

1. **Build Guide Views**
   ```typescript
   gtag('event', 'page_view', {
     page_title: `${characterName} Build Guide`,
     page_location: `/builds/${slug}`
   })
   ```

2. **Mode Switches**
   ```typescript
   gtag('event', 'mode_switch', {
     character: characterName,
     mode: selectedMode
   })
   ```

3. **Weapon Clicks**
   ```typescript
   gtag('event', 'weapon_click', {
     character: characterName,
     weapon: weaponName,
     position: index
   })
   ```

---

## Summary

✅ **Sitemap Updated**: Build guides now included in sitemap.xml
✅ **SEO Optimized**: High priority (0.8-0.9) for important pages
✅ **Dynamic Generation**: Automatically includes new characters
✅ **Proper Structure**: Clear hierarchy under guides hub
✅ **Ready for Production**: All pages tested and working

**Next Steps**:
1. Deploy to production
2. Submit sitemap to Google Search Console
3. Monitor indexing status
4. Track analytics for build guide pages

---

**Questions?** Refer to:
- Next.js Sitemap Documentation: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Google Search Console: https://search.google.com/search-console

