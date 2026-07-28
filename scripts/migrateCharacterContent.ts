/**
 * Migration Script: Update Character Data from Markdown to Sanity CMS
 * 
 * This script reads character markdown files from data/game-content/
 * and updates existing character documents in Sanity CMS.
 * 
 * Usage: npm run migrate:characters
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity client configuration
const client = createClient({
  projectId: 'u9m27k7u',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skDcoIdy72AGDXfWwhswUjKYWTAV8VLCs2GBpOpzfKz8BlgwweTJXSNkn15Qy3RElkLK0uIeQeFMFgDRNyVx2Q6dC8eSZByjmRV7TVBLxYVsJN5CMB7GVNeUIlRt7mkMEoWtLeQQcyi72QFdqdUliD9SXVXRpJTL60Dpauk4LzGoapbBKt9E',
  useCdn: false,
});

// Types
interface ParsedCharacter {
  slug: string;
  name: string;
  role?: string;
  element?: string;
  weapons?: string[];
  profile?: {
    gender?: string;
    birthplace?: string;
    birthday?: string;
    allegiance?: string;
  };
  traits?: Array<{ name: string; effect: string }>;
  baseStats?: Array<{ stat: string; lv1?: string; lvMax?: string }>;
  skills?: Array<{
    name: string;
    description: string;
    type: 'active' | 'ultimate' | 'passive';
    stats?: Array<{ stat: string; lv1?: string; lvMax?: string }>;
  }>;
  passiveUpgrades?: Array<{ upgrade: string; value?: string }>;
  intron?: Array<{ level: number; effect: string }>;
  build?: {
    teamComposition?: string;
    recommendedWeapons?: string;
    recommendedArtifacts?: string;
    statPriority?: string;
    demonWedges?: string;
    teamRecommendations?: string;
    roleOverview?: string;
    pros?: string[];
    cons?: string[];
  };
}

/**
 * Clean markdown artifacts from text
 */
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]/g, '$1') // Remove brackets
    .replace(/`(.+?)`/g, '$1') // Remove code blocks
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .trim();
}

/**
 * Parse markdown table into array of objects
 */
function parseTable(lines: string[], startIndex: number): { data: any[]; endIndex: number } {
  const data: any[] = [];
  let i = startIndex;
  
  // Skip to table start (first line with |)
  while (i < lines.length && !lines[i].includes('|')) i++;
  if (i >= lines.length) return { data: [], endIndex: i };
  
  // Parse header
  const headerLine = lines[i];
  const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
  i++;
  
  // Skip separator line (|---|---|)
  if (i < lines.length && lines[i].includes('---')) i++;
  
  // Parse rows
  while (i < lines.length && lines[i].includes('|')) {
    const row = lines[i].split('|').map(c => c.trim()).filter(c => c);
    if (row.length === headers.length) {
      const obj: any = {};
      headers.forEach((header, idx) => {
        obj[header.toLowerCase().replace(/\s+/g, '_')] = cleanText(row[idx]);
      });
      data.push(obj);
    }
    i++;
  }
  
  return { data, endIndex: i };
}

/**
 * Parse a single markdown file
 */
function parseMarkdownFile(filePath: string): ParsedCharacter | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const character: ParsedCharacter = {
      slug: '',
      name: '',
    };
    
    let i = 0;
    
    // Parse header metadata
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line.startsWith('| name.en |')) {
        character.name = cleanText(line.split('|')[2]);
      } else if (line.startsWith('| slug.current |')) {
        character.slug = cleanText(line.split('|')[2]);
      } else if (line.startsWith('| role |')) {
        character.role = cleanText(line.split('|')[2]);
      } else if (line.startsWith('| element |')) {
        character.element = cleanText(line.split('|')[2]);
      } else if (line.startsWith('| weapons |')) {
        const weaponsStr = line.split('|')[2].trim();
        try {
          character.weapons = JSON.parse(weaponsStr);
        } catch {
          character.weapons = weaponsStr.split(',').map(w => cleanText(w));
        }
      }
      
      // Parse Profile section
      if (line.startsWith('## Profile')) {
        const result = parseTable(lines, i + 1);
        if (result.data.length > 0) {
          character.profile = {
            gender: result.data.find(r => r.attribute === 'Gender')?.value,
            birthplace: result.data.find(r => r.attribute === 'Birthplace')?.value,
            birthday: result.data.find(r => r.attribute === 'Birthday')?.value,
            allegiance: result.data.find(r => r.attribute === 'Allegiance')?.value,
          };
        }
        i = result.endIndex;
        continue;
      }
      
      // Parse Trait section
      if (line.startsWith('## Trait')) {
        const result = parseTable(lines, i + 1);
        character.traits = result.data.map(row => ({
          name: row.name || '',
          effect: row.effect || '',
        }));
        i = result.endIndex;
        continue;
      }
      
      // Parse Base Stats section
      if (line.startsWith('## Base Stats')) {
        const result = parseTable(lines, i + 1);
        character.baseStats = result.data.map(row => ({
          stat: row.stat || '',
          lv1: row['lv.1'] || row.lv1,
          lvMax: row['lv.max'] || row.lvmax,
        }));
        i = result.endIndex;
        continue;
      }

      // Parse Skills section
      if (line.startsWith('## Skills')) {
        character.skills = [];
        i++;

        while (i < lines.length && !lines[i].startsWith('## ')) {
          const skillLine = lines[i].trim();

          // Parse skill header (### Skill — Type · Name)
          if (skillLine.startsWith('### Skill') || skillLine.startsWith('### Ultimate') || skillLine.startsWith('### Passive')) {
            const skill: any = {
              name: '',
              description: '',
              type: 'active',
              stats: [],
            };

            // Determine skill type
            if (skillLine.startsWith('### Ultimate')) {
              skill.type = 'ultimate';
            } else if (skillLine.startsWith('### Passive')) {
              skill.type = 'passive';
            }

            // Extract skill name (after · or —)
            const namePart = skillLine.split(/[·—]/);
            if (namePart.length > 1) {
              skill.name = cleanText(namePart[namePart.length - 1]);
            }

            i++;

            // Parse description (lines until table or next section)
            let description = '';
            while (i < lines.length && !lines[i].includes('|') && !lines[i].startsWith('###') && !lines[i].startsWith('## ') && lines[i].trim() !== '---') {
              if (lines[i].trim() && lines[i].trim() !== '---') {
                description += lines[i].trim() + ' ';
              }
              i++;
            }
            skill.description = cleanText(description);

            // Parse stats table
            if (i < lines.length && lines[i].includes('|')) {
              const result = parseTable(lines, i);
              skill.stats = result.data.map(row => ({
                stat: row.stat || '',
                lv1: row['lv.1'] || row.lv1,
                lvMax: row['lv.max'] || row.lvmax,
              }));
              i = result.endIndex;
            }

            character.skills.push(skill);
          } else {
            i++;
          }
        }
        continue;
      }

      // Parse Passive Upgrades section
      if (line.startsWith('## Passive Upgrades')) {
        const result = parseTable(lines, i + 1);
        character.passiveUpgrades = result.data.map(row => ({
          upgrade: row.upgrade || '',
          value: row.value || '',
        }));
        i = result.endIndex;
        continue;
      }

      // Parse Intron section
      if (line.startsWith('## Intron')) {
        const result = parseTable(lines, i + 1);
        character.intron = result.data.map(row => ({
          level: parseInt(row.level || '0'),
          effect: row.effect || '',
        }));
        i = result.endIndex;
        continue;
      }

      // Parse Build Guide section
      if (line.startsWith('## Build Guide')) {
        character.build = {};
        i++;

        let currentSection = '';
        let currentContent = '';

        while (i < lines.length && !lines[i].startsWith('##')) {
          const buildLine = lines[i].trim();

          if (buildLine.startsWith('### Team Composition')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'teamComposition';
            currentContent = '';
          } else if (buildLine.startsWith('### Recommended Weapons')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'recommendedWeapons';
            currentContent = '';
          } else if (buildLine.startsWith('### Recommended Artifacts')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'recommendedArtifacts';
            currentContent = '';
          } else if (buildLine.startsWith('### Stat Priority')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'statPriority';
            currentContent = '';
          } else if (buildLine.startsWith('### Demon Wedges')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'demonWedges';
            currentContent = '';
          } else if (buildLine.startsWith('### Team Recommendations')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'teamRecommendations';
            currentContent = '';
          } else if (buildLine.startsWith('### Role Overview')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'roleOverview';
            currentContent = '';
          } else if (buildLine.startsWith('### Pros & Cons')) {
            if (currentSection && currentContent) {
              (character.build as any)[currentSection] = cleanText(currentContent);
            }
            currentSection = 'prosAndCons';
            currentContent = '';
          } else if (buildLine.startsWith('**Strengths:**')) {
            character.build.pros = [];
            i++;
            while (i < lines.length && lines[i].trim().startsWith('-')) {
              character.build.pros.push(cleanText(lines[i].trim().substring(1)));
              i++;
            }
            continue;
          } else if (buildLine.startsWith('**Weaknesses:**')) {
            character.build.cons = [];
            i++;
            while (i < lines.length && lines[i].trim().startsWith('-')) {
              character.build.cons.push(cleanText(lines[i].trim().substring(1)));
              i++;
            }
            continue;
          } else if (buildLine && !buildLine.startsWith('###')) {
            currentContent += buildLine + '\n';
          }

          i++;
        }

        // Save last section
        if (currentSection && currentContent) {
          (character.build as any)[currentSection] = cleanText(currentContent);
        }

        continue;
      }

      i++;
    }

    return character.slug ? character : null;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Main migration function
 */
async function migrateCharacters() {
  console.log('🚀 Starting character data migration...\n');
  
  const contentDir = path.join(__dirname, '../data/game-content');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} markdown files\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    console.log(`📄 Processing: ${file}`);
    
    try {
      const character = parseMarkdownFile(filePath);
      
      if (!character || !character.slug) {
        console.log(`   ⚠️  Skipped: Could not extract slug\n`);
        errorCount++;
        continue;
      }
      
      console.log(`   📝 Character: ${character.name} (${character.slug})`);
      
      // Check if character exists in Sanity
      const existing = await client.fetch(
        `*[_type == "character" && slug.current == $slug][0]`,
        { slug: character.slug }
      );
      
      if (!existing) {
        console.log(`   ⚠️  Character not found in Sanity: ${character.slug}\n`);
        errorCount++;
        continue;
      }
      
      // Prepare update data
      const updateData: any = {};

      if (character.profile) {
        updateData.profile = character.profile;
      }

      if (character.traits && character.traits.length > 0) {
        updateData.traits = character.traits.map(trait => ({
          name: { en: trait.name, vi: trait.name },
          effect: { en: trait.effect, vi: trait.effect },
        }));
      }

      if (character.baseStats && character.baseStats.length > 0) {
        updateData.baseStats = character.baseStats.map(stat => ({
          stat: stat.stat,
          lv1: stat.lv1,
          lvMax: stat.lvMax,
        }));
      }

      if (character.skills && character.skills.length > 0) {
        updateData.skills = character.skills.map(skill => ({
          name: { en: skill.name, vi: skill.name },
          description: { en: skill.description, vi: skill.description },
          type: skill.type,
          stats: skill.stats?.map(stat => ({
            stat: stat.stat,
            lv1: stat.lv1,
            lvMax: stat.lvMax,
          })) || [],
        }));
      }

      if (character.passiveUpgrades && character.passiveUpgrades.length > 0) {
        updateData.passiveUpgrades = character.passiveUpgrades.map(upgrade => ({
          upgrade: { en: upgrade.upgrade, vi: upgrade.upgrade },
          value: upgrade.value ? { en: upgrade.value, vi: upgrade.value } : undefined,
        }));
      }

      if (character.intron && character.intron.length > 0) {
        updateData.intron = character.intron.map(intron => ({
          level: intron.level,
          effect: { en: intron.effect, vi: intron.effect },
        }));
      }

      if (character.build) {
        updateData.buildRecommendation = {
          teamComposition: character.build.teamComposition ? { en: character.build.teamComposition, vi: character.build.teamComposition } : undefined,
          recommendedWeapons: character.build.recommendedWeapons ? { en: character.build.recommendedWeapons, vi: character.build.recommendedWeapons } : undefined,
          recommendedArtifacts: character.build.recommendedArtifacts ? { en: character.build.recommendedArtifacts, vi: character.build.recommendedArtifacts } : undefined,
          statPriority: character.build.statPriority ? { en: character.build.statPriority, vi: character.build.statPriority } : undefined,
          demonWedges: character.build.demonWedges ? { en: character.build.demonWedges, vi: character.build.demonWedges } : undefined,
          teamRecommendations: character.build.teamRecommendations ? { en: character.build.teamRecommendations, vi: character.build.teamRecommendations } : undefined,
          roleOverview: character.build.roleOverview ? { en: character.build.roleOverview, vi: character.build.roleOverview } : undefined,
          pros: character.build.pros || [],
          cons: character.build.cons || [],
        };
      }

      // Log what will be updated
      console.log(`   📊 Updating fields:`, Object.keys(updateData).join(', '));

      // Update character in Sanity
      await client
        .patch(existing._id)
        .set(updateData)
        .commit();

      console.log(`   ✅ Updated successfully\n`);
      successCount++;
      
    } catch (error) {
      console.error(`   ❌ Error: ${error}\n`);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total: ${files.length}`);
  console.log('='.repeat(50));
}

// Run migration
migrateCharacters().catch(console.error);

