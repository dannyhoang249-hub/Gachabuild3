'use client';

import { useState } from 'react';
import { BuildGuide } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface BuildGuideClientProps {
  buildGuide: BuildGuide;
}

type GameMode = 'solo' | 'farm' | 'boss';

export default function BuildGuideClient({ buildGuide }: BuildGuideClientProps) {
  const { language, t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<GameMode>('solo');

  // Debug: Log the buildGuide data
  console.log('BuildGuide data:', buildGuide);

  if (!buildGuide || !buildGuide.character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No build guide data available.</p>
        </div>
      </div>
    );
  }

  const character = buildGuide.character;
  const currentMode = selectedMode === 'solo' ? buildGuide.soloMode : 
                      selectedMode === 'farm' ? buildGuide.farmMode : 
                      buildGuide.bossMode;

  const modeLabels = {
    solo: { en: 'Solo / Ranking', vi: 'Solo / Xếp hạng' },
    farm: { en: 'Farm / Speedrun', vi: 'Farm / Tốc độ' },
    boss: { en: 'Boss / Single-Target', vi: 'Boss / Đơn mục tiêu' }
  };

  const getModeIcon = (mode: GameMode) => {
    switch (mode) {
      case 'solo':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'farm':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'boss':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.6) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(0);
  };

  return (
    <main className="py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-slate-300">
            <li>
              <Link href="/guides" className="hover:text-white transition-colors">
                {language === 'vi' ? 'Hướng dẫn' : 'Guides'}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/guides/builds" className="hover:text-white transition-colors">
                {language === 'vi' ? 'Build Guides' : 'Build Guides'}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-white font-medium">{t(character.name)}</li>
          </ol>
        </nav>

        {/* Character Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Character Image */}
            <div className="flex-shrink-0">
              <Link href={`/characters/${character.slug.current}`} className="group block">
                <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all">
                  <Image
                    src={character.image || `/characters-img/${character.slug.current}.png`}
                    alt={t(character.name)}
                    width={192}
                    height={192}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/characters/placeholder.svg';
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Character Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t(character.name)}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  {character.role}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  {character.element}
                </span>
                {character.rarity && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium">
                    {'★'.repeat(parseInt(character.rarity) || 0)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>
                    {language === 'vi' ? 'Thuật toán' : 'Algorithm'} v{buildGuide.algorithmVersion}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>
                    {language === 'vi' ? 'Cập nhật' : 'Updated'}: {new Date(buildGuide.lastCalculated).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* View Full Profile Button */}
              <Link
                href={`/characters/${character.slug.current}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{language === 'vi' ? 'Xem Hồ Sơ Đầy Đủ' : 'View Full Profile'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-sm p-2 border border-gray-200 inline-flex gap-2">
          {(['solo', 'farm', 'boss'] as GameMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                selectedMode === mode
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getModeIcon(mode)}
              <span>{language === 'vi' ? modeLabels[mode].vi : modeLabels[mode].en}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Weapon Pairs Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'vi' ? 'Cặp Vũ Khí Đề Xuất' : 'Recommended Weapon Pairs'}
          </h2>
          
          <div className="space-y-6">
            {currentMode.weaponPairs.map((pair, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      #{index + 1}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(pair.pairScore)}`}>
                      {formatScore(pair.pairScore)}% {language === 'vi' ? 'Phù hợp' : 'Match'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  {/* Melee Weapon */}
                  <Link href={`/weapon/${pair.meleeWeapon.slug.current}`} className="group">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {pair.meleeWeapon.image && (
                          <Image
                            src={pair.meleeWeapon.image}
                            alt={t(pair.meleeWeapon.name)}
                            width={64}
                            height={64}
                            className="object-contain group-hover:scale-110 transition-transform"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">{language === 'vi' ? 'Cận chiến' : 'Melee'}</div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate flex items-center gap-1">
                          {t(pair.meleeWeapon.name)}
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="text-xs text-gray-600">{pair.meleeWeapon.element}</div>
                      </div>
                    </div>
                  </Link>

                  {/* Ranged Weapon */}
                  <Link href={`/weapon/${pair.rangedWeapon.slug.current}`} className="group">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {pair.rangedWeapon.image && (
                          <Image
                            src={pair.rangedWeapon.image}
                            alt={t(pair.rangedWeapon.name)}
                            width={64}
                            height={64}
                            className="object-contain group-hover:scale-110 transition-transform"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">{language === 'vi' ? 'Tầm xa' : 'Ranged'}</div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate flex items-center gap-1">
                          {t(pair.rangedWeapon.name)}
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div className="text-xs text-gray-600">{pair.rangedWeapon.element}</div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Reasoning */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      {language === 'vi' && pair.reasoning.vi ? pair.reasoning.vi : pair.reasoning.en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stat Priority & Playstyle Tips */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Stat Priority */}
          <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'vi' ? 'Ưu Tiên Chỉ Số' : 'Stat Priority'}
            </h2>
            <div className="space-y-3">
              {currentMode.statPriority.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className="px-4 py-2 bg-gray-50 rounded-lg font-medium text-gray-900 flex-1 uppercase text-sm">
                    {stat}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Playstyle Tips */}
          <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'vi' ? 'Mẹo Chơi' : 'Playstyle Tips'}
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {language === 'vi' && currentMode.playstyleTips.vi ? currentMode.playstyleTips.vi : currentMode.playstyleTips.en}
              </p>
            </div>
          </section>
        </div>

        {/* Team Compositions Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'vi' ? 'Đội Hình Đề Xuất' : 'Recommended Team Compositions'}
          </h2>

          <div className="space-y-6">
            {buildGuide.teamCompositions
              .filter(team => team.mode === selectedMode)
              .map((team, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                        #{index + 1}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(team.teamScore)}`}>
                        {formatScore(team.teamScore)}% {language === 'vi' ? 'Hiệu quả' : 'Synergy'}
                      </span>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Main Character */}
                    <div className="text-center">
                      <Link href={`/characters/${character.slug.current}`} className="group inline-block">
                        <div className="relative w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 group-hover:border-blue-500 transition-colors">
                          <Image
                            src={character.image || `/characters-img/${character.slug.current}.png`}
                            alt={t(character.name)}
                            width={96}
                            height={96}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{t(character.name)}</div>
                      </Link>
                      <div className="text-xs text-gray-500 mb-2">{language === 'vi' ? 'Chính' : 'Main'}</div>

                      {/* Main Character Weapons - Show top weapon pair for current mode */}
                      {currentMode?.weaponPairs && currentMode.weaponPairs.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/weapon/${currentMode.weaponPairs[0].meleeWeapon.slug.current}`}
                              className="group/weapon relative w-8 h-8 rounded bg-gray-100 border border-gray-200 hover:border-blue-400 transition-colors overflow-hidden"
                              title={t(currentMode.weaponPairs[0].meleeWeapon.name)}
                            >
                              <Image
                                src={currentMode.weaponPairs[0].meleeWeapon.image || `/weapons-img/${currentMode.weaponPairs[0].meleeWeapon.slug.current}.png`}
                                alt={t(currentMode.weaponPairs[0].meleeWeapon.name)}
                                width={32}
                                height={32}
                                className="object-contain w-full h-full"
                              />
                            </Link>
                            <Link
                              href={`/weapon/${currentMode.weaponPairs[0].rangedWeapon.slug.current}`}
                              className="group/weapon relative w-8 h-8 rounded bg-gray-100 border border-gray-200 hover:border-blue-400 transition-colors overflow-hidden"
                              title={t(currentMode.weaponPairs[0].rangedWeapon.name)}
                            >
                              <Image
                                src={currentMode.weaponPairs[0].rangedWeapon.image || `/weapons-img/${currentMode.weaponPairs[0].rangedWeapon.slug.current}.png`}
                                alt={t(currentMode.weaponPairs[0].rangedWeapon.name)}
                                width={32}
                                height={32}
                                className="object-contain w-full h-full"
                              />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Partner 1 */}
                    <div className="text-center">
                      <Link href={`/characters/${team.partner1.slug.current}`} className="group inline-block">
                        <div className="relative w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 group-hover:border-purple-400 transition-colors">
                          <Image
                            src={team.partner1.image || `/characters-img/${team.partner1.slug.current}.png`}
                            alt={t(team.partner1.name)}
                            width={96}
                            height={96}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-purple-600 transition-colors">
                          {t(team.partner1.name)}
                        </div>
                      </Link>
                      <div className="text-xs text-gray-500 mb-2">{team.partner1.role}</div>

                      {/* Partner 1 Weapons */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          {team.partner1MeleeWeapon && (
                            <Link
                              href={`/weapon/${team.partner1MeleeWeapon.slug.current}`}
                              className="group/weapon relative w-8 h-8 rounded bg-gray-100 border border-gray-200 hover:border-purple-400 transition-colors overflow-hidden"
                              title={t(team.partner1MeleeWeapon.name)}
                            >
                              <Image
                                src={team.partner1MeleeWeapon.image || `/weapons-img/${team.partner1MeleeWeapon.slug.current}.png`}
                                alt={t(team.partner1MeleeWeapon.name)}
                                width={32}
                                height={32}
                                className="object-contain w-full h-full"
                              />
                            </Link>
                          )}
                          {team.partner1RangedWeapon && (
                            <Link
                              href={`/weapon/${team.partner1RangedWeapon.slug.current}`}
                              className="group/weapon relative w-8 h-8 rounded bg-gray-100 border border-gray-200 hover:border-purple-400 transition-colors overflow-hidden"
                              title={t(team.partner1RangedWeapon.name)}
                            >
                              <Image
                                src={team.partner1RangedWeapon.image || `/weapons-img/${team.partner1RangedWeapon.slug.current}.png`}
                                alt={t(team.partner1RangedWeapon.name)}
                                width={32}
                                height={32}
                                className="object-contain w-full h-full"
                              />
                            </Link>
                          )}
                          {!team.partner1MeleeWeapon && !team.partner1RangedWeapon && (
                            <div className="text-xs text-gray-400 italic">
                              {language === 'vi' ? 'Đang cập nhật' : 'Coming soon'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Partner 2 */}
                    <div className="text-center">
                      <Link href={`/characters/${team.partner2.slug.current}`} className="group inline-block">
                        <div className="relative w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 group-hover:border-purple-400 transition-colors">
                          <Image
                            src={team.partner2.image || `/characters-img/${team.partner2.slug.current}.png`}
                            alt={t(team.partner2.name)}
                            width={96}
                            height={96}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-purple-600 transition-colors">
                          {t(team.partner2.name)}
                        </div>
                      </Link>
                      <div className="text-xs text-gray-500 mb-2">{team.partner2.role}</div>

                      {/* Partner 2 Weapons */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          {team.partner2MeleeWeapon && (
                            <Link
                              href={`/weapon/${team.partner2MeleeWeapon.slug.current}`}
                              className="group/weapon relative w-8 h-8 rounded bg-gray-100 border border-gray-200 hover:border-purple-400 transition-colors overflow-hidden"
                              title={t(team.partner2MeleeWeapon.name)}
                            >
                              <Image
                                src={team.partner2MeleeWeapon.image || `/weapons-img/${team.partner2MeleeWeapon.slug.current}.png`}
                                alt={t(team.partner2MeleeWeapon.name)}
                                width={32}
                                height={32}
                                className="object-contain w-full h-full"
                              />
                            </Link>
                          )}
                          {team.partner2RangedWeapon && (
                            <Link
                              href={`/weapon/${team.partner2RangedWeapon.slug.current}`}
                              className="group/weapon relative w-8 h-8 rounded bg-gray-100 border border-gray-200 hover:border-purple-400 transition-colors overflow-hidden"
                              title={t(team.partner2RangedWeapon.name)}
                            >
                              <Image
                                src={team.partner2RangedWeapon.image || `/weapons-img/${team.partner2RangedWeapon.slug.current}.png`}
                                alt={t(team.partner2RangedWeapon.name)}
                                width={32}
                                height={32}
                                className="object-contain w-full h-full"
                              />
                            </Link>
                          )}
                          {!team.partner2MeleeWeapon && !team.partner2RangedWeapon && (
                            <div className="text-xs text-gray-400 italic">
                              {language === 'vi' ? 'Đang cập nhật' : 'Coming soon'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Synergies */}
                  {team.synergies && team.synergies.length > 0 && (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                      <div className="font-semibold text-purple-900 text-sm mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {language === 'vi' ? 'Hiệu ứng Đội' : 'Team Synergies'}
                      </div>
                      <div className="space-y-2">
                        {team.synergies.map((synergy, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs font-medium uppercase flex-shrink-0">
                              {synergy.type}
                            </span>
                            <p className="text-sm text-gray-700">
                              {language === 'vi' && synergy.description.vi ? synergy.description.vi : synergy.description.en}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* No teams for this mode */}
          {buildGuide.teamCompositions.filter(team => team.mode === selectedMode).length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                {language === 'vi' ? 'Không có đội hình cho chế độ này.' : 'No team compositions available for this mode.'}
              </p>
            </div>
          )}
        </section>

        {/* Footer Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                {language === 'vi' ? 'Về Hướng Dẫn Này' : 'About This Guide'}
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                {language === 'vi'
                  ? `Hướng dẫn này được tạo tự động bởi thuật toán AI v${buildGuide.algorithmVersion} phân tích tương thích nguyên tố, tương đồng chỉ số và sự phù hợp vai trò. Khuyến nghị có thể thay đổi dựa trên cập nhật game và meta.`
                  : `This guide is automatically generated by AI algorithm v${buildGuide.algorithmVersion} that analyzes element compatibility, stat similarity, and role alignment. Recommendations may change based on game updates and meta shifts.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

