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

async function checkWeapons() {
  console.log('🔍 Checking weapons in Sanity...\n')

  try {
    // Count total weapons
    const count = await client.fetch<number>('count(*[_type == "weapon"])')
    console.log(`📊 Total weapons: ${count}`)

    // Count weapons with new data
    const newWeaponsCount = await client.fetch<number>('count(*[_type == "weapon" && element != null && damageType != null])')
    console.log(`✅ Weapons with new data: ${newWeaponsCount}`)

    // Find weapons without element or damageType (old weapons)
    const oldWeapons = await client.fetch<any[]>(`
      *[_type == "weapon" && (element == null || damageType == null)] {
        _id,
        name,
        slug,
        type,
        element,
        damageType
      }
    `)

    console.log(`⚠️  Old weapons without new data: ${oldWeapons.length}`)

    if (oldWeapons.length > 0) {
      console.log('\n🔍 Old weapons found:\n')
      oldWeapons.forEach((weapon, index) => {
        console.log(`${index + 1}. ${weapon.name.en} (${weapon.slug.current})`)
        console.log(`   ID: ${weapon._id}`)
        console.log(`   Type: ${weapon.type} | Element: ${weapon.element} | Damage: ${weapon.damageType}\n`)
      })
    } else {
      console.log('\n🎉 All weapons have the new data structure!')
    }

    // Show sample of weapons
    const sampleWeapons = await client.fetch<any[]>(`
      *[_type == "weapon"] | order(name.en asc) [0...5] {
        name,
        type,
        element,
        damageType
      }
    `)

    console.log('\n📋 Sample weapons (first 5):')
    sampleWeapons.forEach((weapon, index) => {
      console.log(`${index + 1}. ${weapon.name.en} - ${weapon.type} | ${weapon.element} | ${weapon.damageType}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkWeapons()

