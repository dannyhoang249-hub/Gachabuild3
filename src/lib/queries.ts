import groq from 'groq'

// Character queries
export const CHARACTERS_QUERY = groq`
  *[_type == 'character' && !(_id match 'drafts.*')] | order(name.en asc) {
    _id,
    _updatedAt,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    overview,
    "image": coalesce(image.asset->url, image),
    "splash": coalesce(splash.asset->url, splash),
    profile,
    traits[] {
      name,
      effect
    },
    baseStats[] {
      stat,
      lv1,
      lvMax
    },
    passiveUpgrades[] {
      upgrade,
      value
    },
    skills[] {
      name,
      description,
      type,
      cooldown,
      cost,
      skillDMG,
      duration,
      range,
      misc,
      level
    },
    build {
      teamComposition,
      recommendedWeapons,
      recommendedArtifacts,
      statPriority,
      demonWedges,
      teamRecommendations,
      roleOverview,
      weapons,
      artifacts,
      team {
        main { name, meleeWeapon, rangedWeapon },
        partner1 { name, meleeWeapon, rangedWeapon },
        partner2 { name, meleeWeapon, rangedWeapon }
      },
      demondWedges {
        setName,
        slots,
        attributeBoosts[] { stat, value },
        notes
      }
    },
    synergy[] {
      partner,
      reason
    },
    pros[],
    cons[],
    recommendedWeapons[] {
      name,
      slug,
      priority
    }
  }
`

export const CHARACTER_BY_SLUG_QUERY = groq`
  *[_type == 'character' && !(_id in path('drafts.**')) && slug.current == $slug][0] {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    overview,
    "image": coalesce(image.asset->url, image),
    "splash": coalesce(splash.asset->url, splash),
    profile,
    traits[] { name, effect },
    baseStats[] { stat, lv1, lvMax },
    passiveUpgrades[] { upgrade, value },
    intron[] { level, effect },
    skills[] {
      name,
      description,
      type,
      subtype,
      cooldown,
      cost,
      skillDMG,
      duration,
      range,
      misc,
      level,
      stats[] { stat, lv1, lvMax, notes },
      icon {
        asset-> { url },
        alt
      }
    },
    build {
      teamComposition,
      recommendedWeapons,
      recommendedArtifacts,
      statPriority,
      demonWedges,
      teamRecommendations,
      roleOverview,
      weapons,
      artifacts,
      team {
        main { name, meleeWeapon, rangedWeapon },
        partner1 { name, meleeWeapon, rangedWeapon },
        partner2 { name, meleeWeapon, rangedWeapon }
      },
      demondWedges {
        setName,
        slots,
        attributeBoosts[] { stat, value },
        notes
      }
    },
    synergy[] {
      partner,
      reason
    },
    pros[],
    cons[],
    recommendedWeapons[] {
      name,
      slug,
      priority
    }
  }
`

// Weapon queries
export const WEAPONS_QUERY = groq`
  *[_type == 'weapon' && !(_id in path('drafts.**'))] | order(name.en asc) {
    _id,
    name,
    slug,
    type,
    category,
    element,
    damageType,
    rarity,
    description,
    passive,
    stats {
      attack,
      health,
      defense,
      critRate,
      critDamage
    },
    "image": coalesce(image.asset->url, image),
    recommendedCharacters
  }
`

export const WEAPON_BY_SLUG_QUERY = groq`
  *[_type == 'weapon' && !(_id in path('drafts.**')) && slug.current == $slug][0] {
    _id,
    name,
    slug,
    type,
    category,
    element,
    damageType,
    rarity,
    description,
    passive,
    refinementSkill {
      description,
      r1,
      r2,
      r3,
      r4,
      r5,
      r6
    },
    baseStats {
      spikeAtkLv1,
      spikeAtkLvMax,
      slashAtkLv1,
      slashAtkLvMax,
      smashAtkLv1,
      smashAtkLvMax,
      critChance,
      critDamage,
      atkSpeed,
      triggerProbability,
      multishot,
      magCapacity,
      maxAmmo,
      ammoConversionRate,
      projectileExplosionRange
    },
    motionValues,
    stats {
      attack,
      health,
      defense,
      critRate,
      critDamage
    },
    "image": coalesce(image.asset->url, image),
    recommendedCharacters
  }
`

// Character slugs for static generation
export const CHARACTER_SLUGS_QUERY = groq`
  *[_type == 'character' && !(_id in path('drafts.**'))].slug.current
`

// Weapon slugs for static generation
export const WEAPON_SLUGS_QUERY = groq`
  *[_type == 'weapon' && !(_id in path('drafts.**'))].slug.current
`

// Search queries for unified search functionality
export const SEARCH_CHARACTERS_QUERY = groq`
  *[_type == 'character' && !(_id in path('drafts.**')) && (
    name.en match $searchTerm + "*" ||
    name.vi match $searchTerm + "*" ||
    role match $searchTerm + "*" ||
    element match $searchTerm + "*" ||
    weapon match $searchTerm + "*" ||
    overview.en match $searchTerm + "*" ||
    overview.vi match $searchTerm + "*"
  )] | order(name.en asc) {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    image,
    splash
  }
`

export const SEARCH_WEAPONS_QUERY = groq`
  *[_type == 'weapon' && !(_id in path('drafts.**')) && (
    name.en match $searchTerm + "*" ||
    name.vi match $searchTerm + "*" ||
    type match $searchTerm + "*" ||
    description.en match $searchTerm + "*" ||
    description.vi match $searchTerm + "*" ||
    passive.en match $searchTerm + "*" ||
    passive.vi match $searchTerm + "*"
  )] | order(name.en asc) {
    _id,
    name,
    slug,
    type,
    rarity,
    "image": coalesce(image.asset->url, image),
    description
  }
`

// Combined search query for both characters and weapons
export const UNIFIED_SEARCH_QUERY = groq`
  {
    "characters": *[_type == 'character' && !(_id in path('drafts.**')) && (
      name.en match $searchTerm + "*" ||
      name.vi match $searchTerm + "*" ||
      role match $searchTerm + "*" ||
      element match $searchTerm + "*" ||
      weapon match $searchTerm + "*" ||
      overview.en match $searchTerm + "*" ||
      overview.vi match $searchTerm + "*"
    )] | order(name.en asc) [0...8] {
      _id,
      name,
      slug,
      role,
      weapon,
      rarity,
      element,
      image,
      splash,
      "_type": "character"
    },
    "weapons": *[_type == 'weapon' && !(_id in path('drafts.**')) && (
      name.en match $searchTerm + "*" ||
      name.vi match $searchTerm + "*" ||
      type match $searchTerm + "*" ||
      description.en match $searchTerm + "*" ||
      description.vi match $searchTerm + "*" ||
      passive.en match $searchTerm + "*" ||
      passive.vi match $searchTerm + "*"
    )] | order(name.en asc) [0...8] {
      _id,
      name,
      slug,
      type,
      rarity,
      image,
      description,
      "_type": "weapon"
    }
  }
`

// Query to fetch weapons by slugs (for character recommended weapons)
export const WEAPONS_BY_SLUGS_QUERY = groq`
  *[_type == 'weapon' && !(_id in path('drafts.**')) && slug.current in $slugs] {
    _id,
    name,
    slug,
    type,
    category,
    element,
    damageType,
    rarity,
    description,
    "image": coalesce(image.asset->url, image)
  }
`

// Query to fetch characters by IDs (for weapon recommended characters)
export const CHARACTERS_BY_IDS_QUERY = groq`
  *[_type == 'character' && !(_id in path('drafts.**')) && _id in $ids] {
    _id,
    name,
    slug,
    role,
    weapon,
    rarity,
    element,
    "image": coalesce(image.asset->url, image)
  }
`

// Build Guide queries
export const BUILD_GUIDE_BY_CHARACTER_SLUG_QUERY = groq`
  *[_type == 'buildGuide' && !(_id in path('drafts.**')) && character->slug.current == $slug][0] {
    _id,
    "character": character-> {
      _id,
      name,
      slug,
      role,
      element,
      rarity,
      "image": coalesce(image.asset->url, image)
    },
    soloMode {
      weaponPairs[] {
        "meleeWeapon": meleeWeapon-> {
          _id,
          name,
          slug,
          type,
          element,
          "image": coalesce(image.asset->url, image)
        },
        "rangedWeapon": rangedWeapon-> {
          _id,
          name,
          slug,
          type,
          element,
          "image": coalesce(image.asset->url, image)
        },
        pairScore,
        reasoning
      },
      statPriority,
      playstyleTips
    },
    farmMode {
      weaponPairs[] {
        "meleeWeapon": meleeWeapon-> {
          _id,
          name,
          slug,
          type,
          element,
          "image": coalesce(image.asset->url, image)
        },
        "rangedWeapon": rangedWeapon-> {
          _id,
          name,
          slug,
          type,
          element,
          "image": coalesce(image.asset->url, image)
        },
        pairScore,
        reasoning
      },
      statPriority,
      playstyleTips
    },
    bossMode {
      weaponPairs[] {
        "meleeWeapon": meleeWeapon-> {
          _id,
          name,
          slug,
          type,
          element,
          "image": coalesce(image.asset->url, image)
        },
        "rangedWeapon": rangedWeapon-> {
          _id,
          name,
          slug,
          type,
          element,
          "image": coalesce(image.asset->url, image)
        },
        pairScore,
        reasoning
      },
      statPriority,
      playstyleTips
    },
    teamCompositions[] {
      mode,
      "partner1": partner1-> {
        _id,
        name,
        slug,
        role,
        element,
        "image": coalesce(image.asset->url, image)
      },
      "partner1MeleeWeapon": partner1MeleeWeapon-> {
        _id,
        name,
        slug,
        type,
        element,
        "image": coalesce(image.asset->url, image)
      },
      "partner1RangedWeapon": partner1RangedWeapon-> {
        _id,
        name,
        slug,
        type,
        element,
        "image": coalesce(image.asset->url, image)
      },
      "partner2": partner2-> {
        _id,
        name,
        slug,
        role,
        element,
        "image": coalesce(image.asset->url, image)
      },
      "partner2MeleeWeapon": partner2MeleeWeapon-> {
        _id,
        name,
        slug,
        type,
        element,
        "image": coalesce(image.asset->url, image)
      },
      "partner2RangedWeapon": partner2RangedWeapon-> {
        _id,
        name,
        slug,
        type,
        element,
        "image": coalesce(image.asset->url, image)
      },
      teamScore,
      synergies[] {
        type,
        description
      }
    },
    algorithmVersion,
    lastCalculated,
    autoGenerated
  }
`

// Query to get all build guide slugs (for static generation)
export const BUILD_GUIDE_SLUGS_QUERY = groq`
  *[_type == 'buildGuide' && !(_id in path('drafts.**'))].character->slug.current
`

// Query to get all build guides with minimal data (for list view)
export const ALL_BUILD_GUIDES_MINIMAL_QUERY = groq`
  *[_type == 'buildGuide' && !(_id in path('drafts.**'))] {
    _id,
    "characterSlug": character->slug.current,
    "topWeaponPair": soloMode.weaponPairs[0] {
      "meleeWeapon": meleeWeapon-> {
        _id,
        name,
        slug,
        type,
        element,
        "image": coalesce(image.asset->url, image)
      },
      "rangedWeapon": rangedWeapon-> {
        _id,
        name,
        slug,
        type,
        element,
        "image": coalesce(image.asset->url, image)
      }
    }
  }
`


