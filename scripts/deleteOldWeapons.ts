import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

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

async function deleteOldWeapons() {
  console.log('🗑️  Deleting old weapons without new data...\n')
  
  try {
    // Find weapons without element or damageType (old weapons)
    const oldWeapons = await client.fetch<any[]>(`
      *[_type == "weapon" && (element == null || damageType == null)] {
        _id,
        name,
        slug
      }
    `)
    
    if (oldWeapons.length === 0) {
      console.log('✅ No old weapons found. All weapons have new data structure.')
      return
    }
    
    console.log(`Found ${oldWeapons.length} old weapons to delete:\n`)
    oldWeapons.forEach((weapon, index) => {
      console.log(`${index + 1}. ${weapon.name.en} (${weapon._id})`)
    })
    
    console.log('\n🗑️  Deleting...\n')
    
    // Delete each weapon
    let successCount = 0
    let errorCount = 0
    
    for (const weapon of oldWeapons) {
      try {
        await client.delete(weapon._id)
        console.log(`   ✅ Deleted: ${weapon.name.en}`)
        successCount++
      } catch (error) {
        console.error(`   ❌ Failed to delete ${weapon.name.en}:`, error)
        errorCount++
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 DELETION SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successfully deleted: ${successCount} weapons`)
    console.log(`❌ Failed to delete: ${errorCount} weapons`)
    console.log('='.repeat(60))
    
    if (errorCount === 0) {
      console.log('\n🎉 All old weapons deleted successfully!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

deleteOldWeapons()

