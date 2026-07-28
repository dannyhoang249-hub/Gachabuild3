# 🧩 Team Compatibility Engine – Summary Overview (v2.2)

This is a simplified overview of the full Team & Weapon Logic (v2.2) for **Duet Night Abyss**, summarizing how the system evaluates characters, weapons, and team compositions across different gameplay modes.

---

## 🎯 1. Goal
The engine recommends the **best weapon and team combinations** for each character based on in-game data and meta rules.  
It optimizes for three main scenarios:
- **Solo (Ranking)** → Maximize personal DPS
- **Farm (Speedrun)** → Clear multiple enemies efficiently
- **Boss (Single-Target)** → Focused burst and stance control

The system considers:
- Character–Weapon synergy (stats, element, role)
- Team synergy (buffs, elemental coverage, balance)
- Iron & Passive upgrade scaling (for both char and weapon)

---

## ⚙️ 2. How It Works (Pipeline)

### **Step 1: Data Parsing & Auto-Tagging**
- Parse key columns: `Name`, `Element`, `Role`, `Skills`, `Passive`, etc.
- Detect keywords like `crit`, `duration`, `trigger`, `aoe`, `dot`, `heal`, `sanity`.
- Auto-generate **tags/archetypes** (e.g., `dot_sustain`, `burst_dps`, `healer_buffer`).

---

### **Step 2: Character ↔ Weapon Scoring**
Each weapon is scored for every character using:
```
FitScore = 0.35*ElementScore + 0.45*StatSimilarity + 0.20*RoleAlignment
```
Then scaled by upgrades:
```
× (1 + Weapon Iron/Passive bonuses)
× (1 + Character Iron/Passive bonuses)
+ PassiveSynergyBonus (if tags match)
```
**Interpretation:**
- Element match gives +1.0, neutral 0.8, mismatch 0.0
- StatSimilarity measures how weapon stats fit the character’s needs
- RoleAlignment ensures role consistency (DPS/Support/Tank)
- Iron/Passive upgrades boost scaling
- Bonus for tag synergy (e.g., weapon with `crit_up` for DPS)

---

### **Step 3: Main (Player) – Dual Weapon Pairing**
Each Main character can equip **two weapons (Melee + Ranged)**.
```
MainPairScore =
  0.5 * max(FitScore(W1), FitScore(W2))
+ 0.2 * CoverageBonus (Melee+Ranged)
+ 0.2 * ModeBonus (based on scenario)
+ 0.1 * VersatilityBonus (EDM vs enemy element)
```
**ModeBonus priorities:**
- Solo/Boss → `crit`, `atk`, `skilldmg`, `cdr`
- Farm → `aoe`, `duration`, `trigger`, `summon`

---

### **Step 4: Partner (AI) Weapon Scoring**
Partners (AI-controlled) prioritize team buffs and uptime:
```
PartnerScore = 0.5*AllyBuff + 0.3*AIUtility + 0.2*BaseStats
```
- ×1.15 multiplier if Partner’s passive tags support automation (`duration_up`, `trigger_up`)
- ×1.10 if weapon only

**AI weapons** don’t need to match element — they exist to enhance uptime, buffs, or healing.

---

### **Step 5: Team Score (Main + 2 Partners)**
```
TeamCore = 0.4*ElementSynergy + 0.2*RoleBalance + 0.2*WeaponCoverage + 0.2*BuffSynergy
TotalTeamScore = 0.5*TeamCore + 0.5*avg(MainPairScore, PartnerScore1, PartnerScore2)
```

| Component | Description |
|------------|--------------|
| **ElementSynergy** | Element advantage (EDM) + Lumino↔Umbro bonus |
| **RoleBalance** | + points for diversity (1 DPS + 2 Supports) |
| **WeaponCoverage** | + if team includes both Melee & Ranged |
| **BuffSynergy** | Based on team passives (crit/atk/skilldmg/heal/duration/etc.) |

**Mode Add-ons:**
- **Boss:** +StanceControl (Umbro / Break)
- **Farm:** +DoT synergy (+0.05~0.10) if ≥2 DoT sources and Lumino/Anemo/Hydro
- **Solo:** Only use MainPairScore (no team layer)

---

## 🔮 6. Extra Meta Logic
| Factor | Effect |
|--------|---------|
| **Iron & Passive** | Boost both character and weapon scaling |
| **DoT Synergy** | Bonus if team has DoT + Lumino/Anemo/Hydro refresh/spread |
| **Versatility (EDM)** | Bonus for multi-element team diversity |
| **AI Tags** | Improve Partner uptime and trigger frequency |

---

## 📊 7. Output Data
The system outputs structured JSON for CMS import:
- Top 3 weapons (Melee & Ranged) per character
- Best team compositions per mode (Solo/Farm/Boss)
- Human-readable explanations (reasons, synergy breakdowns)

---

## ✅ 8. Simplified Summary
> **Main Goal:** Find the best Character + Weapon + Team combos using:
> - Element match & counter logic  
> - Stat/Role similarity  
> - Buff synergy (passive upgrades)  
> - Iron/Passive scaling  
> - Team balance & AI efficiency  

**In short:**
- **Main:** maximize personal DPS  
- **Partners:** provide buffs, heals, or uptime  
- **Team:** combine elements, cover weaknesses, and share buffs effectively.

---

*(Next Step Suggestion: Visualize this as a flowchart — Input → Scoring → Team Assembly → Output JSON — for CMS Guide or Developer Docs.)*

