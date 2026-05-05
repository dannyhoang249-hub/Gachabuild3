// Search analytics and performance utilities

interface SearchAnalytics {
  query: string
  timestamp: number
  resultsCount: number
  searchTime: number
  category: 'character' | 'weapon' | 'both'
}

interface SearchAbandonment {
  query: string
  timestamp: number
  timeSpent: number
  resultsShown: number
  category: 'character' | 'weapon' | 'both'
  reason: 'no_results' | 'too_many_results' | 'user_navigation' | 'timeout'
}

interface SearchPerformanceMetrics {
  averageSearchTime: number
  totalSearches: number
  popularQueries: Record<string, number>
  categoryDistribution: Record<string, number>
  abandonmentRate: number
  averageTimeToAbandon: number
}

interface RelatedSearchTerm {
  term: string
  frequency: number
  category: 'character' | 'weapon' | 'both'
}

class SearchAnalyticsManager {
  private analytics: SearchAnalytics[] = []
  private abandonmentData: SearchAbandonment[] = []
  private readonly maxAnalytics = 1000 // Keep only last 1000 searches
  private readonly maxAbandonmentData = 500 // Keep only last 500 abandonment events

  // Track a search event
  trackSearch(query: string, resultsCount: number, searchTime: number, category: 'character' | 'weapon' | 'both') {
    const analytics: SearchAnalytics = {
      query: query.toLowerCase().trim(),
      timestamp: Date.now(),
      resultsCount,
      searchTime,
      category
    }

    this.analytics.push(analytics)
    
    // Keep only recent analytics to prevent memory issues
    if (this.analytics.length > this.maxAnalytics) {
      this.analytics = this.analytics.slice(-this.maxAnalytics)
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('searchAnalytics', JSON.stringify(this.analytics.slice(-100))) // Keep last 100 in localStorage
    } catch (error) {
      // Failed to store search analytics - continue silently
    }
  }

  // Track search abandonment
  trackSearchAbandonment(
    query: string, 
    timeSpent: number, 
    resultsShown: number, 
    category: 'character' | 'weapon' | 'both',
    reason: 'no_results' | 'too_many_results' | 'user_navigation' | 'timeout'
  ) {
    const abandonment: SearchAbandonment = {
      query: query.toLowerCase().trim(),
      timestamp: Date.now(),
      timeSpent,
      resultsShown,
      category,
      reason
    }

    this.abandonmentData.push(abandonment)
    
    // Keep only recent abandonment data
    if (this.abandonmentData.length > this.maxAbandonmentData) {
      this.abandonmentData = this.abandonmentData.slice(-this.maxAbandonmentData)
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('searchAbandonment', JSON.stringify(this.abandonmentData.slice(-50))) // Keep last 50 in localStorage
    } catch (error) {
      // Failed to store search abandonment data - continue silently
    }
  }

  // Get performance metrics
  getMetrics(): SearchPerformanceMetrics {
    const recentAnalytics = this.analytics.slice(-100) // Last 100 searches
    const recentAbandonment = this.abandonmentData.slice(-50) // Last 50 abandonment events
    
    if (recentAnalytics.length === 0) {
      return {
        averageSearchTime: 0,
        totalSearches: 0,
        popularQueries: {},
        categoryDistribution: {},
        abandonmentRate: 0,
        averageTimeToAbandon: 0
      }
    }

    const averageSearchTime = recentAnalytics.reduce((sum, a) => sum + a.searchTime, 0) / recentAnalytics.length
    
    const popularQueries: Record<string, number> = {}
    const categoryDistribution: Record<string, number> = {}

    recentAnalytics.forEach(analytics => {
      // Count popular queries
      if (analytics.query) {
        popularQueries[analytics.query] = (popularQueries[analytics.query] || 0) + 1
      }
      
      // Count category distribution
      categoryDistribution[analytics.category] = (categoryDistribution[analytics.category] || 0) + 1
    })

    // Calculate abandonment metrics
    const totalSearches = recentAnalytics.length
    const abandonmentRate = recentAbandonment.length / totalSearches
    const averageTimeToAbandon = recentAbandonment.length > 0 
      ? recentAbandonment.reduce((sum, a) => sum + a.timeSpent, 0) / recentAbandonment.length 
      : 0

    return {
      averageSearchTime,
      totalSearches,
      popularQueries,
      categoryDistribution,
      abandonmentRate,
      averageTimeToAbandon
    }
  }

  // Get search suggestions based on popular queries
  getSearchSuggestions(limit: number = 5): string[] {
    const metrics = this.getMetrics()
    const sortedQueries = Object.entries(metrics.popularQueries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query]) => query)
    
    return sortedQueries
  }

  // Get related search terms for prefetching
  getRelatedSearchTerms(query: string, limit: number = 3): RelatedSearchTerm[] {
    const metrics = this.getMetrics()
    const queryLower = query.toLowerCase()
    
    // Find related terms based on common patterns
    const relatedTerms: RelatedSearchTerm[] = []
    
    // Look for terms that start with the same prefix
    Object.entries(metrics.popularQueries).forEach(([term, frequency]) => {
      if (term.startsWith(queryLower) && term !== queryLower) {
        relatedTerms.push({
          term,
          frequency,
          category: this.getCategoryForTerm(term)
        })
      }
    })
    
    // Look for terms that contain the query
    Object.entries(metrics.popularQueries).forEach(([term, frequency]) => {
      if (term.includes(queryLower) && term !== queryLower && !term.startsWith(queryLower)) {
        relatedTerms.push({
          term,
          frequency,
          category: this.getCategoryForTerm(term)
        })
      }
    })
    
    // Sort by frequency and return top results
    return relatedTerms
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
  }

  // Helper method to determine category for a term
  private getCategoryForTerm(term: string): 'character' | 'weapon' | 'both' {
    // This is a simple heuristic - you could make this more sophisticated
    const weaponTerms = ['sword', 'bow', 'staff', 'spear', 'sniper']
    const characterTerms = ['berenica', 'hilda', 'psyche', 'tabethe', 'yuming']
    
    const isWeapon = weaponTerms.some(w => term.includes(w))
    const isCharacter = characterTerms.some(c => term.includes(c))
    
    if (isCharacter && isWeapon) return 'both'
    if (isCharacter) return 'character'
    if (isWeapon) return 'weapon'
    return 'both'
  }

  // Load analytics from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('searchAnalytics')
      if (stored) {
        this.analytics = JSON.parse(stored)
      }
      
      const storedAbandonment = localStorage.getItem('searchAbandonment')
      if (storedAbandonment) {
        this.abandonmentData = JSON.parse(storedAbandonment)
      }
    } catch (error) {
      this.analytics = []
      this.abandonmentData = []
    }
  }

  // Clear analytics
  clearAnalytics() {
    this.analytics = []
    this.abandonmentData = []
    try {
      localStorage.removeItem('searchAnalytics')
      localStorage.removeItem('searchAbandonment')
    } catch (error) {
      // Failed to clear search analytics - continue silently
    }
  }
}

// Create singleton instance
export const searchAnalytics = new SearchAnalyticsManager()

// Initialize analytics on load
if (typeof window !== 'undefined') {
  searchAnalytics.loadFromStorage()
}

// Performance optimization utilities
export class SearchPerformanceOptimizer {
  private static cache = new Map<string, { data: Record<string, unknown>; timestamp: number; isPopular: boolean }>()
  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes for regular searches
  private static readonly POPULAR_CACHE_TTL = 30 * 60 * 1000 // 30 minutes for popular searches
  private static readonly POPULAR_SEARCH_THRESHOLD = 3 // searches per term to be considered popular

  // Cache search results with popularity tracking
  static setCache(key: string, data: Record<string, unknown>, isPopular: boolean = false) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      isPopular
    })
  }

  // Get cached search results with extended TTL for popular searches
  static getCache(key: string): Record<string, unknown> | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Use extended TTL for popular searches
    const ttl = cached.isPopular ? this.POPULAR_CACHE_TTL : this.CACHE_TTL
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  // Mark a search as popular based on frequency
  static markAsPopular(key: string) {
    const cached = this.cache.get(key)
    if (cached) {
      cached.isPopular = true
      cached.timestamp = Date.now() // Reset timestamp for extended TTL
    }
  }

  // Clear expired cache entries
  static clearExpiredCache() {
    const now = Date.now()
    for (const [key, cached] of this.cache.entries()) {
      const ttl = cached.isPopular ? this.POPULAR_CACHE_TTL : this.CACHE_TTL
      if (now - cached.timestamp > ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Check if a search term is popular based on analytics
  static isPopularSearch(term: string): boolean {
    const metrics = searchAnalytics.getMetrics()
    const frequency = metrics.popularQueries[term.toLowerCase()] || 0
    return frequency >= this.POPULAR_SEARCH_THRESHOLD
  }

  // Clear all cache
  static clearAllCache() {
    this.cache.clear()
  }

  // Get cache size
  static getCacheSize(): number {
    return this.cache.size
  }
}

// Debounce utility for search
export function createSearchDebouncer(delay: number = 300) {
  let timeoutId: NodeJS.Timeout | null = null

  return (callback: () => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(callback, delay)
  }
}

// Search result ranking utility
export function rankSearchResults(results: Record<string, unknown>[], query: string): Record<string, unknown>[] {
  const queryLower = query.toLowerCase()
  
  return results.sort((a, b) => {
    const aName = (a.displayName as string) || (a.name as Record<string, unknown>)?.en as string || ''
    const bName = (b.displayName as string) || (b.name as Record<string, unknown>)?.en as string || ''
    
    // Exact match gets highest priority
    const aExactMatch = aName.toLowerCase() === queryLower
    const bExactMatch = bName.toLowerCase() === queryLower
    
    if (aExactMatch && !bExactMatch) return -1
    if (!aExactMatch && bExactMatch) return 1
    
    // Starts with query gets second priority
    const aStartsWith = aName.toLowerCase().startsWith(queryLower)
    const bStartsWith = bName.toLowerCase().startsWith(queryLower)
    
    if (aStartsWith && !bStartsWith) return -1
    if (!aStartsWith && bStartsWith) return 1
    
    // Alphabetical order for remaining results
    return aName.localeCompare(bName)
  })
}

// Search prefetching utility
export class SearchPrefetcher {
  private static prefetchQueue = new Set<string>()
  private static readonly MAX_PREFETCH_QUEUE = 5

  // Prefetch related search terms
  static async prefetchRelatedSearches(query: string, unifiedSearch: (term: string) => Promise<Record<string, unknown>>) {
    if (this.prefetchQueue.size >= this.MAX_PREFETCH_QUEUE) return

    const relatedTerms = searchAnalytics.getRelatedSearchTerms(query, 3)
    
    for (const relatedTerm of relatedTerms) {
      if (this.prefetchQueue.has(relatedTerm.term)) continue
      
      this.prefetchQueue.add(relatedTerm.term)
      
      try {
        const results = await unifiedSearch(relatedTerm.term)
        const cacheKey = `search-${relatedTerm.term.toLowerCase()}`
        const isPopular = SearchPerformanceOptimizer.isPopularSearch(relatedTerm.term)
        
        SearchPerformanceOptimizer.setCache(cacheKey, results, isPopular)
        
        // Remove from queue after successful prefetch
        this.prefetchQueue.delete(relatedTerm.term)
      } catch (error) {
        this.prefetchQueue.delete(relatedTerm.term)
      }
    }
  }

  // Get prefetch queue status
  static getPrefetchStatus() {
    return {
      queueSize: this.prefetchQueue.size,
      maxQueue: this.MAX_PREFETCH_QUEUE,
      isFull: this.prefetchQueue.size >= this.MAX_PREFETCH_QUEUE
    }
  }

  // Clear prefetch queue
  static clearPrefetchQueue() {
    this.prefetchQueue.clear()
  }
}
