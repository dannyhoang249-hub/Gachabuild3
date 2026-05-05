# Weapon Import Guide

## Overview

This guide explains how to import weapon data from Markdown files into Sanity CMS for the Duet Night Abyss weapon database.

## Architecture Summary

### Data Flow
```
Markdown Files → Parser → Sanity CMS → Next.js Frontend
```

### Components Created

1. **Enhanced Sanity Schema** (`sanity/schemas/weapon.ts`)
   - Added `element` field (Neutral, Pyro, Hydro, Lumino, Electro, Anemo, Umbro)
   - Added `damageType` field (Spike, Slash, Smash)
   - Added `refinementSkill` object with R1-R6 scaling values
   - Added `baseStats` object with Lv.1 and Lv.MAX stats
   - Added `motionValues` object for motion multipliers
   - Added `Dual Blades` to weapon type list

2. **Weapon MD Parser** (`scripts/parseWeaponMD.ts`)
   - Extracts structured data from markdown files
   - Parses meta section (element, type, damage type, slug)
   - Parses refinement skill with R1-R6 values
   - Parses base stats (Lv.1 | Lv.MAX format)
   - Parses motion multipliers (attributes)

3. **Import Script** (`scripts/importWeaponsFromMD.ts`)
   - Batch processes all weapon markdown files
   - Uploads weapon images to Sanity CDN
   - Creates weapon documents in Sanity

4. **Updated TypeScript Interfaces** (`src/lib/data.ts`, `src/lib/queries.ts`)
   - Extended `Weapon` interface with new fields
   - Updated GROQ queries to fetch new data

## Prerequisites

Before running the import, ensure you have:

1. **Sanity Credentials**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
   - `SANITY_API_TOKEN` in `.env.local` (with write permissions)

2. **Weapon Data Files**
   - Markdown files in `character_content_update/weapon_update/`
   - Images in `character_content_update/weapon_update/Weapon_update_PNG/`

## Running the Import

### Step 1: Test the Parser

First, test the parser to ensure it's working correctly:

```bash
npx tsx scripts/testWeaponParser.ts
```

This will parse `weapons_batch_10.md` and display sample output.

### Step 2: Run the Full Import

Import all weapons from all markdown files:

```bash
npm run import:weapons
```

Or directly:

```bash
npx tsx scripts/importWeaponsFromMD.ts
```

### Step 3: Verify in Sanity Studio

1. Open Sanity Studio: `npm run studio`
2. Navigate to the "Weapon" content type
3. Verify weapons were imported correctly
4. Check that images were uploaded

## What Gets Imported

### Automatically Populated Fields

- ✅ **Name** (English only, other languages empty for manual translation)
- ✅ **Slug** (from markdown)
- ✅ **Category** (Melee/Range, auto-derived from type)
- ✅ **Type** (Katana, Sword, Polearm, etc.)
- ✅ **Element** (Neutral, Pyro, Hydro, etc.)
- ✅ **Damage Type** (Spike, Slash, Smash)
- ✅ **Refinement Skill** (description + R1-R6 values)
- ✅ **Base Stats** (all stats from markdown)
- ✅ **Motion Values** (all motion multipliers)
- ✅ **Image** (uploaded to Sanity CDN)

### Fields Requiring Manual Input

- ⚠️ **Description** (flavor text - not in markdown)
- ⚠️ **Translations** (Vietnamese, Japanese, Chinese)
- ⚠️ **Recommended Characters** (to be linked manually)

## Data Structure

### Markdown Format

```markdown
## Weapon Name
**Meta**  
- Element/Type: Neutral • Whipsword • Spike  
- Suggested slug: `weapon-slug`

**Skill**  
- **Effect:** Description with (R1 / R2 / R3 / R4 / R5 / R6) values

**Stats (Lv. 1 | Lv. MAX)**  
- Spike ATK: 17 | 213.39  
- CRIT Chance: 26%  
- CRIT Damage: 235%

**Attributes**  
- 1-Hit DMG: 40%  
- Charged Attack DMG: 16.1%
```

### Sanity Document Structure

```typescript
{
  _id: "weapon.weapon-slug",
  _type: "weapon",
  name: { en: "Weapon Name", vi: "", jp: "", zh: "" },
  slug: { current: "weapon-slug" },
  category: "Melee",
  type: "Whipsword",
  element: "Neutral",
  damageType: "Spike",
  refinementSkill: {
    description: { en: "...", vi: "", jp: "", zh: "" },
    r1: ["+75%", "+44%"],
    r2: ["90%", "52.8%"],
    // ... r3-r6
  },
  baseStats: {
    spikeAtkLv1: 17,
    spikeAtkLvMax: 213.39,
    critChance: 26,
    critDamage: 235,
    // ...
  },
  motionValues: {
    hit1: "40%",
    chargedAttack: "16.1%",
    // ...
  },
  image: { asset: { _ref: "image-..." } }
}
```

## Troubleshooting

### Parser Errors

If you see parsing errors:

1. Check the markdown file format
2. Ensure all sections (Meta, Skill, Stats, Attributes) are present
3. Verify the slug format is correct

### Image Upload Failures

If images fail to upload:

1. Check that images exist in `Weapon_update_PNG/`
2. Verify image filenames match weapon names (lowercase, underscores)
3. Ensure Sanity API token has asset upload permissions

### Missing Fields

If some fields are missing after import:

1. Check the markdown file has all required sections
2. Verify the parser regex patterns match the format
3. Review the console output for warnings

## Next Steps

After importing weapons:

1. **Add Descriptions**: Fill in weapon lore/flavor text in Sanity Studio
2. **Translate Content**: Add Vietnamese, Japanese, Chinese translations
3. **Link Characters**: Add recommended characters to each weapon
4. **Update UI Components**: Implement weapon detail drawer and enhanced filters
5. **Test Frontend**: Verify weapons display correctly on `/weapons` page

## File Locations

- **Schema**: `sanity/schemas/weapon.ts`
- **Parser**: `scripts/parseWeaponMD.ts`
- **Import Script**: `scripts/importWeaponsFromMD.ts`
- **Test Script**: `scripts/testWeaponParser.ts`
- **TypeScript Interfaces**: `src/lib/data.ts`
- **GROQ Queries**: `src/lib/queries.ts`
- **Weapon Data**: `character_content_update/weapon_update/`
- **Weapon Images**: `character_content_update/weapon_update/Weapon_update_PNG/`

## Support

If you encounter issues:

1. Check the console output for detailed error messages
2. Verify your Sanity credentials are correct
3. Ensure all markdown files follow the expected format
4. Review the test parser output to debug parsing issues

