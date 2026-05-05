import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export const i18nConfig = {
  // Translation service config
  translationService: process.env.TRANSLATION_SERVICE || 'openai', // 'openai' or 'deepl'
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  deeplApiKey: process.env.DEEPL_API_KEY || '',
  
  // Supported locales
  sourceLocale: 'en',
  targetLocales: (process.env.TRANSLATE_LANGS || 'vi,jp,zh').split(','),
  
  // Rate limiting
  rateLimit: parseInt(process.env.RATE_LIMIT || '10', 10), // requests per minute
  rateLimitWindow: 60000, // 1 minute in ms
  
  // Retry config
  maxRetries: 3,
  retryDelay: 1000, // initial delay in ms
  backoffMultiplier: 2,
  
  // Caching
  cacheDir: './scripts/i18n/cache',
  cacheTtl: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  
  // Glossary
  glossaryPath: './scripts/i18n/glossary.json',
  
  // Sanity config
  sanityProjectId: process.env.SANITY_PROJECT_ID || '',
  sanityDataset: process.env.SANITY_DATASET || 'production',
  sanityToken: process.env.SANITY_TOKEN || '',
  sanityApiVersion: '2024-01-01'
}

// Locale name mappings
export const localeNames: Record<string, string> = {
  en: 'English',
  vi: 'Vietnamese',
  jp: 'Japanese',
  zh: 'Chinese (Simplified)'
}

// Document types that support i18n
export const i18nDocTypes = ['character', 'weapon', 'guide']

