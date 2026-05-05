/**
 * Build Algorithm Configuration
 * Based on Team & Weapon Recommendation Engine v2.3
 * From: Buildguide_logic.md
 *
 * v2.3 Changes:
 * - Added Proficiency Gate (Appendix A) - Hard requirement for weapon eligibility
 * - Added WEAPON_TYPE_CANONICAL mapping for normalization
 * - Added proficiencyMatchBonus (+0.03 for Main proficiency match)
 */

import { AlgorithmConfig } from './types';

export const ALGORITHM_CONFIG: AlgorithmConfig = {
  version: '2.3',
  
  // Scoring weights from Buildguide_logic.md
  weights: {
    elementScore: 0.35,
    statSimilarity: 0.45,
    roleAlignment: 0.20
  },
  
  // Element advantage chain: Hydro → Pyro → Anemo → Electro → Hydro
  elementAdvantage: {
    'Hydro': 'Pyro',
    'Pyro': 'Anemo',
    'Anemo': 'Electro',
    'Electro': 'Hydro',
    'Lumino': 'Umbro',
    'Umbro': 'Lumino'
  },
  
  // Element opposition
  elementOpposition: {
    'Lumino': 'Umbro',
    'Umbro': 'Lumino'
  },
  
  // Mode-specific stat priorities
  modeBonus: {
    solo: ['crit', 'atk', 'skilldmg', 'cdr'],
    farm: ['aoe', 'duration', 'trigger', 'summon'],
    boss: ['crit', 'atk', 'skilldmg', 'cdr', 'dot']
  },
  
  // Role-specific signal priorities (from Buildguide_logic.md)
  rolePriorities: {
    'DPS': ['atk', 'crit', 'skilldmg', 'cdr', 'aspd'],
    'Support': ['heal', 'shield', 'duration', 'sanity', 'skilldmg'],
    'Tank': ['hp', 'def', 'shield', 'heal'],
    'Summoner': ['summon', 'duration', 'skilldmg', 'atk']
  },

  // Proficiency Gate bonus (Appendix A)
  proficiencyMatchBonus: 0.03
};

/**
 * Weapon Type Canonical Mapping (Appendix A - Proficiency Gate)
 * Normalizes weapon type names for proficiency matching
 *
 * Maps various weapon type representations to canonical names
 */
export const WEAPON_TYPE_CANONICAL: Record<string, string> = {
  // Melee weapons
  'Sword': 'Sword',
  'Whipsword': 'Whipsword',
  'Chainblade(Whipsword)': 'Whipsword',
  'Chainblade': 'Whipsword',
  'Greatsword': 'Greatsword',
  'Spear': 'Spear',
  'Polearm': 'Spear',
  'Dagger': 'Dagger',
  'Gauntlet': 'Gauntlet',
  'Gauntlets': 'Gauntlet',
  'Dual Blades': 'Dual Blades',
  'Katana': 'Katana',

  // Ranged weapons
  'Rifle': 'Assault Rifle',
  'Assault Rifle': 'Assault Rifle',
  'AR': 'Assault Rifle',
  'Rifle(AR)': 'Assault Rifle',
  'Dual Pistols': 'Dual Pistols',
  'Pistols(Dual)': 'Dual Pistols',
  'Pistol': 'Pistol',
  'Bow': 'Bow',
  'Grenade Launcher': 'Grenade Launcher',
  'GL': 'Grenade Launcher',
  'Shotgun': 'Shotgun',

  // Add more mappings as needed
};

// Weapon type classification
export const MELEE_WEAPONS = [
  'Sword',
  'Whipsword',
  'Greatsword',
  'Spear',
  'Polearm',
  'Dagger',
  'Gauntlet',
  'Dual Blades',
  'Katana'
];

export const RANGED_WEAPONS = [
  'Rifle',
  'Assault Rifle',
  'Dual Pistols',
  'Bow',
  'Grenade Launcher',
  'Pistol',
  'Shotgun'
];

// Signal keywords for text parsing
export const SIGNAL_KEYWORDS = {
  hp: ['hp', 'health', 'max hp'],
  atk: ['atk', 'attack', 'dmg', 'damage'],
  def: ['def', 'defense'],
  crit: ['crit', 'critical'],
  aspd: ['aspd', 'attack speed', 'atk speed'],
  duration: ['duration'],
  trigger: ['trigger', 'proc'],
  reload: ['reload', 'ammo'],
  sanity: ['sanity'],
  shield: ['shield'],
  heal: ['heal', 'healing', 'recovery'],
  dot: ['dot', 'burn', 'bleed', 'poison', 'decay'],
  summon: ['summon', 'yunchi', 'pet'],
  aoe: ['aoe', 'area', 'radius'],
  skilldmg: ['skill dmg', 'skill damage', 'skill efficiency'],
  cdr: ['cdr', 'cooldown', 'skill speed']
};

// Role detection keywords
export const ROLE_KEYWORDS = {
  DPS: ['dps', 'damage', 'consonance weapon', 'weapon dmg'],
  Support: ['support', 'heal', 'control', 'sanity recovery'],
  Tank: ['tank', 'defense', 'shield'],
  Summoner: ['summon', 'pet']
};

