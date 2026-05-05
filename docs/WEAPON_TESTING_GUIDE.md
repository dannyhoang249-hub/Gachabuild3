# Weapon System Testing Guide

## 🧪 Complete Testing Checklist

This guide provides step-by-step instructions for testing the weapon database system.

---

## Prerequisites

Before testing, ensure:
- ✅ All code changes are committed
- ✅ Development server is running (`npm run dev`)
- ✅ Sanity Studio is accessible
- ✅ Weapon markdown files are in `character_content_update/weapon_update/`
- ✅ Weapon images are in `character_content_update/weapon_update/Weapon_update_PNG/`

---

## Phase 1: Data Import Testing

### Step 1: Test the Parser

```bash
npx tsx scripts/testWeaponParser.ts
```

**Expected Output:**
```
Testing weapon parser...
Found 2 weapons in weapons_batch_10.md

Weapon 1:
  Name: Viridis Reefs
  Slug: viridis-reefs
  Element: Neutral
  Type: Whipsword
  Damage Type: Spike
  Category: Melee
  
  Refinement Skill:
    R1 Values: [+75%, +44%]
    R2 Values: [90%, 52.8%]
    ...
  
  Base Stats:
    spikeAtkLv1: 17
    spikeAtkLvMax: 213.39
    critChance: 26
    critDamage: 235
  
  Motion Values:
    hit1: 40%
    hit2: 50%
    ...
```

**Validation:**
- [ ] Parser runs without errors
- [ ] All fields are extracted correctly
- [ ] R1-R6 values are arrays with correct values
- [ ] Stats have both Lv.1 and Lv.MAX values
- [ ] Motion values are extracted

### Step 2: Import Weapons to Sanity

```bash
npm run import:weapons
```

**Expected Output:**
```
Starting weapon import from markdown files...

Processing weapons_batch_1.md...
  ✓ Uploaded image for Weapon 1
  ✓ Created weapon: Weapon 1 (weapon-1)
  ✓ Uploaded image for Weapon 2
  ✓ Created weapon: Weapon 2 (weapon-2)
  ...

Processing weapons_batch_2.md...
  ...

Import Summary:
  Total weapons processed: 50
  Successfully imported: 50
  Failed: 0
  
✅ Import complete!
```

**Validation:**
- [ ] Import runs without errors
- [ ] All weapons are processed
- [ ] Images are uploaded successfully
- [ ] No failed imports

### Step 3: Verify in Sanity Studio

1. Open Sanity Studio: `http://localhost:3333`
2. Navigate to "Weapons" section
3. Open a weapon document

**Validation:**
- [ ] Weapon name is correct
- [ ] Slug is correct
- [ ] Element field is populated
- [ ] Damage type field is populated
- [ ] Category field is populated (Melee/Range)
- [ ] Refinement skill has description
- [ ] Refinement skill has R1-R6 arrays
- [ ] Base stats have Lv.1 and Lv.MAX values
- [ ] Motion values are populated
- [ ] Image is uploaded and visible

---

## Phase 2: Frontend Display Testing

### Step 4: Test Weapon List Page

1. Navigate to: `http://localhost:3000/weapons`

**Validation:**
- [ ] Page loads without errors
- [ ] Weapons are displayed in grid
- [ ] Melee/Range tabs work
- [ ] Weapon type filters work
- [ ] Element filters are visible
- [ ] Damage type filters are visible
- [ ] Search bar works
- [ ] Weapon cards show:
  - [ ] Weapon image
  - [ ] Weapon name
  - [ ] Type badge
  - [ ] Element badge (NEW!)
  - [ ] Damage type badge (NEW!)
  - [ ] Description (if available)
  - [ ] "View Details" button

### Step 5: Test Filters

**Test Weapon Type Filter:**
1. Click "Katana" filter
2. Verify only Katana weapons are shown
3. Click "All Melee" to reset

**Test Element Filter:**
1. Click "Pyro" filter
2. Verify only Pyro weapons are shown
3. Click "All Elements" to reset

**Test Damage Type Filter:**
1. Click "Spike" filter
2. Verify only Spike weapons are shown
3. Click "All Damage Types" to reset

**Test Multi-Filter:**
1. Select "Katana" + "Pyro" + "Spike"
2. Verify only weapons matching all filters are shown
3. Clear all filters

**Test Search:**
1. Type weapon name in search bar
2. Verify matching weapons are shown
3. Clear search

**Validation:**
- [ ] All filters work independently
- [ ] Multi-filter works correctly
- [ ] Search works with filters
- [ ] Filter chips are color-coded
- [ ] Active filters are highlighted
- [ ] Filter count updates correctly

### Step 6: Test Weapon Detail Page

1. Click on a weapon card
2. Navigate to weapon detail page

**Validation:**
- [ ] Page loads without errors
- [ ] Back button works
- [ ] Weapon image is displayed
- [ ] Weapon name is correct
- [ ] All badges are shown:
  - [ ] Type badge
  - [ ] Category badge
  - [ ] Element badge (NEW!)
  - [ ] Damage type badge (NEW!)
  - [ ] Rarity badge (if available)
- [ ] Description is shown (if available)

### Step 7: Test Refinement Skill Section

1. Scroll to "Refinement Skill" section
2. Click on refinement tabs (R1-R6)

**Validation:**
- [ ] Refinement tabs are visible
- [ ] Active tab is highlighted
- [ ] Skill description is shown
- [ ] R1 values are shown by default
- [ ] Clicking R2 shows R2 values
- [ ] Clicking R3 shows R3 values
- [ ] All tabs (R1-R6) work correctly
- [ ] Values are displayed as chips
- [ ] Values match the markdown source

### Step 8: Test Base Stats Section

1. Scroll to "Base Stats" section

**Validation:**
- [ ] Stats table is displayed
- [ ] Table has 3 columns: Stat, Lv.1, Lv.MAX
- [ ] Primary ATK stats are shown (Spike/Slash/Smash)
- [ ] Universal stats are shown (CRIT, ATK Speed, etc.)
- [ ] Ranged stats are shown (if ranged weapon)
- [ ] Lv.1 values are correct
- [ ] Lv.MAX values are correct
- [ ] Table is responsive on mobile

### Step 9: Test Motion Values Section

1. Scroll to "Motion Values" section

**Validation:**
- [ ] Motion values grid is displayed
- [ ] All motion values are shown
- [ ] Labels are readable (converted from camelCase)
- [ ] Values have correct units (%, etc.)
- [ ] Grid is responsive on mobile

### Step 10: Test Recommended Characters Section

1. Scroll to "Recommended Characters" section

**Validation:**
- [ ] Character cards are displayed (if linked)
- [ ] Character portraits are shown
- [ ] Character names are correct
- [ ] Character role and weapon type are shown
- [ ] Clicking character navigates to character page
- [ ] If no characters, shows "No recommended characters yet"

---

## Phase 3: Responsive Design Testing

### Step 11: Test Mobile View (< 768px)

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or Android device

**Weapon List Page:**
- [ ] Grid shows 1 column
- [ ] Filter chips are scrollable
- [ ] Search bar is full width
- [ ] Weapon cards are readable
- [ ] Badges wrap correctly

**Weapon Detail Page:**
- [ ] Weapon image is responsive
- [ ] Badges wrap to multiple lines
- [ ] Tabs are scrollable
- [ ] Stats table is scrollable
- [ ] Motion values grid stacks vertically
- [ ] Character cards stack vertically

### Step 12: Test Tablet View (768px - 1023px)

1. Select iPad or tablet device

**Validation:**
- [ ] Grid shows 2-3 columns
- [ ] Filters are visible
- [ ] Stats table is readable
- [ ] Motion values grid shows 2 columns

### Step 13: Test Desktop View (1024px+)

1. Select desktop resolution

**Validation:**
- [ ] Grid shows 4 columns
- [ ] All filters are visible
- [ ] Stats table is full width
- [ ] Motion values grid shows 3 columns

---

## Phase 4: Integration Testing

### Step 14: Test Character-Weapon Linking

1. Open a character page
2. Check "Recommended Weapons" section
3. Click on a weapon
4. Verify weapon detail page opens
5. Check "Recommended Characters" section
6. Verify character is listed

**Validation:**
- [ ] Character → Weapon link works
- [ ] Weapon → Character link works
- [ ] Bidirectional linking is correct

### Step 15: Test Navigation Flow

**Flow 1: Weapons → Weapon Detail → Back**
1. Go to `/weapons`
2. Click weapon card
3. Click "Back" button
4. Verify returns to `/weapons`

**Flow 2: Weapons → Weapon Detail → Character → Back**
1. Go to `/weapons`
2. Click weapon card
3. Click recommended character
4. Click "Back" button
5. Verify returns to weapon detail

**Validation:**
- [ ] All navigation flows work
- [ ] Back button preserves filter state
- [ ] URL parameters are correct

---

## Phase 5: Performance Testing

### Step 16: Test Page Load Speed

1. Open DevTools → Network tab
2. Reload weapon list page
3. Check load time

**Validation:**
- [ ] Page loads in < 2 seconds
- [ ] Images load progressively
- [ ] No console errors
- [ ] No 404 errors for images

### Step 17: Test Filter Performance

1. Open DevTools → Performance tab
2. Start recording
3. Apply multiple filters
4. Stop recording

**Validation:**
- [ ] Filtering is instant (< 100ms)
- [ ] No layout shifts
- [ ] No memory leaks

---

## Phase 6: SEO & Accessibility Testing

### Step 18: Test SEO Metadata

1. View page source (Ctrl+U)
2. Check meta tags

**Validation:**
- [ ] Title tag is correct
- [ ] Meta description is present
- [ ] Open Graph tags are present
- [ ] Language attribute is correct

### Step 19: Test Accessibility

1. Run Lighthouse audit (DevTools → Lighthouse)
2. Select "Accessibility" category
3. Run audit

**Validation:**
- [ ] Accessibility score > 90
- [ ] No critical issues
- [ ] All images have alt text
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works

---

## Phase 7: Edge Cases Testing

### Step 20: Test Missing Data

**Test weapon with missing fields:**
1. Create a weapon with minimal data
2. Verify page doesn't crash
3. Check fallback messages are shown

**Validation:**
- [ ] Missing description shows fallback
- [ ] Missing refinement skill shows fallback
- [ ] Missing stats shows fallback
- [ ] Missing motion values shows fallback
- [ ] Missing characters shows fallback

### Step 21: Test Image Errors

1. Delete a weapon image
2. Reload weapon page
3. Verify placeholder image is shown

**Validation:**
- [ ] Placeholder image loads
- [ ] No broken image icons
- [ ] Page layout is not broken

---

## Phase 8: Cross-Browser Testing

### Step 22: Test in Different Browsers

**Chrome:**
- [ ] All features work
- [ ] No console errors

**Firefox:**
- [ ] All features work
- [ ] No console errors

**Safari:**
- [ ] All features work
- [ ] No console errors

**Edge:**
- [ ] All features work
- [ ] No console errors

---

## Bug Reporting Template

If you find a bug, report it using this template:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error...

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[Attach screenshots if applicable]

**Environment**:
- Browser: [Chrome/Firefox/Safari/Edge]
- Version: [Browser version]
- Device: [Desktop/Mobile/Tablet]
- OS: [Windows/Mac/Linux/iOS/Android]

**Console Errors**:
[Paste any console errors]
```

---

## Testing Summary Checklist

### Data Import
- [ ] Parser test passed
- [ ] Import script completed successfully
- [ ] All weapons in Sanity Studio

### Frontend Display
- [ ] Weapon list page works
- [ ] All filters work
- [ ] Weapon detail page works
- [ ] Refinement tabs work
- [ ] Stats table displays correctly
- [ ] Motion values display correctly
- [ ] Character linking works

### Responsive Design
- [ ] Mobile view works
- [ ] Tablet view works
- [ ] Desktop view works

### Integration
- [ ] Character-weapon linking works
- [ ] Navigation flows work

### Performance
- [ ] Page load speed is acceptable
- [ ] Filter performance is good

### SEO & Accessibility
- [ ] SEO metadata is correct
- [ ] Accessibility score is high

### Edge Cases
- [ ] Missing data handled gracefully
- [ ] Image errors handled

### Cross-Browser
- [ ] Works in all major browsers

---

**Status**: Ready for testing!

Follow this guide to thoroughly test the weapon database system before deployment.

