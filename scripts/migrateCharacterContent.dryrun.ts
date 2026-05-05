/**
 * Migration Script (DRY RUN): Preview Character Data Migration
 * 
 * This script reads character markdown files and shows what would be updated
 * WITHOUT actually making changes to Sanity CMS.
 * 
 * Usage: npm run migrate:characters:dryrun
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .trim();
}

/**
 * Parse markdown table into array of objects
 */
function parseTable(lines: string[], startIndex: number): { data: any[]; endIndex: number } {
  const data: any[] = [];
  let i = startIndex;
  
  while (i < lines.length && !lines[i].includes('|')) i++;
  if (i >= lines.length) return { data: [], endIndex: i };
  
  const headerLine = lines[i];
  const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
  i++;
  
  if (i < lines.length && lines[i].includes('---')) i++;
  
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
 * Parse a single markdown file (simplified version for dry run)
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
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line.startsWith('| name.en |')) {
        character.name = cleanText(line.split('|')[2]);
      } else if (line.startsWith('| slug.current |')) {
        character.slug = cleanText(line.split('|')[2]);
      } else if (line.startsWith('| role |')) {
        character.role = cleanText(line.split('|')[2]);
      }
      
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
      
      if (line.startsWith('## Trait')) {
        const result = parseTable(lines, i + 1);
        character.traits = result.data.map(row => ({
          name: row.name || '',
          effect: row.effect || '',
        }));
        i = result.endIndex;
        continue;
      }
      
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
      
      if (line.startsWith('## Skills')) {
        character.skills = [];
        i++;

        while (i < lines.length && !lines[i].startsWith('## ')) {
          const skillLine = lines[i].trim();

          if (skillLine.startsWith('### Skill') || skillLine.startsWith('### Ultimate') || skillLine.startsWith('### Passive')) {
            const skill: any = {
              name: '',
              description: '',
              type: 'active',
              stats: [],
            };

            if (skillLine.startsWith('### Ultimate')) {
              skill.type = 'ultimate';
            } else if (skillLine.startsWith('### Passive')) {
              skill.type = 'passive';
            }

            const namePart = skillLine.split(/[·—]/);
            if (namePart.length > 1) {
              skill.name = cleanText(namePart[namePart.length - 1]);
            }

            i++;

            let description = '';
            while (i < lines.length && !lines[i].includes('|') && !lines[i].startsWith('###') && !lines[i].startsWith('## ') && lines[i].trim() !== '---') {
              if (lines[i].trim() && lines[i].trim() !== '---') {
                description += lines[i].trim() + ' ';
              }
              i++;
            }
            skill.description = cleanText(description);

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
      
      if (line.startsWith('## Passive Upgrades')) {
        const result = parseTable(lines, i + 1);
        character.passiveUpgrades = result.data.map(row => ({
          upgrade: row.upgrade || '',
          value: row.value || '',
        }));
        i = result.endIndex;
        continue;
      }
      
      if (line.startsWith('## Intron')) {
        const result = parseTable(lines, i + 1);
        character.intron = result.data.map(row => ({
          level: parseInt(row.level || '0'),
          effect: row.effect || '',
        }));
        i = result.endIndex;
        continue;
      }
      
      if (line.startsWith('## Build Guide')) {
        character.build = {};
        i++;
        
        let currentSection = '';
        let currentContent = '';
        
        while (i < lines.length && !lines[i].startsWith('##')) {
          const buildLine = lines[i].trim();
          
          if (buildLine.startsWith('### Pros & Cons')) {
            character.build.pros = [];
            character.build.cons = [];
            i++;
            
            let inStrengths = false;
            let inWeaknesses = false;
            
            while (i < lines.length && !lines[i].startsWith('##')) {
              const prosConsLine = lines[i].trim();
              
              if (prosConsLine.startsWith('**Strengths:**')) {
                inStrengths = true;
                inWeaknesses = false;
              } else if (prosConsLine.startsWith('**Weaknesses:**')) {
                inStrengths = false;
                inWeaknesses = true;
              } else if (prosConsLine.startsWith('-')) {
                if (inStrengths) {
                  character.build.pros!.push(cleanText(prosConsLine.substring(1)));
                } else if (inWeaknesses) {
                  character.build.cons!.push(cleanText(prosConsLine.substring(1)));
                }
              }
              
              i++;
            }
            break;
          }
          
          i++;
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
 * Dry run - show what would be migrated
 */
async function dryRunMigration() {
  console.log('🔍 DRY RUN: Character Data Migration Preview\n');
  console.log('This will NOT make any changes to Sanity CMS.\n');
  console.log('='.repeat(60) + '\n');
  
  const contentDir = path.join(__dirname, '../Character_content_update');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} markdown files\n`);
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    console.log(`📄 ${file}`);
    
    const character = parseMarkdownFile(filePath);
    
    if (!character || !character.slug) {
      console.log(`   ⚠️  Could not extract slug\n`);
      continue;
    }
    
    console.log(`   Name: ${character.name}`);
    console.log(`   Slug: ${character.slug}`);
    console.log(`   Role: ${character.role || 'N/A'}`);
    console.log(`   Element: ${character.element || 'N/A'}`);
    
    console.log(`\n   📊 Data Summary:`);
    console.log(`      Profile: ${character.profile ? '✅' : '❌'}`);
    console.log(`      Traits: ${character.traits?.length || 0} items`);
    console.log(`      Base Stats: ${character.baseStats?.length || 0} items`);
    console.log(`      Skills: ${character.skills?.length || 0} items`);
    if (character.skills && character.skills.length > 0) {
      const activeCount = character.skills.filter(s => s.type === 'active').length;
      const ultimateCount = character.skills.filter(s => s.type === 'ultimate').length;
      const passiveCount = character.skills.filter(s => s.type === 'passive').length;
      console.log(`         - Active: ${activeCount}`);
      console.log(`         - Ultimate: ${ultimateCount}`);
      console.log(`         - Passive: ${passiveCount}`);
    }
    console.log(`      Passive Upgrades: ${character.passiveUpgrades?.length || 0} items`);
    console.log(`      Intron Levels: ${character.intron?.length || 0} items`);
    console.log(`      Build Guide: ${character.build ? '✅' : '❌'}`);
    if (character.build) {
      console.log(`         - Pros: ${character.build.pros?.length || 0} items`);
      console.log(`         - Cons: ${character.build.cons?.length || 0} items`);
    }
    
    console.log('\n' + '-'.repeat(60) + '\n');
  }
  
  console.log('='.repeat(60));
  console.log(`\n✅ Dry run complete! Reviewed ${files.length} files.`);
  console.log(`\nTo run the actual migration, use: npm run migrate:characters\n`);
}

// Run dry run
dryRunMigration().catch(console.error);

