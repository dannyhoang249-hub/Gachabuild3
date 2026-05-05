#!/usr/bin/env node

/**
 * Upload script for individual files
 * 
 * Usage:
 *   npm run assets:upload -- --file=./path/to/image.jpg --doc-type=character --slug=test --asset-type=portrait
 *   npm run assets:upload -- --url=https://example.com/image.jpg --doc-type=character --slug=test --asset-type=portrait
 */

import { createClient } from '@sanity/client'
import { validateConfig, assetsConfig } from './config'
import { uploadFile, generateRemotePath } from './storage'
import { downloadFile } from './utils/download'
import path from 'path'

const args = process.argv.slice(2)

const FILE_PATH = args.find(arg => arg.startsWith('--file='))?.split('=')[1]
const FILE_URL = args.find(arg => arg.startsWith('--url='))?.split('=')[1]
const DOC_TYPE = args.find(arg => arg.startsWith('--doc-type='))?.split('=')[1]
const SLUG = args.find(arg => arg.startsWith('--slug='))?.split('=')[1]
const ASSET_TYPE = args.find(arg => arg.startsWith('--asset-type='))?.split('=')[1] // portrait, splash, image, cover
const DOC_ID = args.find(arg => arg.startsWith('--id='))?.split('=')[1]

async function main() {
  console.log('🚀 Starting asset upload')
  
  // Validate config
  validateConfig()
  
  // Validate arguments
  if (!FILE_PATH && !FILE_URL) {
    throw new Error('Either --file or --url must be provided')
  }
  
  if (!DOC_TYPE || !ASSET_TYPE) {
    throw new Error('--doc-type and --asset-type are required')
  }
  
  if (!SLUG && !DOC_ID) {
    throw new Error('Either --slug or --id must be provided')
  }
  
  // Initialize Sanity client
  const client = createClient({
    projectId: assetsConfig.sanityProjectId,
    dataset: assetsConfig.sanityDataset,
    token: assetsConfig.sanityToken,
    apiVersion: assetsConfig.sanityApiVersion,
    useCdn: false
  })
  
  // Get document
  let doc: any
  if (DOC_ID) {
    doc = await client.getDocument(DOC_ID)
  } else {
    const results = await client.fetch(`*[_type == "${DOC_TYPE}" && slug.current == "${SLUG}"][0]`)
    doc = results
  }
  
  if (!doc) {
    throw new Error(`Document not found: ${DOC_TYPE}/${SLUG || DOC_ID}`)
  }
  
  console.log(`📄 Document: ${doc.name?.en || doc.title?.en || doc._id}`)
  
  // Get local file path
  let localPath: string
  if (FILE_PATH) {
    localPath = FILE_PATH
  } else {
    console.log(`📥 Downloading from URL: ${FILE_URL}`)
    const filename = path.basename(FILE_URL!)
    localPath = await downloadFile(FILE_URL!, filename)
  }
  
  console.log(`📁 Local file: ${localPath}`)
  
  // Generate remote path
  const filename = path.basename(localPath)
  const remotePath = generateRemotePath(DOC_TYPE, doc.slug.current, ASSET_TYPE, filename)
  
  console.log(`☁️  Remote path: ${remotePath}`)
  
  // Upload
  console.log(`⬆️  Uploading to ${assetsConfig.provider.toUpperCase()}...`)
  const cdnUrl = await uploadFile(localPath, remotePath)
  
  console.log(`✅ Upload successful: ${cdnUrl}`)
  
  // Update Sanity document
  const cdnFieldMap: Record<string, string> = {
    'portrait': 'portraitCdn',
    'splash': 'splashCdn',
    'image': 'imageCdn',
    'cover': 'coverCdn'
  }
  
  const cdnField = cdnFieldMap[ASSET_TYPE]
  if (!cdnField) {
    console.warn(`⚠️  Unknown asset type: ${ASSET_TYPE}, skipping Sanity update`)
  } else {
    console.log(`💾 Updating Sanity document...`)
    
    await client
      .patch(doc._id)
      .set({
        [`${cdnField}.cdnUrl`]: cdnUrl,
        [`${cdnField}.originalUrl`]: FILE_URL || null,
        [`${cdnField}.localFile`]: FILE_PATH || null
      })
      .commit()
    
    console.log(`✅ Document updated`)
  }
  
  console.log('\n🎉 Upload complete!')
}

main().catch(error => {
  console.error('❌ Upload failed:', error)
  process.exit(1)
})

