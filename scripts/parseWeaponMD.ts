/**
 * Weapon Markdown Parser
 * Parses weapon data from markdown files into structured format for Sanity CMS
 */

import fs from 'fs'

export interface ParsedWeapon {
  name: string
  slug: string
  element: string
  weaponType: string
  damageType: string
  category: 'Melee' | 'Range'
  refinementSkill: {
    description: string
    r1: string[]
    r2: string[]
    r3: string[]
    r4: string[]
    r5: string[]
    r6: string[]
  }
  baseStats: Record<string, any>
  motionValues: Record<string, string>
}

// Weapon type to category mapping
const WEAPON_CATEGORIES: Record<string, 'Melee' | 'Range'> = {
  'Katana': 'Melee',
  'Sword': 'Melee',
  'Polearm': 'Melee',
  'Whipsword': 'Melee',
  'Greatsword': 'Melee',
  'Dual Blades': 'Melee',
  'Shotgun': 'Range',
  'Dual Pistols': 'Range',
  'Assault Rifle': 'Range',
  'Bow': 'Range',
  'Grenade Launcher': 'Range'
}

/**
 * Extract refinement values from skill description
 */
function extractRefinementValues(skillText: string): string[][] {
  // Match patterns like (+75% / 90% / 105% / 120% / 135% / 150%)
  const matches = skillText.match(/\(([^)]+)\)/g)
  
  if (!matches) {
    return [[], [], [], [], [], []]
  }
  
  const allValues: string[][] = [[], [], [], [], [], []]
  
  for (const match of matches) {
    // Remove parentheses and split by /
    const values = match
      .replace(/[()]/g, '')
      .split('/')
      .map(v => v.trim())
    
    if (values.length === 6) {
      values.forEach((val, idx) => {
        allValues[idx].push(val)
      })
    }
  }
  
  return allValues
}

/**
 * Parse stat line (e.g., "Spike ATK: 17 | 213.39" or "Spike ATK: **17 | 213.39**")
 */
function parseStatLine(line: string): { key: string, lv1?: number, lvMax?: number, value?: any } | null {
  // Remove markdown bold markers
  line = line.replace(/\*\*/g, '').trim()
  
  const match = line.match(/^-?\s*(.+?):\s*(.+)$/)
  if (!match) return null
  
  const key = match[1].trim()
  const value = match[2].trim()
  
  // Check if it's a Lv.1 | Lv.MAX format
  if (value.includes('|')) {
    const [lv1Str, lvMaxStr] = value.split('|').map(v => v.trim())
    const lv1 = parseFloat(lv1Str.replace('%', ''))
    const lvMax = parseFloat(lvMaxStr.replace('%', ''))
    
    return { key, lv1, lvMax }
  } else {
    // Single value (like CRIT Chance: 26%)
    const numValue = parseFloat(value.replace('%', ''))
    return { key, value: isNaN(numValue) ? value : numValue }
  }
}

/**
 * Convert stat key to camelCase field name
 */
function statKeyToFieldName(key: string, suffix: string = ''): string {
  return key
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/atk/gi, 'Atk')
    .replace(/dmg/gi, 'Dmg')
    .replace(/crit/gi, 'crit')
    .replace(/chance/gi, 'Chance')
    .replace(/damage/gi, 'Damage')
    .replace(/speed/gi, 'Speed')
    .replace(/probability/gi, 'Probability')
    .replace(/multishot/gi, 'multishot')
    .replace(/capacity/gi, 'Capacity')
    .replace(/ammo/gi, 'Ammo')
    .replace(/conversion/gi, 'Conversion')
    .replace(/rate/gi, 'Rate')
    .replace(/ratio/gi, 'Ratio')
    .replace(/max/gi, 'max')
    .replace(/mag/gi, 'mag')
    + suffix
}

/**
 * Parse a single weapon from markdown section
 */
function parseWeaponSection(section: string): ParsedWeapon | null {
  const lines = section.split('\n').map(l => l.trim()).filter(l => l)

  if (lines.length === 0) return null

  // Extract weapon name (first line starting with ##)
  const nameMatch = lines[0].match(/^##\s+(.+)$/)
  if (!nameMatch) return null

  const name = nameMatch[1].trim()

  // Skip section headers (like "Batch 2 – Assault Rifle & Bow")
  if (name.toLowerCase().includes('batch') && (name.includes('–') || name.includes('-'))) {
    return null
  }
  
  // Initialize weapon object
  let slug = ''
  let element = 'Neutral'
  let weaponType = ''
  let damageType = 'Slash'
  let skillDescription = ''
  const baseStats: Record<string, any> = {}
  const motionValues: Record<string, string> = {}
  
  let currentSection = ''
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    
    // Detect sections
    if (line.startsWith('**Meta**') || line.startsWith('**Type:**')) {
      currentSection = 'meta'
      continue
    } else if (line.startsWith('**Skill**') || line.startsWith('### Skill')) {
      currentSection = 'skill'
      continue
    } else if (line.startsWith('**Stats') || line.startsWith('### Stats')) {
      currentSection = 'stats'
      continue
    } else if (line.startsWith('**Attributes**') || line.startsWith('### Attributes')) {
      currentSection = 'attributes'
      continue
    }
    
    // Parse based on current section
    if (currentSection === 'meta') {
      // Format 1: "- Element/Type: Neutral • Whipsword • Spike"
      // Format 2: "**Type:** Lumino • Assault Rifle • Slash"
      const typeMatch = line.match(/(?:Element\/Type|Type):\s*(.+?)\s*•\s*(.+?)\s*•\s*(.+)/)
      if (typeMatch) {
        element = typeMatch[1].trim()
        weaponType = typeMatch[2].trim()
        damageType = typeMatch[3].trim()
      }
      
      // Extract slug
      const slugMatch = line.match(/slug:\s*`([^`]+)`/)
      if (slugMatch) {
        slug = slugMatch[1].trim()
      }
    } else if (currentSection === 'skill') {
      // Collect skill description
      if (line.startsWith('-') || !line.startsWith('**')) {
        const cleanLine = line.replace(/^-\s*\*\*Effect:\*\*\s*/, '').replace(/^-\s*/, '')
        if (cleanLine) {
          skillDescription += (skillDescription ? ' ' : '') + cleanLine
        }
      } else if (!line.startsWith('**')) {
        skillDescription += (skillDescription ? ' ' : '') + line
      }
    } else if (currentSection === 'stats') {
      const stat = parseStatLine(line)
      if (stat) {
        if (stat.lv1 !== undefined && stat.lvMax !== undefined) {
          const fieldBase = statKeyToFieldName(stat.key)
          baseStats[fieldBase + 'Lv1'] = stat.lv1
          baseStats[fieldBase + 'LvMax'] = stat.lvMax
        } else if (stat.value !== undefined) {
          const fieldName = statKeyToFieldName(stat.key)
          baseStats[fieldName] = stat.value
        }
      }
    } else if (currentSection === 'attributes') {
      const stat = parseStatLine(line)
      if (stat && stat.value !== undefined) {
        const fieldName = statKeyToFieldName(stat.key)
        motionValues[fieldName] = String(stat.value)
      }
    }
  }
  
  // Generate slug if not provided
  if (!slug) {
    // Remove apostrophes first, then convert to slug
    // "Dreamweaver's Feather" -> "Dreamweavers Feather" -> "dreamweavers-feather"
    slug = name
      .replace(/'/g, '') // Remove apostrophes
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Determine category
  const category = WEAPON_CATEGORIES[weaponType] || 'Melee'
  
  // Extract refinement values
  const refinementValues = extractRefinementValues(skillDescription)
  
  return {
    name,
    slug,
    element,
    weaponType,
    damageType,
    category,
    refinementSkill: {
      description: skillDescription,
      r1: refinementValues[0],
      r2: refinementValues[1],
      r3: refinementValues[2],
      r4: refinementValues[3],
      r5: refinementValues[4],
      r6: refinementValues[5]
    },
    baseStats,
    motionValues
  }
}

/**
 * Parse weapon markdown file
 */
export function parseWeaponMD(filePath: string): ParsedWeapon[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Split by weapon sections (## Weapon Name)
  const sections = content.split(/(?=^## [^#])/m).filter(s => s.trim())
  
  const weapons: ParsedWeapon[] = []
  
  for (const section of sections) {
    // Skip header sections
    if (section.startsWith('# Weapon') || section.startsWith('> ')) {
      continue
    }
    
    const weapon = parseWeaponSection(section)
    if (weapon) {
      weapons.push(weapon)
    }
  }
  
  return weapons
}

