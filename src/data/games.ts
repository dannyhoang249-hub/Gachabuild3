export interface Game {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
  comingSoon?: boolean;
  navigationItems: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  href: string;
  disabled?: boolean;
  category?: string;
}

export const games: Game[] = [
  {
    id: 'dna',
    name: 'Duet Night Abyss',
    shortName: 'DNA',
    icon: '/duetnightabyss.png',
    color: 'blue',
    description: 'Character Guide Hub',
    isActive: true,
    navigationItems: [
      {
        id: 'tier-list',
        icon: '🏆',
        label: 'Tier List',
        href: '/tier-list',
        category: 'main'
      },
      {
        id: 'characters',
        icon: '📁',
        label: 'Character Database',
        href: '/characters',
        category: 'main'
      },
      {
        id: 'weapons',
        icon: '⚔️',
        label: 'Weapons Database',
        href: '/weapons',
        category: 'main'
      },
      {
        id: 'guides',
        icon: '📘',
        label: 'Guide Hub',
        href: '/guides/builds',
        category: 'main'
      },
      {
        id: 'patch',
        icon: '🔄',
        label: 'Patch Update',
        href: '/patch',
        disabled: true,
        category: 'main'
      }
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    shortName: 'GI',
    icon: '⚔️',
    color: 'green',
    description: 'Adventure Guide',
    isActive: false,
    comingSoon: true,
    navigationItems: [
      {
        id: 'tier-list',
        icon: '🏆',
        label: 'Character Tier List',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      },
      {
        id: 'weapons',
        icon: '⚔️',
        label: 'Weapons Database',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'artifacts',
        icon: '💎',
        label: 'Artifacts',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'builds',
        icon: '🔧',
        label: 'Build Calculator',
        href: '#',
        disabled: true,
        category: 'tools'
      },
      {
        id: 'spiral-abyss',
        icon: '🌪️',
        label: 'Spiral Abyss',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      }
    ]
  },
  {
    id: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    shortName: 'HSR',
    icon: '🚀',
    color: 'purple',
    description: 'Trailblazer Guide',
    isActive: false,
    comingSoon: true,
    navigationItems: [
      {
        id: 'tier-list',
        icon: '🏆',
        label: 'Character Tier List',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      },
      {
        id: 'light-cones',
        icon: '💫',
        label: 'Light Cones',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'relics',
        icon: '🔮',
        label: 'Relics',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'simulated-universe',
        icon: '🌌',
        label: 'Simulated Universe',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      },
      {
        id: 'moc',
        icon: '⚡',
        label: 'Memory of Chaos',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      }
    ]
  },
  {
    id: 'wuthering-waves',
    name: 'Wuthering Waves',
    shortName: 'WW',
    icon: '🌊',
    color: 'cyan',
    description: 'Resonator Guide',
    isActive: false,
    comingSoon: true,
    navigationItems: [
      {
        id: 'tier-list',
        icon: '🏆',
        label: 'Resonator Tier List',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      },
      {
        id: 'resonators',
        icon: '👤',
        label: 'Resonators',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'weapons',
        icon: '⚔️',
        label: 'Weapons',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'echoes',
        icon: '🎵',
        label: 'Echoes',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'tower-of-adversity',
        icon: '🗼',
        label: 'Tower of Adversity',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      }
    ]
  },
  {
    id: 'zenless-zone-zero',
    name: 'Zenless Zone Zero',
    shortName: 'ZZZ',
    icon: '🎮',
    color: 'orange',
    description: 'Proxy Guide',
    isActive: false,
    comingSoon: true,
    navigationItems: [
      {
        id: 'tier-list',
        icon: '🏆',
        label: 'Agent Tier List',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      },
      {
        id: 'agents',
        icon: '🕴️',
        label: 'Agents',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'bangs',
        icon: '💥',
        label: 'Bangs',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'disc-drives',
        icon: '💿',
        label: 'Disc Drives',
        href: '#',
        disabled: true,
        category: 'database'
      },
      {
        id: 'hollow-zero',
        icon: '🌑',
        label: 'Hollow Zero',
        href: '#',
        disabled: true,
        category: 'tier-lists'
      }
    ]
  }
];

export const getActiveGame = (): Game => {
  return games.find(game => game.isActive) || games[0];
};

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

export const getNavigationCategories = (game: Game) => {
  const categories: { [key: string]: NavigationItem[] } = {};
  
  game.navigationItems.forEach(item => {
    const category = item.category || 'main';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });
  
  return categories;
};
