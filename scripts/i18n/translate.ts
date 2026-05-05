#!/usr/bin/env node

import { createClient } from '@sanity/client'
import { i18nConfig, i18nDocTypes } from './config'
import { translate, translateBatch } from './translators'
import { generateHash, extractTranslatableContent, hasContentChanged } from './utils/hash'
import { clearOldCache } from './utils/cache'

const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const DOC_TYPE = process.argv.find(arg => arg.startsWith('--type='))?.split('=')[1]
const DOC_ID = process.argv.find(arg => arg.startsWith('--id='))?.split('=')[1]

interface TranslationStats {
  processed: number
  translated: number
  skipped: number
  errors: number
}

/**
 * Initialize Sanity client
 */
function getSanityClient() {
  return createClient({
    projectId: i18nConfig.sanityProjectId,
    dataset: i18nConfig.sanityDataset,
    token: i18nConfig.sanityToken,
    apiVersion: i18nConfig.sanityApiVersion,
    useCdn: false
  })
}

/**
 * Translate a single document
 */
async function translateDocument(
  client: any,
  doc: any,
  docType: string,
  stats: TranslationStats
): Promise<void> {
  try {
    console.log(`\n📄 Processing ${docType}: ${doc.name?.en || doc.title?.en || doc._id}`)
    
    // Check if translation is needed
    if (!FORCE && !hasContentChanged(doc, docType)) {
      const existingLocales = doc.autoTranslatedLocales || []
      const allLocalesPresent = i18nConfig.targetLocales.every(locale => 
        existingLocales.includes(locale)
      )
      
      if (allLocalesPresent) {
        console.log('  ⏭️  Skipped: No changes detected')
        stats.skipped++
        return
      }
    }
    
    // Prepare patches
    const patches: any = {}
    const translatedLocales: string[] = [...(doc.autoTranslatedLocales || [])]
    
    // Translate based on document type
    if (docType === 'character') {
      await translateCharacter(doc, patches, translatedLocales)
    } else if (docType === 'weapon') {
      await translateWeapon(doc, patches, translatedLocales)
    } else if (docType === 'guide') {
      await translateGuide(doc, patches, translatedLocales)
    }
    
    // Update hash
    const content = extractTranslatableContent(doc, docType)
    patches.translationHash = generateHash(content)
    patches.autoTranslatedLocales = Array.from(new Set(translatedLocales))
    
    // Apply patches
    if (!DRY_RUN) {
      await client
        .patch(doc._id)
        .set(patches)
        .commit()
      
      console.log('  ✅ Translation completed and saved')
    } else {
      console.log('  ✅ Translation completed (dry-run, not saved)')
      console.log('  Preview:', JSON.stringify(patches, null, 2).slice(0, 200) + '...')
    }
    
    stats.translated++
    
  } catch (error: any) {
    console.error(`  ❌ Error: ${error.message}`)
    stats.errors++
  }
  
  stats.processed++
}

/**
 * Translate character document
 */
async function translateCharacter(doc: any, patches: any, translatedLocales: string[]): Promise<void> {
  for (const locale of i18nConfig.targetLocales) {
    console.log(`  🌐 Translating to ${locale}...`)
    
    // Translate name
    if (doc.name?.en && !doc.name?.[locale]) {
      patches[`name.${locale}`] = await translate(doc.name.en, locale, { 
        context: 'Character name' 
      })
    }
    
    // Translate overview
    if (doc.overview?.en && !doc.overview?.[locale]) {
      patches[`overview.${locale}`] = await translate(doc.overview.en, locale, {
        context: 'Character overview/description'
      })
    }
    
    // Translate skills
    if (doc.skills && Array.isArray(doc.skills)) {
      for (let i = 0; i < doc.skills.length; i++) {
        const skill = doc.skills[i]
        
        if (skill.name?.en && !skill.name?.[locale]) {
          patches[`skills[${i}].name.${locale}`] = await translate(skill.name.en, locale, {
            context: 'Skill name'
          })
        }
        
        if (skill.description?.en && !skill.description?.[locale]) {
          patches[`skills[${i}].description.${locale}`] = await translate(skill.description.en, locale, {
            context: 'Skill description'
          })
        }
      }
    }
    
    // Translate pros
    if (doc.pros && Array.isArray(doc.pros)) {
      for (let i = 0; i < doc.pros.length; i++) {
        if (doc.pros[i].en && !doc.pros[i][locale]) {
          patches[`pros[${i}].${locale}`] = await translate(doc.pros[i].en, locale, {
            context: 'Character advantage'
          })
        }
      }
    }
    
    // Translate cons
    if (doc.cons && Array.isArray(doc.cons)) {
      for (let i = 0; i < doc.cons.length; i++) {
        if (doc.cons[i].en && !doc.cons[i][locale]) {
          patches[`cons[${i}].${locale}`] = await translate(doc.cons[i].en, locale, {
            context: 'Character disadvantage'
          })
        }
      }
    }
    
    // Translate synergy reasons
    if (doc.synergy && Array.isArray(doc.synergy)) {
      for (let i = 0; i < doc.synergy.length; i++) {
        if (doc.synergy[i].reason?.en && !doc.synergy[i].reason?.[locale]) {
          patches[`synergy[${i}].reason.${locale}`] = await translate(doc.synergy[i].reason.en, locale, {
            context: 'Team synergy explanation'
          })
        }
      }
    }
    
    translatedLocales.push(locale)
  }
}

/**
 * Translate weapon document
 */
async function translateWeapon(doc: any, patches: any, translatedLocales: string[]): Promise<void> {
  for (const locale of i18nConfig.targetLocales) {
    console.log(`  🌐 Translating to ${locale}...`)
    
    // Translate name
    if (doc.name?.en && !doc.name?.[locale]) {
      patches[`name.${locale}`] = await translate(doc.name.en, locale, {
        context: 'Weapon name'
      })
    }
    
    // Translate description
    if (doc.description?.en && !doc.description?.[locale]) {
      patches[`description.${locale}`] = await translate(doc.description.en, locale, {
        context: 'Weapon description'
      })
    }
    
    // Translate passive
    if (doc.passive?.en && !doc.passive?.[locale]) {
      patches[`passive.${locale}`] = await translate(doc.passive.en, locale, {
        context: 'Weapon passive effect'
      })
    }
    
    translatedLocales.push(locale)
  }
}

/**
 * Translate guide document
 */
async function translateGuide(doc: any, patches: any, translatedLocales: string[]): Promise<void> {
  for (const locale of i18nConfig.targetLocales) {
    console.log(`  🌐 Translating to ${locale}...`)
    
    // Translate title
    if (doc.title?.en && !doc.title?.[locale]) {
      patches[`title.${locale}`] = await translate(doc.title.en, locale, {
        context: 'Guide title'
      })
    }
    
    // Translate summary
    if (doc.summary?.en && !doc.summary?.[locale]) {
      patches[`summary.${locale}`] = await translate(doc.summary.en, locale, {
        context: 'Guide summary'
      })
    }
    
    // Note: Block content (content.en) requires special handling
    // For now, we'll skip it and handle it manually or in a separate process
    console.log('  ⚠️  Block content translation not yet implemented')
    
    translatedLocales.push(locale)
  }
}

/**
 * Main translation process
 */
async function main() {
  console.log('🚀 Starting i18n translation process')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Service: ${i18nConfig.translationService}`)
  console.log(`Target locales: ${i18nConfig.targetLocales.join(', ')}`)
  console.log('')
  
  // Clear old cache
  await clearOldCache()
  
  const client = getSanityClient()
  const stats: TranslationStats = {
    processed: 0,
    translated: 0,
    skipped: 0,
    errors: 0
  }
  
  // Determine document types to process
  const typesToProcess = DOC_TYPE 
    ? [DOC_TYPE]
    : i18nDocTypes
  
  // Process each document type
  for (const docType of typesToProcess) {
    console.log(`\n📚 Processing ${docType} documents...`)
    
    // Build query
    let query = `*[_type == "${docType}"`
    if (DOC_ID) {
      query += ` && _id == "${DOC_ID}"`
    }
    query += ']'
    
    const docs = await client.fetch(query)
    console.log(`Found ${docs.length} document(s)`)
    
    for (const doc of docs) {
      await translateDocument(client, doc, docType, stats)
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Translation Summary')
  console.log('='.repeat(50))
  console.log(`Processed: ${stats.processed}`)
  console.log(`Translated: ${stats.translated}`)
  console.log(`Skipped: ${stats.skipped}`)
  console.log(`Errors: ${stats.errors}`)
  console.log('')
  
  if (DRY_RUN) {
    console.log('ℹ️  This was a dry run. Run without --dry-run to apply changes.')
  }
  
  if (stats.errors > 0) {
    process.exit(1)
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})

