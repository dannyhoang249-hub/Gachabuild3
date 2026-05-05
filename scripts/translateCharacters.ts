#!/usr/bin/env node

/**
 * Translate Character Data to Vietnamese
 * 
 * This script translates character data from English to Vietnamese
 * for the new multilingual fields (traits, passiveUpgrades, intron, buildRecommendation).
 * 
 * Usage:
 *   npm run translate:characters              # Translate all characters
 *   npm run translate:characters --dry-run    # Preview without saving
 *   npm run translate:characters --slug=berenica  # Translate specific character
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'u9m27k7u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skDcoIdy72AGDXfWwhswUjKYWTAV8VLCs2GBpOpzfKz8BlgwweTJXSNkn15Qy3RElkLK0uIeQeFMFgDRNyVx2Q6dC8eSZByjmRV7TVBLxYVsJN5CMB7GVNeUIlRt7mkMEoWtLeQQcyi72QFdqdUliD9SXVXRpJTL60Dpauk4LzGoapbBKt9E',
  useCdn: false,
});

const DRY_RUN = process.argv.includes('--dry-run');
const SLUG_FILTER = process.argv.find(arg => arg.startsWith('--slug='))?.split('=')[1];

interface Stats {
  processed: number;
  translated: number;
  skipped: number;
  errors: number;
}

/**
 * Translation function using OpenAI API
 */
async function translate(text: string, context?: string): Promise<string> {
  if (!text || !text.trim()) return text;

  const apiKey = process.env.OPENAI_API_KEY;

  // If no API key, return original text
  if (!apiKey) {
    console.warn('⚠️  No OPENAI_API_KEY found. Returning original text.');
    return text;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional game translator specializing in Vietnamese localization. Translate the following game content from English to Vietnamese. Maintain game terminology, keep proper nouns in English, preserve formatting and special characters. Be natural and engaging in Vietnamese.'
          },
          {
            role: 'user',
            content: context ? `Context: ${context}\n\nTranslate to Vietnamese:\n${text}` : `Translate to Vietnamese:\n${text}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return text;
    }

    const data = await response.json();
    const translated = data.choices[0].message.content.trim();

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));

    return translated;
  } catch (error: any) {
    console.error('Translation error:', error.message);
    return text;
  }
}

/**
 * Translate character data
 */
async function translateCharacter(character: any, stats: Stats): Promise<void> {
  try {
    console.log(`\n📄 Processing: ${character.name?.en || character._id}`);
    
    const patches: any = {};
    let hasTranslations = false;
    
    // Translate traits
    if (character.traits && Array.isArray(character.traits)) {
      console.log('   🌐 Translating traits...');
      patches.traits = await Promise.all(
        character.traits.map(async (trait: any) => {
          const nameVi = trait.name?.vi || await translate(trait.name?.en || '', 'Trait name');
          const effectVi = trait.effect?.vi || await translate(trait.effect?.en || '', 'Trait effect');
          
          return {
            ...trait,
            name: {
              en: trait.name?.en || '',
              vi: nameVi,
            },
            effect: {
              en: trait.effect?.en || '',
              vi: effectVi,
            },
          };
        })
      );
      hasTranslations = true;
    }
    
    // Translate passive upgrades
    if (character.passiveUpgrades && Array.isArray(character.passiveUpgrades)) {
      console.log('   🌐 Translating passive upgrades...');
      patches.passiveUpgrades = await Promise.all(
        character.passiveUpgrades.map(async (upgrade: any) => {
          const upgradeVi = upgrade.upgrade?.vi || await translate(upgrade.upgrade?.en || '', 'Passive upgrade name');
          const valueVi = upgrade.value?.vi || await translate(upgrade.value?.en || '', 'Passive upgrade value');
          
          return {
            ...upgrade,
            upgrade: {
              en: upgrade.upgrade?.en || '',
              vi: upgradeVi,
            },
            value: {
              en: upgrade.value?.en || '',
              vi: valueVi,
            },
          };
        })
      );
      hasTranslations = true;
    }
    
    // Translate intron levels
    if (character.intron && Array.isArray(character.intron)) {
      console.log('   🌐 Translating intron levels...');
      patches.intron = await Promise.all(
        character.intron.map(async (intron: any) => {
          const effectVi = intron.effect?.vi || await translate(intron.effect?.en || '', 'Intron effect');
          
          return {
            ...intron,
            effect: {
              en: intron.effect?.en || '',
              vi: effectVi,
            },
          };
        })
      );
      hasTranslations = true;
    }
    
    // Translate build recommendation
    if (character.buildRecommendation) {
      console.log('   🌐 Translating build recommendation...');
      const br = character.buildRecommendation;
      
      patches.buildRecommendation = {
        ...br,
      };
      
      // Translate each multilingual field
      const fields = [
        'roleOverview',
        'teamComposition',
        'recommendedWeapons',
        'recommendedArtifacts',
        'statPriority',
        'demonWedges',
        'teamRecommendations',
      ];
      
      for (const field of fields) {
        if (br[field]?.en) {
          const vi = br[field]?.vi || await translate(br[field].en, `Build guide: ${field}`);
          patches.buildRecommendation[field] = {
            en: br[field].en,
            vi: vi,
          };
          hasTranslations = true;
        }
      }
    }
    
    // Apply patches if there are translations
    if (hasTranslations) {
      if (!DRY_RUN) {
        await client
          .patch(character._id)
          .set(patches)
          .commit();
        
        console.log('   ✅ Translations saved');
      } else {
        console.log('   ✅ Translations ready (dry-run, not saved)');
      }
      stats.translated++;
    } else {
      console.log('   ⏭️  No translations needed');
      stats.skipped++;
    }
    
    stats.processed++;
    
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🌐 Starting character translation...');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  if (SLUG_FILTER) {
    console.log(`Filter: slug = ${SLUG_FILTER}`);
  }
  console.log('');
  
  const stats: Stats = {
    processed: 0,
    translated: 0,
    skipped: 0,
    errors: 0,
  };
  
  try {
    // Fetch characters
    let query = `*[_type == "character"]`;
    if (SLUG_FILTER) {
      query = `*[_type == "character" && slug.current == "${SLUG_FILTER}"]`;
    }
    
    const characters = await client.fetch(query);
    
    console.log(`Found ${characters.length} character(s)\n`);
    
    // Process each character
    for (const character of characters) {
      await translateCharacter(character, stats);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log('   Processed:', stats.processed);
    console.log('   ✅ Translated:', stats.translated);
    console.log('   ⏭️  Skipped:', stats.skipped);
    console.log('   ❌ Errors:', stats.errors);
    console.log('='.repeat(50));
    
    if (!DRY_RUN && stats.translated > 0) {
      console.log('\n✅ Translation complete!');
      console.log('\nNOTE: This script currently uses placeholder translations.');
      console.log('To enable actual translation:');
      console.log('1. Add translation API (OpenAI, DeepL, Google Translate)');
      console.log('2. Update the translate() function in this script');
      console.log('3. Or manually translate in Sanity Studio at: http://localhost:3333');
    }
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

