# Complete Gameplay Data Export Summary

**Date:** October 30, 2025  
**Status:** ✅ COMPLETE

---

## 🎯 Overview

Exported **ALL gameplay-related data** from Sanity CMS to CSV files for character-weapon mapping and analysis.

---

## 📊 Characters CSV - Complete Data

### **File:** `characters.csv`

### **Columns (13 total):**

1. **Name** - Character name (English)
2. **Element** - Pyro, Anemo, Hydro, Lumino, Electro, Umbro
3. **Role** - DPS, Support, Tank, etc.
4. **Rarity** - 3★, 4★, 5★
5. **Weapon Type (Main)** - Primary weapon proficiency
6. **Weapon Type (Sub)** - Secondary weapon proficiency
7. **Traits** - Character traits (Adventurer, Geologist, etc.)
8. **Skills** - Skill names
9. **Base Stats** - HP, ATK, DEF, Shield, Sanity, Skill DMG/Range/Duration/Efficiency, Morale, Resolve (Lv.1 → Lv.Max)
10. **Skill Stats** - Detailed stats for each skill (DMG, Cost, Duration, Radius, etc.)
11. **Intron Levels** - Constellation/upgrade effects (Lv1-Lv6)
12. **Passive Upgrades** - Passive abilities and stat bonuses
13. **Feature** - Character description/lore

### **Sample Data (Berenica):**

```csv
Name: Berenica
Element: Umbro
Role: DPS / Consonance Weapon / Weapon DMG
Rarity: 5★
Weapon Type (Main): Sword
Weapon Type (Sub): Dual Pistols
Traits: Adventurer; Impression: Morality; Rapt Attention
Skills: Faintlight; Netherflames; Recuperation

Base Stats:
- Umbro ATK: 20 → 376.57
- HP: 100 → 1255
- Shield: 100 → 1255
- DEF: 300
- Max Sanity: 150
- Skill DMG: 100%
- Skill Range: 100%
- Skill Duration: 118%
- Skill Efficiency: 100% → 112.5%
- Morale: 0%
- Resolve: 0%

Skill Stats:
- [Faintlight] Sanity Cost: 20 → 18, DMG: 347% → 1040%, DMG Radius: 3m
- [Netherflames] Sanity Cost: 10 → 9, Sanity Cost per Second: 26 → 23, 1-Hit DMG: 19% → 37%, ...
- [Recuperation] Sanity Recovery: 2, Effect Trigger Probability: 17% → 44%

Intron Levels:
- Lv1: Upon using Helix Leap or Faintlight, Berenica gains 1 stack that increases Skill Efficiency by 8% for 12s, up to 3 stacks.
- Lv2: Increase damage dealt to targets with a HP Percentage lower than Berenica by 30%.
- Lv3: Faintlight Level +2; Recuperation Level +1.
- Lv4: Increase Berenica's Attack by 20% per Combo Level.
- Lv5: Netherflames Level +2; Recuperation Level +1.
- Lv6: When in Netherflames state, each attack has a chance to unleash 1 additional Swordwave.

Passive Upgrades:
- ATK: +20%
- ATK: +30%
- Skill Efficiency: +5%
- Skill Efficiency: +7.5%
- Afterburn: After using Netherflames, the next use of Faintlight will not consume Sanity.
- Heart Devourer: Only active when deployed as a Combat Partner Increases ATK (+40%) for the character and their nearby Umbro teammate(s).
```

---

## 🗡️ Weapons CSV - Complete Data

### **File:** `weapons.csv`

### **Columns (10 total):**

1. **Name** - Weapon name (English)
2. **Element** - Neutral, Pyro, Anemo, Hydro, Lumino, Electro, Umbro
3. **Weapon Type** - Sword, Bow, Katana, Shotgun, etc.
4. **Category** - Melee or Range
5. **Damage Type** - Spike, Slash, Smash
6. **Rarity** - R, SR, SSR (legacy field, mostly empty)
7. **Refinement Skill** - Skill effect description + R1-R6 scaling values
8. **Base Stats** - ATK, CRIT Chance, CRIT DMG, ATK Speed, Trigger Probability, Multishot, Ammo, etc. (Lv.1 → Lv.Max)
9. **Motion Values** - Attack multipliers (Hit1, Hit2, Charged Attack, Projectile DMG, etc.)
10. **Description** - Weapon lore/flavor text

### **Sample Data (Arclight Apocalypse):**

```csv
Name: Arclight Apocalypse
Element: Neutral
Weapon Type: Bow
Category: Range
Damage Type: Smash
Rarity: (empty)

Refinement Skill:
Effect: Skill Duration (+15% / 18% / 21% / 24% / 27% / 30%). Landing a CRIT hit with this weapon randomly grants other allies one of the following for 16s: (+10% / 12% / 14% / 16% / 18% / 20%) ATK, (+10% / 12% / 14% / 16% / 18% / 20%) DEF, (+7.5% / 9% / 10.5% / 12% / 13.5% / 15%) Skill Damage, or (+10% / 12% / 14% / 16% / 18% / 20%) Skill Duration.

Refinements:
- R1: 15%, 10%, 10%, 7.5%, 10%
- R2: 18%, 12%, 12%, 9%, 12%
- R3: 21%, 14%, 14%, 10.5%, 14%
- R4: 24%, 16%, 16%, 12%, 16%
- R5: 27%, 18%, 18%, 13.5%, 18%
- R6: 30%, 20%, 20%, 15%, 20%

Base Stats:
- Smash ATK: 18 → 225.94
- CRIT Chance: 26%
- CRIT DMG: 220%
- ATK Speed: 1
- Trigger Prob: 20%
- Multishot: 1
- Max Ammo: 150
- Ammo Conv Rate: 475

Motion Values:
- Number_of_Projectiles: 7
- Projectile_Damage: 6.3%
```

---

## 📋 Data Categories Exported

### **Character Gameplay Data:**
✅ **Base Stats** - HP, ATK, DEF, Shield, Sanity, Skill modifiers  
✅ **Skill Stats** - DMG, Cost, Duration, Radius, Healing, DoT, etc.  
✅ **Intron Levels** - 6 constellation levels with effects  
✅ **Passive Upgrades** - Stat bonuses and special abilities  
✅ **Traits** - Character traits affecting gameplay  
✅ **Weapon Proficiency** - Main and sub weapon types  
✅ **Element** - Character element type  
✅ **Role** - DPS, Support, Tank classification  
✅ **Rarity** - 3★, 4★, 5★  

### **Weapon Gameplay Data:**
✅ **Refinement Skill** - Effect description + R1-R6 scaling  
✅ **Base Stats** - ATK (Spike/Slash/Smash), CRIT, ATK Speed, Trigger Prob  
✅ **Ranged Stats** - Multishot, Ammo, Mag Capacity, Explosion Range  
✅ **Motion Values** - Attack multipliers for all attack types  
✅ **Element** - Weapon element (Neutral or elemental)  
✅ **Damage Type** - Spike, Slash, Smash  
✅ **Category** - Melee or Range  
✅ **Weapon Type** - Specific weapon class  

---

## 🎮 Use Cases for Mapping

### **1. Element Synergy Mapping**
- Match character elements with weapon elements
- Example: Umbro characters (Berenica, Phantasio) → Blast Artistry (Umbro weapon)

### **2. Weapon Type Compatibility**
- Match character weapon proficiency with weapon types
- Example: Berenica (Sword/Dual Pistols) → Sword or Dual Pistols weapons

### **3. Role-Based Recommendations**
- DPS characters → High ATK, CRIT weapons
- Support characters → Skill Duration, Skill Range weapons
- Tank characters → HP, DEF weapons

### **4. Stat Optimization**
- Match weapon stats with character scaling
- Example: Characters with high Skill DMG → Weapons with Skill DMG bonuses

### **5. Refinement Skill Synergy**
- Match weapon effects with character abilities
- Example: Characters with high CRIT → Weapons that trigger on CRIT

### **6. Damage Type Matching**
- Match weapon damage type with character preferences
- Example: Characters with Smash bonuses → Smash weapons

---

## 📊 Export Statistics

| Data Type | Count | Completeness |
|-----------|-------|--------------|
| **Characters** | 24 | ✅ 100% |
| **Weapons** | 45 | ✅ 100% |
| **Character Fields** | 13 | ✅ All gameplay data |
| **Weapon Fields** | 10 | ✅ All gameplay data |
| **Base Stats** | ✅ | Lv.1 → Lv.Max progression |
| **Skill Stats** | ✅ | Lv.1 → Lv.Max progression |
| **Refinement Levels** | ✅ | R1 → R6 scaling |
| **Intron Levels** | ✅ | Lv1 → Lv6 effects |

---

## 🛠️ Technical Details

### **Script:** `scripts/exportSanityToCSV.ts`

### **Key Functions:**

1. **`formatBaseStats()`** - Formats character base stats with level progression
2. **`formatSkillStats()`** - Formats skill stats from skills array
3. **`formatWeaponBaseStats()`** - Formats weapon stats based on damage type
4. **`formatRefinementSkill()`** - Formats refinement skill with R1-R6 values
5. **`formatMotionValues()`** - Formats motion multipliers
6. **`getEnglishText()`** - Extracts English text from localized objects
7. **`escapeCSV()`** - Properly escapes CSV special characters

### **Data Sources:**
- **Sanity CMS** - Project: `u9m27k7u`, Dataset: `production`
- **API Version** - `2024-01-01`
- **Fields Queried** - All gameplay-related fields from character and weapon schemas

---

## ✅ Summary

**Characters CSV:**
- ✅ 24 characters exported
- ✅ 13 columns of gameplay data
- ✅ Base stats, skill stats, intron levels, passive upgrades included
- ✅ Level progression (Lv.1 → Lv.Max) for all stats

**Weapons CSV:**
- ✅ 45 weapons exported
- ✅ 10 columns of gameplay data
- ✅ Refinement skills with R1-R6 scaling
- ✅ Base stats, motion values, damage types included
- ✅ Element data corrected (Blast Artistry = Umbro)

**Ready for:**
- ✅ Character-weapon mapping
- ✅ Team composition analysis
- ✅ Build optimization
- ✅ Synergy calculations
- ✅ Tier list creation

**All gameplay data successfully exported! 🎉**

