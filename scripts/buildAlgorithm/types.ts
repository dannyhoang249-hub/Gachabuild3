/**
 * Type definitions for the build algorithm
 * Based on Buildguide_logic.md specification
 */

export interface CharacterData {
  Name: string;
  Element: string;
  Role: string;
  Rarity: string;
  'Weapon Type (Main)': string;
  'Weapon Type (Sub)': string;
  Traits: string;
  Skills: string;
  'Base Stats': string;
  'Skill Stats': string;
  'Intron Levels': string;
  'Passive Upgrades': string;
  Feature: string;
}

export interface WeaponData {
  Name: string;
  Element: string;
  'Weapon Type': string;
  Category: string; // Melee or Range
  'Damage Type': string;
  Rarity: string;
  'Refinement Skill': string;
  'Base Stats': string;
  'Motion Values': string;
  Description: string;
}

export interface ParsedCharacter {
  name: string;
  element: string;
  role: string;
  rarity: string;
  weaponTypes: {
    main: string;
    sub: string;
  };
  signals: {
    hp: number;
    atk: number;
    def: number;
    crit: number;
    aspd: number;
    duration: number;
    trigger: number;
    reload: number;
    sanity: number;
    shield: number;
    heal: number;
    dot: number;
    summon: number;
    aoe: number;
    skilldmg: number;
    cdr: number;
  };
  roleBucket: 'DPS' | 'Support' | 'Tank' | 'Summoner';
}

export interface ParsedWeapon {
  name: string;
  element: string;
  weaponType: string;
  category: 'Melee' | 'Range';
  damageType: string;
  signals: {
    hp: number;
    atk: number;
    def: number;
    crit: number;
    aspd: number;
    duration: number;
    trigger: number;
    reload: number;
    sanity: number;
    shield: number;
    heal: number;
    dot: number;
    summon: number;
    aoe: number;
    skilldmg: number;
    cdr: number;
  };
}

export interface WeaponScore {
  weapon: ParsedWeapon;
  fitScore: number;
  elementScore: number;
  statSimilarity: number;
  roleAlignment: number;
}

export interface WeaponPair {
  melee: ParsedWeapon;
  ranged: ParsedWeapon;
  meleeScore: number;
  rangedScore: number;
  pairScore: number;
  reasoning: string;
}

export interface TeamComposition {
  mode: 'solo' | 'farm' | 'boss';
  mainCharacter: ParsedCharacter;
  partner1: ParsedCharacter;
  partner2: ParsedCharacter;
  teamScore: number;
  synergies: Array<{
    type: string;
    description: string;
  }>;
}

export interface BuildRecommendation {
  character: ParsedCharacter;
  soloMode: {
    weaponPairs: WeaponPair[];
    statPriority: string[];
    playstyleTips: string;
  };
  farmMode: {
    weaponPairs: WeaponPair[];
    statPriority: string[];
    playstyleTips: string;
  };
  bossMode: {
    weaponPairs: WeaponPair[];
    statPriority: string[];
    playstyleTips: string;
  };
  teamCompositions: TeamComposition[];
  algorithmVersion: string;
  lastCalculated: string;
}

export type GameMode = 'solo' | 'farm' | 'boss';

export interface AlgorithmConfig {
  version: string;
  weights: {
    elementScore: number;
    statSimilarity: number;
    roleAlignment: number;
  };
  elementAdvantage: Record<string, string>;
  elementOpposition: Record<string, string>;
  modeBonus: Record<GameMode, string[]>;
  rolePriorities: Record<string, string[]>;
  proficiencyMatchBonus: number;
}

