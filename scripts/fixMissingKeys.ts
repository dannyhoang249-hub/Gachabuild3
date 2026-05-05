#!/usr/bin/env node

/**
 * Fix Missing Keys in Sanity Arrays
 * 
 * This script adds missing _key properties to array items in Sanity documents.
 * The _key property is required by Sanity for all array items.
 */

import { createClient } from '@sanity/client';
import { randomUUID } from 'crypto';

const client = createClient({
  projectId: 'u9m27k7u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skDcoIdy72AGDXfWwhswUjKYWTAV8VLCs2GBpOpzfKz8BlgwweTJXSNkn15Qy3RElkLK0uIeQeFMFgDRNyVx2Q6dC8eSZByjmRV7TVBLxYVsJN5CMB7GVNeUIlRt7mkMEoWtLeQQcyi72QFdqdUliD9SXVXRpJTL60Dpauk4LzGoapbBKt9E',
  useCdn: false,
});

interface Stats {
  processed: number;
  fixed: number;
  errors: number;
}

/**
 * Add _key to array items if missing
 */
function addKeysToArray(arr: any[]): any[] {
  if (!Array.isArray(arr)) return arr;
  
  return arr.map(item => {
    if (typeof item === 'object' && item !== null && !item._key) {
      return {
        _key: randomUUID(),
        ...item
      };
    }
    return item;
  });
}

/**
 * Fix missing keys in a character document
 */
async function fixCharacterKeys(character: any, stats: Stats): Promise<void> {
  try {
    console.log(`\n📄 Processing: ${character.name?.en || character._id}`);
    
    const patches: any = {};
    let hasChanges = false;
    
    // Fix traits array
    if (character.traits && Array.isArray(character.traits)) {
      const needsKeys = character.traits.some((t: any) => !t._key);
      if (needsKeys) {
        patches.traits = addKeysToArray(character.traits);
        hasChanges = true;
        console.log('   ✓ Fixed traits array');
      }
    }
    
    // Fix baseStats array
    if (character.baseStats && Array.isArray(character.baseStats)) {
      const needsKeys = character.baseStats.some((s: any) => !s._key);
      if (needsKeys) {
        patches.baseStats = addKeysToArray(character.baseStats);
        hasChanges = true;
        console.log('   ✓ Fixed baseStats array');
      }
    }
    
    // Fix skills array
    if (character.skills && Array.isArray(character.skills)) {
      const needsKeys = character.skills.some((s: any) => !s._key);
      if (needsKeys) {
        patches.skills = character.skills.map((skill: any) => {
          const fixedSkill = skill._key ? skill : { _key: randomUUID(), ...skill };
          
          // Fix stats array within skill
          if (fixedSkill.stats && Array.isArray(fixedSkill.stats)) {
            const statsNeedKeys = fixedSkill.stats.some((st: any) => !st._key);
            if (statsNeedKeys) {
              fixedSkill.stats = addKeysToArray(fixedSkill.stats);
            }
          }
          
          return fixedSkill;
        });
        hasChanges = true;
        console.log('   ✓ Fixed skills array');
      }
    }
    
    // Fix passiveUpgrades array
    if (character.passiveUpgrades && Array.isArray(character.passiveUpgrades)) {
      const needsKeys = character.passiveUpgrades.some((p: any) => !p._key);
      if (needsKeys) {
        patches.passiveUpgrades = addKeysToArray(character.passiveUpgrades);
        hasChanges = true;
        console.log('   ✓ Fixed passiveUpgrades array');
      }
    }
    
    // Fix intron array
    if (character.intron && Array.isArray(character.intron)) {
      const needsKeys = character.intron.some((i: any) => !i._key);
      if (needsKeys) {
        patches.intron = addKeysToArray(character.intron);
        hasChanges = true;
        console.log('   ✓ Fixed intron array');
      }
    }
    
    // Fix pros array in buildRecommendation
    if (character.buildRecommendation?.pros && Array.isArray(character.buildRecommendation.pros)) {
      const needsKeys = character.buildRecommendation.pros.some((p: any) => typeof p === 'object' && !p._key);
      if (needsKeys) {
        patches['buildRecommendation.pros'] = addKeysToArray(character.buildRecommendation.pros);
        hasChanges = true;
        console.log('   ✓ Fixed buildRecommendation.pros array');
      }
    }
    
    // Fix cons array in buildRecommendation
    if (character.buildRecommendation?.cons && Array.isArray(character.buildRecommendation.cons)) {
      const needsKeys = character.buildRecommendation.cons.some((c: any) => typeof c === 'object' && !c._key);
      if (needsKeys) {
        patches['buildRecommendation.cons'] = addKeysToArray(character.buildRecommendation.cons);
        hasChanges = true;
        console.log('   ✓ Fixed buildRecommendation.cons array');
      }
    }
    
    // Fix recommendedWeapons array
    if (character.recommendedWeapons && Array.isArray(character.recommendedWeapons)) {
      const needsKeys = character.recommendedWeapons.some((w: any) => !w._key);
      if (needsKeys) {
        patches.recommendedWeapons = addKeysToArray(character.recommendedWeapons);
        hasChanges = true;
        console.log('   ✓ Fixed recommendedWeapons array');
      }
    }
    
    // Fix synergy array
    if (character.synergy && Array.isArray(character.synergy)) {
      const needsKeys = character.synergy.some((s: any) => !s._key);
      if (needsKeys) {
        patches.synergy = addKeysToArray(character.synergy);
        hasChanges = true;
        console.log('   ✓ Fixed synergy array');
      }
    }
    
    // Fix pros array (top-level)
    if (character.pros && Array.isArray(character.pros)) {
      const needsKeys = character.pros.some((p: any) => typeof p === 'object' && !p._key);
      if (needsKeys) {
        patches.pros = addKeysToArray(character.pros);
        hasChanges = true;
        console.log('   ✓ Fixed pros array');
      }
    }
    
    // Fix cons array (top-level)
    if (character.cons && Array.isArray(character.cons)) {
      const needsKeys = character.cons.some((c: any) => typeof c === 'object' && !c._key);
      if (needsKeys) {
        patches.cons = addKeysToArray(character.cons);
        hasChanges = true;
        console.log('   ✓ Fixed cons array');
      }
    }
    
    // Apply patches if there are changes
    if (hasChanges) {
      await client
        .patch(character._id)
        .set(patches)
        .commit();
      
      console.log('   ✅ Updated successfully');
      stats.fixed++;
    } else {
      console.log('   ⏭️  No missing keys found');
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
  console.log('🔧 Starting missing keys fix...\n');
  
  const stats: Stats = {
    processed: 0,
    fixed: 0,
    errors: 0,
  };
  
  try {
    // Fetch all characters
    const characters = await client.fetch(`*[_type == "character"]`);
    
    console.log(`Found ${characters.length} characters\n`);
    
    // Process each character
    for (const character of characters) {
      await fixCharacterKeys(character, stats);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Processed:', stats.processed);
    console.log('🔧 Fixed:', stats.fixed);
    console.log('❌ Errors:', stats.errors);
    console.log('='.repeat(50));
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

