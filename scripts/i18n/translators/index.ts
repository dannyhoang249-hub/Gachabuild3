import { i18nConfig } from '../config'
import { translateWithOpenAI, TranslateOptions as OpenAIOptions } from './openai'
import { translateWithDeepL, TranslateOptions as DeepLOptions } from './deepl'

export type TranslateOptions = OpenAIOptions & DeepLOptions

/**
 * Main translation function that routes to the configured service
 */
export async function translate(
  text: string,
  targetLocale: string,
  options: TranslateOptions = {}
): Promise<string> {
  if (!text || !text.trim()) return text
  
  const service = i18nConfig.translationService
  
  switch (service) {
    case 'openai':
      if (!i18nConfig.openaiApiKey) {
        throw new Error('OPENAI_API_KEY not configured')
      }
      return translateWithOpenAI(text, targetLocale, options)
    
    case 'deepl':
      if (!i18nConfig.deeplApiKey) {
        throw new Error('DEEPL_API_KEY not configured')
      }
      return translateWithDeepL(text, targetLocale, options)
    
    default:
      throw new Error(`Unknown translation service: ${service}`)
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: string[],
  targetLocale: string,
  options: TranslateOptions = {}
): Promise<string[]> {
  const results: string[] = []
  
  for (const text of texts) {
    const translation = await translate(text, targetLocale, options)
    results.push(translation)
  }
  
  return results
}

