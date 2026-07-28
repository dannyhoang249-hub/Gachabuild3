// Simplified search data utilities - optimized for both static and dynamic data sources
import { unifiedSearch } from './data'

// Types for search suggestions
export interface SearchSuggestion {
  _id: string
  name: { en: string; vi: string }
  slug: { _type: 'slug'; current: string }
  _type: 'character' | 'weapon'
  image?: string
  displayName: string
  category: 'character' | 'weapon'
  subtitle: string
  // Character specific
  role?: string
  weapon?: string
  rarity?: string
  element?: string
  splash?: string
  // Weapon specific
  type?: string
  description?: { en: string; vi: string }
}

// Static data cache for instant suggestions
class StaticSearchCache {
  private static characters: SearchSuggestion[] = []
  private static weapons: SearchSuggestion[] = []
  private static isInitialized = false

  // Initialize with static data for instant suggestions
  static async initialize() {
    if (this.isInitialized) return

    try {
      // Load from import JSON files
      const [charactersImport, weaponsImport] = await Promise.all([
        import('../../data/import/character_import.json'),
        import('../../data/import/weapon_import.json')
      ])

      const charactersData = charactersImport.default
      const weaponsData = weaponsImport.default

      // Transform character data
      this.characters = charactersData.map((char: Record<string, unknown>) => ({
        _id: String(char.slug || char._id || ''),
        name: (char.name as { en: string; vi: string }) || { en: '', vi: '' },
        slug: { _type: 'slug' as const, current: String(char.slug || '') },
        _type: 'character' as const,
        image: char.image as string,
        displayName: (char.name as { en: string; vi: string })?.en || '', // Will be translated by component
        category: 'character' as const,
        subtitle: `${char.role || ''}${char.element ? ` • ${char.element}` : ''}${char.weapon ? ` • ${char.weapon}` : ''}`,
        role: char.role as string,
        weapon: char.weapon as string,
        rarity: char.rarity as string,
        element: char.element as string,
        splash: char.splash as string
      }))

      // Transform weapon data
      this.weapons = weaponsData.map((weapon: Record<string, unknown>) => ({
        _id: String(weapon.slug || weapon._id || ''),
        name: (weapon.name as { en: string; vi: string }) || { en: '', vi: '' },
        slug: { _type: 'slug' as const, current: String(weapon.slug || '') },
        _type: 'weapon' as const,
        image: weapon.image as string,
        displayName: (weapon.name as { en: string; vi: string })?.en || '', // Will be translated by component
        category: 'weapon' as const,
        subtitle: `${weapon.type || ''}${weapon.rarity ? ` • ${weapon.rarity}` : ''}`,
        type: weapon.type as string,
        rarity: weapon.rarity as string,
        description: weapon.description as { en: string; vi: string }
      }))

      this.isInitialized = true
      // Static search cache initialized successfully
    } catch (error) {
      // Failed to load static search data, will use Sanity fallback
      this.isInitialized = false
    }
  }

  // Get instant suggestions from static data
  static getInstantSuggestions(query: string, limit: number = 10): SearchSuggestion[] {
    if (!this.isInitialized || !query.trim()) return []

    const queryLower = query.toLowerCase()
    const allItems = [...this.characters, ...this.weapons]
    
    // Filter and rank results
    const filtered = allItems.filter(item => {
      const nameEn = item.name.en.toLowerCase()
      const nameVi = item.name.vi.toLowerCase()
      const subtitle = item.subtitle.toLowerCase()
      
      return nameEn.includes(queryLower) || 
             nameVi.includes(queryLower) || 
             subtitle.includes(queryLower)
    })

    // Rank by relevance
    const ranked = filtered.sort((a, b) => {
      const aName = a.name.en.toLowerCase()
      const bName = b.name.en.toLowerCase()
      
      // Exact match gets highest priority
      const aExact = aName === queryLower
      const bExact = bName === queryLower
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      // Starts with query gets second priority
      const aStartsWith = aName.startsWith(queryLower)
      const bStartsWith = bName.startsWith(queryLower)
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      // Alphabetical order for remaining
      return aName.localeCompare(bName)
    })

    return ranked.slice(0, limit)
  }

  // Check if static data is available
  static isAvailable(): boolean {
    return this.isInitialized
  }

  // Get all data for comprehensive search
  static getAllData(): { characters: SearchSuggestion[]; weapons: SearchSuggestion[] } {
    return {
      characters: this.characters,
      weapons: this.weapons
    }
  }
}

// Enhanced search function with static fallback
export async function getSearchSuggestions(
  query: string, 
  limit: number = 10,
  useStaticFirst: boolean = true
): Promise<SearchSuggestion[]> {
  if (!query.trim()) return []

  // Try static data first for instant results
  if (useStaticFirst && StaticSearchCache.isAvailable()) {
    const staticResults = StaticSearchCache.getInstantSuggestions(query, limit)
    if (staticResults.length > 0) {
      return staticResults
    }
  }

  // Fallback to Sanity for comprehensive search
  try {
    const results = await unifiedSearch(query)
    const allSuggestions: SearchSuggestion[] = []

    // Transform character results
    results.characters.forEach(char => {
      allSuggestions.push({
        ...char,
        displayName: char.name.en, // Will be translated by component
        category: 'character',
        subtitle: `${char.role}${char.element ? ` • ${char.element}` : ''}${char.weapon ? ` • ${char.weapon}` : ''}`
      })
    })

    // Transform weapon results
    results.weapons.forEach(weapon => {
      allSuggestions.push({
        ...weapon,
        displayName: weapon.name.en, // Will be translated by component
        category: 'weapon',
        subtitle: `${weapon.type}${weapon.rarity ? ` • ${weapon.rarity}` : ''}`
      })
    })

    // Rank and limit results
    const ranked = allSuggestions.sort((a, b) => {
      const aName = a.displayName.toLowerCase()
      const bName = b.displayName.toLowerCase()
      const queryLower = query.toLowerCase()
      
      // Exact match gets highest priority
      const aExact = aName === queryLower
      const bExact = bName === queryLower
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      // Starts with query gets second priority
      const aStartsWith = aName.startsWith(queryLower)
      const bStartsWith = bName.startsWith(queryLower)
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      // Alphabetical order for remaining
      return aName.localeCompare(bName)
    })

    return ranked.slice(0, limit)
  } catch (error) {
    // Search failed, using fallback
    
    // Final fallback to static data if Sanity fails
    if (StaticSearchCache.isAvailable()) {
      return StaticSearchCache.getInstantSuggestions(query, limit)
    }
    
    return []
  }
}

// Initialize static cache
export async function initializeSearchData() {
  await StaticSearchCache.initialize()
}

// Export for direct access to static data
export { StaticSearchCache }
