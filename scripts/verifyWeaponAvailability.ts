#!/usr/bin/env ts-node
/**
 * Verify Weapon Availability Script
 * Compares local weapon markdown files with Sanity CMS to find missing weapons
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { parseWeaponMD } from './parseWeaponMD'
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

interface WeaponComparison {
  name: string
  slug: string
  inLocal: boolean
  inSanity: boolean
  localFile?: string
  hasImage: boolean
  imagePath?: string
}

/**
 * Get all weapons from Sanity
 */
async function getSanityWeapons(): Promise<Set<string>> {
  try {
    const weapons = await client.fetch<any[]>(`
      *[_type == "weapon"] {
        slug
      }
    `)
    return new Set(weapons.map(w => w.slug.current))
  } catch (error) {
    console.error('❌ Error fetching weapons from Sanity:', error)
    return new Set()
  }
}

/**
 * Get all weapons from local markdown files
 */
function getLocalWeapons(weaponDir: string): Map<string, { name: string, file: string }> {
  const weaponMap = new Map<string, { name: string, file: string }>()
  
  const files = fs.readdirSync(weaponDir)
    .filter(file => file.endsWith('.md') && file.includes('batch'))
  
  for (const file of files) {
    const filePath = path.join(weaponDir, file)
    try {
      const weapons = parseWeaponMD(filePath)
      for (const weapon of weapons) {
        weaponMap.set(weapon.slug, { name: weapon.name, file })
      }
    } catch (error) {
      console.error(`⚠️  Error parsing ${file}:`, error)
    }
  }
  
  return weaponMap
}

/**
 * Convert weapon name to image filename
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
 * Check if weapon image exists (handles variations in naming)
 */
function checkImageExists(weaponName: string, imageDir: string, verbose: boolean = false): { exists: boolean, path?: string, attempts?: string[] } {
  const baseName = getImageFileName(weaponName)
  const attempts: string[] = []

  // Try exact match first
  let imagePath = path.join(imageDir, `${baseName}.png`)
  attempts.push(`${baseName}.png`)
  if (fs.existsSync(imagePath)) {
    if (verbose) console.log(`   ✅ Found exact match: ${baseName}.png`)
    return { exists: true, path: imagePath, attempts }
  }

  // Try with 's' suffix (for plurals like "apocalypses")
  imagePath = path.join(imageDir, `${baseName}s.png`)
  attempts.push(`${baseName}s.png`)
  if (fs.existsSync(imagePath)) {
    if (verbose) console.log(`   ✅ Found plural match: ${baseName}s.png`)
    return { exists: true, path: imagePath, attempts }
  }

  // Try without last 's' (in case we added one)
  if (baseName.endsWith('s')) {
    imagePath = path.join(imageDir, `${baseName.slice(0, -1)}.png`)
    attempts.push(`${baseName.slice(0, -1)}.png`)
    if (fs.existsSync(imagePath)) {
      if (verbose) console.log(`   ✅ Found singular match: ${baseName.slice(0, -1)}.png`)
      return { exists: true, path: imagePath, attempts }
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
        attempts.push(`${file} (fuzzy)`)
        if (verbose) console.log(`   ✅ Found fuzzy match: ${file}`)
        return { exists: true, path: path.join(imageDir, file), attempts }
      }
    }
  } catch (error) {
    if (verbose) console.log(`   ⚠️  Error reading directory: ${error}`)
  }

  if (verbose) {
    console.log(`   ❌ No image found for "${weaponName}". Tried:`)
    attempts.forEach(a => console.log(`      - ${a}`))
  }

  return {
    exists: false,
    path: path.join(imageDir, `${baseName}.png`),
    attempts
  }
}

/**
 * Main verification function
 */
async function verifyWeaponAvailability() {
  console.log('🔍 Verifying Weapon Availability\n')
  console.log('=' .repeat(60))
  
  // Paths
  const weaponDir = path.join(process.cwd(), 'data/game-content', 'Weapon_Update')
  const imageDir = path.join(weaponDir, 'Weapon_update_PNG')
  
  // Check if directories exist
  if (!fs.existsSync(weaponDir)) {
    console.error(`❌ Weapon directory not found: ${weaponDir}`)
    return
  }
  
  if (!fs.existsSync(imageDir)) {
    console.error(`❌ Image directory not found: ${imageDir}`)
    return
  }
  
  console.log(`📁 Weapon Directory: ${weaponDir}`)
  console.log(`🖼️  Image Directory: ${imageDir}\n`)
  
  // Get weapons from both sources
  console.log('📊 Fetching data...')
  const sanityWeapons = await getSanityWeapons()
  const localWeapons = getLocalWeapons(weaponDir)
  
  console.log(`✅ Found ${sanityWeapons.size} weapons in Sanity CMS`)
  console.log(`✅ Found ${localWeapons.size} weapons in local files\n`)
  console.log('=' .repeat(60))
  
  // Compare and find missing weapons
  const missingInSanity: WeaponComparison[] = []
  const existingInBoth: WeaponComparison[] = []
  const missingImages: WeaponComparison[] = []
  
  for (const [slug, { name, file }] of localWeapons.entries()) {
    const inSanity = sanityWeapons.has(slug)
    const imageCheck = checkImageExists(name, imageDir)
    
    const comparison: WeaponComparison = {
      name,
      slug,
      inLocal: true,
      inSanity,
      localFile: file,
      hasImage: imageCheck.exists,
      imagePath: imageCheck.path
    }
    
    if (!inSanity) {
      missingInSanity.push(comparison)
    } else {
      existingInBoth.push(comparison)
    }
    
    if (!imageCheck.exists) {
      missingImages.push(comparison)
    }
  }
  
  // Report results
  console.log('\n📋 VERIFICATION RESULTS\n')
  console.log('=' .repeat(60))
  
  if (missingInSanity.length === 0) {
    console.log('✅ All local weapons are present in Sanity CMS!')
  } else {
    console.log(`⚠️  Found ${missingInSanity.length} weapons missing from Sanity CMS:\n`)
    missingInSanity.forEach((weapon, index) => {
      console.log(`${index + 1}. ${weapon.name}`)
      console.log(`   Slug: ${weapon.slug}`)
      console.log(`   File: ${weapon.localFile}`)
      console.log(`   Image: ${weapon.hasImage ? '✅ Available' : '❌ Missing'}`)
      if (weapon.hasImage && weapon.imagePath) {
        console.log(`   Image Path: ${weapon.imagePath}`)
      }
      console.log()
    })
  }
  
  console.log('=' .repeat(60))
  
  if (missingImages.length > 0) {
    console.log(`\n⚠️  Found ${missingImages.length} weapons with missing images:\n`)
    missingImages.forEach((weapon, index) => {
      console.log(`${index + 1}. ${weapon.name} (${weapon.slug})`)
      console.log(`   Expected: ${weapon.imagePath}`)
      console.log()
    })
    console.log('=' .repeat(60))
  }
  
  // Summary
  console.log('\n📊 SUMMARY\n')
  console.log('=' .repeat(60))
  console.log(`Total weapons in local files: ${localWeapons.size}`)
  console.log(`Total weapons in Sanity CMS: ${sanityWeapons.size}`)
  console.log(`Weapons in both: ${existingInBoth.length}`)
  console.log(`Missing from Sanity: ${missingInSanity.length}`)
  console.log(`Missing images: ${missingImages.length}`)
  console.log('=' .repeat(60))
  
  // Return results for potential upload
  return {
    missingInSanity,
    missingImages,
    totalLocal: localWeapons.size,
    totalSanity: sanityWeapons.size
  }
}

// Run verification
verifyWeaponAvailability()
  .then((results) => {
    if (results && results.missingInSanity.length > 0) {
      console.log('\n💡 To upload missing weapons, run:')
      console.log('   npm run import:weapons')
    }
  })
  .catch(error => {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  })

