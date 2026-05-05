/**
 * Data parsing utilities for build algorithm
 * Converts CSV data into normalized signal vectors
 */

import { CharacterData, WeaponData, ParsedCharacter, ParsedWeapon } from './types';
import { SIGNAL_KEYWORDS, ROLE_KEYWORDS, MELEE_WEAPONS, RANGED_WEAPONS } from './config';

/**
 * Extract signal strength from text using keyword matching
 */
function extractSignals(text: string): Record<string, number> {
  const signals: Record<string, number> = {
    hp: 0, atk: 0, def: 0, crit: 0, aspd: 0,
    duration: 0, trigger: 0, reload: 0, sanity: 0,
    shield: 0, heal: 0, dot: 0, summon: 0,
    aoe: 0, skilldmg: 0, cdr: 0
  };

  const lowerText = text.toLowerCase();

  // Count keyword occurrences and extract numeric values
  for (const [signal, keywords] of Object.entries(SIGNAL_KEYWORDS)) {
    let count = 0;
    let totalValue = 0;

    for (const keyword of keywords) {
      // Count occurrences
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        count += matches.length;
      }

      // Extract numeric values near keywords (e.g., "ATK +20%")
      const valueRegex = new RegExp(`${keyword}[^\\d]*(\\+?\\d+(?:\\.\\d+)?)%?`, 'gi');
      const valueMatches = [...lowerText.matchAll(valueRegex)];
      for (const match of valueMatches) {
        const value = parseFloat(match[1]);
        if (!isNaN(value)) {
          totalValue += value;
        }
      }
    }

    // Combine count and values for signal strength
    signals[signal] = count + (totalValue / 100);
  }

  return signals;
}

/**
 * Normalize signal vector to 0-1 range
 */
function normalizeSignals(signals: Record<string, number>): Record<string, number> {
  const values = Object.values(signals);
  const max = Math.max(...values, 1); // Avoid division by zero
  
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(signals)) {
    normalized[key] = value / max;
  }
  
  return normalized;
}

/**
 * Determine role bucket from role text
 */
function determineRoleBucket(roleText: string): 'DPS' | 'Support' | 'Tank' | 'Summoner' {
  const lowerRole = roleText.toLowerCase();
  
  // Check for summoner first (most specific)
  if (ROLE_KEYWORDS.Summoner.some(kw => lowerRole.includes(kw))) {
    return 'Summoner';
  }
  
  // Check for tank
  if (ROLE_KEYWORDS.Tank.some(kw => lowerRole.includes(kw))) {
    return 'Tank';
  }
  
  // Check for support
  if (ROLE_KEYWORDS.Support.some(kw => lowerRole.includes(kw))) {
    return 'Support';
  }
  
  // Default to DPS
  return 'DPS';
}

/**
 * Parse character data from CSV row
 */
export function parseCharacter(data: CharacterData): ParsedCharacter {
  // Combine all text fields for signal extraction
  const combinedText = [
    data.Role,
    data.Traits,
    data.Skills,
    data['Base Stats'],
    data['Skill Stats'],
    data['Intron Levels'],
    data['Passive Upgrades'],
    data.Feature
  ].join(' ');

  const rawSignals = extractSignals(combinedText);
  const normalizedSignals = normalizeSignals(rawSignals);

  return {
    name: data.Name,
    element: data.Element,
    role: data.Role,
    rarity: data.Rarity,
    weaponTypes: {
      main: data['Weapon Type (Main)'],
      sub: data['Weapon Type (Sub)']
    },
    signals: normalizedSignals as any,
    roleBucket: determineRoleBucket(data.Role)
  };
}

/**
 * Parse weapon data from CSV row
 */
export function parseWeapon(data: WeaponData): ParsedWeapon {
  // Combine text fields for signal extraction
  const combinedText = [
    data['Refinement Skill'],
    data['Base Stats'],
    data['Motion Values'],
    data.Description
  ].join(' ');

  const rawSignals = extractSignals(combinedText);
  const normalizedSignals = normalizeSignals(rawSignals);

  // Determine category
  let category: 'Melee' | 'Range' = 'Melee';
  if (data.Category) {
    category = data.Category === 'Range' ? 'Range' : 'Melee';
  } else {
    // Fallback: check weapon type
    category = RANGED_WEAPONS.includes(data['Weapon Type']) ? 'Range' : 'Melee';
  }

  return {
    name: data.Name,
    element: data.Element || 'Neutral',
    weaponType: data['Weapon Type'],
    category,
    damageType: data['Damage Type'],
    signals: normalizedSignals as any
  };
}

/**
 * Calculate cosine similarity between two signal vectors
 */
export function cosineSimilarity(
  signals1: Record<string, number>,
  signals2: Record<string, number>
): number {
  const keys = Object.keys(signals1);
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const key of keys) {
    const v1 = signals1[key] || 0;
    const v2 = signals2[key] || 0;
    
    dotProduct += v1 * v2;
    magnitude1 += v1 * v1;
    magnitude2 += v2 * v2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Calculate weighted signal similarity based on role priorities
 */
export function weightedSignalSimilarity(
  charSignals: Record<string, number>,
  weaponSignals: Record<string, number>,
  rolePriorities: string[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  // High priority signals get more weight
  rolePriorities.forEach((signal, index) => {
    const weight = rolePriorities.length - index; // Decreasing weight
    const charValue = charSignals[signal] || 0;
    const weaponValue = weaponSignals[signal] || 0;
    
    // Calculate similarity for this signal (1 - absolute difference)
    const similarity = 1 - Math.abs(charValue - weaponValue);
    
    weightedSum += similarity * weight;
    totalWeight += weight;
  });

  // Also include general cosine similarity with lower weight
  const generalSimilarity = cosineSimilarity(charSignals, weaponSignals);
  weightedSum += generalSimilarity * 2;
  totalWeight += 2;

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

