'use client';

import { useEffect, useState } from 'react';
import { Weapon } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWeaponElementColor, getWeaponDamageTypeColor } from '@/data/filterConstants';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { WEAPONS_BY_SLUGS_QUERY } from '@/lib/queries';

interface RecommendedWeapon {
  name: string;
  slug: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface RecommendedWeaponsSectionProps {
  recommendedWeapons: RecommendedWeapon[];
}

export default function RecommendedWeaponsSection({ recommendedWeapons }: RecommendedWeaponsSectionProps) {
  const { language, t } = useLanguage();
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeapons = async () => {
      if (!recommendedWeapons || recommendedWeapons.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const slugs = recommendedWeapons.map(w => w.slug);
        const fetchedWeapons = await sanityClient.fetch<Weapon[]>(WEAPONS_BY_SLUGS_QUERY, { slugs });
        
        // Sort weapons by priority order from recommendedWeapons array
        const sortedWeapons = fetchedWeapons.sort((a, b) => {
          const aIndex = recommendedWeapons.findIndex(w => w.slug === a.slug.current);
          const bIndex = recommendedWeapons.findIndex(w => w.slug === b.slug.current);
          return aIndex - bIndex;
        });
        
        setWeapons(sortedWeapons);
      } catch (error) {
        console.error('Error fetching recommended weapons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, [recommendedWeapons]);

  const getPriorityForWeapon = (weaponSlug: string): string => {
    const recommended = recommendedWeapons.find(w => w.slug === weaponSlug);
    return recommended?.priority || 'Medium';
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'katana':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'sword':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'polearm':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'whipsword':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'greatsword':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'dual blades':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'shotgun':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'dual pistols':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'assault rifle':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'grenade launcher':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'bow':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="recommended-weapons-section">
        <h3 className="section-title">
          {language === 'vi' ? 'Vũ khí được đề xuất' : 'Recommended Weapons'}
        </h3>
        <div className="text-center py-8 text-gray-500">
          {language === 'vi' ? 'Đang tải...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!weapons || weapons.length === 0) {
    return null;
  }

  return (
    <div className="recommended-weapons-section">
      <h3 className="section-title">
        {language === 'vi' ? 'Vũ khí được đề xuất' : 'Recommended Weapons'}
      </h3>
      
      <div className="weapon-grid">
        {weapons.map((weapon) => {
          const priority = getPriorityForWeapon(weapon.slug.current);
          
          return (
            <Link
              key={weapon._id}
              href={`/weapon/${weapon.slug.current}`}
              className="weapon-card"
            >
              {/* Weapon Image */}
              <div className="weapon-image-container">
                {weapon.image ? (
                  <Image
                    src={weapon.image}
                    alt={t(weapon.name)}
                    width={280}
                    height={280}
                    className="weapon-image"
                  />
                ) : (
                  <div className="weapon-image-placeholder">
                    <span className="text-4xl">⚔️</span>
                  </div>
                )}
              </div>

              {/* Weapon Info */}
              <div className="weapon-info">
                <h4 className="weapon-name">{t(weapon.name)}</h4>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Priority Badge */}
                  <span className={`badge ${getPriorityBadgeColor(priority)}`}>
                    {priority}
                  </span>
                  
                  {/* Type Badge */}
                  <span className={`badge ${getTypeBadgeColor(weapon.type)}`}>
                    {weapon.type}
                  </span>
                  
                  {/* Element Badge */}
                  {weapon.element && (
                    <span className={`badge ${getWeaponElementColor(weapon.element)}`}>
                      {weapon.element}
                    </span>
                  )}
                  
                  {/* Damage Type Badge */}
                  {weapon.damageType && (
                    <span className={`badge ${getWeaponDamageTypeColor(weapon.damageType)}`}>
                      {weapon.damageType}
                    </span>
                  )}
                </div>

                {/* Description */}
                {weapon.description && (
                  <p className="weapon-description mt-3 text-sm text-gray-600 line-clamp-2">
                    {t(weapon.description)}
                  </p>
                )}
              </div>

              {/* View Details Button */}
              <div className="weapon-card-footer">
                <button className="view-details-btn">
                  {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

