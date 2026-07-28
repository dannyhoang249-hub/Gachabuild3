# Duet Night Abyss – Team & Weapon Logic (Solo / Farm / Boss) v2.2 (English Version)

> **Goal:**  
> This document defines the **v2.2 standardized logic** for the Team & Weapon Recommendation Engine in *Duet Night Abyss*.  
> It handles:  
> - Main + 2 Partner team structure  
> - Solo, Farm, and Boss modes  
> - Elemental advantage & versatility (vs. enemy tag)  
> - Iron & Passive scaling for both **Characters** and **Weapons**  
> - Main dual-weapon pairing (Melee + Ranged)  
> - AI weapon utility logic  
> - DoT / Lumino / Anemo / Hydro synergy  
> Fully compatible with **Sanity CMS** and **Cursor pipelines**.

---

## **0) Input & Data Normalization**

**characters.csv** →  
`Name, Element, Role/Feature, Weapon Type (Main/Sub), Traits, Skills, Feature, Passive Upgrades, (Base/Skill Stats...)`

**weapons.csv** →  
`Name, Element/Neutral, Weapon Type, (Category), Base Stats (Crit/Trigger...), Refinement Skill / Passive Summary`

**Optional enemy input:**  
`Enemy_Element` or  
`Distribution = [(element, weight)...]` → used to compute **Versatility (EDM)**.

**Signal keywords (core feature set):**  
`hp, atk, def, crit, aspd, duration, trigger, reload, sanity, shield, heal, dot, summon, aoe, skilldmg, cdr`

- Build **need vectors** (characters) and **supply vectors** (weapons).  
  Normalize (min–max) + apply **text-bonus (+0.3)** when a keyword match is detected in `Traits`, `Skills`, `Feature`, or `Passive text`.

**Role buckets:**
| Role | Signal priorities |
|------|--------------------|
| DPS | crit, atk, aspd, skilldmg, cdr |
| Support | heal, duration, aoe, sanity |
| Tank | hp, def, shield, sanity |
| Summoner | summon, duration, aoe, sanity |

**Weapon classification:**
- **Melee:** Sword, Whipsword, Greatsword, Spear, Dagger, Gauntlet  
- **Ranged:** Rifle, Assault Rifle, Dual Pistols, Bow, Grenade Launcher, Pistol  

---

## **1) Element Advantage & Versatility (EDM)**

**Advantage chain:** `Hydro → Pyro → Anemo → Electro → Hydro`  
**Lumino ↔ Umbro** are direct opposites.

| Relation | Multiplier |
|-----------|-------------|
| Advantage | ×4.0 |
| Non-advantage | ×0.5 |
| Lumino ↔ Umbro | ×4.0 (vs each other), ×0.5 vs others |

**ElementScore (char ↔ weapon):**  
`Match = 1.0`, `Neutral = 0.8`, `Mismatch = 0.0`

**Expected Damage Multiplier (EDM):**
```
EDM(char) = Σ_i [ weight_i * AdvantageMatrix[char.Element][enemy_i] ]
```
- If `Enemy_Element` is missing → assume uniform (1/6) or use meta-distribution stored in CMS.  
- **TeamEDM** = average or role-weighted max of all members.

**Elemental Counter Filter (soft mode):**
- If an enemy tag is defined (e.g., “Pyro”), prioritize the counter (Hydro).  
- But **don’t exclude** others when buff synergy (e.g., Daphne’s CRIT +40%, Hellfire’s Pyro ATK +40%) compensates the disadvantage.

---

## **2) Phase A – Character ↔ Weapon Scoring**

### 2.1 **Base Formula**
```
FitBase = 0.35*ElementScore
        + 0.45*StatSimilarity
        + 0.20*RoleAlignment
```

- **StatSimilarity:** cosine similarity between need/supply vectors + text-bonus.  
- **RoleAlignment:** mean of the signal scores in the character’s role bucket.

---

### 2.2 **Iron & Passive Scaling (Weapon + Character)**
```
FitScaled = FitBase
          * (1 + 0.05*wpnIron + 0.03*wpnPassiveTier)
          * (1 + 0.04*charIron + 0.03*charPassiveTier)
          + PassiveSynergyBonus
```

- **PassiveSynergyBonus:** +0.03~+0.10 when passive tags match role or element archetypes  
  (e.g., `crit/atk/skilldmg/cdr` for DPS, `duration/trigger/sanity` for Support/Auto, `shield/stance` for Tank/Umbro).  
- **Caps:** `(weaponScale * characterScale) ≤ 1.6`, total bonus ≤ `+0.12`.

---

### 2.3 **Tier & Reason (UI Layer)**
| Tier | Range | Example Tooltip |
|------|--------|----------------|
| **Best** | ≥ 0.75 | "Perfect synergy: Element match + crit + duration" |
| **Good** | ≥ 0.55 | "Minor mismatch but strong scaling" |
| **Conditional** | ≥ 0.40 | "Requires buff or team synergy" |
| **Low** | < 0.40 | "Poor match or opposite element" |

Each entry includes a **Reason breakdown**:  
`{ element:..., proficiency:..., overlaps:[...], breakdown:{element,stat,role,total} }`

---

## **3) Main (Player) – Dual Weapon Pair Logic**

Each Main character can equip **two weapons** (ideally one Melee + one Ranged).

```
MainPairScore(mode) =
  0.5 * max(FitScaled(W1), FitScaled(W2))
+ 0.2 * CoverageBonus   // +0.1 if Melee + Ranged
+ 0.2 * ModeBonus       // weighted by scenario
+ 0.1 * VersatilityBonus // EDM vs enemy distribution
```

- **ModeBonus priorities:**
  - **Solo/Boss:** `crit, atk, skilldmg, cdr`
  - **Farm:** `aoe, duration, trigger, summon`

---

## **4) Partner (AI) – Weapon Scoring Logic**
```
AllyBuff  = norm(0..1) from weapon passive text (ally/teammate/party/allies)
AIUtility = norm(trigger_prob, duration, aoe, sanity)
BaseStats = norm(crit_chance)

PartnerScore_raw = 0.5*AllyBuff + 0.3*AIUtility + 0.2*BaseStats
PartnerScore = PartnerScore_raw * AutoMultiplier
```

- **AutoMultiplier:**  
  ×1.15 if the Partner’s `charPassiveTags` include `duration_up`, `trigger_up`, or `sanity_efficiency`.  
  ×1.10 if only weapon-side AI-friendly tags exist.  
- Partner weapons don’t need element match — their purpose is to enhance **team-wide uptime and buff loops**.

---

## **5) Phase B – Team Scoring (Main + 2 Partners)**

```
ElementSynergy = norm(EDM team vs enemy tag) + (Lumino & Umbro ? +0.2 : 0)
RoleBalance    = +0.15 (≥1 DPS) +0.10 (≥1 Support) +0.05 (Tank/Summoner)
                 -0.20 (3x DPS) -0.10 (3x Support)
WeaponCoverage = +0.10 if both Melee & Ranged exist
BuffSynergy    = team passive synergy (crit/atk/skilldmg/heal/shield/resolve/dot_refresh/dot_spread), cap 0.2

TeamCore = 0.4*ElementSynergy + 0.2*RoleBalance + 0.2*WeaponCoverage + 0.2*BuffSynergy

TotalTeamScore(mode) = 0.5*TeamCore + 0.5*avg(MainPairScore(mode), PartnerScore(P1), PartnerScore(P2))
```

### 5.1 **Mode-specific Synergies**
| Mode | Bonus Rules |
|------|--------------|
| **Boss** | Add `StanceControl` when Umbro or “stance/break” tags exist. Prioritize `crit/skilldmg/cdr`. |
| **Farm** | Add `DoT synergy` (+0.05~0.10) if ≥2 DoT sources **and** Lumino (refresh) or Anemo/Hydro (spread). |
| **Solo** | Skip team layer; rank by `MainPairScore(Solo)` only. |

---

## **6) Scenario Filters**

| Scenario | Focus | Filter Logic |
|-----------|--------|--------------|
| **A – Bossing / Ranking** | Single-Target / Burst | Pick Main with ST/burst potential; partners that buff stance or CRIT/ATK. |
| **B – Farming / Speed Run** | Multi-Target | Pick Main with AoE/Duration/DoT; partners with high AllyBuff + AIUtility. |
| **C – Solo / Ranking** | Single Character | Run Phase A only (dual-weapon pairing). |

---

## **7) Archetype Auto-Tag System**

**Character tags:**  
`burst_dps`, `dot_sustain`, `healer_buffer`, `summoner_control`, `breaker_shield`, `sanity_efficiency`, `resolve`

**Weapon tags:**  
`crit_up`, `atk_up`, `skilldmg_up`, `duration_up`, `trigger_up`, `aoe_up`, `sanity_efficiency`, `stance_break`, `ally_buff`

**Rule mapping examples:**
- Character with `dot + duration + sanity` → archetype `dot_sustain`
- Weapon with `ally_buff` → `AllyBuff = 1.0`
- If team includes **Lumino** + any `dot_sustain` → add DoT synergy (Farm scenario)

---

## **8) CMS Schema Example**
```json
{
  "character": "Rhythm",
  "element": "Electro",
  "role": "DPS",
  "charIron": 4,
  "charPassiveTier": 2,
  "charPassiveTags": ["crit_up","duration_up","resolve"],
  "weaponPairs": {
    "solo":  [{"pair":["W1","W2"], "score":0.86, "reason":"Crit + CDR + Burst"}],
    "farm":  [{"pair":["W3","W4"], "score":0.88, "reason":"AoE + Duration + Trigger"}],
    "boss":  [{"pair":["W5","W6"], "score":0.83, "reason":"Crit + Skill DMG + CDR"}]
  },
  "partnersSuggestion": {
    "solo": [{"partnerA":"Daphne","partnerB":"Truffle","score":0.82,"reason":"CRIT+Heal, EDM 0.73"}],
    "farm": [{"partnerA":"Tabethe","partnerB":"Truffle","score":0.88,"reason":"AoE/Duration/Trigger synergy 1.15x"}],
    "boss": [{"partnerA":"Randy","partnerB":"Daphne","score":0.80,"reason":"Shield+Crit+StanceControl"}]
  }
}
```

---

## **9) Pseudo-code (Cursor Integration)**
```pseudo
for each Character C:
  FitCharScale = (1 + 0.04*C.charIron + 0.03*C.charPassiveTier)
  for each Weapon W where ProficiencyOK(C, W):
    FitWpnScale = (1 + 0.05*W.iron + 0.03*W.passiveTier)
    FitBase = 0.35*Elem(C,W) + 0.45*Cosine(NeedC,SupplyW) + 0.20*RoleAlign(C,W)
    Bonus   = PassiveSynergy(C.tags, W.tags, C.role, C.element)
    FitScaled[C,W] = Cap(FitBase * FitWpnScale * FitCharScale + Bonus)

MainPairScore(mode) = 0.5*max(FitScaled[W1],FitScaled[W2])
                    + 0.2*CoverageBonus(W1,W2)
                    + 0.2*ModeBonus(W1,W2,mode)
                    + 0.1*VersatilityBonus(C,[W1,W2],EnemyDist)

PartnerScore_raw = 0.5*AllyBuff + 0.3*AIUtility + 0.2*BaseStats
PartnerScore = PartnerScore_raw * AutoMultiplier(PartnerCharTags, WeaponTags)

ElementSynergy = EDM_Team(Team, EnemyTag/Dist) + (hasLuminoUmbro(Team)?0.2:0)
TeamCore = 0.4*ElementSynergy + 0.2*RoleBalance + 0.2*WeaponCoverage + 0.2*BuffSynergy
TotalTeamScore(mode) = 0.5*TeamCore + 0.5*avg(MainPairScore, PartnerScore1, PartnerScore2)
```

---

## **10) UI / UX & QA**

- **Filters:** Scenario selector (Solo/Farm/Boss) + Enemy Tag or Element Distribution slider  
- **Badges:** Iron IV/V, Passive Tier, Versatility (EDM Grade), DoT Synergy  
- **Tooltips:** Full breakdown (Element / Stat / Role / Buff / Utility / TeamCore)  
- **Capping & Fallbacks:** All values normalized 0–1; missing data defaults to 0 (no crash)  

---

### ✅ **Conclusion**
Version **2.2** strikes a balance between **meta accuracy** (Element, DoT, team buffs) and **practical game logic** (dual-weapon pairing, AI utility, Iron/Passive scaling).  
All coefficients can be fine-tuned later as real in-game balance data evolves.

