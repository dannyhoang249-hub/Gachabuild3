/**
 * Import Build Guides Script
 * 
 * Reads characters.csv and weapons.csv, runs the build algorithm,
 * and imports the results into Sanity CMS.
 * 
 * Usage:
 *   npm run import:builds
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

import { CharacterData, WeaponData } from './buildAlgorithm/types';
import { parseCharacter, parseWeapon } from './buildAlgorithm/parser';
import { generateAllBuilds } from './buildAlgorithm/generator';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

/**
 * Simple CSV parser (no external dependencies)
 */
function readCSV<T>(filePath: string): T[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());

  if (lines.length === 0) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());

  // Parse rows
  const records: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record: any = {};

    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    records.push(record);
  }

  return records;
}

/**
 * Parse a single CSV line (handles quoted values with commas)
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Find character reference ID in Sanity by name
 */
async function findCharacterRef(characterName: string): Promise<string | null> {
  const query = `*[_type == "character" && name.en == $name][0]._id`;
  const result = await sanityClient.fetch(query, { name: characterName });
  return result || null;
}

/**
 * Find weapon reference ID in Sanity by name
 */
async function findWeaponRef(weaponName: string): Promise<string | null> {
  const query = `*[_type == "weapon" && name.en == $name][0]._id`;
  const result = await sanityClient.fetch(query, { name: weaponName });
  return result || null;
}

/**
 * Convert build recommendation to Sanity document format
 */
async function convertToSanityFormat(buildRec: any) {
  const characterRef = await findCharacterRef(buildRec.character.name);
  
  if (!characterRef) {
    console.warn(`⚠️  Character not found in Sanity: ${buildRec.character.name}`);
    return null;
  }

  // Helper to convert weapon pairs
  const convertWeaponPairs = async (pairs: any[]) => {
    const converted = [];
    
    for (const pair of pairs) {
      const meleeRef = await findWeaponRef(pair.melee.name);
      const rangedRef = await findWeaponRef(pair.ranged.name);
      
      if (meleeRef && rangedRef) {
        converted.push({
          _type: 'object',
          meleeWeapon: { _type: 'reference', _ref: meleeRef },
          rangedWeapon: { _type: 'reference', _ref: rangedRef },
          pairScore: pair.pairScore,
          reasoning: {
            en: pair.reasoning,
            vi: '' // Can be filled by translation later
          }
        });
      }
    }
    
    return converted;
  };

  // Helper to convert team compositions
  const convertTeamComps = async (teams: any[]) => {
    const converted = [];
    
    for (const team of teams) {
      const partner1Ref = await findCharacterRef(team.partner1.name);
      const partner2Ref = await findCharacterRef(team.partner2.name);
      
      if (partner1Ref && partner2Ref) {
        converted.push({
          _type: 'object',
          mode: team.mode,
          partner1: { _type: 'reference', _ref: partner1Ref },
          partner2: { _type: 'reference', _ref: partner2Ref },
          teamScore: team.teamScore,
          synergies: team.synergies.map((syn: any) => ({
            _type: 'object',
            type: syn.type,
            description: {
              en: syn.description,
              vi: '' // Can be filled by translation later
            }
          }))
        });
      }
    }
    
    return converted;
  };

  const soloWeaponPairs = await convertWeaponPairs(buildRec.soloMode.weaponPairs);
  const farmWeaponPairs = await convertWeaponPairs(buildRec.farmMode.weaponPairs);
  const bossWeaponPairs = await convertWeaponPairs(buildRec.bossMode.weaponPairs);
  const teamCompositions = await convertTeamComps(buildRec.teamCompositions);

  return {
    _type: 'buildGuide',
    _id: `build-${buildRec.character.name.toLowerCase().replace(/\s+/g, '-')}`,
    character: { _type: 'reference', _ref: characterRef },
    soloMode: {
      weaponPairs: soloWeaponPairs,
      statPriority: buildRec.soloMode.statPriority,
      playstyleTips: {
        en: buildRec.soloMode.playstyleTips,
        vi: ''
      }
    },
    farmMode: {
      weaponPairs: farmWeaponPairs,
      statPriority: buildRec.farmMode.statPriority,
      playstyleTips: {
        en: buildRec.farmMode.playstyleTips,
        vi: ''
      }
    },
    bossMode: {
      weaponPairs: bossWeaponPairs,
      statPriority: buildRec.bossMode.statPriority,
      playstyleTips: {
        en: buildRec.bossMode.playstyleTips,
        vi: ''
      }
    },
    teamCompositions,
    algorithmVersion: buildRec.algorithmVersion,
    lastCalculated: buildRec.lastCalculated,
    autoGenerated: true,
    manualOverrides: {
      hasOverrides: false,
      notes: ''
    }
  };
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Starting build guide import...\n');

  // Read CSV files
  const charactersPath = path.join(process.cwd(), 'data/build-guides', 'characters.csv');
  const weaponsPath = path.join(process.cwd(), 'data/build-guides', 'weapons.csv');

  console.log('📖 Reading CSV files...');
  const characterData = readCSV<CharacterData>(charactersPath);
  const weaponData = readCSV<WeaponData>(weaponsPath);
  
  console.log(`   Found ${characterData.length} characters`);
  console.log(`   Found ${weaponData.length} weapons\n`);

  // Parse data
  console.log('🔍 Parsing character and weapon data...');
  const parsedCharacters = characterData.map(parseCharacter);
  const parsedWeapons = weaponData.map(parseWeapon);
  console.log('   ✓ Parsing complete\n');

  // Generate build recommendations
  console.log('⚙️  Generating build recommendations...');
  const buildRecommendations = generateAllBuilds(parsedCharacters, parsedWeapons);
  console.log(`   ✓ Generated ${buildRecommendations.length} build guides\n`);

  // Import to Sanity
  console.log('📤 Importing to Sanity CMS...');
  let successCount = 0;
  let errorCount = 0;

  for (const buildRec of buildRecommendations) {
    try {
      const sanityDoc = await convertToSanityFormat(buildRec);
      
      if (sanityDoc) {
        await sanityClient.createOrReplace(sanityDoc);
        console.log(`   ✓ Imported: ${buildRec.character.name}`);
        successCount++;
      } else {
        console.log(`   ⚠️  Skipped: ${buildRec.character.name} (character not found in Sanity)`);
        errorCount++;
      }
    } catch (error: any) {
      console.error(`   ❌ Error importing ${buildRec.character.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n✨ Import complete!');
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors/Skipped: ${errorCount}`);
  
  if (errorCount > 0) {
    console.log('\n💡 Tip: Make sure all characters and weapons from the CSV exist in Sanity CMS first.');
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

