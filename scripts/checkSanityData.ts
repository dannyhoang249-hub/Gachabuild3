#!/usr/bin/env ts-node
/**
 * Check Sanity Data - Characters and Weapons
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

async function checkData() {
  console.log('🔍 Checking Sanity CMS Data\n')
  console.log('='.repeat(80))
  
  // Check for Zhiliu and Outsider
  console.log('\n📋 Checking for Zhiliu and Outsider characters...\n')
  const targetChars = await client.fetch<any[]>(`
    *[_type == 'character' && (name.en match 'Zhiliu' || name.en match 'Outsider')] {
      _id,
      'name': name.en,
      slug,
      element,
      role,
      'hasImage': defined(image.asset._ref)
    }
  `)
  
  if (targetChars.length > 0) {
    console.log(`✅ Found ${targetChars.length} matching characters:`)
    targetChars.forEach(c => {
      console.log(`  - ${c.name} (${c.slug.current})`)
      console.log(`    Element: ${c.element || 'N/A'}, Role: ${c.role || 'N/A'}`)
      console.log(`    Image: ${c.hasImage ? '✅' : '❌ Missing'}`)
    })
  } else {
    console.log('❌ Zhiliu and Outsider NOT found in Sanity')
  }
  
  // List all characters
  console.log('\n📋 All Characters in Sanity:\n')
  const allChars = await client.fetch<any[]>(`
    *[_type == 'character'] | order(name.en asc) {
      'name': name.en,
      slug,
      element,
      'hasImage': defined(image.asset._ref)
    }
  `)
  
  console.log(`Total: ${allChars.length} characters\n`)
  allChars.forEach((c, i) => {
    const num = String(i + 1).padStart(2, ' ')
    const name = c.name.padEnd(25, ' ')
    const element = (c.element || 'N/A').padEnd(8, ' ')
    const image = c.hasImage ? '✅' : '❌'
    console.log(`${num}. ${name} | ${element} | Image: ${image}`)
  })
  
  // Check weapons without images
  console.log('\n\n🔍 Checking Weapons Without Images...\n')
  const weaponsNoImage = await client.fetch<any[]>(`
    *[_type == 'weapon' && !defined(image.asset._ref)] {
      _id,
      'name': name.en,
      slug,
      type,
      element
    }
  `)
  
  if (weaponsNoImage.length > 0) {
    console.log(`⚠️  Found ${weaponsNoImage.length} weapons without images:\n`)
    weaponsNoImage.forEach((w, i) => {
      console.log(`${i + 1}. ${w.name}`)
      console.log(`   Slug: ${w.slug.current}`)
      console.log(`   Type: ${w.type || 'N/A'}, Element: ${w.element || 'N/A'}`)
      console.log(`   ID: ${w._id}\n`)
    })
  } else {
    console.log('✅ All weapons have images!')
  }
  
  console.log('='.repeat(80))
}

checkData().catch(console.error)

