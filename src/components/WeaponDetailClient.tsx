'use client';

import { useEffect, useState, Suspense } from 'react';
import { Weapon } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWeaponElementColor, getWeaponDamageTypeColor } from '@/data/filterConstants';
import { cleanText } from '@/lib/textUtils';

interface WeaponDetailClientProps {
  weapon: Weapon;
}

function WeaponDetailContent({ weapon }: WeaponDetailClientProps) {
  const { language, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');
  const [activeRefinement, setActiveRefinement] = useState<'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6'>('r1');
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || 'weapons';

  // Update document title and meta description when language changes
  useEffect(() => {
    const weaponName = t(weapon.name);
    const title = language === 'vi' 
      ? `Hướng dẫn vũ khí ${weaponName} trong Duet Night Abyss`
      : `Weapon Guide: ${weaponName} in Duet Night Abyss`;
    
    const description = language === 'vi'
      ? `Thông tin chi tiết về vũ khí ${weaponName} - ${weapon.type} ${weapon.element || ''} trong DNA.`
      : `Detailed information about ${weaponName} - ${weapon.type} ${weapon.element || ''} weapon in DNA.`;

    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    // Update language attribute
    document.documentElement.lang = language;
  }, [language, weapon, t]);

  // Badge color functions
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
      case 'bow':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'grenade launcher':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sections = [
    {
      id: 'overview',
      label: { en: 'Overview', vi: 'Tổng quan' }
    },
    {
      id: 'refinement',
      label: { en: 'Refinement Skill', vi: 'Kỹ năng tinh luyện' }
    },
    {
      id: 'stats',
      label: { en: 'Base Stats', vi: 'Chỉ số cơ bản' }
    },
    {
      id: 'motion',
      label: { en: 'Motion Values', vi: 'Hệ số sát thương' }
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href={from === 'tier-list' ? '/tier-list' : '/weapons'}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'vi' ? 'Quay lại' : 'Back'}
          </Link>
        </div>

        {/* Weapon Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Weapon Image */}
              <div className="lg:w-72 flex-shrink-0">
                <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={weapon.image || '/weapons/placeholder.svg'}
                    alt={`${t(weapon.name)} weapon`}
                    width={280}
                    height={280}
                    className="object-contain max-w-full max-h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/weapons/placeholder.svg';
                    }}
                  />
                </div>
              </div>

              {/* Weapon Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 font-['Poppins',sans-serif]">
                  {t(weapon.name)}
                </h1>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeBadgeColor(weapon.type)}`}>
                    {weapon.type}
                  </span>
                  {weapon.category && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-300">
                      {weapon.category}
                    </span>
                  )}
                  {weapon.element && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getWeaponElementColor(weapon.element)}`}>
                      {weapon.element}
                    </span>
                  )}
                  {weapon.damageType && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getWeaponDamageTypeColor(weapon.damageType)}`}>
                      {weapon.damageType}
                    </span>
                  )}
                  {weapon.rarity && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRarityBadgeColor(weapon.rarity)}`}>
                      {weapon.rarity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t(section.label)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <article className="space-y-8">

              {/* Overview Section */}
              <section id="overview" className="scroll-mt-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins',sans-serif]">
                    {language === 'vi' ? 'Tổng quan' : 'Overview'}
                  </h2>
                  {weapon.description ? (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {cleanText(t(weapon.description))}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      {language === 'vi' ? 'Chưa có mô tả.' : 'No description available.'}
                    </p>
                  )}
                </div>
              </section>

              {/* Refinement Skill Section */}
              <section id="refinement" className="scroll-mt-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins',sans-serif]">
                    {language === 'vi' ? 'Kỹ năng tinh luyện' : 'Refinement Skill'}
                  </h2>

                  {weapon.refinementSkill ? (
                    <div>
                      {/* Refinement Tabs */}
                      <div className="mb-6">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {(['r1', 'r2', 'r3', 'r4', 'r5', 'r6'] as const).map((level) => (
                            <button
                              key={level}
                              onClick={() => setActiveRefinement(level)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                activeRefinement === level
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                              }`}
                            >
                              {level.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Skill Description */}
                      <div className="bg-blue-50/30 p-5 rounded-lg border border-blue-200 mb-4">
                        <p className="text-gray-800 leading-relaxed">
                          {cleanText(t(weapon.refinementSkill.description))}
                        </p>
                      </div>

                      {/* Refinement Values */}
                      {weapon.refinementSkill[activeRefinement] && weapon.refinementSkill[activeRefinement]!.length > 0 && (
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                            {activeRefinement.toUpperCase()} {language === 'vi' ? 'Giá trị' : 'Values'}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {weapon.refinementSkill[activeRefinement]!.map((value, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-white rounded-md border border-gray-300 text-sm font-medium text-gray-900"
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        {language === 'vi' ? 'Không có kỹ năng tinh luyện.' : 'No refinement skill available.'}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Base Stats Section */}
              <section id="stats" className="scroll-mt-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins',sans-serif]">
                    {language === 'vi' ? 'Chỉ số cơ bản' : 'Base Stats'}
                  </h2>

                  {weapon.baseStats && Object.keys(weapon.baseStats).length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              {language === 'vi' ? 'Chỉ số' : 'Stat'}
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Lv. 1
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Lv. MAX
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {/* Primary ATK Stats */}
                          {weapon.baseStats.spikeAtkLv1 !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Spike ATK</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700">{weapon.baseStats.spikeAtkLv1}</td>
                              <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">{weapon.baseStats.spikeAtkLvMax}</td>
                            </tr>
                          )}
                          {weapon.baseStats.slashAtkLv1 !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Slash ATK</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700">{weapon.baseStats.slashAtkLv1}</td>
                              <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">{weapon.baseStats.slashAtkLvMax}</td>
                            </tr>
                          )}
                          {weapon.baseStats.smashAtkLv1 !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Smash ATK</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700">{weapon.baseStats.smashAtkLv1}</td>
                              <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">{weapon.baseStats.smashAtkLvMax}</td>
                            </tr>
                          )}

                          {/* Universal Stats */}
                          {weapon.baseStats.critChance !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">CRIT Chance</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.critChance}%</td>
                            </tr>
                          )}
                          {weapon.baseStats.critDamage !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">CRIT Damage</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.critDamage}%</td>
                            </tr>
                          )}
                          {weapon.baseStats.atkSpeed !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">ATK Speed</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.atkSpeed}</td>
                            </tr>
                          )}
                          {weapon.baseStats.triggerProbability !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Trigger Probability</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.triggerProbability}%</td>
                            </tr>
                          )}

                          {/* Ranged Stats */}
                          {weapon.baseStats.multishot !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Multishot</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.multishot}</td>
                            </tr>
                          )}
                          {weapon.baseStats.magCapacity !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Mag Capacity</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.magCapacity}</td>
                            </tr>
                          )}
                          {weapon.baseStats.maxAmmo !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Max Ammo</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.maxAmmo}</td>
                            </tr>
                          )}
                          {weapon.baseStats.ammoConversionRate !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Ammo Conversion Rate</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.ammoConversionRate}%</td>
                            </tr>
                          )}
                          {weapon.baseStats.projectileExplosionRange !== undefined && (
                            <tr className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">Projectile Explosion Range</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-700" colSpan={2}>{weapon.baseStats.projectileExplosionRange}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        {language === 'vi' ? 'Thông tin chỉ số sẽ có sớm.' : 'Stats information will be available soon.'}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Motion Values Section */}
              <section id="motion" className="scroll-mt-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 font-['Poppins',sans-serif]">
                    {language === 'vi' ? 'Hệ số sát thương' : 'Motion Values'}
                  </h2>

                  {weapon.motionValues && Object.keys(weapon.motionValues).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(weapon.motionValues).map(([key, value]) => {
                        // Convert camelCase to readable format
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .replace(/Dmg/g, 'DMG')
                          .replace(/Atk/g, 'ATK');

                        return (
                          <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                              {label}
                            </h3>
                            <p className="text-lg font-bold text-gray-900">
                              {value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        {language === 'vi' ? 'Không có hệ số sát thương.' : 'No motion values available.'}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeaponDetailClient({ weapon }: WeaponDetailClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weapon details...</p>
        </div>
      </div>
    }>
      <WeaponDetailContent weapon={weapon} />
    </Suspense>
  );
}


