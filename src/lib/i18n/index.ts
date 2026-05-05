/**
 * i18n utilities for the frontend
 * 
 * Usage:
 * ```tsx
 * import { getLocalizedContent, getLocalizedArray } from '@/lib/i18n'
 * 
 * const character = await getCharacter(slug)
 * const locale = 'vi'
 * 
 * const name = getLocalizedContent(character.name, locale)
 * const pros = getLocalizedArray(character.pros, locale)
 * ```
 */

export * from './types'
export * from './utils'

