import { i18nConfig, localeNames } from '../config'
import { getCachedTranslation, setCachedTranslation } from '../utils/cache'
import { rateLimitedCall } from '../utils/rateLimit'
import { loadGlossary, getGlossaryInstruction, applyGlossary, replaceWithPlaceholders, restorePlaceholders } from '../utils/glossary'

export interface TranslateOptions {
  useCache?: boolean
  context?: string
}

/**
 * Translate text using OpenAI GPT
 */
export async function translateWithOpenAI(
  text: string,
  targetLocale: string,
  options: TranslateOptions = {}
): Promise<string> {
  if (!text || !text.trim()) return text
  
  const { useCache = true, context = '' } = options
  
  // Check cache first
  if (useCache) {
    const cached = await getCachedTranslation(text, targetLocale)
    if (cached) {
      return cached
    }
  }
  
  // Load glossary
  const glossaryData = await loadGlossary()
  
  // Replace preserve patterns with placeholders
  const [textWithPlaceholders, patterns] = replaceWithPlaceholders(text, glossaryData)
  
  // Prepare prompt
  const targetLanguage = localeNames[targetLocale] || targetLocale
  const glossaryInstruction = getGlossaryInstruction(targetLocale, glossaryData)
  const contextInstruction = context ? `\n\nContext: ${context}` : ''
  
  const systemPrompt = `You are a professional game localization translator specializing in gacha games and RPGs.
Translate the following text to ${targetLanguage}.

Rules:
1. Maintain the tone and style appropriate for game content
2. Keep placeholders like __PRESERVE_X_Y__ exactly as they are
3. Preserve formatting, line breaks, and special characters
4. Use gaming terminology appropriately${glossaryInstruction}${contextInstruction}

Respond with ONLY the translated text, no explanations.`

  // Make API call with rate limiting
  const translation = await rateLimitedCall(async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${i18nConfig.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: textWithPlaceholders }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }
    
    const data = await response.json()
    return data.choices[0].message.content.trim()
  })
  
  // Restore placeholders
  let finalTranslation = restorePlaceholders(translation, patterns)
  
  // Apply glossary as post-processing (for terms not in placeholders)
  finalTranslation = applyGlossary(finalTranslation, targetLocale, glossaryData)
  
  // Cache the result
  if (useCache) {
    await setCachedTranslation(text, targetLocale, finalTranslation)
  }
  
  return finalTranslation
}

