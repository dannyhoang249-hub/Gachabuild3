// Mode-based tier list data for Duet Night Abyss
// Each mode (Farming/Party/Boss) has different tier rankings
// Each tier has two lanes: DPS and Support

export type GameMode = 'farming' | 'party' | 'boss';
export type TierLevel = 'T0' | 'T1' | 'T2' | 'T3';
export type LaneType = 'dps' | 'support';

export interface TierLanes {
  dps: string[];      // Character slugs for DPS lane
  support: string[];  // Character slugs for Support lane
}

export interface ModeTierData {
  [key: string]: TierLanes;
}

export interface TierListData {
  farming: ModeTierData;
  party: ModeTierData;
  boss: ModeTierData;
}

// Mode-based tier list data
// Note: Character slugs should match the actual slugs in Sanity CMS
export const modeTierlist: TierListData = {
  // 🔷 Exploration (Farming) Mode
  farming: {
    T0: {
      dps: ['rebecca', 'psyche', 'lady-nifle', 'hellfire'],
      support: ['daphne', 'truffle-filbert', 'fina', 'protagonist']
    },
    T1: {
      dps: ['berenica', 'lynn', 'outsider', 'phantasio', 'rhythm', 'sibylle'],
      support: ['randy', 'tabethe']
    },
    T2: {
      dps: ['yale-oliver'],
      support: []
    },
    T3: {
      dps: ['margie'],
      support: []
    }
  },

  // 🔶 Party (Coop / AI) Mode
  party: {
    T0: {
      dps: ['psyche', 'lady-nifle'],
      support: ['fina', 'protagonist']
    },
    T1: {
      dps: ['berenica', 'outsider', 'rhythm', 'lynn'],
      support: ['randy', 'tabethe']
    },
    T2: {
      dps: ['sibylle'],
      support: ['truffle-filbert', 'daphne']
    },
    T3: {
      dps: ['margie'],
      support: []
    }
  },

  // 🔴 Boss (Solo) Mode
  boss: {
    T0: {
      dps: ['psyche', 'lady-nifle'],
      support: ['protagonist']
    },
    T1: {
      dps: ['berenica', 'outsider', 'phantasio'],
      support: ['fina']
    },
    T2: {
      dps: ['rhythm', 'sibylle'],
      support: ['truffle-filbert']
    },
    T3: {
      dps: ['margie'],
      support: []
    }
  }
};

// Helper function to get tier data for a specific mode
export function getTierDataForMode(mode: GameMode): ModeTierData {
  return modeTierlist[mode];
}

// Helper function to get all tier levels
export function getAllTierLevels(): TierLevel[] {
  return ['T0', 'T1', 'T2', 'T3'];
}

// Helper function to get all game modes
export function getAllGameModes(): GameMode[] {
  return ['farming', 'party', 'boss'];
}

// Helper function to get mode display name
export function getModeDisplayName(mode: GameMode): string {
  switch (mode) {
    case 'farming':
      return 'Exploration (Farming)';
    case 'party':
      return 'Party (Coop / AI)';
    case 'boss':
      return 'Boss (Solo)';
    default:
      return mode;
  }
}

// Helper function to get mode icon
export function getModeIcon(mode: GameMode): string {
  switch (mode) {
    case 'farming':
      return '🔷';
    case 'party':
      return '🔶';
    case 'boss':
      return '🔴';
    default:
      return '⚪';
  }
}

// Helper function to get tier color (light theme)
export function getTierColor(tier: TierLevel): { bg: string; text: string; border: string } {
  switch (tier) {
    case 'T0':
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
        text: 'text-amber-900',
        border: 'border-amber-300'
      };
    case 'T1':
      return {
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        text: 'text-purple-900',
        border: 'border-purple-300'
      };
    case 'T2':
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        text: 'text-blue-900',
        border: 'border-blue-300'
      };
    case 'T3':
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        text: 'text-gray-900',
        border: 'border-gray-300'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        border: 'border-gray-300'
      };
  }
}

// Helper function to get tier description
export function getTierDescription(tier: TierLevel): string {
  switch (tier) {
    case 'T0':
      return 'Best in class - Exceptional performance';
    case 'T1':
      return 'Excellent - Strong performance';
    case 'T2':
      return 'Good - Solid performance';
    case 'T3':
      return 'Viable - Situational use';
    default:
      return '';
  }
}

/**
 * Get tier rankings for a character across all modes
 * @param characterSlug - The character's slug
 * @returns Object with tier for each mode, or null if not ranked
 */
export function getCharacterTiers(characterSlug: string): {
  farming: TierLevel | null;
  party: TierLevel | null;
  boss: TierLevel | null;
} {
  const result = {
    farming: null as TierLevel | null,
    party: null as TierLevel | null,
    boss: null as TierLevel | null,
  };

  // Search through all modes and tiers
  const modes: GameMode[] = ['farming', 'party', 'boss'];
  const tiers: TierLevel[] = ['T0', 'T1', 'T2', 'T3'];

  modes.forEach((mode) => {
    tiers.forEach((tier) => {
      const tierData = modeTierlist[mode][tier];
      if (tierData) {
        // Check both DPS and Support lanes
        if (tierData.dps.includes(characterSlug) || tierData.support.includes(characterSlug)) {
          result[mode] = tier;
        }
      }
    });
  });

  return result;
}

