// Shared filter constants for consistent filtering across the application

// Role options - Updated from Sanity data (2026-03-30)
// Simplified to main categories for filtering
export const ROLE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'DPS', label: 'DPS' },
  { value: 'Support', label: 'Support' },
] as const;

// Element options - Updated from Sanity data (2026-03-30)
// All characters now have proper elements (no more "Unknown")
export const ELEMENT_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Pyro', label: 'Pyro' },
  { value: 'Anemo', label: 'Anemo' },
  { value: 'Hydro', label: 'Hydro' },
  { value: 'Lumino', label: 'Lumino' },
  { value: 'Electro', label: 'Electro' },
  { value: 'Umbro', label: 'Umbro' },
] as const;

export const WEAPON_CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'Melee', label: 'Melee' },
  { value: 'Range', label: 'Range' },
] as const;

export const WEAPON_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Sword', label: 'Sword' },
  { value: 'Whipsword', label: 'Whipsword' },
  { value: 'Greatsword', label: 'Greatsword' },
  { value: 'Dual Blades', label: 'Dual Blades' },
  { value: 'Katana', label: 'Katana' },
  { value: 'Polearm', label: 'Polearm' },
  { value: 'Dual Pistols', label: 'Dual Pistols' },
  { value: 'Pistol', label: 'Pistol' },
  { value: 'Shotgun', label: 'Shotgun' },
  { value: 'Grenade Launcher', label: 'Grenade Launcher' },
] as const;

// Weapon element options (for weapons, not characters)
// Based on actual Sanity data: Neutral, Pyro, Hydro, Anemo
// (Lumino, Electro, Umbro included for future weapons)
export const WEAPON_ELEMENT_OPTIONS = [
  { value: '', label: 'All Elements' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Pyro', label: 'Pyro' },
  { value: 'Hydro', label: 'Hydro' },
  { value: 'Anemo', label: 'Anemo' },
  { value: 'Lumino', label: 'Lumino' },
  { value: 'Electro', label: 'Electro' },
  { value: 'Umbro', label: 'Umbro' },
] as const;

// Weapon damage type options
export const WEAPON_DAMAGE_TYPE_OPTIONS = [
  { value: '', label: 'All Damage Types' },
  { value: 'Spike', label: 'Spike' },
  { value: 'Slash', label: 'Slash' },
  { value: 'Smash', label: 'Smash' },
] as const;

// Legacy support - keep the old WEAPON_OPTIONS for backward compatibility
export const WEAPON_OPTIONS = WEAPON_TYPE_OPTIONS;

export const TIER_OPTIONS = [
  { value: '', label: 'All Tiers' },
  { value: 'EX', label: 'EX Tier' },
  { value: 'S', label: 'S Tier' },
  { value: 'A', label: 'A Tier' },
  { value: 'B', label: 'B Tier' },
  { value: 'C', label: 'C Tier' },
  { value: 'D', label: 'D Tier' },
  { value: 'E', label: 'E Tier' },
] as const;

export const CHARACTER_RARITY_OPTIONS = [
  { value: '', label: 'All' },
  { value: '3★', label: '3★' },
  { value: '4★', label: '4★' },
  { value: '5★', label: '5★' },
] as const;

export const WEAPON_RARITY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'SSR', label: 'SSR' },
  { value: 'SR', label: 'SR' },
  { value: 'R', label: 'R' },
  { value: 'N', label: 'N' },
] as const;

// Color mapping functions for consistent styling
export const getRoleColor = (role: string) => {
  const roleLower = role.toLowerCase();

  // Check if role starts with "DPS" or "Support"
  if (roleLower.startsWith('dps')) {
    return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
  } else if (roleLower.startsWith('support')) {
    return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
  }

  return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
};

export const getElementColor = (element: string) => {
  switch (element.toLowerCase()) {
    case 'pyro':
      return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
    case 'anemo':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200';
    case 'hydro':
      return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
    case 'lumino':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200';
    case 'electro':
      return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
    case 'umbro':
      return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  }
};

// Weapon element color mapping (for weapon-specific elements)
export const getWeaponElementColor = (element: string) => {
  switch (element.toLowerCase()) {
    case 'neutral':
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
    case 'pyro':
      return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
    case 'hydro':
      return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
    case 'lumino':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200';
    case 'electro':
      return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
    case 'anemo':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200';
    case 'umbro':
      return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  }
};

// Weapon damage type color mapping
export const getWeaponDamageTypeColor = (damageType: string) => {
  switch (damageType.toLowerCase()) {
    case 'spike':
      return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200';
    case 'slash':
      return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
    case 'smash':
      return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  }
};

export const getWeaponColor = (weapon: string) => {
  switch (weapon.toLowerCase()) {
    case 'sword':
      return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200:bg-slate-700';
    case 'sniper':
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200:bg-gray-700';
    case 'staff':
      return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200:bg-purple-800';
    case 'spear':
      return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200:bg-green-800';
    case 'bow':
      return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200:bg-orange-800';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200:bg-gray-700';
  }
};

export const getCharacterRarityColor = (rarity: string) => {
  switch (rarity) {
    case '5★':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
    case '4★':
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    case '3★':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  }
};

export const getTierColor = (tier: string) => {
  switch (tier) {
    case 'EX':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
    case 'S':
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    case 'A':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    case 'B':
      return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
    case 'C':
      return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
    case 'D':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    case 'E':
      return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  }
};
