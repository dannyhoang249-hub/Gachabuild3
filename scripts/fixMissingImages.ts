#!/usr/bin/env ts-node
/**
 * Fix Missing Images in Sanity CMS
 * Uploads missing images for weapons and characters
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

/**
 * Upload image to Sanity and return image reference
 */
async function uploadImage(imagePath: string, title: string): Promise<any> {
  if (!fs.existsSync(imagePath)) {
    console.error(`   ❌ Image file not found: ${imagePath}`)
    return null
  }

  try {
    console.log(`   📤 Uploading: ${path.basename(imagePath)}`)
    const imageBuffer = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
      title: title
    })
    
    console.log(`   ✅ Uploaded successfully (ID: ${asset._id})`)
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    }
  } catch (error) {
    console.error(`   ❌ Failed to upload:`, error)
    return null
  }
}

/**
 * Update weapon with image
 */
async function updateWeaponImage(weaponId: string, weaponName: string, imagePath: string): Promise<boolean> {
  console.log(`\n🔧 Updating weapon: ${weaponName}`)
  console.log(`   ID: ${weaponId}`)
  console.log(`   Image: ${imagePath}`)
  
  const imageAsset = await uploadImage(imagePath, weaponName)
  if (!imageAsset) {
    return false
  }
  
  try {
    await client.patch(weaponId).set({ image: imageAsset }).commit()
    console.log(`   ✅ Weapon updated successfully`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed to update weapon:`, error)
    return false
  }
}

/**
 * Update character with image
 */
async function updateCharacterImage(characterId: string, characterName: string, imagePath: string): Promise<boolean> {
  console.log(`\n🔧 Updating character: ${characterName}`)
  console.log(`   ID: ${characterId}`)
  console.log(`   Image: ${imagePath}`)
  
  const imageAsset = await uploadImage(imagePath, characterName)
  if (!imageAsset) {
    return false
  }
  
  try {
    await client.patch(characterId).set({ image: imageAsset }).commit()
    console.log(`   ✅ Character updated successfully`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed to update character:`, error)
    return false
  }
}

/**
 * Find image file with fuzzy matching
 */
function findImageFile(baseName: string, directory: string, extensions: string[] = ['.png', '.jpg', '.jpeg']): string | null {
  // Try exact match first
  for (const ext of extensions) {
    const exactPath = path.join(directory, `${baseName}${ext}`)
    if (fs.existsSync(exactPath)) {
      return exactPath
    }
  }
  
  // Try case-insensitive match
  try {
    const files = fs.readdirSync(directory)
    const normalizedBase = baseName.toLowerCase()
    
    for (const file of files) {
      const fileBase = path.basename(file, path.extname(file)).toLowerCase()
      if (fileBase === normalizedBase) {
        return path.join(directory, file)
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return null
}

/**
 * Main fix function
 */
async function fixMissingImages() {
  console.log('🔧 Fixing Missing Images in Sanity CMS\n')
  console.log('='.repeat(80))
  
  const workspaceRoot = process.cwd()
  const weaponImageDir = path.join(workspaceRoot, 'Character_content_update', 'Weapon_Update', 'Weapon_update_PNG')
  const characterImageDir = path.join(workspaceRoot, 'Character_content_update', 'PNG')
  
  let successCount = 0
  let failCount = 0
  
  // Fix Siren's Kiss weapon
  console.log('\n📦 WEAPONS\n')
  const sirenImagePath = findImageFile('siren_kiss', weaponImageDir)
  if (sirenImagePath) {
    const success = await updateWeaponImage('weapon.sirens-kiss', "Siren's Kiss", sirenImagePath)
    if (success) successCount++
    else failCount++
  } else {
    console.log('\n❌ Siren\'s Kiss image not found in:', weaponImageDir)
    failCount++
  }
  
  // Fix Zhiliu character
  console.log('\n\n👤 CHARACTERS\n')
  const zhiliuImagePath = findImageFile('zhiliu', characterImageDir)
  if (zhiliuImagePath) {
    const success = await updateCharacterImage('character.zhiliu', 'Zhiliu', zhiliuImagePath)
    if (success) successCount++
    else failCount++
  } else {
    console.log('\n❌ Zhiliu image not found in:', characterImageDir)
    failCount++
  }
  
  // Fix Outsider character
  const outsiderImagePath = findImageFile('outsider', characterImageDir)
  if (outsiderImagePath) {
    const success = await updateCharacterImage('character.outsider', 'Outsider', outsiderImagePath)
    if (success) successCount++
    else failCount++
  } else {
    console.log('\n❌ Outsider image not found in:', characterImageDir)
    failCount++
  }
  
  // Summary
  console.log('\n' + '='.repeat(80))
  console.log('📊 SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Successfully updated: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('='.repeat(80))
  
  if (failCount === 0) {
    console.log('\n🎉 All missing images have been fixed!')
  } else {
    console.log('\n⚠️  Some images could not be fixed. Check the errors above.')
  }
}

fixMissingImages().catch(console.error)

