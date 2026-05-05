'use client';

import { Weapon } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWeaponElementColor, getWeaponDamageTypeColor } from '@/data/filterConstants';

interface WeaponCardProps {
  weapon: Weapon;
}

export default function WeaponCard({ weapon }: WeaponCardProps) {
  const { t } = useLanguage();

  const getRarityBadgeColor = (rarity?: string) => {
    if (!rarity) return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    switch (rarity) {
      case 'SSR':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
      case 'SR':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'R':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'N':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'katana':
        return 'bg-red-200 text-red-800 border-red-300 shadow-sm';
      case 'sword':
        return 'bg-blue-200 text-blue-800 border-blue-300 shadow-sm';
      case 'polearm':
        return 'bg-green-200 text-green-800 border-green-300 shadow-sm';
      case 'whipsword':
        return 'bg-purple-200 text-purple-800 border-purple-300 shadow-sm';
      case 'greatsword':
        return 'bg-orange-200 text-orange-800 border-orange-300 shadow-sm';
      case 'dual blades':
        return 'bg-rose-200 text-rose-800 border-rose-300 shadow-sm';
      case 'shotgun':
        return 'bg-yellow-200 text-yellow-800 border-yellow-300 shadow-sm';
      case 'dual pistols':
        return 'bg-pink-200 text-pink-800 border-pink-300 shadow-sm';
      case 'assault rifle':
        return 'bg-indigo-200 text-indigo-800 border-indigo-300 shadow-sm';
      case 'bow':
        return 'bg-emerald-200 text-emerald-800 border-emerald-300 shadow-sm';
      case 'grenade launcher':
        return 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm';
      default:
        return 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm';
    }
  };
  
  return (
    <article className="weapon-card group">
      <Link href={`/weapon/${weapon.slug?.current || 'unknown'}?from=weapons`} className="block w-full h-full">
        {/* Weapon Image */}
        <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden rounded-t-xl">
          <Image
            src={weapon.image || '/weapons/placeholder.svg'}
            alt={`${t(weapon.name)} weapon`}
            width={200}
            height={200}
            className="object-contain transition-transform duration-300 group-hover:scale-105 max-w-full max-h-full"
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/weapons/placeholder.svg';
            }}
          />

          {/* Rarity Badge - Top Right (if exists) */}
          {weapon.rarity && (
            <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getRarityBadgeColor(weapon.rarity)}`} aria-label={`${weapon.rarity} rarity`}>
              {weapon.rarity}
            </div>
          )}
        </div>

        {/* Weapon Info */}
        <div className="p-4 flex-1 flex flex-col bg-white rounded-b-xl border border-gray-200 border-t-0 shadow-md">
          {/* Weapon Name - Bold */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {t(weapon.name)}
          </h3>

          {/* Badges - Type, Element, Damage Type */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(weapon.type)}`}>
              {weapon.type}
            </span>
            {weapon.element && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getWeaponElementColor(weapon.element)}`}>
                {weapon.element}
              </span>
            )}
            {weapon.damageType && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getWeaponDamageTypeColor(weapon.damageType)}`}>
                {weapon.damageType}
              </span>
            )}
          </div>

          {/* Description - 1 Line */}
          {weapon.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-1 flex-1">
              {t(weapon.description)}
            </p>
          )}

          {/* View Details Button - Consistent Width */}
          <div className="btn-primary w-full text-center py-2" role="button" aria-label={`View details for ${t(weapon.name)}`}>
            View Details
          </div>
        </div>
      </Link>
    </article>
  );
}
