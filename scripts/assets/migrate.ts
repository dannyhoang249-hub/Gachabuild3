#!/usr/bin/env node

/**
 * Asset migration script
 * 
 * Migrates existing images from Sanity assets or URLs to R2/B2 storage
 * 
 * Usage:
 *   npm run assets:migrate                    # Migrate all
 *   npm run assets:migrate -- --dry-run       # Preview without changes
 *   npm run assets:migrate -- --type=character  # Migrate specific type
 *   npm run assets:migrate -- --id=xxx        # Migrate specific document
 */

import { createClient } from '@sanity/client'
import { validateConfig, assetsConfig } from './config'
import { uploadFile, generateRemotePath, checkFileExists } from './storage'
import { downloadSanityAsset, downloadFile, cleanupTemp } from './utils/download'
import path from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const DOC_TYPE = process.argv.find(arg => arg.startsWith('--type='))?.split('=')[1]
const DOC_ID = process.argv.find(arg => arg.startsWith('--id='))?.split('=')[1]

interface MigrationStats {
  processed: number
  migrated: number
  skipped: number
  errors: number
}

const stats: MigrationStats = {
  processed: 0,
  migrated: 0,
  skipped: 0,
  errors: 0
}

/**
 * Migrate a single asset
 */
async function migrateAsset(
  client: any,
  doc: any,
  docType: string,
  assetField: string,
  cdnField: string
): Promise<void> {
  try {
    const asset = doc[assetField]
    const cdn = doc[cdnField]
    
    // Skip if already migrated (unless force)
    if (!FORCE && cdn?.cdnUrl) {
      console.log(`  ⏭️  ${assetField}: Already migrated`)
      stats.skipped++
      return
    }
    
    // Skip if no asset
    if (!asset) {
      console.log(`  ⏭️  ${assetField}: No asset`)
      stats.skipped++
      return
    }
    
    let localPath: string
    let originalUrl: string | null = null
    
    // Download asset
    if (asset.asset) {
      // Sanity asset
      console.log(`  📥 ${assetField}: Downloading from Sanity...`)
      localPath = await downloadSanityAsset(asset)
    } else if (typeof asset === 'string') {
      // URL string
      console.log(`  📥 ${assetField}: Downloading from URL...`)
      originalUrl = asset
      const filename = path.basename(asset)
      localPath = await downloadFile(asset, filename)
    } else {
      console.log(`  ⚠️  ${assetField}: Unknown asset type`)
      stats.skipped++
      return
    }
    
    // Generate remote path
    const filename = path.basename(localPath)
    const remotePath = generateRemotePath(docType, doc.slug.current, assetField, filename)
    
    // Check if already exists in storage
    if (!FORCE) {
      const exists = await checkFileExists(remotePath)
      if (exists) {
        console.log(`  ⏭️  ${assetField}: Already exists in storage`)
        stats.skipped++
        return
      }
    }
    
    // Upload
    console.log(`  ⬆️  ${assetField}: Uploading to ${assetsConfig.provider.toUpperCase()}...`)
    const cdnUrl = await uploadFile(localPath, remotePath)
    
    console.log(`  ✅ ${assetField}: ${cdnUrl}`)
    
    // Update document
    if (!DRY_RUN) {
      await client
        .patch(doc._id)
        .set({
          [`${cdnField}.cdnUrl`]: cdnUrl,
          [`${cdnField}.originalUrl`]: originalUrl,
          [`${cdnField}.localFile`]: null
        })
        .commit()
    }
    
    stats.migrated++
    
  } catch (error: any) {
    console.error(`  ❌ ${assetField}: ${error.message}`)
    stats.errors++
  }
}

/**
 * Migrate document assets
 */
async function migrateDocument(client: any, doc: any, docType: string): Promise<void> {
  console.log(`\n📄 ${doc.name?.en || doc.title?.en || doc._id}`)
  stats.processed++
  
  if (docType === 'character') {
    await migrateAsset(client, doc, docType, 'image', 'portraitCdn')
    await migrateAsset(client, doc, docType, 'splash', 'splashCdn')
  } else if (docType === 'weapon') {
    await migrateAsset(client, doc, docType, 'image', 'imageCdn')
  } else if (docType === 'guide') {
    await migrateAsset(client, doc, docType, 'coverImage', 'coverCdn')
  }
}

/**
 * Main migration process
 */
async function main() {
  console.log('🚀 Starting asset migration')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Storage: ${assetsConfig.provider.toUpperCase()}`)
  console.log('')
  
  // Validate config
  validateConfig()
  
  // Initialize Sanity client
  const client = createClient({
    projectId: assetsConfig.sanityProjectId,
    dataset: assetsConfig.sanityDataset,
    token: assetsConfig.sanityToken,
    apiVersion: assetsConfig.sanityApiVersion,
    useCdn: false
  })
  
  // Determine document types to process
  const typesToProcess = DOC_TYPE 
    ? [DOC_TYPE]
    : ['character', 'weapon', 'guide']
  
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
    
    // Process with concurrency limit
    for (let i = 0; i < docs.length; i += assetsConfig.maxConcurrent) {
      const batch = docs.slice(i, i + assetsConfig.maxConcurrent)
      await Promise.all(
        batch.map((doc: any) => migrateDocument(client, doc, docType))
      )
    }
  }
  
  // Cleanup
  await cleanupTemp()
  
  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary')
  console.log('='.repeat(50))
  console.log(`Documents: ${stats.processed}`)
  console.log(`Migrated: ${stats.migrated}`)
  console.log(`Skipped: ${stats.skipped}`)
  console.log(`Errors: ${stats.errors}`)
  console.log('')
  
  if (DRY_RUN) {
    console.log('ℹ️  This was a dry run. Run without --dry-run to apply changes.')
  }
  
  if (stats.errors > 0) {
    console.log('⚠️  Some assets failed to migrate. Check logs above.')
    process.exit(1)
  }
  
  console.log('🎉 Migration complete!')
}

main().catch(error => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})

