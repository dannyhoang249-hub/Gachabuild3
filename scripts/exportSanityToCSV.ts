import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u9m27k7u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface Character {
  _id: string;
  name: string | { en: string; [key: string]: string };
  slug: { current: string };
  element?: string;
  role?: string;
  weapon?: string; // Main weapon type
  baseStats?: Array<{ stat: string; lv1: string; lvMax: string }>;
  traits?: string[] | Array<{ name: string | { en: string }; effect: string | { en: string } }>;
  skills?: Array<{ name: string | { en: string }; description: string | { en: string } }>;
  description?: string | { en: string; [key: string]: string };
  rarity?: number;
  image?: any;
}

interface Weapon {
  _id: string;
  name: string | { en: string; [key: string]: string };
  slug: { current: string };
  element?: string;
  type?: string; // Weapon type (Bow, Sword, etc.)
  category?: string; // Range, Melee, etc.
  damageType?: string; // Spike, Slash, Smash
  rarity?: string;
  refinementSkill?: {
    description?: string | { en: string; [key: string]: string };
    r1?: string[];
    r2?: string[];
    r3?: string[];
    r4?: string[];
    r5?: string[];
    r6?: string[];
  };
  baseStats?: {
    // ATK based on damage type
    spikeAtkLv1?: number;
    spikeAtkLvMax?: number;
    slashAtkLv1?: number;
    slashAtkLvMax?: number;
    smashAtkLv1?: number;
    smashAtkLvMax?: number;
    // Universal stats
    critChance?: number;
    critDamage?: number;
    atkSpeed?: number;
    triggerProbability?: number;
    // Ranged stats
    multishot?: number;
    magCapacity?: number;
    maxAmmo?: number;
    ammoConversionRate?: number;
    projectileExplosionRange?: number;
  };
  motionValues?: Record<string, string>;
  description?: string | { en: string; [key: string]: string };
  image?: any;
}

// Extract English text from localized object or return string
function getEnglishText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value.en) return value.en;
  if (typeof value === 'number') return String(value);
  return '';
}

// Convert array to CSV-safe string
function arrayToString(arr: any[] | undefined): string {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
      // Handle localized objects
      if (item.en) return item.en;
      // Handle skill objects
      if (item.name) return getEnglishText(item.name);
    }
    return '';
  }).filter(Boolean).join('; ');
}

// Escape CSV field
function escapeCSV(field: any): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Format base stats as a readable string
function formatBaseStats(baseStats: any[] | undefined): string {
  if (!baseStats || baseStats.length === 0) return '';

  return baseStats
    .filter(stat => stat.stat !== 'Weapon Proficiency' && stat.stat !== 'Feature')
    .map(stat => {
      const lv1 = stat.lv1 || '';
      const lvMax = stat.lvMax || '';
      return `${stat.stat}: ${lv1}${lvMax && lvMax !== lv1 ? ` → ${lvMax}` : ''}`;
    })
    .join('; ');
}

// Format skill stats from skills array
function formatSkillStats(skills: any[] | undefined): string {
  if (!skills || skills.length === 0) return '';

  const skillsWithStats = skills
    .filter(skill => skill.stats && skill.stats.length > 0)
    .map(skill => {
      const skillName = getEnglishText(skill.name);
      const stats = skill.stats
        .map((stat: any) => {
          const lv1 = stat.lv1 || '';
          const lvMax = stat.lvMax || '';
          const notes = stat.notes ? ` (${stat.notes})` : '';
          return `${stat.stat}: ${lv1}${lvMax && lvMax !== lv1 ? ` → ${lvMax}` : ''}${notes}`;
        })
        .join(', ');
      return `[${skillName}] ${stats}`;
    });

  return skillsWithStats.join(' | ');
}

async function exportCharactersToCSV() {
  console.log('📥 Fetching characters from Sanity...');

  const characters: Character[] = await client.fetch(`
    *[_type == "character"] | order(name.en asc) {
      _id,
      name,
      slug,
      element,
      role,
      weapon,
      rarity,
      baseStats,
      stats,
      traits,
      skills,
      intron,
      passiveUpgrades,
      description,
      image
    }
  `);

  console.log(`✅ Found ${characters.length} characters`);

  // Create CSV header with all gameplay data
  const header = 'Name,Element,Role,Rarity,Weapon Type (Main),Weapon Type (Sub),Traits,Skills,Base Stats,Skill Stats,Intron Levels,Passive Upgrades,Feature';

  // Create CSV rows
  const rows = characters.map(char => {
    const name = escapeCSV(getEnglishText(char.name));
    const element = escapeCSV(char.element || '');
    const role = escapeCSV(char.role || '');
    const rarity = escapeCSV(char.rarity || '');

    // Extract weapon proficiency from baseStats
    let mainWeapon = '';
    let subWeapon = '';
    const weaponProficiency = char.baseStats?.find(stat => stat.stat === 'Weapon Proficiency');
    if (weaponProficiency && weaponProficiency.lv1) {
      const weapons = weaponProficiency.lv1.split('/').map(w => w.trim());
      mainWeapon = weapons[0] || '';
      subWeapon = weapons[1] || '';
    }

    const traits = escapeCSV(arrayToString(char.traits));
    const skills = escapeCSV(arrayToString(char.skills));
    const baseStats = escapeCSV(formatBaseStats(char.baseStats));
    const skillStats = escapeCSV(formatSkillStats(char.skills));

    // Format intron levels
    const intronLevels = escapeCSV(
      char.intron?.map((intron: any) =>
        `Lv${intron.level}: ${getEnglishText(intron.effect)}`
      ).join(' | ') || ''
    );

    // Format passive upgrades
    const passiveUpgrades = escapeCSV(
      char.passiveUpgrades?.map((upgrade: any) =>
        `${getEnglishText(upgrade.upgrade)}: ${getEnglishText(upgrade.value)}`
      ).join('; ') || ''
    );

    const feature = escapeCSV(getEnglishText(char.description));

    return `${name},${element},${role},${rarity},${escapeCSV(mainWeapon)},${escapeCSV(subWeapon)},${traits},${skills},${baseStats},${skillStats},${intronLevels},${passiveUpgrades},${feature}`;
  });

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Write to file
  const filePath = path.join(process.cwd(), 'characters.csv');
  fs.writeFileSync(filePath, csv, 'utf-8');

  console.log(`✅ Exported ${characters.length} characters to characters.csv`);

  return characters.length;
}

// Format weapon base stats
function formatWeaponBaseStats(baseStats: any, damageType: string): string {
  if (!baseStats) return '';

  const stats: string[] = [];

  // ATK based on damage type
  if (damageType === 'Spike' && baseStats.spikeAtkLv1) {
    stats.push(`Spike ATK: ${baseStats.spikeAtkLv1}${baseStats.spikeAtkLvMax ? ` → ${baseStats.spikeAtkLvMax}` : ''}`);
  } else if (damageType === 'Slash' && baseStats.slashAtkLv1) {
    stats.push(`Slash ATK: ${baseStats.slashAtkLv1}${baseStats.slashAtkLvMax ? ` → ${baseStats.slashAtkLvMax}` : ''}`);
  } else if (damageType === 'Smash' && baseStats.smashAtkLv1) {
    stats.push(`Smash ATK: ${baseStats.smashAtkLv1}${baseStats.smashAtkLvMax ? ` → ${baseStats.smashAtkLvMax}` : ''}`);
  }

  // Universal stats
  if (baseStats.critChance) stats.push(`CRIT Chance: ${baseStats.critChance}%`);
  if (baseStats.critDamage) stats.push(`CRIT DMG: ${baseStats.critDamage}%`);
  if (baseStats.atkSpeed) stats.push(`ATK Speed: ${baseStats.atkSpeed}`);
  if (baseStats.triggerProbability) stats.push(`Trigger Prob: ${baseStats.triggerProbability}%`);

  // Ranged-only stats
  if (baseStats.multishot) stats.push(`Multishot: ${baseStats.multishot}`);
  if (baseStats.magCapacity) stats.push(`Mag Capacity: ${baseStats.magCapacity}`);
  if (baseStats.maxAmmo) stats.push(`Max Ammo: ${baseStats.maxAmmo}`);
  if (baseStats.ammoConversionRate) stats.push(`Ammo Conv Rate: ${baseStats.ammoConversionRate}`);
  if (baseStats.projectileExplosionRange) stats.push(`Explosion Range: ${baseStats.projectileExplosionRange}`);

  return stats.join('; ');
}

// Format weapon refinement skill with R1-R6 values
function formatRefinementSkill(refinementSkill: any): string {
  if (!refinementSkill) return '';

  const parts: string[] = [];

  // Add description
  const desc = getEnglishText(refinementSkill.description);
  if (desc) parts.push(`Effect: ${desc}`);

  // Add refinement values
  const refinements: string[] = [];
  if (refinementSkill.r1?.length) refinements.push(`R1: ${refinementSkill.r1.join(', ')}`);
  if (refinementSkill.r2?.length) refinements.push(`R2: ${refinementSkill.r2.join(', ')}`);
  if (refinementSkill.r3?.length) refinements.push(`R3: ${refinementSkill.r3.join(', ')}`);
  if (refinementSkill.r4?.length) refinements.push(`R4: ${refinementSkill.r4.join(', ')}`);
  if (refinementSkill.r5?.length) refinements.push(`R5: ${refinementSkill.r5.join(', ')}`);
  if (refinementSkill.r6?.length) refinements.push(`R6: ${refinementSkill.r6.join(', ')}`);

  if (refinements.length > 0) parts.push(`Refinements: [${refinements.join(' | ')}]`);

  return parts.join(' || ');
}

// Format motion values
function formatMotionValues(motionValues: any): string {
  if (!motionValues) return '';

  return Object.entries(motionValues)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
}

async function exportWeaponsToCSV() {
  console.log('📥 Fetching weapons from Sanity...');

  const weapons: Weapon[] = await client.fetch(`
    *[_type == "weapon"] | order(name.en asc) {
      _id,
      name,
      slug,
      element,
      type,
      category,
      damageType,
      rarity,
      refinementSkill,
      baseStats,
      motionValues,
      description,
      image
    }
  `);

  console.log(`✅ Found ${weapons.length} weapons`);

  // Create CSV header with all gameplay data
  const header = 'Name,Element,Weapon Type,Category,Damage Type,Rarity,Refinement Skill,Base Stats,Motion Values,Description';

  // Create CSV rows
  const rows = weapons.map(weapon => {
    const name = escapeCSV(getEnglishText(weapon.name));
    const element = escapeCSV(weapon.element || '');
    const weaponType = escapeCSV(weapon.type || '');
    const category = escapeCSV(weapon.category || '');
    const damageType = escapeCSV(weapon.damageType || '');
    const rarity = escapeCSV(weapon.rarity || '');
    const refinementSkill = escapeCSV(formatRefinementSkill(weapon.refinementSkill));
    const baseStats = escapeCSV(formatWeaponBaseStats(weapon.baseStats, weapon.damageType || ''));
    const motionValues = escapeCSV(formatMotionValues(weapon.motionValues));
    const description = escapeCSV(getEnglishText(weapon.description));

    return `${name},${element},${weaponType},${category},${damageType},${rarity},${refinementSkill},${baseStats},${motionValues},${description}`;
  });

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Write to file
  const filePath = path.join(process.cwd(), 'weapons.csv');
  fs.writeFileSync(filePath, csv, 'utf-8');

  console.log(`✅ Exported ${weapons.length} weapons to weapons.csv`);

  return weapons.length;
}

async function main() {
  console.log('🚀 Starting Sanity to CSV export...\n');

  try {
    const charCount = await exportCharactersToCSV();
    console.log('');
    const weaponCount = await exportWeaponsToCSV();

    console.log('\n✅ Export complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Characters: ${charCount}`);
    console.log(`   - Weapons: ${weaponCount}`);
    console.log('\n📁 Files created:');
    console.log('   - characters.csv');
    console.log('   - weapons.csv');
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  }
}

main();

