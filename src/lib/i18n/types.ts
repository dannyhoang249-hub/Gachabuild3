/**
 * Type definitions for i18n
 */

export type Locale = 'en' | 'vi' | 'jp' | 'zh'

export interface LocalizedString {
  en: string
  vi?: string
  jp?: string
  zh?: string
}

export interface LocalizedText {
  en: string
  vi?: string
  jp?: string
  zh?: string
}

export interface LocalizedContent {
  en: any[]
  vi?: any[]
  jp?: any[]
  zh?: any[]
}

export const SUPPORTED_LOCALES: Locale[] = ['en', 'vi', 'jp', 'zh']

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  jp: '日本語',
  zh: '中文'
}

export const LOCALE_NAMES_NATIVE: Record<Locale, string> = {
  en: 'English',
  vi: 'Vietnamese',
  jp: 'Japanese',
  zh: 'Chinese'
}

