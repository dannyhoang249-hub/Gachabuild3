import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface Weapon {
  _id: string;
  name: { en: string };
  element: string;
  refinementSkill?: {
    description?: { en: string };
  };
}

// Map of weapons that should have specific elements based on their skill effects
const ELEMENT_CORRECTIONS: Record<string, string> = {
  'Blast Artistry': 'Umbro',  // Mentions "Umbro character uses Ultimate"
};

async function analyzeWeaponElements() {
  console.log('🔍 Analyzing weapon elements...\n');

  // Fetch all weapons
  const weapons: Weapon[] = await client.fetch(`
    *[_type == "weapon"] | order(name.en asc) {
      _id,
      name,
      element,
      refinementSkill
    }
  `);

  console.log(`Found ${weapons.length} weapons\n`);

  const updates: Array<{ weapon: string; from: string; to: string; reason: string }> = [];

  // Check each weapon for element-specific mentions
  for (const weapon of weapons) {
    const skillDesc = weapon.refinementSkill?.description?.en || '';
    const weaponName = weapon.name.en;
    const currentElement = weapon.element;

    // Check for element mentions in skill description
    const elementMentions = {
      Umbro: /\*\*Umbro\*\*/.test(skillDesc),
      Anemo: /\*\*Anemo\*\*/.test(skillDesc),
      Lumino: /\bLumino\b/.test(skillDesc),
      Pyro: /\*\*Pyro\*\*/.test(skillDesc),
      Hydro: /\bHydro\b/.test(skillDesc),
      Electro: /\bElectro\b/.test(skillDesc),
    };

    // Find which element is mentioned
    const mentionedElement = Object.entries(elementMentions).find(([_, mentioned]) => mentioned)?.[0];

    if (mentionedElement && currentElement !== mentionedElement) {
      updates.push({
        weapon: weaponName,
        from: currentElement,
        to: mentionedElement,
        reason: `Skill mentions "${mentionedElement}" character`,
      });
    }
  }

  return { weapons, updates };
}

async function updateWeaponElements(dryRun: boolean = true) {
  const { weapons, updates } = await analyzeWeaponElements();

  if (updates.length === 0) {
    console.log('✅ No element corrections needed!\n');
    return;
  }

  console.log(`📋 Found ${updates.length} weapons that need element updates:\n`);

  for (const update of updates) {
    console.log(`🔧 ${update.weapon}`);
    console.log(`   Current: ${update.from}`);
    console.log(`   Should be: ${update.to}`);
    console.log(`   Reason: ${update.reason}\n`);
  }

  if (dryRun) {
    console.log('🔍 DRY RUN - No changes made');
    console.log('Run with --execute flag to apply changes\n');
    return;
  }

  console.log('💾 Updating weapons in Sanity...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    try {
      // Find the weapon document
      const weapon = weapons.find(w => w.name.en === update.weapon);
      if (!weapon) {
        console.log(`❌ Weapon not found: ${update.weapon}`);
        errorCount++;
        continue;
      }

      // Update the element
      await client
        .patch(weapon._id)
        .set({ element: update.to })
        .commit();

      console.log(`✅ Updated ${update.weapon}: ${update.from} → ${update.to}`);
      successCount++;
    } catch (error) {
      console.log(`❌ Error updating ${update.weapon}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

async function main() {
  console.log('🚀 Weapon Element Updater\n');

  const args = process.argv.slice(2);
  const execute = args.includes('--execute');

  if (execute) {
    console.log('⚠️  EXECUTE MODE - Changes will be applied to Sanity\n');
  } else {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    await updateWeaponElements(!execute);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

