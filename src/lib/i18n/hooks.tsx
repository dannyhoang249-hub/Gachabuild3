'use client'

import { usePathname } from 'next/navigation'
import { Locale, DEFAULT_LOCALE } from './types'
import { getLocaleFromPathname, isValidLocale } from './utils'

/**
 * Hook to get current locale from URL
 */
export function useLocale(): Locale {
  const pathname = usePathname()
  return getLocaleFromPathname(pathname)
}

/**
 * Hook to get locale switcher data
 */
export function useLocaleSwitcher() {
  const pathname = usePathname()
  const currentLocale = useLocale()
  
  const switchLocale = (newLocale: Locale): string => {
    const basePath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
    return `/${newLocale}${basePath}`
  }
  
  return {
    currentLocale,
    switchLocale
  }
}

