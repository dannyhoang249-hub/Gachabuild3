import { sanityClient } from './sanity'
import {
  CHARACTERS_QUERY,
  CHARACTER_BY_SLUG_QUERY,
  WEAPONS_QUERY,
  WEAPON_BY_SLUG_QUERY,
  CHARACTER_SLUGS_QUERY,
  WEAPON_SLUGS_QUERY,
  SEARCH_CHARACTERS_QUERY,
  SEARCH_WEAPONS_QUERY,
  UNIFIED_SEARCH_QUERY,
  BUILD_GUIDE_BY_CHARACTER_SLUG_QUERY,
  BUILD_GUIDE_SLUGS_QUERY,
  ALL_BUILD_GUIDES_MINIMAL_QUERY
} from './queries'

// Types (matching your existing structure)
export type Language = 'en' | 'vi'

export interface MultilingualText {
  en: string
  vi: string
}

export interface CharacterProfile {
  gender?: string
  birthplace?: string
  birthday?: string
  allegiance?: string
}

export interface TraitRow {
  name?: MultilingualText
  effect?: MultilingualText
}

export interface BaseStatRow {
  stat: string
  lv1?: string
  lvMax?: string
}

export interface PassiveUpgradeRow {
  upgrade: MultilingualText
  value?: MultilingualText
}

export interface IntronLevel {
  level: number
  effect: MultilingualText
}

export interface BuildTeamUnit {
  name?: string
  meleeWeapon?: string
  rangedWeapon?: string
}

export interface BuildDemondWedges {
  setName?: string
  slots?: string[]
  attributeBoosts?: { stat: string; value: string }[]
  notes?: string
}

export interface Character {
  _id: string
  _updatedAt?: string
  name: MultilingualText
  slug: {
    _type: 'slug'
    current: string
  }
  role: string
  weapon: string
  image?: string
  splash?: string
  rarity?: string
  element?: string
  overview?: MultilingualText
  profile?: CharacterProfile
  traits?: TraitRow[]
  baseStats?: BaseStatRow[]
  passiveUpgrades?: PassiveUpgradeRow[]
  intron?: IntronLevel[]
  skills?: Skill[]
  build?: BuildRecommendation
  synergy?: TeamSynergy[]
  pros?: MultilingualText[]
  cons?: MultilingualText[]
  recommendedWeapons?: {
    name: string
    slug: string
    priority: 'High' | 'Medium' | 'Low'
  }[]
}

export interface SkillStat {
  stat: string // e.g., "Sanity Cost", "DMG per Hit", "Radius", "Cooldown"
  lv1?: string  // Value at Level 1
  lvMax?: string // Value at Max Level
  notes?: string // Optional notes (e.g., "channeled", "on hit", "swordwave")

  // Legacy field name (kept for backward compatibility)
  name?: string
}

export interface Skill {
  name: MultilingualText
  description: MultilingualText
  type: 'active' | 'passive' | 'intron' | 'ultimate'
  subtype?: string // e.g., "DMG", "Buff", "Heal", "Support"

  // New stats structure with level-based values
  stats?: SkillStat[]

  // Legacy fields (kept for backward compatibility)
  cooldown?: string
  cost?: string
  skillDMG?: string
  duration?: string
  range?: string
  misc?: string
  level?: number
  icon?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

export interface BuildRecommendation {
  // Team Composition section
  teamComposition?: MultilingualText

  // Recommended Weapons section
  recommendedWeapons?: MultilingualText

  // Recommended Artifacts section
  recommendedArtifacts?: MultilingualText

  // Stat Priority section
  statPriority?: MultilingualText

  // Demon Wedges section
  demonWedges?: MultilingualText

  // Team Recommendations (optional, for some characters)
  teamRecommendations?: MultilingualText

  // Role Overview (optional, for some characters)
  roleOverview?: MultilingualText

  // Legacy fields (kept for backward compatibility)
  weapons?: string[]
  artifacts?: string[]
  team?: {
    main?: BuildTeamUnit
    partner1?: BuildTeamUnit
    partner2?: BuildTeamUnit
  }
  demondWedges?: BuildDemondWedges
}

export interface TeamSynergy {
  partner: string
  reason: MultilingualText
}

export interface Weapon {
  _id: string
  name: MultilingualText
  slug: {
    _type: 'slug'
    current: string
  }
  type: string
  category: string
  element: string
  damageType: string
  rarity?: string // Legacy field
  image?: string
  description?: MultilingualText
  passive?: MultilingualText // Legacy field

  // Refinement Skill (R1-R6)
  refinementSkill?: {
    description: MultilingualText
    r1?: string[]
    r2?: string[]
    r3?: string[]
    r4?: string[]
    r5?: string[]
    r6?: string[]
  }

  // Base Stats
  baseStats?: {
    // Primary ATK (one will be populated based on damageType)
    spikeAtkLv1?: number
    spikeAtkLvMax?: number
    slashAtkLv1?: number
    slashAtkLvMax?: number
    smashAtkLv1?: number
    smashAtkLvMax?: number

    // Universal stats
    critChance?: number
    critDamage?: number
    atkSpeed?: number
    triggerProbability?: number

    // Ranged-only stats
    multishot?: number
    magCapacity?: number
    maxAmmo?: number
    ammoConversionRate?: number
    projectileExplosionRange?: number
  }

  // Motion Multipliers (stored as key-value pairs)
  motionValues?: Record<string, string>

  // Legacy stats field
  stats?: {
    attack?: number
    health?: number
    defense?: number
    critRate?: number
    critDamage?: number
  }

  recommendedCharacters?: string[]
}

// Search result types
export interface SearchResult {
  _id: string
  name: MultilingualText
  slug: {
    _type: 'slug'
    current: string
  }
  _type: 'character' | 'weapon'
  image?: string
  // Character specific fields
  role?: string
  weapon?: string
  rarity?: string
  element?: string
  splash?: string
  // Weapon specific fields
  type?: string
  description?: MultilingualText
}

export interface UnifiedSearchResults {
  characters: SearchResult[]
  weapons: SearchResult[]
}

// Data fetching functions - Sanity only
export async function getCharacters(): Promise<Character[]> {
  try {
    const characters = await sanityClient.fetch(CHARACTERS_QUERY)
    if (!characters || characters.length === 0) {
      throw new Error('No characters found in Sanity. Please import data first.')
    }
    return characters
  } catch (error) {
    throw new Error('Unable to fetch characters. Please check your Sanity configuration and import data.')
  }
}

export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  try {
    const character = await sanityClient.fetch(CHARACTER_BY_SLUG_QUERY, { slug })
    if (!character) {
      throw new Error(`Character with slug "${slug}" not found`)
    }
    return character
  } catch (error) {
    throw new Error(`Unable to fetch character "${slug}". Please check your Sanity configuration.`)
  }
}

export async function getWeapons(): Promise<Weapon[]> {
  try {
    const weapons = await sanityClient.fetch(WEAPONS_QUERY)
    if (!weapons || weapons.length === 0) {
      throw new Error('No weapons found in Sanity')
    }
    return weapons
  } catch (error) {
    throw new Error('Unable to fetch weapons. Please check your Sanity configuration.')
  }
}

export async function getWeaponBySlug(slug: string): Promise<Weapon | null> {
  try {
    const weapon = await sanityClient.fetch(WEAPON_BY_SLUG_QUERY, { slug })
    if (!weapon) {
      throw new Error(`Weapon with slug "${slug}" not found`)
    }
    return weapon
  } catch (error) {
    throw new Error(`Unable to fetch weapon "${slug}". Please check your Sanity configuration.`)
  }
}

export async function getCharacterSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch(CHARACTER_SLUGS_QUERY)
    if (!slugs || slugs.length === 0) {
      throw new Error('No character slugs found in Sanity')
    }
    return slugs
  } catch (error) {
    throw new Error('Unable to fetch character slugs. Please check your Sanity configuration.')
  }
}

export async function getWeaponSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch(WEAPON_SLUGS_QUERY)
    if (!slugs || slugs.length === 0) {
      throw new Error('No weapon slugs found in Sanity')
    }
    return slugs
  } catch (error) {
    throw new Error('Unable to fetch weapon slugs. Please check your Sanity configuration.')
  }
}

// Search functions
export async function searchCharacters(searchTerm: string): Promise<SearchResult[]> {
  try {
    if (!searchTerm.trim()) return []
    
    const results = await sanityClient.fetch(SEARCH_CHARACTERS_QUERY, { 
      searchTerm: searchTerm.toLowerCase() 
    })
    
    return results.map((char: Record<string, unknown>) => ({
      _id: char._id,
      name: char.name,
      slug: char.slug,
      _type: 'character' as const,
      image: char.image,
      role: char.role,
      weapon: char.weapon,
      rarity: char.rarity,
      element: char.element,
      splash: char.splash
    }))
  } catch (error) {
    return []
  }
}

export async function searchWeapons(searchTerm: string): Promise<SearchResult[]> {
  try {
    if (!searchTerm.trim()) return []
    
    const results = await sanityClient.fetch(SEARCH_WEAPONS_QUERY, { 
      searchTerm: searchTerm.toLowerCase() 
    })
    
    return results.map((weapon: Record<string, unknown>) => ({
      _id: weapon._id,
      name: weapon.name,
      slug: weapon.slug,
      _type: 'weapon' as const,
      image: weapon.image,
      type: weapon.type,
      rarity: weapon.rarity,
      description: weapon.description
    }))
  } catch (error) {
    return []
  }
}

export async function unifiedSearch(searchTerm: string): Promise<UnifiedSearchResults> {
  try {
    if (!searchTerm.trim()) {
      return { characters: [], weapons: [] }
    }

    const results = await sanityClient.fetch(UNIFIED_SEARCH_QUERY, {
      searchTerm: searchTerm.toLowerCase()
    })

    return {
      characters: results.characters || [],
      weapons: results.weapons || []
    }
  } catch (error) {
    return { characters: [], weapons: [] }
  }
}

// Build Guide types
export interface BuildGuideWeapon {
  _id: string
  name: MultilingualText
  slug: { current: string }
  type: string
  element: string
  image?: string
}

export interface WeaponPair {
  meleeWeapon: BuildGuideWeapon
  rangedWeapon: BuildGuideWeapon
  pairScore: number
  reasoning: MultilingualText
}

export interface ModeBuild {
  weaponPairs: WeaponPair[]
  statPriority: string[]
  playstyleTips: MultilingualText
}

export interface TeamComposition {
  mode: string
  partner1: {
    _id: string
    name: MultilingualText
    slug: { current: string }
    role: string
    element: string
    image?: string
  }
  partner1MeleeWeapon?: BuildGuideWeapon
  partner1RangedWeapon?: BuildGuideWeapon
  partner2: {
    _id: string
    name: MultilingualText
    slug: { current: string }
    role: string
    element: string
    image?: string
  }
  partner2MeleeWeapon?: BuildGuideWeapon
  partner2RangedWeapon?: BuildGuideWeapon
  teamScore: number
  synergies: {
    type: string
    description: MultilingualText
  }[]
}

export interface BuildGuide {
  _id: string
  character: {
    _id: string
    name: MultilingualText
    slug: { current: string }
    role: string
    element: string
    rarity: string
    image?: string
  }
  soloMode: ModeBuild
  farmMode: ModeBuild
  bossMode: ModeBuild
  teamCompositions: TeamComposition[]
  algorithmVersion: string
  lastCalculated: string
  autoGenerated: boolean
}

// Build Guide data fetching functions
export async function getBuildGuideByCharacterSlug(slug: string): Promise<BuildGuide | null> {
  try {
    const buildGuide = await sanityClient.fetch(BUILD_GUIDE_BY_CHARACTER_SLUG_QUERY, { slug })
    return buildGuide
  } catch (error) {
    console.error('Error fetching build guide:', error)
    return null
  }
}

export async function getBuildGuideSlugs(): Promise<string[]> {
  try {
    const slugs = await sanityClient.fetch(BUILD_GUIDE_SLUGS_QUERY)
    return slugs || []
  } catch (error) {
    console.error('Error fetching build guide slugs:', error)
    return []
  }
}

export interface BuildGuideMinimal {
  _id: string
  characterSlug: string
  topWeaponPair?: {
    meleeWeapon: BuildGuideWeapon
    rangedWeapon: BuildGuideWeapon
  }
}

export async function getAllBuildGuidesMinimal(): Promise<BuildGuideMinimal[]> {
  try {
    const buildGuides = await sanityClient.fetch(ALL_BUILD_GUIDES_MINIMAL_QUERY)
    return buildGuides || []
  } catch (error) {
    console.error('Error fetching build guides:', error)
    return []
  }
}

