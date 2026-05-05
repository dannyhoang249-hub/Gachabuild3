'use client';

import { Character } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const { t } = useLanguage();
  
  const getRoleTagClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'vanguard':
        return 'role-tag-vanguard';
      case 'support':
        return 'role-tag-support';
      case 'annihilator':
        return 'role-tag-annihilator';
      default:
        return 'role-tag-vanguard';
    }
  };

  const getStarRating = (rarity: string) => {
    const stars = parseInt(rarity.replace('★', ''));
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < stars ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };
  
  return (
    <article className="character-card group">
      <Link href={`/characters/${character.slug?.current || 'unknown'}?from=characters`} className="block w-full h-full">
        {/* Character Image */}
        <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
          <Image
            src={character.image || `/characters-img/${character.slug?.current}.png`}
            alt={`${t(character.name)} character portrait`}
            width={200}
            height={200}
            className="object-contain transition-transform duration-300 group-hover:scale-105 max-w-full max-h-full"
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/characters/placeholder.svg';
            }}
          />
          
          {/* Rarity Badge */}
          {character.rarity && (
            <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold border border-yellow-200" aria-label={`${character.rarity} rarity`}>
              {character.rarity}
            </div>
          )}
          
          {/* Element Badge */}
          {character.element && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium border border-gray-200" aria-label={`${character.element} element`}>
              {character.element}
            </div>
          )}
        </div>
        
        {/* Character Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-heading-3 text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
            {t(character.name)}
          </h3>
          
          <dl className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <dt className="text-caption text-gray-500">Role:</dt>
              <dd className={`role-tag ${getRoleTagClass(character.role)}`}>
                {character.role}
              </dd>
            </div>
            
            <div className="flex items-center justify-between">
              <dt className="text-caption text-gray-500">Weapon:</dt>
              <dd className="text-caption font-medium text-gray-700">
                {character.weapon}
              </dd>
            </div>
          </dl>

          {/* Star Rating */}
          {character.rarity && (
            <div className="flex items-center justify-center mb-4" aria-label={`${character.rarity} star rating`}>
              {getStarRating(character.rarity)}
            </div>
          )}
          
          {/* View Details Button */}
          <div className="btn-primary w-full text-center" role="button" aria-label={`View details for ${t(character.name)}`}>
            View Details
          </div>
        </div>
      </Link>
    </article>
  );
}
