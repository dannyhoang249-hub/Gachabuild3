# Build Guide System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Deploy Sanity Schema

The build guide schema needs to be deployed to your Sanity project:

```bash
# Navigate to sanity directory
cd sanity

# Deploy schema changes
npm run deploy

# Or if using sanity CLI directly
sanity deploy
```

**Expected output**:
```
✔ Deploying GraphQL API
✔ Schema deployed successfully
```

### Step 2: Verify Environment Variables

Check that `.env.local` contains:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here
```

**To get a write token**:
1. Go to https://sanity.io/manage
2. Select your project (u9m27k7u)
3. Go to API → Tokens
4. Create new token with "Editor" permissions
5. Copy token to `.env.local`

### Step 3: Run the Import Script

```bash
npm run import:builds
```

**What happens**:
1. ✅ Reads `data/build-guides/characters.csv` (25 characters)
2. ✅ Reads `data/build-guides/weapons.csv` (49 weapons)
3. ✅ Parses data and extracts signals
4. ✅ Applies **Proficiency Gate** - filters weapons by character proficiency
5. ✅ Calculates build recommendations using algorithm v2.3
6. ✅ Imports to Sanity CMS

**Expected output**:
```
🚀 Starting build guide import...

📖 Reading CSV files...
   Found 25 characters
   Found 49 weapons

🔍 Parsing character and weapon data...
   ✓ Parsing complete

⚙️  Generating build recommendations...
   ✓ Generated 25 build guides

📤 Importing to Sanity CMS...
   ✓ Imported: Berenica
   ✓ Imported: Daphne
   ✓ Imported: Fina
   ...

✨ Import complete!
   Success: 25
   Errors/Skipped: 0
```

### Step 4: Verify in Sanity Studio

1. Open Sanity Studio: http://localhost:3000/studio
2. Navigate to "Build Guide" content type
3. You should see 25 build guide documents
4. Open one to inspect the generated data

---

## 📊 What Gets Generated

For each character, the system generates:

### Solo/Ranking Mode
- **Top 3 weapon pairs** (Melee + Ranged)
- **Stat priority** (e.g., crit, atk, skilldmg, cdr)
- **Playstyle tips** (auto-generated based on role)

### Farm/Speedrun Mode
- **Top 3 weapon pairs** optimized for AoE
- **Stat priority** (e.g., aoe, duration, trigger)
- **Playstyle tips**

### Boss/Single-Target Mode
- **Top 3 weapon pairs** optimized for burst damage
- **Stat priority** (e.g., crit, atk, skilldmg)
- **Playstyle tips**

### Team Compositions
- **9 team recommendations** (3 per mode)
- **Team synergy analysis** (element chains, role diversity)
- **Team scores** (0-1 scale)

---

## 🔄 Common Workflows

### Workflow 1: New Character Released

```bash
# 1. Update CSV file
# Edit: data/build-guides/characters.csv
# Add new character row

# 2. Import character to Sanity (existing script)
npm run migrate:characters

# 3. Generate build guide
npm run import:builds
```

### Workflow 2: Balance Patch

```bash
# 1. Update CSV files with new stats
# Edit: data/build-guides/characters.csv
# Edit: data/build-guides/weapons.csv

# 2. Re-import characters/weapons (if needed)
npm run migrate:characters
npm run import:weapons

# 3. Regenerate all build guides
npm run import:builds
```

### Workflow 3: Algorithm Tweak

```bash
# 1. Edit algorithm files
# Modify: scripts/buildAlgorithm/config.ts
# Or: scripts/buildAlgorithm/scoring.ts

# 2. Update version number (if major change)
# In config.ts: version: '2.4'

# 3. Regenerate all builds
npm run import:builds
```

### Workflow 4: Add New Weapon Type

```bash
# 1. Add canonical mapping
# Edit: scripts/buildAlgorithm/config.ts
# Add to WEAPON_TYPE_CANONICAL:
#   'New Type': 'Canonical Name'

# 2. Update CSV files with new weapon type
# Edit: data/build-guides/weapons.csv

# 3. Regenerate builds
npm run import:builds
```

---

## 🐛 Troubleshooting

### Error: "Character not found in Sanity"

**Problem**: The script can't find a character by name.

**Solution**:
```bash
# Check character names in Sanity
npm run check:sanity

# Ensure name.en matches exactly (case-sensitive)
# CSV: "Berenica"
# Sanity: name.en = "Berenica" ✅
```

### Error: "SANITY_API_TOKEN is not defined"

**Problem**: Missing or invalid API token.

**Solution**:
1. Create token at https://sanity.io/manage
2. Add to `.env.local`:
   ```env
   SANITY_API_TOKEN=sk...your_token_here
   ```
3. Restart the script

### Error: "Cannot find module 'csv-parse'"

**Problem**: This shouldn't happen - we use a custom CSV parser.

**Solution**: If you see this, the import script is using the wrong version. Check that `scripts/importBuildGuides.ts` uses the custom `readCSV` function.

### Low Scores for All Weapons

**Problem**: Signal extraction isn't finding keywords.

**Solution**:
1. Check CSV data format
2. Verify keywords in `scripts/buildAlgorithm/config.ts`
3. Add debug logging to `parser.ts`:
   ```typescript
   console.log('Extracted signals:', rawSignals);
   ```

---

## 📝 Next Steps

After successful import:

1. **Review generated builds** in Sanity Studio
2. **Make manual adjustments** if needed (set `manualOverrides.hasOverrides = true`)
3. **Build frontend page** to display the data (see next section)
4. **Add Vietnamese translations** for reasoning and tips
5. **Test with real users** and gather feedback

---

## 🎨 Frontend Integration (Coming Next)

The build guide data is now in Sanity. Next steps:

1. Create GROQ query to fetch build guides
2. Build Next.js page at `/builds/[character-slug]`
3. Add mode selector (Solo/Farm/Boss)
4. Display weapon pairs with scores
5. Show team compositions
6. Add filtering and sorting

See `docs/BUILD_GUIDE_FRONTEND.md` for implementation guide.

---

## 📚 Additional Resources

- **Full Documentation**: `docs/BUILD_GUIDE_SYSTEM.md`
- **Algorithm Spec**: `data/build-guides/Buildguide_logic.md`
- **Sanity Schema**: `sanity/schemas/buildGuide.ts`
- **Import Script**: `scripts/importBuildGuides.ts`

---

## ✅ Checklist

Before running the import:

- [ ] Sanity schema deployed
- [ ] Environment variables set
- [ ] Characters exist in Sanity
- [ ] Weapons exist in Sanity
- [ ] CSV files are up-to-date
- [ ] API token has write permissions

After running the import:

- [ ] All characters imported successfully
- [ ] Build guides visible in Sanity Studio
- [ ] Weapon pairs look reasonable
- [ ] Team compositions make sense
- [ ] No errors in console output

---

**Need help?** Check the full documentation or review the algorithm specification in `data/build-guides/Buildguide_logic.md`.

