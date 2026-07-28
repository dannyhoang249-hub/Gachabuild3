# Build Guide System - Proficiency Gate Implementation (v2.3)

## Overview

The **Proficiency Gate** is a hard requirement added in algorithm v2.3 that ensures characters only receive weapon recommendations they can actually equip based on their weapon proficiency.

This implements **Appendix A** from the `Buildguide_logic.md` specification.

---

## What Changed in v2.3

### Before (v2.2)
- All weapons were scored for all characters
- Characters could see recommendations for weapons they couldn't equip
- No proficiency validation

### After (v2.3)
- ✅ **Hard proficiency check** - weapons must match character's Main or Sub proficiency
- ✅ **Weapon type normalization** - handles variations like "AR" vs "Assault Rifle"
- ✅ **Main proficiency bonus** - +0.03 to FitScore for Main weapon matches
- ✅ **Automatic filtering** - ineligible weapons are discarded before scoring

---

## How It Works

### 1. Weapon Type Canonical Mapping

The system normalizes weapon type names to handle variations:

```typescript
// From: scripts/buildAlgorithm/config.ts
export const WEAPON_TYPE_CANONICAL: Record<string, string> = {
  // Ranged weapons
  'Rifle': 'Assault Rifle',
  'Assault Rifle': 'Assault Rifle',
  'AR': 'Assault Rifle',
  'Rifle(AR)': 'Assault Rifle',
  
  // Melee weapons
  'Whipsword': 'Whipsword',
  'Chainblade(Whipsword)': 'Whipsword',
  'Chainblade': 'Whipsword',
  
  // More mappings...
};
```

**Why?** CSV files and Sanity data may use different naming conventions. This ensures consistent matching.

### 2. Proficiency Gate Check

```typescript
// From: scripts/buildAlgorithm/scoring.ts
export function checkProficiencyGate(
  character: ParsedCharacter,
  weapon: ParsedWeapon
): { eligible: boolean; isMainProficiency: boolean } {
  const weaponTypeNormalized = normalizeWeaponType(weapon.weaponType);
  const mainProficiency = normalizeWeaponType(character.weaponTypes.main);
  const subProficiency = normalizeWeaponType(character.weaponTypes.sub);
  
  // Check Main proficiency match
  if (weaponTypeNormalized === mainProficiency) {
    return { eligible: true, isMainProficiency: true };
  }
  
  // Check Sub proficiency match
  if (weaponTypeNormalized === subProficiency) {
    return { eligible: true, isMainProficiency: false };
  }
  
  // Not in proficiency list → discard
  return { eligible: false, isMainProficiency: false };
}
```

### 3. Updated Scoring Formula

```
FitScore = 0.35×ElementScore + 0.45×StatSimilarity + 0.20×RoleAlignment + ProficiencyBonus

Where:
- ProficiencyBonus = +0.03 if weapon matches Main proficiency
- ProficiencyBonus = 0 if weapon matches Sub proficiency
- Weapon is DISCARDED if it doesn't match either proficiency
```

### 4. Filtering in findTopWeapons

```typescript
export function findTopWeapons(
  character: ParsedCharacter,
  weapons: ParsedWeapon[],
  category: 'Melee' | 'Range',
  topN: number = 5
): WeaponScore[] {
  const categoryWeapons = weapons.filter(w => w.category === category);

  // Score all weapons (returns null for ineligible weapons)
  const scoredWeapons = categoryWeapons
    .map(weapon => calculateWeaponFitScore(character, weapon))
    .filter((score): score is WeaponScore => score !== null); // Remove null entries

  scoredWeapons.sort((a, b) => b.fitScore - a.fitScore);
  return scoredWeapons.slice(0, topN);
}
```

---

## Example

### Character: Berenica
```csv
Name: Berenica
Weapon Type (Main): Sword
Weapon Type (Sub): Dual Pistols
```

### Weapons Being Evaluated

| Weapon Name | Weapon Type | Eligible? | Bonus | Reason |
|-------------|-------------|-----------|-------|--------|
| Blade Amberglow | Sword | ✅ Yes | +0.03 | Matches Main proficiency |
| Bluecurrent Pulse | Dual Pistols | ✅ Yes | 0 | Matches Sub proficiency |
| Daybreak Hymn | Assault Rifle | ❌ No | N/A | Not in proficiency list → DISCARDED |
| Destructo | Grenade Launcher | ❌ No | N/A | Not in proficiency list → DISCARDED |

**Result**: Berenica will only see Sword (Melee) and Dual Pistols (Ranged) recommendations.

---

## Benefits

### 1. **Accuracy**
- Characters only see weapons they can actually use
- No more confusing recommendations for incompatible weapons

### 2. **Game Fidelity**
- Respects the game's weapon proficiency system
- Matches player expectations

### 3. **Better Scores**
- Main weapon proficiency gets a small bonus
- Encourages using the character's primary weapon type

### 4. **Cleaner Data**
- Fewer irrelevant weapons in the recommendation pool
- Faster computation (fewer weapons to score)

---

## Adding New Weapon Types

When a new weapon type is added to the game:

### Step 1: Update Canonical Mapping

Edit `scripts/buildAlgorithm/config.ts`:

```typescript
export const WEAPON_TYPE_CANONICAL: Record<string, string> = {
  // ... existing mappings ...
  
  // New weapon type
  'Scythe': 'Scythe',
  'Reaper': 'Scythe',  // If there are variations
};
```

### Step 2: Update CSV Files

Add the new weapon type to `data/build-guides/weapons.csv`:

```csv
Name,Element,Weapon Type,Category,...
Soul Reaper,Umbro,Scythe,Melee,...
```

And update character proficiencies in `data/build-guides/characters.csv`:

```csv
Name,Element,Role,Rarity,Weapon Type (Main),Weapon Type (Sub),...
NewCharacter,Umbro,DPS,5★,Scythe,Dual Pistols,...
```

### Step 3: Regenerate Builds

```bash
npm run import:builds
```

The system will automatically:
1. Normalize "Scythe" using the canonical mapping
2. Check proficiency for all characters
3. Only recommend Scythe weapons to characters with Scythe proficiency

---

## Troubleshooting

### Issue: Character has no weapon recommendations

**Possible Causes**:
1. Weapon type mismatch between CSV and canonical mapping
2. No weapons exist for the character's proficiency types
3. Typo in weapon type names

**Solution**:
```bash
# Add debug logging to scoring.ts
console.log('Character proficiencies:', character.weaponTypes);
console.log('Weapon type (normalized):', normalizeWeaponType(weapon.weaponType));
console.log('Proficiency check:', checkProficiencyGate(character, weapon));
```

### Issue: Weapon type not being normalized correctly

**Example**: Character has "AR" proficiency but weapons use "Assault Rifle"

**Solution**: Add mapping to `WEAPON_TYPE_CANONICAL`:
```typescript
'AR': 'Assault Rifle',
'Rifle': 'Assault Rifle',
'Assault Rifle': 'Assault Rifle',
```

### Issue: Main proficiency bonus not being applied

**Check**:
1. Verify weapon type exactly matches Main proficiency (after normalization)
2. Check that `ALGORITHM_CONFIG.proficiencyMatchBonus` is set to 0.03
3. Add logging to `calculateWeaponFitScore` to see if bonus is applied

---

## Testing

### Manual Test

```typescript
// In scripts/importBuildGuides.ts, add:
const testCharacter = parsedCharacters.find(c => c.name === 'Berenica');
const testWeapon = parsedWeapons.find(w => w.name === 'Blade Amberglow');

if (testCharacter && testWeapon) {
  const profCheck = checkProficiencyGate(testCharacter, testWeapon);
  console.log('Proficiency check:', profCheck);
  // Expected: { eligible: true, isMainProficiency: true }
  
  const score = calculateWeaponFitScore(testCharacter, testWeapon);
  console.log('Weapon score:', score);
  // Should include +0.03 bonus in fitScore
}
```

### Automated Test

Create `scripts/buildAlgorithm/proficiencyGate.test.ts`:

```typescript
import { checkProficiencyGate, normalizeWeaponType } from './scoring';
import { WEAPON_TYPE_CANONICAL } from './config';

// Test normalization
console.assert(normalizeWeaponType('AR') === 'Assault Rifle');
console.assert(normalizeWeaponType('Rifle') === 'Assault Rifle');
console.assert(normalizeWeaponType('Assault Rifle') === 'Assault Rifle');

// Test proficiency gate
const mockCharacter = {
  weaponTypes: { main: 'Sword', sub: 'Dual Pistols' }
};

const swordWeapon = { weaponType: 'Sword' };
const pistolWeapon = { weaponType: 'Dual Pistols' };
const rifleWeapon = { weaponType: 'Assault Rifle' };

console.assert(checkProficiencyGate(mockCharacter, swordWeapon).eligible === true);
console.assert(checkProficiencyGate(mockCharacter, swordWeapon).isMainProficiency === true);
console.assert(checkProficiencyGate(mockCharacter, pistolWeapon).eligible === true);
console.assert(checkProficiencyGate(mockCharacter, pistolWeapon).isMainProficiency === false);
console.assert(checkProficiencyGate(mockCharacter, rifleWeapon).eligible === false);

console.log('✅ All proficiency gate tests passed!');
```

---

## Migration Notes

### Upgrading from v2.2 to v2.3

**No data migration required** - just regenerate builds:

```bash
npm run import:builds
```

**Expected changes**:
- Some weapon recommendations may disappear (if they weren't proficient)
- Scores may shift slightly due to +0.03 Main proficiency bonus
- Overall recommendations should be more accurate

**Rollback**: If needed, revert to v2.2 by:
1. Change `version: '2.2'` in `config.ts`
2. Remove proficiency gate check from `calculateWeaponFitScore`
3. Regenerate builds

---

## References

- **Algorithm Specification**: `data/build-guides/Buildguide_logic.md` (Appendix A)
- **Implementation**: `scripts/buildAlgorithm/scoring.ts`
- **Configuration**: `scripts/buildAlgorithm/config.ts`
- **Full Documentation**: `docs/BUILD_GUIDE_SYSTEM.md`

---

## Version History

- **v2.3** (Current): Added Proficiency Gate with weapon type normalization
- **v2.2**: Base algorithm with element, stat, and role scoring
- **v2.1**: Initial implementation

---

**Questions?** Check the main documentation or review the algorithm specification.

