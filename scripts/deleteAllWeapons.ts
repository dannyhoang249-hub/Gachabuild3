#!/usr/bin/env ts-node

import { createClient } from '@sanity/client'

// Create a client for data operations
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Required for write operations
})

interface WeaponInfo {
  _id: string
  name: {
    en: string
    vi: string
  }
  slug: {
    _type: 'slug'
    current: string
  }
  type: string
}

async function deleteAllWeapons(dryRun: boolean = true) {
  try {
    console.log(`🔍 ${dryRun ? 'DRY RUN: Would delete' : 'Deleting'} all weapons...\n`)
    
    // Get all weapons
    const weapons = await sanityClient.fetch(`
      *[_type == 'weapon'] | order(name.en asc) {
        _id,
        name,
        slug,
        type
      }
    `)

    if (weapons.length === 0) {
      console.log('🎉 No weapons found in the database!')
      return
    }

    console.log(`Found ${weapons.length} weapons to delete:\n`)
    
    // Show all weapons that will be deleted
    weapons.forEach((weapon: WeaponInfo, index: number) => {
      console.log(`${index + 1}. ${weapon.name?.en || 'Unknown'} (${weapon.slug?.current || 'no-slug'}) - ${weapon.type || 'Unknown Type'}`)
    })
    
    console.log('')
    
    let successCount = 0
    let errorCount = 0
    
    // Delete each weapon
    for (const weapon of weapons) {
      try {
        console.log(`${dryRun ? '🗑️  Would delete' : '🗑️  Deleting'}: ${weapon.name?.en || 'Unknown'} (${weapon.slug?.current || 'no-slug'})`)
        
        if (!dryRun) {
          // Actually delete the weapon
          await sanityClient.delete(weapon._id)
          console.log(`   ✅ Deleted successfully`)
          successCount++
        } else {
          console.log(`   🔍 Would be deleted (dry run mode)`)
        }
        
      } catch (error) {
        console.error(`   ❌ Error ${dryRun ? 'checking' : 'deleting'} weapon ${weapon._id}:`, error)
        errorCount++
      }
    }
    
    // Summary
    console.log('\n📊 Deletion Summary:')
    if (dryRun) {
      console.log(`🔍 Would delete: ${weapons.length} weapons`)
      console.log('\n💡 This was a dry run. To actually delete these weapons, run:')
      console.log('   npm run delete-all-weapons -- --execute')
    } else {
      console.log(`✅ Successfully deleted: ${successCount} weapons`)
      console.log(`❌ Failed to delete: ${errorCount} weapons`)
      console.log(`📁 Total processed: ${weapons.length} weapons`)
      
      if (errorCount > 0) {
        console.log('\n⚠️  Some weapons failed to delete. Check the errors above.')
      } else {
        console.log('\n🎉 All weapons deleted successfully!')
      }
    }
    
  } catch (error) {
    console.error('❌ Error deleting weapons:', error)
    throw error
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2)
  const isDryRun = !args.includes('--execute')
  
  if (isDryRun) {
    console.log('🔍 Running in DRY RUN mode. Use --execute to actually delete weapons.\n')
  } else {
    console.log('⚠️  EXECUTION MODE: Weapons will be permanently deleted!\n')
  }
  
  try {
    await deleteAllWeapons(isDryRun)
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

// Run the script if executed directly
if (require.main === module) {
  main()
}

export { deleteAllWeapons }
