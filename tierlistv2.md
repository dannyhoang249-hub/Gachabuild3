# DNA – Character Tier List Scoring (Main & AI) **v1.1 (Role-Aware, Built on Build Guide v2.3)**

> **Purpose:** A comprehensive, production-ready scoring system that ranks characters by **role**, **mode**, and **build compatibility**. This version aligns fully with **Build Guide v2.3**, covering dual-weapon builds, proficiency gating, and synergy scoring for both **Main** and **AI Partner** characters. It integrates seamlessly with the **Sanity CMS** and **Cursor** pipelines.

---

## 1) Scope & Outputs
- **Tier Lists:**
  1) **Main Character Tier** (Solo / Farm / Boss)
  2) **AI Partner Tier** (Farm / Boss)
- **Per-character outputs:**
  - `tierScore` (0..1), `tierGrade` (S/A/B/C/D)
  - `bestMode`, `topReasons`, `role`, `archetypes`, `element`, `proficiency`
  - `topWeaponPair` (Main) or `topAIWeapon` (AI)

---

## 2) Dependencies & Core Logic (from Build Guide v2.3)
- **Proficiency Gate (HARD):** Weapons are scored **only** if they match the character’s `Weapon Proficiency` (Main/Sub). Non-eligible pairs are ignored.
- **Core formulas imported from Build Guide v2.3:**
  - `FitScaled(C,W)` – Full character↔weapon compatibility score (Element + Stat + Role + Iron/Passive + PassiveSynergy).
  - `MainPairScore(C,mode)` – Dual-weapon pairing score (Melee + Ranged) with coverage, mode bonus, and versatility.
  - `PartnerScore(C,mode)` – AI weapon performance (AllyBuff + AIUtility + BaseStats + AutoMultiplier).
  - `EDM/ElementSynergy` – Elemental advantage and versatility from Build Guide v2.3 (Hydro→Pyro→Anemo→Electro chain, Lumino↔Umbro opposites).

---

## 3) Role Detection & Archetypes
Roles and archetypes are automatically parsed from `Role`, `Feature`, and `Passive` columns.

| Role | Core Function | Typical Tags |
|------|----------------|---------------|
| **DPS** | Direct damage, crit scaling | `burst_dps`, `dot_sustain` |
| **Support** | Buff, heal, sanity, utility | `healer_buffer`, `resolve_support` |
| **Tank** | Defense, shield, stance control | `barrier_tank`, `breaker_shield` |
| **Summoner** | Summons, AoE spread | `summoner_control`, `dot_refresh` |
| **Hybrid** | Mixed DPS & buff | `battle_support`, `crit_aura` |

> Each role determines how much the engine values **self damage vs team utility**, based on v2.3 archetype weights.

---

## 4) Role-Weighted Framework
### 4.1 Role Weight Distribution
| Role | SelfPerformance | TeamImpact | Notes |
|-----|------------------|------------|------|
| **DPS** | 0.70 | 0.30 | Focus on personal DPS uptime |
| **Support** | 0.40 | 0.60 | Buff & healing duration prioritized |
| **Tank** | 0.50 | 0.50 | Balanced sustain vs protection |
| **Summoner** | 0.55 | 0.45 | Summon uptime & DoT spread |
| **Hybrid** | 0.50 | 0.50 | Moderate DPS + buff mix |

```
TierScore(base) = SelfPerformance * RoleWeight_Self + TeamImpact * RoleWeight_Team
```

### 4.2 Role × Mode Multipliers
| Role ↓ / Mode → | Solo | Farm | Boss |
|-----------------|------|------|------|
| **DPS** | ×1.10 | ×1.00 | ×1.10 |
| **Support** | ×0.85 | ×1.10 | ×1.05 |
| **Tank** | ×0.90 | ×1.00 | ×1.05 |
| **Summoner** | ×1.00 | ×1.10 | ×0.95 |
| **Hybrid** | ×1.00 | ×1.05 | ×1.05 |

> These multipliers are inherited from **Build Guide v2.3 mode coefficients**.

---

## 5) Main Character Tier (Solo / Farm / Boss)
### 5.1 Self Performance per Mode
```
SoloPerf = MainPairScore(C, Solo)
FarmPerf = MainPairScore(C, Farm)
BossPerf = MainPairScore(C, Boss)

// Apply Role × Mode multipliers from v2.3
SoloPerf' = SoloPerf * ModeMul[Role][Solo]
FarmPerf' = FarmPerf * ModeMul[Role][Farm]
BossPerf' = BossPerf * ModeMul[Role][Boss]
```

### 5.2 Aggregation by Mode Weight
| Mode | Weight | Reason |
|------|---------|---------|
| Solo | 0.35 | Controlled DPS test |
| Farm | 0.35 | AoE and duration relevance |
| Boss | 0.30 | Burst and stance control |
```
SelfPerformance_Main = 0.35*SoloPerf' + 0.35*FarmPerf' + 0.30*BossPerf'
```

### 5.3 Team Impact (as Main DPS)
```
TeamImpact_Main =
  0.40*AvgBuffGain(C)      // Buffs from common AI supports (CRIT, duration)
+ 0.30*ElementSynergy(C)   // Advantage vs current meta (EDM v2.3)
+ 0.30*BuffCompatibility(C)// How meta supports role/element archetype
```

### 5.4 Final Main TierScore
```
TierScore_Main = (SelfPerformance_Main * RoleWeight_Self) + (TeamImpact_Main * RoleWeight_Team)
```

---

## 6) AI Partner Tier (Farm / Boss)
### 6.1 Self Performance
```
AI_Farm = PartnerScore(C, Farm)
AI_Boss = PartnerScore(C, Boss)
AI_Farm' = AI_Farm * ModeMul[Role][Farm]
AI_Boss' = AI_Boss * ModeMul[Role][Boss]
SelfPerformance_AI = 0.40*AI_Farm' + 0.60*AI_Boss'
```

### 6.2 Team Impact (as Support / Utility)
```
TeamImpact_AI =
  0.50*AllyBuffStrength(C)  // from Build Guide v2.3 parsing of passive/refinement text
+ 0.30*ElementSynergy(C)    // team EDM bonus
+ 0.20*UptimeMultiplier(C)  // duration/trigger/sanity efficiency
```

### 6.3 Final AI TierScore
```
TierScore_AI = (SelfPerformance_AI * RoleWeight_Self) + (TeamImpact_AI * RoleWeight_Team)
```

---

## 7) Team Role Synergy Bonus (v2.3 extension)
```
+0.05 → team includes DPS + Support + (Tank or Hybrid)
+0.03 → 2 Supports provide distinct buffs (e.g., CRIT + Duration)
−0.05 → 3 DPS or no sustain role
```
Applied at display level, not stored in CMS base scores.

---

## 8) Normalization & Tiers
```
S  : ≥ 0.85
A  : 0.70–0.84
B  : 0.55–0.69
C  : 0.40–0.54
D  : < 0.40
```
Normalize all TierScores across the roster; clamp after role & synergy modifiers.

---

## 9) CMS Output Schemas
**Main example:**
```json
{
  "character": "Rebecca",
  "role": "DPS",
  "type": "Main",
  "element": "Hydro",
  "tierScore": 0.87,
  "tier": "S",
  "bestMode": "Farm",
  "topWeaponPair": ["Thunderwyrm AR", "Dual Pistols X"],
  "reasons": ["Hydro DoT DPS", "Lumino refresh synergy", "High AoE uptime"],
  "meta": {"solo": 0.88, "farm": 0.91, "boss": 0.84}
}
```

**AI example:**
```json
{
  "character": "Daphne",
  "role": "Support",
  "type": "AI",
  "element": "Anemo",
  "tierScore": 0.84,
  "tier": "S",
  "bestMode": "Boss",
  "topWeapon": "Arclight Apocalypse",
  "reasons": ["+40% CRIT team buff", "High uptime", "Sanity-efficient"],
  "meta": {"farm": 0.76, "boss": 0.89}
}
```

---

## 10) Pseudo-code
```pseudo
for each Character C:
  Role = DetectRole(C)
  // MAIN
  Solo  = MainPairScore(C,Solo)*ModeMul[Role][Solo]
  Farm  = MainPairScore(C,Farm)*ModeMul[Role][Farm]
  Boss  = MainPairScore(C,Boss)*ModeMul[Role][Boss]
  SelfM = 0.35*Solo + 0.35*Farm + 0.30*Boss
  TeamM = 0.40*AvgBuffGain(C)+0.30*ElementSynergy(C)+0.30*BuffCompatibility(C)
  TierScore_Main[C] = SelfM*RoleW_Self(Role)+TeamM*RoleW_Team(Role)

  // AI
  AIFarm = PartnerScore(C,Farm)*ModeMul[Role][Farm]
  AIBoss = PartnerScore(C,Boss)*ModeMul[Role][Boss]
  SelfA  = 0.40*AIFarm + 0.60*AIBoss
  TeamA  = 0.50*AllyBuffStrength(C)+0.30*ElementSynergy(C)+0.20*UptimeMultiplier(C)
  TierScore_AI[C] = SelfA*RoleW_Self(Role)+TeamA*RoleW_Team(Role)

NormalizeAll()
AssignGrades(S/A/B/C/D)
```

---

## 11) QA & Implementation Notes
- Always apply **Proficiency Gate** before scoring.
- Keep every component normalized 0..1 and capped.
- Missing data → 0 fallback.
- Tooltips: use concise 2–3 reason lines per card.
- CMS/Front-end should allow sorting by **Mode**, **Role**, and **Type (Main/AI)**.
