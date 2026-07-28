# DNA – Character Tier List Scoring (Main & AI) v1.0

> Purpose: Define a **self-contained, production-ready** scoring model to generate character tier lists by **role** (Main vs AI Partner) and by **scenario** (Solo / Farm / Boss). Compatible with the v2.2 Team Compatibility Engine, Sanity CMS, and Cursor pipelines.

---

## 1) Scope & Outputs
- **Two tier lists** maintained in parallel:
  1. **Main Character Tier** (Solo / Farm / Boss)
  2. **AI Partner Tier** (Farm / Boss)
- **Granular outputs** per character:
  - Final **TierScore** (0..1)
  - **Tier Grade** (S / A / B / C / D)
  - **Best Mode** & **Top Reasons** (human-readable)
  - **Top Weapon Pair** (Main) or **Top AI Weapon** (Partner)

---

## 2) Dependencies & Pre-requisites
- **Proficiency Gate (HARD)**: Only score weapons within each character’s Weapon Proficiency (Main/Sub). Non-eligible pairs are discarded.
- **FitScaled(C,W)**: From Phase A in v2.2 (ElementScore + StatSimilarity + RoleAlignment + Iron/Passive scaling + PassiveSynergy; with caps).
- **MainPairScore(mode)**: From v2.2 dual-weapon logic (Melee+Ranged coverage, ModeBonus, VersatilityBonus).
- **PartnerScore(mode)**: From v2.2 AI formula (AllyBuff, AIUtility, BaseStats, AutoMultiplier).
- **EDM/ElementSynergy**: From v2.2 (element advantage vs enemy tag/distribution).

---

## 3) Main Character Tier (Solo/Farm/Boss)

### 3.1 Self Performance per Mode
```
SoloPerformance = max(MainPairScore(Solo))
FarmPerformance = max(MainPairScore(Farm))
BossPerformance = max(MainPairScore(Boss))
```
> Each `MainPairScore` is normalized to 0..1 by engine.

### 3.2 Cross-Mode Weighting
| Mode | Weight | Rationale |
|------|--------|-----------|
| Solo | 0.35 | personal control matters |
| Farm | 0.35 | mob clear speed matters |
| Boss | 0.30 | single-target burst/uptime |

```
SelfPerformance_Main = 0.35*SoloPerformance + 0.35*FarmPerformance + 0.30*BossPerformance
```

### 3.3 Team Impact as Main DPS
```
TeamImpact_Main =
  0.4*AvgBuffGain           // scaling gained from common AI supports (e.g., Daphne +CRIT, Truffle +duration)
+ 0.3*ElementSynergy        // EDM vs enemy meta distribution/tag
+ 0.3*BuffCompatibility     // how well meta supports their element/role archetype
```

### 3.4 Final Main TierScore
```
TierScore_Main = 0.6*SelfPerformance_Main + 0.4*TeamImpact_Main
```

---

## 4) AI Partner Tier (Farm/Boss)

### 4.1 AI Self Performance
```
AI_Farm = PartnerScore(Farm)
AI_Boss = PartnerScore(Boss)
SelfPerformance_AI = 0.4*AI_Farm + 0.6*AI_Boss  // Boss weighting is higher for stability
```

### 4.2 Support/Team Impact
```
TeamImpact_AI =
  0.5*AllyBuffStrength      // from weapon & passive text (ally/teammate/party)
+ 0.3*ElementSynergy        // team-wide EDM contribution
+ 0.2*UptimeMultiplier      // duration/trigger/sanity efficiency tags
```

### 4.3 Final AI TierScore
```
TierScore_AI = 0.6*SelfPerformance_AI + 0.4*TeamImpact_AI
```

---

## 5) Global Normalization & Tiers
After all characters are scored (separately for Main and AI):

```
S  : score ≥ 0.85
A  : 0.70–0.84
B  : 0.55–0.69
C  : 0.40–0.54
D  : < 0.40
```

Display with badges and include:
- **Best Mode** (Solo/Farm/Boss for Main; Farm/Boss for AI)
- **Top Weapon Pair** (Main) / **Top AI Weapon** (AI)
- **Key Reasons** (element match, buff synergy, uptime, stance control, etc.)

---

## 6) Adjustments & Meta Modifiers (Optional)
| Modifier | Where | Value (suggested) | Notes |
|---------|-------|-------------------|-------|
| Unique mechanic (Resolve / Lumino refresh) | Main | +0.05 | If proven to uplift multiple teams broadly |
| Weak/rotating element meta | Main & AI | −0.05 | If element underperforms in current rotation |
| High AI consistency | AI | +0.03 | Long duration, self-sustain, low downtime |

> All modifiers are **capped** so final `TierScore` remains within [0..1].

---

## 7) CMS Output Schema (Example)
```json
{
  "character": "Rebecca",
  "type": "Main",                 
  "tierScore": 0.87,
  "tier": "S",
  "bestMode": "Farm",
  "topWeaponPair": ["Thunderwyrm AR", "Dual Pistols X"],
  "reasons": ["Hydro DoT DPS", "Lumino refresh synergy", "High AoE uptime"],
  "meta": {
    "solo": 0.88,
    "farm": 0.91,
    "boss": 0.84
  }
}
```

```json
{
  "character": "Daphne",
  "type": "AI",
  "tierScore": 0.84,
  "tier": "S",
  "bestMode": "Boss",
  "topWeapon": "Arclight Apocalypse",
  "reasons": ["+40% CRIT team buff", "High uptime", "Sanity-efficient"],
  "meta": {
    "farm": 0.76,
    "boss": 0.89
  }
}
```

---

## 8) Pseudo-code (Drop-in)
```pseudo
// MAIN
for C in Characters:
  SoloPerf = max(MainPairScore(C, Solo))
  FarmPerf = max(MainPairScore(C, Farm))
  BossPerf = max(MainPairScore(C, Boss))
  SelfMain = 0.35*SoloPerf + 0.35*FarmPerf + 0.30*BossPerf
  TeamMain = 0.4*AvgBuffGain(C) + 0.3*ElementSynergy(C) + 0.3*BuffCompatibility(C)
  TierScore_Main[C] = 0.6*SelfMain + 0.4*TeamMain

// AI
for C in Characters:
  AI_Farm = PartnerScore(C, Farm)
  AI_Boss = PartnerScore(C, Boss)
  SelfAI  = 0.4*AI_Farm + 0.6*AI_Boss
  TeamAI  = 0.5*AllyBuffStrength(C) + 0.3*ElementSynergy(C) + 0.2*UptimeMultiplier(C)
  TierScore_AI[C] = 0.6*SelfAI + 0.4*TeamAI

// Normalize and assign grades
Normalize(TierScore_Main); Normalize(TierScore_AI)
Assign Tiers (S/A/B/C/D) per table
```

---

## 9) QA & Implementation Notes
- **No scoring without Proficiency Gate** (discard non-eligible weapon types early).
- Keep **all components 0..1 normalized** and apply **caps** to any additive bonuses.
- Ensure **graceful fallback**: missing data → 0, no crashes.
- Store **tooltips** with concise reasons; avoid overlong text on cards.
- Allow **mode toggles** on the tier list UI to visualize per-scenario strengths.

