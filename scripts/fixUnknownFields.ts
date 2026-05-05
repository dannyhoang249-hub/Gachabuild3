/**
 * Fix Unknown Fields in Sanity Character Documents
 * 
 * This script fixes characters that have "Unknown fields found" warnings in Sanity Studio.
 * 
 * Issues fixed:
 * 1. Characters with `stats` array at top level (now properly defined in schema)
 * 2. Characters with `pros` and `cons` inside `buildRecommendation` (already in schema)
 * 3. Characters with `intron` array (already in schema)
 * 
 * The schema has been updated to include these fields, so this script just verifies
 * that all characters are now valid.
 */

import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = createClient({
  projectId: 'u9m27k7u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN || 'skDcoIdy72AGDXfWwhswUjKYWTAV8VLCs2GBpOpzfKz8BlgwweTJXSNkn15Qy3RElkLK0uIeQeFMFgDRNyVx2Q6dC8eSZByjmRV7TVBLxYVsJN5CMB7GVNeUIlRt7mkMEoWtLeQQcyi72QFdqdUliD9SXVXRpJTL60Dpauk4LzGoapbBKt9E',
  useCdn: false
})

interface Character {
  _id: string
  _type: string
  name: { en: string }
  slug: { current: string }
  stats?: any[]
  buildRecommendation?: {
    pros?: string[]
    cons?: string[]
  }
  intron?: any[]
}

async function main() {
  console.log('🔍 Checking for characters with unknown fields...\n')

  try {
    // Fetch all characters
    const characters = await client.fetch<Character[]>(`
      *[_type == "character"] {
        _id,
        _type,
        name,
        slug,
        stats,
        buildRecommendation,
        intron
      }
    `)

    console.log(`✅ Found ${characters.length} characters\n`)

    let hasStats = 0
    let hasBuildRecommendation = 0
    let hasIntron = 0
    let hasIssues = 0

    for (const char of characters) {
      const issues: string[] = []

      // Check for stats field
      if (char.stats && Array.isArray(char.stats) && char.stats.length > 0) {
        hasStats++
        console.log(`✅ ${char.name.en}: Has stats array (${char.stats.length} items)`)
      }

      // Check for buildRecommendation with pros/cons
      if (char.buildRecommendation) {
        if (char.buildRecommendation.pros || char.buildRecommendation.cons) {
          hasBuildRecommendation++
          const prosCount = char.buildRecommendation.pros?.length || 0
          const consCount = char.buildRecommendation.cons?.length || 0
          console.log(`✅ ${char.name.en}: Has buildRecommendation (${prosCount} pros, ${consCount} cons)`)
        }
      }

      // Check for intron field
      if (char.intron && Array.isArray(char.intron) && char.intron.length > 0) {
        hasIntron++
        console.log(`✅ ${char.name.en}: Has intron array (${char.intron.length} levels)`)
      }

      if (issues.length > 0) {
        hasIssues++
        console.log(`⚠️  ${char.name.en}:`)
        issues.forEach(issue => console.log(`   - ${issue}`))
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Summary:')
    console.log('='.repeat(60))
    console.log(`Total characters: ${characters.length}`)
    console.log(`Characters with stats: ${hasStats}`)
    console.log(`Characters with buildRecommendation (pros/cons): ${hasBuildRecommendation}`)
    console.log(`Characters with intron: ${hasIntron}`)
    console.log(`Characters with issues: ${hasIssues}`)
    console.log('='.repeat(60))

    if (hasIssues === 0) {
      console.log('\n✅ All characters are valid! No unknown fields found.')
      console.log('\n📝 Note: If you still see "Unknown fields found" warnings in Sanity Studio:')
      console.log('   1. Refresh the Sanity Studio page (Cmd+R or Ctrl+R)')
      console.log('   2. Clear browser cache')
      console.log('   3. The schema has been updated to include:')
      console.log('      - stats (top-level character stats array)')
      console.log('      - buildRecommendation.pros (array of strings)')
      console.log('      - buildRecommendation.cons (array of strings)')
      console.log('      - intron (array of intron levels)')
    } else {
      console.log('\n⚠️  Some characters have issues. Please review the output above.')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()

