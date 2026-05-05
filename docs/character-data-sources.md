# Character Data Sources - Duet Night Abyss

## Overview
This document outlines the sources and structure of character data used in the Duet Night Abyss character guide application.

## Data Structure

### Character Interface
```typescript
interface Character {
  id: string;                    // Unique identifier (slug)
  name: MultilingualText;        // Character name in EN/VI
  role: string;                  // Vanguard, Annihilator, Support
  weapon: string;                // Sword, Sniper, Staff, Spear, Bow
  image: string;                 // Avatar image path
  splash?: string;               // Hero/splash image path
  rarity?: string;               // 4★, 5★
  element?: string;              // Fire, Ice, Lightning, Dark, Light, Wind, Water, Electro
  overview?: MultilingualText;   // Character description
  skills?: Skill[];              // Character abilities
  build?: BuildRecommendation;   // Build suggestions
  synergy?: TeamSynergy[];       // Team combinations
  pros?: MultilingualText[];     // Strengths
  cons?: MultilingualText[];     // Weaknesses
}
```

## Current Character Data

### Fully Detailed Characters
1. **Calcharo** (5★ Electro Vanguard)
   - Complete skills, build, synergy, pros/cons
   - Multilingual content (EN/VI)

2. **Kalka** (5★ Fire Vanguard)
   - Complete skills, build, synergy, pros/cons
   - Multilingual content (EN/VI)

### Basic Characters (Overview Only)
- **Yuna** (5★ Ice Annihilator)
- **Sophia** (4★ Lightning Vanguard)
- **Raven** (5★ Dark Annihilator)
- **Luna** (4★ Light Support)
- **Kai** (4★ Wind Vanguard)
- **Iris** (5★ Water Annihilator)
- **Zephyr** (4★ Wind Support)
- **Nova** (5★ Fire Vanguard)
- **Echo** (4★ Ice Annihilator)
- **Phoenix** (5★ Fire Support)
- **Storm** (4★ Lightning Vanguard)

## Data Sources

### Primary Sources
1. **Official Website**: https://duetnightabyss.dna-panstudio.com/
2. **Game Assets**: Character art, splash images, skill descriptions
3. **Community Resources**: Reddit, Discord, game databases

### Data Extraction Process
1. **Manual Research**: Gathering character information from official sources
2. **Community Verification**: Cross-referencing with community resources
3. **Multilingual Translation**: Providing Vietnamese translations for all content
4. **Data Validation**: Ensuring accuracy and completeness

## Image Assets

### Current Status
- **Avatar Images**: Using placeholder SVGs (need official character art)
- **Splash Images**: Using placeholder images (need official splash art)
- **Optimization**: Images need to be optimized for web performance

### Required Images
- Character avatars (300x400px recommended)
- Splash/hero images (1200x630px for social sharing)
- Skill icons (64x64px)
- Element icons (32x32px)

## Data Updates

### How to Add New Characters
1. Add character data to `src/data/characters.ts`
2. Follow the multilingual structure
3. Include all required fields
4. Add character images to `/public/characters/`
5. Test on both index and detail pages

### How to Update Existing Characters
1. Modify the character object in `src/data/characters.ts`
2. Ensure multilingual content is updated
3. Test changes on the detail page
4. Verify SEO metadata updates correctly

## Quality Assurance

### Data Validation Checklist
- [ ] Character name in both EN and VI
- [ ] Role and weapon correctly assigned
- [ ] Element and rarity specified
- [ ] Overview description in both languages
- [ ] Skills with proper names and descriptions
- [ ] Build recommendations (weapons, artifacts, stats)
- [ ] Team synergy partners and reasons
- [ ] Pros and cons in both languages
- [ ] Images properly linked and optimized

### Testing Checklist
- [ ] Character appears on index page
- [ ] Character detail page loads correctly
- [ ] Language switching works
- [ ] SEO metadata updates
- [ ] Images load properly
- [ ] Responsive design works
- [ ] All sections display correctly

## Future Enhancements

### Planned Improvements
1. **Official API Integration**: Connect to official game API when available
2. **Real-time Updates**: Automatically sync with game updates
3. **Community Contributions**: Allow community to suggest improvements
4. **Advanced Filtering**: Filter by element, rarity, tier, etc.
5. **Build Calculator**: Interactive build optimization tool
6. **Team Builder**: Visual team composition tool

### Data Expansion
1. **More Characters**: Add all available characters
2. **Detailed Skills**: Complete skill trees and upgrades
3. **Build Variants**: Multiple build recommendations per character
4. **Meta Analysis**: Tier lists and meta discussions
5. **Combat Guides**: Detailed combat strategies
6. **Lore Content**: Character backstories and world building

## Maintenance

### Regular Updates
- **Weekly**: Check for new character releases
- **Monthly**: Update meta information and tier lists
- **Quarterly**: Review and improve data quality
- **As Needed**: Fix bugs and improve user experience

### Backup Strategy
- **Version Control**: All data changes tracked in Git
- **Data Export**: Regular exports of character data
- **Image Backup**: All assets stored in version control
- **Documentation**: Keep this document updated

## Contact & Support

For questions about character data or to report issues:
- **GitHub Issues**: Report bugs or request features
- **Community Discord**: Join discussions about character builds
- **Email**: Contact for data accuracy concerns

---

*Last Updated: December 2024*
*Data Version: 1.0*
*Characters: 13 total (2 fully detailed, 11 basic)*
