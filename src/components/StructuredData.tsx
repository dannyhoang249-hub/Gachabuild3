'use client';

import { useEffect, useState } from 'react';
import { getCharacters } from '@/lib/data';
import { Character } from '@/lib/data';

interface StructuredDataProps {
  type: 'website' | 'game' | 'character' | 'tierlist';
  data?: Record<string, unknown>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const chars = await getCharacters();
        setCharacters(chars);
      } catch (error) {
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    if (type === 'game' || type === 'character') {
      fetchCharacters();
    } else {
      setLoading(false);
    }
  }, [type]);

  const getWebsiteStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Duet Night Abyss Guide Hub",
    "alternateName": ["Duet Night Abyss Guide", "Hướng dẫn Duet Night Abyss", "Bảng xếp hạng nhân vật DNA"],
    "url": "https://duetnightabyss.gachabuild.com",
    "description": "Complete Duet Night Abyss character tier list, builds, and strategies. Find the best DNA characters ranked by effectiveness. | Bảng xếp hạng nhân vật Duet Night Abyss hoàn chỉnh, build và chiến thuật.",
    "inLanguage": ["en-US", "vi-VN"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://duetnightabyss.gachabuild.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Duet Night Abyss Guide Hub",
      "alternateName": "Hướng dẫn Duet Night Abyss",
      "url": "https://duetnightabyss.gachabuild.com"
    },
    "sameAs": [
      "https://duetnightabyss.gachabuild.com",
      "https://gachabuild.com"
    ]
  });

  const getGameStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Duet Night Abyss",
    "alternateName": "DNA",
    "description": "A strategic gacha game featuring unique characters with different roles, elements, and weapons.",
    "genre": ["Strategy", "RPG", "Gacha"],
    "gamePlatform": ["Mobile", "PC"],
    "publisher": {
      "@type": "Organization",
      "name": "Duet Night Abyss Guide Hub"
    },
    "character": characters.map(char => ({
      "@type": "VideoGameCharacter",
      "name": char.name.en,
      "alternateName": char.name.vi,
      "description": char.overview?.en || `A ${char.role} character in Duet Night Abyss`,
      "characterAttribute": {
        "role": char.role,
        "weapon": char.weapon,
        "element": char.element,
        "rarity": char.rarity
      }
    }))
  });

  const getTierListStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Duet Night Abyss Character Tier List",
    "description": "Complete character tier list for Duet Night Abyss with rankings and strategies",
    "author": {
      "@type": "Organization",
      "name": "Duet Night Abyss Guide Hub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Duet Night Abyss Guide Hub"
    },
    "datePublished": "2026-03-30",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://duetnightabyss.gachabuild.com/tier-list"
    }
  });

  const getCharacterStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Duet Night Abyss Character Database",
    "description": "Complete database of all characters in Duet Night Abyss with detailed information",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": characters.map((char, index) => ({
        "@type": "VideoGameCharacter",
        "position": index + 1,
        "name": char.name.en,
        "alternateName": char.name.vi,
        "description": char.overview?.en || `A ${char.role} character in Duet Night Abyss`,
        "characterAttribute": {
          "role": char.role,
          "weapon": char.weapon,
          "element": char.element,
          "rarity": char.rarity
        }
      }))
    }
  });

  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return getWebsiteStructuredData();
      case 'game':
        return getGameStructuredData();
      case 'tierlist':
        return getTierListStructuredData();
      case 'character':
        return getCharacterStructuredData();
      default:
        return data || {};
    }
  };

  // Don't render if still loading characters for game/character types
  if (loading && (type === 'game' || type === 'character')) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  );
}