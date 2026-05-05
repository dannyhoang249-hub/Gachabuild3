import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { i18nConfig } from '../config'

export interface CacheEntry {
  key: string
  value: any
  timestamp: number
}

/**
 * Generate cache key from content and target locale
 */
function getCacheKey(text: string, targetLocale: string): string {
  const hash = crypto.createHash('sha256')
    .update(`${text}:${targetLocale}`)
    .digest('hex')
  return hash.slice(0, 16)
}

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(i18nConfig.cacheDir, { recursive: true })
  } catch (err) {
    // Directory might already exist
  }
}

/**
 * Get translation from cache
 */
export async function getCachedTranslation(
  text: string,
  targetLocale: string
): Promise<string | null> {
  try {
    await ensureCacheDir()
    const key = getCacheKey(text, targetLocale)
    const cacheFile = path.join(i18nConfig.cacheDir, `${key}.json`)
    
    const data = await fs.readFile(cacheFile, 'utf-8')
    const entry: CacheEntry = JSON.parse(data)
    
    // Check if cache is still valid
    const age = Date.now() - entry.timestamp
    if (age > i18nConfig.cacheTtl) {
      return null
    }
    
    return entry.value
  } catch (err) {
    return null
  }
}

/**
 * Save translation to cache
 */
export async function setCachedTranslation(
  text: string,
  targetLocale: string,
  translation: string
): Promise<void> {
  try {
    await ensureCacheDir()
    const key = getCacheKey(text, targetLocale)
    const cacheFile = path.join(i18nConfig.cacheDir, `${key}.json`)
    
    const entry: CacheEntry = {
      key,
      value: translation,
      timestamp: Date.now()
    }
    
    await fs.writeFile(cacheFile, JSON.stringify(entry, null, 2))
  } catch (err) {
    console.warn(`Failed to cache translation: ${err}`)
  }
}

/**
 * Clear old cache entries
 */
export async function clearOldCache(): Promise<void> {
  try {
    await ensureCacheDir()
    const files = await fs.readdir(i18nConfig.cacheDir)
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      
      const filePath = path.join(i18nConfig.cacheDir, file)
      const data = await fs.readFile(filePath, 'utf-8')
      const entry: CacheEntry = JSON.parse(data)
      
      const age = Date.now() - entry.timestamp
      if (age > i18nConfig.cacheTtl) {
        await fs.unlink(filePath)
      }
    }
  } catch (err) {
    console.warn(`Failed to clear old cache: ${err}`)
  }
}

