#!/usr/bin/env ts-node
/**
 * Weapon Import Script (from Markdown)
 * Imports weapons from markdown files to Sanity CMS
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { parseWeaponMD, ParsedWeapon } from './parseWeaponMD'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

/**
 * Convert weapon name to image filename
 * Handles apostrophes and special characters
 */
function getImageFileName(weaponName: string): string {
  return weaponName
    .toLowerCase()
    .replace(/'s\s+/g, '_') // Replace "'s " with "_" (e.g., "Dreamweaver's Feather" -> "dreamweaver_feather")
    .replace(/'/g, '') // Remove remaining apostrophes
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, '') // Remove special characters
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
}

/**
 * Find image file for weapon (handles variations in naming)
 */
function findWeaponImage(weaponName: string, imageDir: string): string | null {
  const baseName = getImageFileName(weaponName)

  // Try exact match first
  let imagePath = path.join(imageDir, `${baseName}.png`)
  if (fs.existsSync(imagePath)) {
    return imagePath
  }

  // Try with 's' suffix (for plurals like "apocalypses")
  imagePath = path.join(imageDir, `${baseName}s.png`)
  if (fs.existsSync(imagePath)) {
    return imagePath
  }

  // Try without last 's' (in case we added one)
  if (baseName.endsWith('s')) {
    imagePath = path.join(imageDir, `${baseName.slice(0, -1)}.png`)
    if (fs.existsSync(imagePath)) {
      return imagePath
    }
  }

  // List all files and try fuzzy match
  try {
    const files = fs.readdirSync(imageDir)
    const normalizedName = baseName.replace(/_/g, '')

    for (const file of files) {
      if (!file.endsWith('.png')) continue
      const normalizedFile = file.replace(/\.png$/, '').replace(/_/g, '')
      if (normalizedFile === normalizedName) {
        return path.join(imageDir, file)
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return null
}

/**
 * Upload image to Sanity
 */
async function uploadImage(imagePath: string, weaponName: string): Promise<any> {
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️  Image not found: ${imagePath}`)
    return null
  }

  try {
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
      title: weaponName
    })
    
    console.log(`   ✅ Uploaded image: ${weaponName}`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    }
  } catch (error) {
    console.error(`   ❌ Failed to upload image for ${weaponName}:`, error)
    return null
  }
}

/**
 * Create Sanity document from parsed weapon
 */
async function createWeaponDocument(weapon: ParsedWeapon, imageDir: string): Promise<boolean> {
  const documentId = `weapon.${weapon.slug}`

  // Find and upload image
  const imagePath = findWeaponImage(weapon.name, imageDir)
  const imageAsset = imagePath ? await uploadImage(imagePath, weapon.name) : null
  
  // Create document
  const document = {
    _id: documentId,
    _type: 'weapon',
    name: {
      en: weapon.name,
      vi: '', // To be translated manually
      jp: '',
      zh: ''
    },
    slug: {
      _type: 'slug',
      current: weapon.slug
    },
    category: weapon.category,
    type: weapon.weaponType,
    element: weapon.element,
    damageType: weapon.damageType,
    description: {
      en: '', // To be filled manually
      vi: '',
      jp: '',
      zh: ''
    },
    refinementSkill: {
      description: {
        en: weapon.refinementSkill.description,
        vi: '',
        jp: '',
        zh: ''
      },
      r1: weapon.refinementSkill.r1,
      r2: weapon.refinementSkill.r2,
      r3: weapon.refinementSkill.r3,
      r4: weapon.refinementSkill.r4,
      r5: weapon.refinementSkill.r5,
      r6: weapon.refinementSkill.r6
    },
    baseStats: weapon.baseStats,
    motionValues: weapon.motionValues,
    image: imageAsset,
    recommendedCharacters: [],
    i18nReadyLocales: ['en']
  }
  
  try {
    await client.createOrReplace(document)
    console.log(`   ✅ Imported: ${weapon.name} (${weapon.slug})`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed to import ${weapon.name}:`, error)
    return false
  }
}

/**
 * Main import function
 */
async function importWeapons() {
  console.log('🚀 Starting weapon import from Markdown files...\n')
  
  // Verify Sanity credentials
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
  if (!projectId || !process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing Sanity credentials!')
    console.error('Please set SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local')
    process.exit(1)
  }
  
  const weaponDir = path.join(process.cwd(), 'character_content_update', 'weapon_update')
  const imageDir = path.join(weaponDir, 'Weapon_update_PNG')
  
  // Verify directories exist
  if (!fs.existsSync(weaponDir)) {
    console.error(`❌ Weapon directory not found: ${weaponDir}`)
    process.exit(1)
  }
  
  if (!fs.existsSync(imageDir)) {
    console.error(`❌ Image directory not found: ${imageDir}`)
    process.exit(1)
  }
  
  // Get all weapon batch files
  const files = fs.readdirSync(weaponDir)
    .filter(file => file.startsWith('weapon') && file.endsWith('.md'))
    .sort()
  
  console.log(`📁 Found ${files.length} weapon batch files\n`)
  
  let totalWeapons = 0
  let successCount = 0
  let errorCount = 0
  
  for (const file of files) {
    const filePath = path.join(weaponDir, file)
    console.log(`\n📄 Processing: ${file}`)
    
    try {
      const weapons = parseWeaponMD(filePath)
      console.log(`   Found ${weapons.length} weapons`)
      
      for (const weapon of weapons) {
        totalWeapons++
        const success = await createWeaponDocument(weapon, imageDir)
        if (success) {
          successCount++
        } else {
          errorCount++
        }
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error)
      errorCount++
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 IMPORT SUMMARY')
  console.log('='.repeat(60))
  console.log(`✅ Successfully imported: ${successCount} weapons`)
  console.log(`❌ Failed to import: ${errorCount} weapons`)
  console.log(`📁 Total processed: ${totalWeapons} weapons`)
  console.log('='.repeat(60))
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some weapons failed to import. Check the errors above.')
  } else {
    console.log('\n🎉 All weapons imported successfully!')
  }
}

// Run import
if (require.main === module) {
  importWeapons()
    .then(() => {
      console.log('\n✅ Import process completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Import failed:', error)
      process.exit(1)
    })
}

export { importWeapons }

