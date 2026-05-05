# Weapon System Visual Guide

## 🎨 UI Components Overview

This guide shows the visual structure of the weapon database system.

---

## 1. Weapon List Page (`/weapons`)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                     WEAPON DATABASE                          │
│         Discover all weapons in Duet Night Abyss            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    🔍 Search Weapons...                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         [ Melee Weapons ]  [ Range Weapons ]                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Weapon Type                             │
│  [All Melee] [Katana] [Sword] [Polearm] [Whipsword]        │
│  [Greatsword] [Dual Blades]                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Element                               │
│  [All Elements] [Neutral] [Pyro] [Hydro] [Lumino]          │
│  [Electro] [Anemo] [Umbro]                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Damage Type                              │
│  [All Damage Types] [Spike] [Slash] [Smash]                │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│  ┌────────┐  │  ┌────────┐  │  ┌────────┐  │  ┌────────┐  │
│  │ Weapon │  │  │ Weapon │  │  │ Weapon │  │  │ Weapon │  │
│  │ Image  │  │  │ Image  │  │  │ Image  │  │  │ Image  │  │
│  └────────┘  │  └────────┘  │  └────────┘  │  └────────┘  │
│  Weapon Name │  Weapon Name │  Weapon Name │  Weapon Name │
│  [Katana]    │  [Sword]     │  [Polearm]   │  [Whipsword] │
│  [Neutral]   │  [Pyro]      │  [Hydro]     │  [Electro]   │
│  [Spike]     │  [Slash]     │  [Smash]     │  [Spike]     │
│  Description │  Description │  Description │  Description │
│ [View Details]│ [View Details]│ [View Details]│ [View Details]│
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### Filter Behavior
- **Category Tabs**: Switch between Melee and Range weapons
- **Weapon Type**: Filter by specific weapon type
- **Element**: Filter by weapon element
- **Damage Type**: Filter by damage type (Spike/Slash/Smash)
- **Search**: Real-time search by weapon name
- **Multi-Filter**: All filters work together

### Card Features
- **Weapon Image**: High-quality weapon artwork
- **Weapon Name**: Bold, clickable name
- **Type Badge**: Color-coded weapon type
- **Element Badge**: Color-coded element (NEW!)
- **Damage Type Badge**: Color-coded damage type (NEW!)
- **Description**: One-line weapon description
- **View Details Button**: Navigate to detail page

---

## 2. Weapon Detail Page (`/weapon/[slug]`)

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐                                               │
│  │          │   WEAPON NAME                                 │
│  │  Weapon  │   [Katana] [Melee] [Neutral] [Spike] [SSR]   │
│  │  Image   │                                               │
│  │          │   Description text goes here...               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ [Overview] [Refinement Skill] [Base Stats] [Motion Values]  │
│ [Recommended Characters]                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  REFINEMENT SKILL                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [R1] [R2] [R3] [R4] [R5] [R6]                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Skill Description with (R1 / R2 / R3 / R4 / R5 / R6) │  │
│  │ values highlighted...                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  R1 VALUES                                                  │
│  [+75%] [+44%] [+20%]                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  BASE STATS                                                 │
│  ┌──────────────────┬──────────┬──────────┐               │
│  │ Stat             │  Lv. 1   │  Lv. MAX │               │
│  ├──────────────────┼──────────┼──────────┤               │
│  │ Spike ATK        │    17    │  213.39  │               │
│  │ CRIT Chance      │    26%   │          │               │
│  │ CRIT Damage      │   235%   │          │               │
│  │ ATK Speed        │     1    │          │               │
│  └──────────────────┴──────────┴──────────┘               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  MOTION VALUES                                              │
│  ┌──────────────┬──────────────┬──────────────┐           │
│  │ 1-Hit DMG    │ 2-Hit DMG    │ 3-Hit DMG    │           │
│  │    40%       │    50%       │    60%       │           │
│  ├──────────────┼──────────────┼──────────────┤           │
│  │ Charged ATK  │ Plunge DMG   │ Sliding ATK  │           │
│  │   16.1%      │    51%       │    51%       │           │
│  └──────────────┴──────────────┴──────────────┘           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  RECOMMENDED CHARACTERS                                     │
│  ┌──────────────┬──────────────┬──────────────┐           │
│  │ [Portrait]   │ [Portrait]   │ [Portrait]   │           │
│  │ Character 1  │ Character 2  │ Character 3  │           │
│  │ Role • Type  │ Role • Type  │ Role • Type  │           │
│  └──────────────┴──────────────┴──────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Tab Navigation
1. **Overview**: Weapon description and lore
2. **Refinement Skill**: R1-R6 tabs with skill description and values
3. **Base Stats**: Lv.1 and Lv.MAX stats table
4. **Motion Values**: All motion multipliers in grid
5. **Recommended Characters**: Character portraits with links

### Refinement Tabs (NEW!)
- **R1-R6 Switcher**: Click to switch between refinement levels
- **Dynamic Values**: Values update based on selected level
- **Skill Description**: Full skill description with placeholders
- **Value Chips**: Individual value chips for easy reading

### Stats Table (NEW!)
- **Two Columns**: Lv.1 and Lv.MAX side-by-side
- **Primary ATK**: Spike/Slash/Smash ATK with scaling
- **Universal Stats**: CRIT, ATK Speed, Trigger Probability
- **Ranged Stats**: Multishot, Mag Capacity, Max Ammo

### Motion Values (NEW!)
- **Grid Layout**: Organized grid of motion multipliers
- **Readable Labels**: Converted from camelCase to readable format
- **Percentage Values**: All values displayed with units

---

## 3. Color Coding System

### Element Colors
```
Neutral  → Gray
Pyro     → Red
Hydro    → Blue
Lumino   → Yellow
Electro  → Purple
Anemo    → Emerald
Umbro    → Slate
```

### Damage Type Colors
```
Spike    → Orange
Slash    → Blue
Smash    → Purple
```

### Weapon Type Colors
```
Katana          → Red
Sword           → Blue
Polearm         → Green
Whipsword       → Purple
Greatsword      → Orange
Dual Blades     → Rose
Shotgun         → Yellow
Dual Pistols    → Pink
Assault Rifle   → Indigo
Bow             → Emerald
Grenade Launcher→ Slate
```

---

## 4. Responsive Design

### Desktop (1024px+)
- 4-column weapon grid
- Side-by-side stats table
- Full filter chips visible
- Large weapon images

### Tablet (768px - 1023px)
- 3-column weapon grid
- Stacked stats table
- Scrollable filter chips
- Medium weapon images

### Mobile (< 768px)
- 1-column weapon grid
- Stacked stats table
- Scrollable filter chips
- Compact weapon images
- Collapsible sections

---

## 5. Interactive Features

### Weapon List Page
- ✅ Real-time search filtering
- ✅ Multi-filter support
- ✅ Category tab switching
- ✅ Filter chip toggling
- ✅ Hover effects on cards
- ✅ Smooth transitions

### Weapon Detail Page
- ✅ Tab navigation with scroll
- ✅ Refinement level switching
- ✅ Intersection observer for active tab
- ✅ Character link navigation
- ✅ Back button to previous page
- ✅ Smooth scrolling

---

## 6. Data Display Examples

### Refinement Skill Example
```
Trigger Probability (+75% / 90% / 105% / 120% / 135% / 150%).
Charged Attacks grant (+44% / 52.8% / 61.6% / 70.4% / 79.2% / 88%) 
Spike ATK for 5s.

R1 Values: [+75%, +44%]
R2 Values: [90%, 52.8%]
R3 Values: [105%, 61.6%]
R4 Values: [120%, 70.4%]
R5 Values: [135%, 79.2%]
R6 Values: [150%, 88%]
```

### Base Stats Example
```
┌──────────────────┬──────────┬──────────┐
│ Stat             │  Lv. 1   │  Lv. MAX │
├──────────────────┼──────────┼──────────┤
│ Spike ATK        │    17    │  213.39  │
│ CRIT Chance      │    26%   │          │
│ CRIT Damage      │   235%   │          │
│ ATK Speed        │     1    │          │
│ Trigger Prob.    │    21%   │          │
└──────────────────┴──────────┴──────────┘
```

### Motion Values Example
```
┌──────────────┬──────────────┬──────────────┐
│ 1-Hit DMG    │ 2-Hit DMG    │ 3-Hit DMG    │
│    40%       │    50%       │    60%       │
├──────────────┼──────────────┼──────────────┤
│ 4-Hit DMG    │ Charged ATK  │ Plunge DMG   │
│  50% × 2     │   16.1%      │    51%       │
└──────────────┴──────────────┴──────────────┘
```

---

## 7. User Flow

### Browsing Weapons
```
1. User visits /weapons
2. Sees all melee weapons by default
3. Can switch to range weapons
4. Can filter by type, element, damage type
5. Can search by name
6. Clicks weapon card
7. Navigates to weapon detail page
```

### Viewing Weapon Details
```
1. User lands on /weapon/[slug]
2. Sees weapon hero section with all badges
3. Scrolls or clicks tabs to navigate
4. Switches refinement levels (R1-R6)
5. Views stats and motion values
6. Clicks recommended character
7. Navigates to character page
```

---

## 8. Accessibility Features

- ✅ Semantic HTML (article, section, nav)
- ✅ ARIA labels for buttons and links
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Alt text for images
- ✅ Color contrast compliance

---

**Status**: ✅ **FULLY IMPLEMENTED**

All UI components are built, tested, and ready for production use.

