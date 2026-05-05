/**
 * Build recommendation generator
 * Main entry point for generating build guides
 */

import { ParsedCharacter, ParsedWeapon, BuildRecommendation, TeamComposition, GameMode } from './types';
import { createWeaponPairs, calculateTeamScore, getStatPriority } from './scoring';
import { ALGORITHM_CONFIG } from './config';

/**
 * Generate playstyle tips based on character role and mode
 */
function generatePlaystyleTips(
  character: ParsedCharacter,
  mode: GameMode
): string {
  const roleTips: Record<string, Record<GameMode, string>> = {
    'DPS': {
      solo: 'Focus on maximizing burst damage windows. Use skill rotations to maintain high DPS uptime.',
      farm: 'Prioritize AoE abilities to clear groups efficiently. Maintain momentum between enemy packs.',
      boss: 'Optimize critical hit timing and skill combos. Save ultimate abilities for damage phases.'
    },
    'Support': {
      solo: 'Balance damage output with self-sustain. Use support abilities to extend combat effectiveness.',
      farm: 'Provide buffs and healing to maintain high clear speed. Focus on area control.',
      boss: 'Maximize team buffs and debuffs. Time healing and shields for critical moments.'
    },
    'Tank': {
      solo: 'Use defensive abilities to survive extended fights. Counter-attack during enemy downtime.',
      farm: 'Gather enemies with crowd control. Use AoE damage during defensive windows.',
      boss: 'Maintain aggro and position boss optimally. Use defensive cooldowns for major attacks.'
    },
    'Summoner': {
      solo: 'Maintain summon uptime. Let summons handle damage while you focus on positioning.',
      farm: 'Deploy summons to handle multiple enemy groups. Maximize summon efficiency.',
      boss: 'Stack summon damage buffs. Coordinate summon abilities with your own skills.'
    }
  };

  return roleTips[character.roleBucket]?.[mode] || 'Adapt your playstyle based on the situation.';
}

/**
 * Find best team compositions for a character
 */
function findBestTeams(
  mainCharacter: ParsedCharacter,
  allCharacters: ParsedCharacter[],
  mode: GameMode,
  topN: number = 3
): TeamComposition[] {
  const teams: TeamComposition[] = [];

  // Filter out the main character
  const partners = allCharacters.filter(c => c.name !== mainCharacter.name);

  // Generate all possible 2-partner combinations
  for (let i = 0; i < partners.length; i++) {
    for (let j = i + 1; j < partners.length; j++) {
      const partner1 = partners[i];
      const partner2 = partners[j];

      const teamScore = calculateTeamScore(mainCharacter, partner1, partner2);

      const synergies = analyzeTeamSynergies(mainCharacter, partner1, partner2);

      teams.push({
        mode,
        mainCharacter,
        partner1,
        partner2,
        teamScore,
        synergies
      });
    }
  }

  // Sort by team score and return top N
  teams.sort((a, b) => b.teamScore - a.teamScore);
  return teams.slice(0, topN);
}

/**
 * Analyze synergies between team members
 */
function analyzeTeamSynergies(
  main: ParsedCharacter,
  partner1: ParsedCharacter,
  partner2: ParsedCharacter
): Array<{ type: string; description: string }> {
  const synergies: Array<{ type: string; description: string }> = [];

  // Element synergies
  const elements = [main.element, partner1.element, partner2.element];
  const uniqueElements = new Set(elements);

  if (uniqueElements.size === 3) {
    synergies.push({
      type: 'Element Diversity',
      description: 'Team has 3 different elements, providing versatile damage coverage and elemental reactions.'
    });
  }

  // Check for element advantage chain
  for (let i = 0; i < elements.length; i++) {
    const current = elements[i];
    const next = elements[(i + 1) % elements.length];
    
    if (ALGORITHM_CONFIG.elementAdvantage[current] === next) {
      synergies.push({
        type: 'Element Chain',
        description: `${current} → ${next} element advantage chain increases team damage output.`
      });
      break;
    }
  }

  // Role synergies
  const roles = [main.roleBucket, partner1.roleBucket, partner2.roleBucket];
  const uniqueRoles = new Set(roles);

  if (uniqueRoles.has('DPS') && uniqueRoles.has('Support')) {
    synergies.push({
      type: 'DPS + Support',
      description: 'Support characters enhance DPS effectiveness with buffs, healing, and crowd control.'
    });
  }

  if (uniqueRoles.has('Tank') && uniqueRoles.has('DPS')) {
    synergies.push({
      type: 'Tank + DPS',
      description: 'Tank provides survivability while DPS focuses on damage output.'
    });
  }

  if (uniqueRoles.has('Summoner')) {
    synergies.push({
      type: 'Summoner Presence',
      description: 'Summons provide additional damage and battlefield control.'
    });
  }

  // If no specific synergies found, add a generic one
  if (synergies.length === 0) {
    synergies.push({
      type: 'Balanced Team',
      description: 'Well-rounded team composition suitable for various content.'
    });
  }

  return synergies;
}

/**
 * Generate complete build recommendation for a character
 */
export function generateBuildRecommendation(
  character: ParsedCharacter,
  allCharacters: ParsedCharacter[],
  allWeapons: ParsedWeapon[]
): BuildRecommendation {
  // Generate weapon pairs for each mode
  const soloPairs = createWeaponPairs(character, allWeapons, 'solo');
  const farmPairs = createWeaponPairs(character, allWeapons, 'farm');
  const bossPairs = createWeaponPairs(character, allWeapons, 'boss');

  // Find best teams for each mode
  const soloTeams = findBestTeams(character, allCharacters, 'solo', 3);
  const farmTeams = findBestTeams(character, allCharacters, 'farm', 3);
  const bossTeams = findBestTeams(character, allCharacters, 'boss', 3);

  return {
    character,
    soloMode: {
      weaponPairs: soloPairs,
      statPriority: getStatPriority('solo'),
      playstyleTips: generatePlaystyleTips(character, 'solo')
    },
    farmMode: {
      weaponPairs: farmPairs,
      statPriority: getStatPriority('farm'),
      playstyleTips: generatePlaystyleTips(character, 'farm')
    },
    bossMode: {
      weaponPairs: bossPairs,
      statPriority: getStatPriority('boss'),
      playstyleTips: generatePlaystyleTips(character, 'boss')
    },
    teamCompositions: [...soloTeams, ...farmTeams, ...bossTeams],
    algorithmVersion: ALGORITHM_CONFIG.version,
    lastCalculated: new Date().toISOString()
  };
}

/**
 * Generate build recommendations for all characters
 */
export function generateAllBuilds(
  characters: ParsedCharacter[],
  weapons: ParsedWeapon[]
): BuildRecommendation[] {
  return characters.map(character => 
    generateBuildRecommendation(character, characters, weapons)
  );
}

