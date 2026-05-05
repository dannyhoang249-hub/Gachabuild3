import { Locale, DEFAULT_LOCALE, LocalizedString, LocalizedText } from './types'

/**
 * Get localized content with fallback
 */
export function getLocalizedContent<T extends LocalizedString | LocalizedText>(
  content: T | undefined | null,
  locale: Locale
): string {
  if (!content) return ''
  
  // Try requested locale
  if (content[locale]) {
    return content[locale] as string
  }
  
  // Fallback to English
  if (content.en) {
    return content.en
  }
  
  // Fallback to any available locale
  const available = Object.values(content).find(v => v && typeof v === 'string')
  return available as string || ''
}

/**
 * Get localized content for arrays (pros, cons, etc.)
 */
export function getLocalizedArray<T extends { en: string }>(
  items: T[] | undefined | null,
  locale: Locale
): string[] {
  if (!items || !Array.isArray(items)) return []
  
  return items
    .map(item => getLocalizedContent(item as any, locale))
    .filter(Boolean)
}

/**
 * Get localized skill
 */
export function getLocalizedSkill(skill: any, locale: Locale) {
  if (!skill) return null
  
  return {
    ...skill,
    name: getLocalizedContent(skill.name, locale),
    description: getLocalizedContent(skill.description, locale)
  }
}

/**
 * Get localized skills array
 */
export function getLocalizedSkills(skills: any[] | undefined | null, locale: Locale) {
  if (!skills || !Array.isArray(skills)) return []
  
  return skills.map(skill => getLocalizedSkill(skill, locale))
}

/**
 * Check if locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return ['en', 'vi', 'jp', 'zh'].includes(locale)
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(/^\/([a-z]{2})(?:\/|$)/)
  if (match && isValidLocale(match[1])) {
    return match[1]
  }
  return DEFAULT_LOCALE
}

/**
 * Get asset URL with CDN fallback
 */
export function getAssetUrl(
  cdnData: { cdnUrl?: string; originalUrl?: string } | undefined,
  sanityAsset: any | undefined,
  defaultUrl?: string
): string {
  // Priority: CDN URL > Sanity Asset > Original URL > Default
  if (cdnData?.cdnUrl) {
    return cdnData.cdnUrl
  }
  
  // Build Sanity asset URL if available
  if (sanityAsset?.asset) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u'
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

    // Extract asset reference from Sanity asset object
    let assetRef = ''
    if (typeof sanityAsset.asset === 'string') {
      assetRef = sanityAsset.asset
    } else if (sanityAsset.asset._ref) {
      assetRef = sanityAsset.asset._ref
    }

    if (assetRef && assetRef.startsWith('image-')) {
      // Parse Sanity asset reference: image-{assetId}-{dimensions}-{format}
      const parts = assetRef.split('-')
      if (parts.length >= 4) {
        const assetId = parts[1]
        const dimensions = parts[2]
        const format = parts[3]
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}`
      }
    }
  }
  
  if (cdnData?.originalUrl) {
    return cdnData.originalUrl
  }
  
  return defaultUrl || ''
}

/**
 * Generate alternate language links for SEO
 */
export function generateAlternateLinks(
  pathname: string,
  locales: Locale[] = ['en', 'vi', 'jp', 'zh']
): Array<{ hreflang: string; href: string }> {
  const currentLocale = getLocaleFromPathname(pathname)
  const basePath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
  
  return locales.map(locale => ({
    hreflang: locale === 'en' ? 'en' : locale,
    href: `/${locale}${basePath}`
  }))
}

/**
 * Get translation status
 */
export function getTranslationStatus(
  doc: any,
  locale: Locale
): 'ready' | 'auto' | 'missing' {
  if (!doc) return 'missing'
  
  const readyLocales = doc.i18nReadyLocales || []
  const autoLocales = doc.autoTranslatedLocales || []
  
  if (readyLocales.includes(locale)) {
    return 'ready'
  }
  
  if (autoLocales.includes(locale)) {
    return 'auto'
  }
  
  return 'missing'
}

/**
 * Build localized path
 */
export function buildLocalizedPath(
  locale: Locale,
  ...segments: string[]
): string {
  const path = segments.filter(Boolean).join('/')
  return `/${locale}/${path}`.replace(/\/+/g, '/')
}

