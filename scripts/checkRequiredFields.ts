/**
 * Check Required Fields in Sanity Character Documents
 * 
 * This script checks if all characters have the required fields to display on the frontend.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'u9m27k7u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skDcoIdy72AGDXfWwhswUjKYWTAV8VLCs2GBpOpzfKz8BlgwweTJXSNkn15Qy3RElkLK0uIeQeFMFgDRNyVx2Q6dC8eSZByjmRV7TVBLxYVsJN5CMB7GVNeUIlRt7mkMEoWtLeQQcyi72QFdqdUliD9SXVXRpJTL60Dpauk4LzGoapbBKt9E',
  useCdn: false
})

interface Character {
  _id: string
  name?: { en?: string }
  slug?: { current?: string }
  role?: string
  weapon?: string
  rarity?: string
  element?: string
  image?: any
}

async function main() {
  console.log('🔍 Checking required fields for all characters...\n')

  try {
    const characters = await client.fetch<Character[]>(`
      *[_type == "character"] {
        _id,
        name,
        slug,
        role,
        weapon,
        rarity,
        element,
        image
      }
    `)

    console.log(`✅ Found ${characters.length} characters\n`)

    const requiredFields = ['name.en', 'slug.current', 'role', 'weapon', 'rarity', 'element', 'image']
    let validCount = 0
    let invalidCount = 0

    for (const char of characters) {
      const missing: string[] = []

      if (!char.name?.en) missing.push('name.en')
      if (!char.slug?.current) missing.push('slug.current')
      if (!char.role) missing.push('role')
      if (!char.weapon) missing.push('weapon')
      if (!char.rarity) missing.push('rarity')
      if (!char.element) missing.push('element')
      if (!char.image) missing.push('image')

      if (missing.length > 0) {
        invalidCount++
        console.log(`❌ ${char.name?.en || 'Unknown'} (${char._id}):`)
        console.log(`   Missing: ${missing.join(', ')}`)
        console.log('')
      } else {
        validCount++
        console.log(`✅ ${char.name.en} - All required fields present`)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Summary:')
    console.log('='.repeat(60))
    console.log(`Total characters: ${characters.length}`)
    console.log(`Valid characters: ${validCount}`)
    console.log(`Invalid characters: ${invalidCount}`)
    console.log('='.repeat(60))

    if (invalidCount === 0) {
      console.log('\n✅ All characters have required fields!')
      console.log('   They should all appear on the frontend.')
    } else {
      console.log(`\n⚠️  ${invalidCount} character(s) are missing required fields.`)
      console.log('   These characters may not appear on the frontend.')
      console.log('\n📝 To fix:')
      console.log('   1. Open Sanity Studio: http://localhost:3333')
      console.log('   2. Edit the characters listed above')
      console.log('   3. Fill in the missing required fields')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()

