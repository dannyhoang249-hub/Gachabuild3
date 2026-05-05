/**
 * Scoring engine for build recommendations
 * Implements the algorithm from Buildguide_logic.md
 *
 * v2.3 Changes:
 * - Added Proficiency Gate (Appendix A) - Hard requirement for weapon eligibility
 * - Weapons must match character's Main or Sub proficiency to be eligible
 * - Main proficiency match grants +0.03 bonus to FitScore
 */

import { ParsedCharacter, ParsedWeapon, WeaponScore, WeaponPair, GameMode } from './types';
import { ALGORITHM_CONFIG, WEAPON_TYPE_CANONICAL } from './config';
import { weightedSignalSimilarity } from './parser';

/**
 * Normalize weapon type using canonical mapping (Appendix A)
 */
function normalizeWeaponType(weaponType: string): string {
  const trimmed = weaponType.trim();
  return WEAPON_TYPE_CANONICAL[trimmed] || trimmed;
}

/**
 * Check if weapon passes Proficiency Gate (Appendix A - Hard Requirement)
 * Returns: { eligible: boolean, isMainProficiency: boolean }
 *
 * A weapon is eligible only if it appears in character's proficiency list.
 * If it matches Main proficiency → eligible + bonus
 * If it matches Sub proficiency → eligible (no bonus)
 * Otherwise → NOT eligible (must be discarded)
 */
export function checkProficiencyGate(
  character: ParsedCharacter,
  weapon: ParsedWeapon
): { eligible: boolean; isMainProficiency: boolean } {
  const weaponTypeNormalized = normalizeWeaponType(weapon.weaponType);
  const mainProficiency = normalizeWeaponType(character.weaponTypes.main);
  const subProficiency = normalizeWeaponType(character.weaponTypes.sub);

  // Check Main proficiency match
  if (weaponTypeNormalized === mainProficiency) {
    return { eligible: true, isMainProficiency: true };
  }

  // Check Sub proficiency match
  if (weaponTypeNormalized === subProficiency) {
    return { eligible: true, isMainProficiency: false };
  }

  // Not in proficiency list → discard
  return { eligible: false, isMainProficiency: false };
}

/**
 * Calculate element score between character and weapon
 * Returns 1.0 for advantage, 0.5 for same element, 0.3 for opposition, 0.0 otherwise
 */
export function calculateElementScore(charElement: string, weaponElement: string): number {
  // Neutral weapons work with anyone
  if (weaponElement === 'Neutral') {
    return 0.7;
  }

  // Same element
  if (charElement === weaponElement) {
    return 0.5;
  }

  // Element advantage (e.g., Hydro char with Pyro weapon)
  const advantageElement = ALGORITHM_CONFIG.elementAdvantage[charElement];
  if (weaponElement === advantageElement) {
    return 1.0;
  }

  // Element opposition (Lumino vs Umbro)
  const oppositionElement = ALGORITHM_CONFIG.elementOpposition[charElement];
  if (weaponElement === oppositionElement) {
    return 0.3;
  }

  // No special relationship
  return 0.4;
}

/**
 * Calculate role alignment score
 * How well the weapon's signals match the character's role priorities
 */
export function calculateRoleAlignment(
  character: ParsedCharacter,
  weapon: ParsedWeapon
): number {
  const rolePriorities = ALGORITHM_CONFIG.rolePriorities[character.roleBucket] || [];
  
  let alignmentScore = 0;
  let totalWeight = 0;

  rolePriorities.forEach((signal, index) => {
    const weight = rolePriorities.length - index;
    const weaponValue = weapon.signals[signal] || 0;
    
    alignmentScore += weaponValue * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? alignmentScore / totalWeight : 0;
}

/**
 * Calculate overall weapon fit score
 * FitScore = 0.35×ElementScore + 0.45×StatSimilarity + 0.20×RoleAlignment
 *
 * v2.3: Added Proficiency Gate check and Main proficiency bonus
 * Returns null if weapon doesn't pass proficiency gate
 */
export function calculateWeaponFitScore(
  character: ParsedCharacter,
  weapon: ParsedWeapon
): WeaponScore | null {
  // Appendix A: Proficiency Gate (Hard Requirement)
  const proficiencyCheck = checkProficiencyGate(character, weapon);

  // If weapon is not eligible, discard it (return null)
  if (!proficiencyCheck.eligible) {
    return null;
  }

  const elementScore = calculateElementScore(character.element, weapon.element);

  const rolePriorities = ALGORITHM_CONFIG.rolePriorities[character.roleBucket] || [];
  const statSimilarity = weightedSignalSimilarity(
    character.signals,
    weapon.signals,
    rolePriorities
  );

  const roleAlignment = calculateRoleAlignment(character, weapon);

  // Calculate base fit score
  let fitScore =
    ALGORITHM_CONFIG.weights.elementScore * elementScore +
    ALGORITHM_CONFIG.weights.statSimilarity * statSimilarity +
    ALGORITHM_CONFIG.weights.roleAlignment * roleAlignment;

  // Appendix A: Add proficiency match bonus if Main proficiency
  if (proficiencyCheck.isMainProficiency) {
    fitScore += ALGORITHM_CONFIG.proficiencyMatchBonus;
  }

  return {
    weapon,
    fitScore,
    elementScore,
    statSimilarity,
    roleAlignment
  };
}

/**
 * Find top N weapons for a character in a specific category (Melee or Range)
 * v2.3: Filters out weapons that don't pass proficiency gate
 */
export function findTopWeapons(
  character: ParsedCharacter,
  weapons: ParsedWeapon[],
  category: 'Melee' | 'Range',
  topN: number = 5
): WeaponScore[] {
  // Filter weapons by category
  const categoryWeapons = weapons.filter(w => w.category === category);

  // Score all weapons (returns null for ineligible weapons)
  const scoredWeapons = categoryWeapons
    .map(weapon => calculateWeaponFitScore(character, weapon))
    .filter((score): score is WeaponScore => score !== null); // Remove null entries

  // Sort by fit score (descending)
  scoredWeapons.sort((a, b) => b.fitScore - a.fitScore);

  // Return top N
  return scoredWeapons.slice(0, topN);
}

/**
 * Create weapon pairs (Melee + Ranged)
 * Returns top 3 pairs based on combined score
 */
export function createWeaponPairs(
  character: ParsedCharacter,
  weapons: ParsedWeapon[],
  mode: GameMode
): WeaponPair[] {
  const topMelee = findTopWeapons(character, weapons, 'Melee', 5);
  const topRanged = findTopWeapons(character, weapons, 'Range', 5);

  const pairs: WeaponPair[] = [];

  // Create all combinations
  for (const meleeScore of topMelee) {
    for (const rangedScore of topRanged) {
      // Calculate pair score (average of both weapons)
      const pairScore = (meleeScore.fitScore + rangedScore.fitScore) / 2;

      // Apply mode-specific bonus
      const modeBonus = calculateModeBonus(
        meleeScore.weapon,
        rangedScore.weapon,
        mode
      );

      const finalScore = pairScore * (1 + modeBonus);

      pairs.push({
        melee: meleeScore.weapon,
        ranged: rangedScore.weapon,
        meleeScore: meleeScore.fitScore,
        rangedScore: rangedScore.fitScore,
        pairScore: finalScore,
        reasoning: generatePairReasoning(meleeScore, rangedScore, mode)
      });
    }
  }

  // Sort by pair score and return top 3
  pairs.sort((a, b) => b.pairScore - a.pairScore);
  return pairs.slice(0, 3);
}

/**
 * Calculate mode-specific bonus for weapon pair
 */
function calculateModeBonus(
  melee: ParsedWeapon,
  ranged: ParsedWeapon,
  mode: GameMode
): number {
  const modeSignals = ALGORITHM_CONFIG.modeBonus[mode] || [];
  
  let bonusScore = 0;
  for (const signal of modeSignals) {
    const meleeValue = melee.signals[signal] || 0;
    const rangedValue = ranged.signals[signal] || 0;
    bonusScore += (meleeValue + rangedValue) / 2;
  }

  // Normalize bonus (0-0.2 range)
  return Math.min(bonusScore / modeSignals.length * 0.2, 0.2);
}

/**
 * Generate human-readable reasoning for weapon pair
 */
function generatePairReasoning(
  meleeScore: WeaponScore,
  rangedScore: WeaponScore,
  mode: GameMode
): string {
  const reasons: string[] = [];

  // Element synergy
  if (meleeScore.elementScore >= 0.7 || rangedScore.elementScore >= 0.7) {
    reasons.push('Strong elemental synergy');
  }

  // Stat alignment
  if (meleeScore.statSimilarity >= 0.7 && rangedScore.statSimilarity >= 0.7) {
    reasons.push('Excellent stat alignment');
  }

  // Mode-specific
  const modeDescriptions = {
    solo: 'Optimized for solo play with high burst damage',
    farm: 'Great for farming with AoE and efficiency',
    boss: 'Maximizes single-target DPS for boss fights'
  };
  reasons.push(modeDescriptions[mode]);

  return reasons.join('. ') + '.';
}

/**
 * Calculate team synergy score
 */
export function calculateTeamScore(
  main: ParsedCharacter,
  partner1: ParsedCharacter,
  partner2: ParsedCharacter
): number {
  let score = 0;

  // Element diversity bonus
  const elements = new Set([main.element, partner1.element, partner2.element]);
  score += elements.size * 0.15; // Up to 0.45 for 3 different elements

  // Role diversity bonus
  const roles = new Set([main.roleBucket, partner1.roleBucket, partner2.roleBucket]);
  score += roles.size * 0.15; // Up to 0.45 for 3 different roles

  // Element advantage chain bonus
  const hasAdvantageChain = checkElementAdvantageChain([main, partner1, partner2]);
  if (hasAdvantageChain) {
    score += 0.2;
  }

  // Normalize to 0-1
  return Math.min(score, 1.0);
}

/**
 * Check if team has element advantage chain
 */
function checkElementAdvantageChain(characters: ParsedCharacter[]): boolean {
  const elements = characters.map(c => c.element);
  
  for (let i = 0; i < elements.length; i++) {
    const current = elements[i];
    const next = elements[(i + 1) % elements.length];
    
    if (ALGORITHM_CONFIG.elementAdvantage[current] === next) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get stat priority for mode
 */
export function getStatPriority(mode: GameMode): string[] {
  return ALGORITHM_CONFIG.modeBonus[mode] || [];
}

