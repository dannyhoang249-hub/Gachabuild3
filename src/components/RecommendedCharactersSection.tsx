'use client';

import { useEffect, useState } from 'react';
import { Character } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { CHARACTERS_BY_IDS_QUERY } from '@/lib/queries';

interface RecommendedCharactersSectionProps {
  recommendedCharacters: string[];
}

export default function RecommendedCharactersSection({ recommendedCharacters }: RecommendedCharactersSectionProps) {
  const { language, t } = useLanguage();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!recommendedCharacters || recommendedCharacters.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const fetchedCharacters = await sanityClient.fetch<Character[]>(CHARACTERS_BY_IDS_QUERY, {
          ids: recommendedCharacters
        });
        setCharacters(fetchedCharacters);
      } catch (error) {
        console.error('Error fetching recommended characters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [recommendedCharacters]);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'vanguard':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'support':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'annihilator':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getElementBadgeColor = (element: string) => {
    switch (element.toLowerCase()) {
      case 'pyro':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'hydro':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'electro':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'anemo':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'lumino':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'umbro':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRarityBadgeColor = (rarity?: string) => {
    if (!rarity) return 'bg-gray-100 text-gray-800 border-gray-300';
    switch (rarity) {
      case 'SSR':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'SR':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'R':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'N':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="recommended-characters-section">
        <h3 className="section-title">
          {language === 'vi' ? 'Nhân vật được đề xuất' : 'Recommended For'}
        </h3>
        <div className="text-center py-8 text-gray-500">
          {language === 'vi' ? 'Đang tải...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <div className="recommended-characters-section">
      <h3 className="section-title">
        {language === 'vi' ? 'Nhân vật được đề xuất' : 'Recommended For'}
      </h3>
      
      <div className="character-grid">
        {characters.map((character) => (
          <Link
            key={character._id}
            href={`/characters/${character.slug.current}`}
            className="character-card"
          >
            {/* Character Image */}
            <div className="character-image-container">
              {character.image ? (
                <Image
                  src={character.image}
                  alt={t(character.name)}
                  width={280}
                  height={280}
                  className="character-image"
                />
              ) : (
                <div className="character-image-placeholder">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>

            {/* Character Info */}
            <div className="character-info">
              <h4 className="character-name">{t(character.name)}</h4>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Role Badge */}
                {character.role && (
                  <span className={`badge ${getRoleBadgeColor(character.role)}`}>
                    {character.role}
                  </span>
                )}
                
                {/* Element Badge */}
                {character.element && (
                  <span className={`badge ${getElementBadgeColor(character.element)}`}>
                    {character.element}
                  </span>
                )}
                
                {/* Rarity Badge */}
                {character.rarity && (
                  <span className={`badge ${getRarityBadgeColor(character.rarity)}`}>
                    {character.rarity}
                  </span>
                )}
              </div>

              {/* Weapon Type */}
              {character.weapon && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">
                    {language === 'vi' ? 'Vũ khí: ' : 'Weapon: '}
                  </span>
                  {character.weapon}
                </p>
              )}
            </div>

            {/* View Details Button */}
            <div className="character-card-footer">
              <button className="view-details-btn">
                {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

