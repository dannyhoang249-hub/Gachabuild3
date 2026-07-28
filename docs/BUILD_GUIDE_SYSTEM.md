# Build Guide System Documentation

## Overview

The Build Guide System is an automated meta recommendation engine that calculates optimal weapon pairs and team compositions for characters based on the algorithm defined in `Buildguide_logic.md`.

### Architecture

```
CSV Files (Source of Truth)
    ↓
[Build Algorithm Script] ← Buildguide_logic.md
    ↓
Sanity CMS (Pre-calculated Meta)
    ↓
Next.js Frontend (Display Only)
```

**Key Principle**: Build recommendations are **pre-calculated** and stored in Sanity CMS, not computed in real-time on the frontend.

---

## Components

### 1. Sanity Schema (`sanity/schemas/buildGuide.ts`)

Stores pre-calculated build recommendations with:
- **Mode-specific builds**: Solo/Ranking, Farm/Speedrun, Boss/Single-Target
- **Weapon pairs**: Top 3 Melee + Ranged combinations per mode
- **Team compositions**: Best 3-character teams per mode
- **Metadata**: Algorithm version, calculation timestamp, auto-generation flag

### 2. Build Algorithm (`scripts/buildAlgorithm/`)

TypeScript implementation of the Team & Weapon Recommendation Engine v2.3:

- **`types.ts`**: Type definitions for characters, weapons, and recommendations
- **`config.ts`**: Algorithm configuration (weights, element chains, mode bonuses, weapon type canonical mapping)
- **`parser.ts`**: CSV parsing and signal extraction logic
- **`scoring.ts`**: Scoring engine (element, stat similarity, role alignment, proficiency gate)
- **`generator.ts`**: Main build generation logic

#### Scoring Formula

```
FitScore = 0.35×ElementScore + 0.45×StatSimilarity + 0.20×RoleAlignment + ProficiencyBonus
```

- **ElementScore**: 1.0 (advantage), 0.7 (neutral), 0.5 (same), 0.3 (opposition)
- **StatSimilarity**: Cosine similarity + weighted role priorities
- **RoleAlignment**: How well weapon signals match character role
- **ProficiencyBonus**: +0.03 if weapon matches Main proficiency (v2.3)

#### Proficiency Gate (v2.3 - Appendix A)

**Hard Requirement**: A weapon is eligible for a character ONLY if it appears in that character's Weapon Proficiency list.

- **Weapon Type Normalization**: Uses `WEAPON_TYPE_CANONICAL` mapping to normalize weapon types
  - Example: `Assault Rifle` ≡ `AR` ≡ `Rifle(AR)`
  - Example: `Whipsword` ≡ `Chainblade(Whipsword)`
  - Example: `Grenade Launcher` ≡ `GL`

- **Eligibility Check**:
  - If `WeaponType(weapon) ∉ {Main, Sub}` → **DISCARD** (weapon not scored or displayed)
  - If matches **Main proficiency** → Eligible + **+0.03 bonus** to FitScore
  - If matches **Sub proficiency** → Eligible (no bonus)

This ensures characters only see weapons they can actually equip, improving recommendation accuracy.

### 3. Import Script (`scripts/importBuildGuides.ts`)

Orchestrates the entire pipeline:
1. Reads `characters.csv` and `weapons.csv`
2. Parses data into normalized signal vectors
3. Runs build algorithm to generate recommendations
4. Converts to Sanity document format
5. Imports to Sanity CMS via API

---

## Usage

### Initial Setup

1. **Ensure Sanity schema is deployed**:
   ```bash
   cd sanity
   npm run deploy
   ```

2. **Set up environment variables** (`.env.local`):
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=u9m27k7u
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_write_token_here
   ```

3. **Ensure characters and weapons exist in Sanity**:
   - The script matches by name (`name.en` field)
   - Characters and weapons must be imported first

### Generate Build Guides

```bash
npm run import:builds
```

This will:
- ✅ Read CSV files from `data/build-guides/` folder
- ✅ Calculate build recommendations for all characters
- ✅ Import results to Sanity CMS
- ✅ Display progress and success/error counts

### Update Workflow

#### Scenario 1: New Character Added

1. Update `data/build-guides/characters.csv` with new character data
2. Import character to Sanity (using existing character import script)
3. Run `npm run import:builds`
4. New character's build guide will be generated

#### Scenario 2: Game Balance Patch

1. Update CSV files with new stats/skills
2. Run `npm run import:builds`
3. All build guides will be recalculated with updated data

#### Scenario 3: Algorithm Update

1. Modify algorithm logic in `scripts/buildAlgorithm/`
2. Update `ALGORITHM_CONFIG.version` in `config.ts`
3. Run `npm run import:builds`
4. All builds regenerated with new algorithm version

---

## Algorithm Details

### Signal Extraction

The algorithm extracts 16 signals from character/weapon text:

```typescript
{
  hp, atk, def, crit, aspd,
  duration, trigger, reload, sanity,
  shield, heal, dot, summon,
  aoe, skilldmg, cdr
}
```

**Method**: Keyword matching + numeric value extraction + normalization

### Role Buckets

Characters are classified into 4 role buckets:

- **DPS**: Prioritizes `atk`, `crit`, `skilldmg`, `cdr`, `aspd`
- **Support**: Prioritizes `heal`, `shield`, `duration`, `sanity`, `skilldmg`
- **Tank**: Prioritizes `hp`, `def`, `shield`, `heal`
- **Summoner**: Prioritizes `summon`, `duration`, `skilldmg`, `atk`

### Mode-Specific Bonuses

- **Solo/Ranking**: Bonus for `crit`, `atk`, `skilldmg`, `cdr`
- **Farm/Speedrun**: Bonus for `aoe`, `duration`, `trigger`, `summon`
- **Boss/Single-Target**: Bonus for `crit`, `atk`, `skilldmg`, `cdr`, `dot`

### Element System

**Advantage Chain**: Hydro → Pyro → Anemo → Electro → Hydro  
**Opposition**: Lumino ↔ Umbro  
**Neutral**: Works with all elements (0.7 score)

### Team Scoring

```typescript
TeamScore = ElementDiversity + RoleDiversity + AdvantageChainBonus
```

- Element diversity: +0.15 per unique element (max 0.45)
- Role diversity: +0.15 per unique role (max 0.45)
- Advantage chain: +0.20 if present

---

## Data Format

### Input: CSV Files

**characters.csv** columns:
```
Name, Element, Role, Rarity, Weapon Type (Main), Weapon Type (Sub),
Traits, Skills, Base Stats, Skill Stats, Intron Levels, 
Passive Upgrades, Feature
```

**weapons.csv** columns:
```
Name, Element, Weapon Type, Category, Damage Type, Rarity,
Refinement Skill, Base Stats, Motion Values, Description
```

### Output: Sanity Documents

```typescript
{
  _type: 'buildGuide',
  character: { _ref: 'character-id' },
  soloMode: {
    weaponPairs: [
      {
        meleeWeapon: { _ref: 'weapon-id' },
        rangedWeapon: { _ref: 'weapon-id' },
        pairScore: 0.88,
        reasoning: { en: '...', vi: '...' }
      }
    ],
    statPriority: ['crit', 'atk', 'skilldmg'],
    playstyleTips: { en: '...', vi: '...' }
  },
  // farmMode, bossMode similar structure
  teamCompositions: [...],
  algorithmVersion: '2.2',
  lastCalculated: '2024-01-15T10:30:00Z',
  autoGenerated: true
}
```

---

## Maintenance

### Updating the Algorithm

1. **Modify scoring weights** in `scripts/buildAlgorithm/config.ts`:
   ```typescript
   weights: {
     elementScore: 0.35,  // Adjust these
     statSimilarity: 0.45,
     roleAlignment: 0.20
   }
   ```

2. **Add new signals** in `config.ts`:
   ```typescript
   SIGNAL_KEYWORDS = {
     // Add new signal
     newSignal: ['keyword1', 'keyword2']
   }
   ```

3. **Modify scoring logic** in `scripts/buildAlgorithm/scoring.ts`

4. **Update version** in `config.ts`:
   ```typescript
   version: '2.3'  // Increment version
   ```

5. **Re-run import**:
   ```bash
   npm run import:builds
   ```

### Manual Overrides

Editors can manually adjust recommendations in Sanity Studio:

1. Navigate to Build Guide document
2. Edit weapon pairs, team compositions, or tips
3. Set `manualOverrides.hasOverrides = true`
4. Add notes explaining the override

**Note**: Manual overrides will be preserved when re-running the import script (the script uses `createOrReplace` but checks for manual override flag).

### Troubleshooting

**Issue**: Character/weapon not found in Sanity

**Solution**: Ensure the character/weapon exists in Sanity with matching `name.en` field

---

**Issue**: Low scores for all weapons

**Solution**: Check signal extraction - the CSV data might not contain expected keywords

---

**Issue**: Import fails with authentication error

**Solution**: Verify `SANITY_API_TOKEN` in `.env.local` has write permissions

---

## Future Enhancements

- [ ] Add Vietnamese translations for reasoning and tips
- [ ] Implement manual override preservation logic
- [ ] Add validation to prevent overwriting manual edits
- [ ] Create admin UI for triggering recalculation
- [ ] Add A/B testing for algorithm versions
- [ ] Implement change detection (only recalculate if CSV changed)
- [ ] Add unit tests for scoring functions
- [ ] Create visualization for signal vectors (debugging)

---

## References

- **Algorithm Specification**: `data/build-guides/Buildguide_logic.md`
- **Algorithm Overview**: `data/build-guides/Buildguide_overview.md`
- **Sanity Schema**: `sanity/schemas/buildGuide.ts`
- **Import Script**: `scripts/importBuildGuides.ts`

