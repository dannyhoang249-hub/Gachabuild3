import { i18nConfig } from '../config'
import { getCachedTranslation, setCachedTranslation } from '../utils/cache'
import { rateLimitedCall } from '../utils/rateLimit'
import { loadGlossary, applyGlossary, replaceWithPlaceholders, restorePlaceholders } from '../utils/glossary'

export interface TranslateOptions {
  useCache?: boolean
  context?: string
}

/**
 * Map locale codes to DeepL language codes
 */
const deeplLocaleMap: Record<string, string> = {
  en: 'EN',
  vi: 'VI', // Note: DeepL may not support Vietnamese
  jp: 'JA',
  zh: 'ZH'
}

/**
 * Translate text using DeepL API
 */
export async function translateWithDeepL(
  text: string,
  targetLocale: string,
  options: TranslateOptions = {}
): Promise<string> {
  if (!text || !text.trim()) return text
  
  const { useCache = true } = options
  
  // Check cache first
  if (useCache) {
    const cached = await getCachedTranslation(text, targetLocale)
    if (cached) {
      return cached
    }
  }
  
  // Check if DeepL supports this locale
  const targetLang = deeplLocaleMap[targetLocale]
  if (!targetLang) {
    throw new Error(`DeepL does not support locale: ${targetLocale}`)
  }
  
  // Load glossary
  const glossaryData = await loadGlossary()
  
  // Replace preserve patterns with placeholders
  const [textWithPlaceholders, patterns] = replaceWithPlaceholders(text, glossaryData)
  
  // Make API call with rate limiting
  const translation = await rateLimitedCall(async () => {
    const params = new URLSearchParams({
      auth_key: i18nConfig.deeplApiKey,
      text: textWithPlaceholders,
      source_lang: 'EN',
      target_lang: targetLang,
      tag_handling: 'xml',
      preserve_formatting: '1'
    })
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`DeepL API error: ${error}`)
    }
    
    const data = await response.json()
    return data.translations[0].text
  })
  
  // Restore placeholders
  let finalTranslation = restorePlaceholders(translation, patterns)
  
  // Apply glossary as post-processing
  finalTranslation = applyGlossary(finalTranslation, targetLocale, glossaryData)
  
  // Cache the result
  if (useCache) {
    await setCachedTranslation(text, targetLocale, finalTranslation)
  }
  
  return finalTranslation
}

