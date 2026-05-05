import fs from 'fs/promises'
import { i18nConfig } from '../config'

interface GlossaryData {
  terms: Record<string, Record<string, string>>
  preservePatterns: string[]
}

let glossary: GlossaryData | null = null

/**
 * Load glossary from file
 */
export async function loadGlossary(): Promise<GlossaryData> {
  if (glossary) return glossary
  
  try {
    const data = await fs.readFile(i18nConfig.glossaryPath, 'utf-8')
    glossary = JSON.parse(data)
    return glossary!
  } catch (err) {
    console.warn('Glossary not found, using empty glossary')
    glossary = { terms: {}, preservePatterns: [] }
    return glossary
  }
}

/**
 * Apply glossary terms to translation
 */
export function applyGlossary(text: string, targetLocale: string, glossaryData: GlossaryData): string {
  let result = text
  
  // Apply term replacements
  for (const [term, translations] of Object.entries(glossaryData.terms)) {
    if (translations[targetLocale]) {
      // Use word boundary regex for whole word matching
      const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi')
      result = result.replace(regex, translations[targetLocale])
    }
  }
  
  return result
}

/**
 * Extract preserve patterns from text (numbers, percentages, etc.)
 */
export function extractPreservePatterns(text: string, glossaryData: GlossaryData): Map<string, string> {
  const patterns = new Map<string, string>()
  
  glossaryData.preservePatterns.forEach((pattern, index) => {
    const regex = new RegExp(pattern, 'g')
    const matches = text.match(regex)
    
    if (matches) {
      matches.forEach((match, matchIndex) => {
        const placeholder = `__PRESERVE_${index}_${matchIndex}__`
        patterns.set(placeholder, match)
      })
    }
  })
  
  return patterns
}

/**
 * Replace preserve patterns with placeholders
 */
export function replaceWithPlaceholders(text: string, glossaryData: GlossaryData): [string, Map<string, string>] {
  const patterns = extractPreservePatterns(text, glossaryData)
  let result = text
  
  patterns.forEach((value, placeholder) => {
    result = result.replace(value, placeholder)
  })
  
  return [result, patterns]
}

/**
 * Restore preserve patterns from placeholders
 */
export function restorePlaceholders(text: string, patterns: Map<string, string>): string {
  let result = text
  
  patterns.forEach((value, placeholder) => {
    result = result.replace(new RegExp(placeholder, 'g'), value)
  })
  
  return result
}

/**
 * Get glossary instruction for AI
 */
export function getGlossaryInstruction(targetLocale: string, glossaryData: GlossaryData): string {
  const terms = Object.entries(glossaryData.terms)
    .filter(([_, translations]) => translations[targetLocale])
    .map(([term, translations]) => `"${term}" → "${translations[targetLocale]}"`)
    .slice(0, 20) // Limit to avoid token bloat
  
  if (terms.length === 0) return ''
  
  return `\n\nIMPORTANT GLOSSARY - Use these exact translations:\n${terms.join('\n')}`
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

