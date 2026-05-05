'use client';

import { useEffect, Suspense } from 'react';
import { Character } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cleanText } from '@/lib/textUtils';
import IntronLevels from './IntronLevels';
import SkillsSection from './SkillsSection';
import RecommendedWeaponsSection from './RecommendedWeaponsSection';

interface CharacterDetailClientProps {
  character: Character;
}

function CharacterDetailContent({ character }: CharacterDetailClientProps) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || 'tier-list';

  // Update document title and meta description when language changes
  useEffect(() => {
    const characterName = t(character.name);
    const title = language === 'vi'
      ? `Hướng dẫn build ${characterName} trong Duet Night Abyss`
      : `How to build ${characterName} in Duet Night Abyss`;

    const description = language === 'vi'
      ? `Cách build, kỹ năng và đội hình mạnh nhất cho ${characterName} trong DNA.`
      : `Best build, skills, and team guide for ${characterName} in DNA.`;

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
  }, [language, character, t]);

  // Badge color functions
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'vanguard':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'support':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'annihilator':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getElementBadgeColor = (element: string) => {
    switch (element.toLowerCase()) {
      case 'fire':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'water':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ice':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'wind':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'earth':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'light':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'dark':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'psychic':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'moon':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'sound':
        return 'bg-violet-100 text-violet-800 border-violet-300';
      case 'anemo':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'electro':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'ssr':
      case '5-star':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'sr':
      case '4-star':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'r':
      case '3-star':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get Intron data from character.intron field (not from skills)
  const intronLevels = character.intron || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1100px] mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/${from}`}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              {from === 'characters' ? (language === 'vi' ? 'Danh Sách Nhân Vật' : 'Character List') : (language === 'vi' ? 'Bảng Xếp Hạng' : 'Tier List')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{cleanText(t(character.name))}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href={`/${from}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'vi'
              ? `← Quay lại ${from === 'characters' ? 'Danh Sách Nhân Vật' : 'Bảng Xếp Hạng'}`
              : `← Back to ${from === 'characters' ? 'Character List' : 'Tier List'}`
            }
          </Link>
        </div>

        {/* Character Hero Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Character Portrait */}
              <div className="mb-6">
                <div className="relative w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                  <Image
                    src={character.image || `/characters-img/${character.slug?.current}.png`}
                    alt={`${cleanText(t(character.name))} character portrait`}
                    width={256}
                    height={256}
                    className="object-contain max-w-full max-h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/characters/placeholder.svg';
                    }}
                  />
                </div>
              </div>

              {/* Character Name */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {cleanText(t(character.name))}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {character.element && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getElementBadgeColor(character.element)}`}>
                    {character.element}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(character.role)}`}>
                  {character.role}
                </span>
                {character.weapon && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
                    {character.weapon}
                  </span>
                )}
                {character.rarity && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityBadgeColor(character.rarity)}`}>
                    {character.rarity}
                  </span>
                )}
              </div>

              {/* One-Line Overview */}
              {character.overview && (
                <p className="text-base text-gray-700 leading-relaxed max-w-2xl">
                  {cleanText(t(character.overview)).substring(0, 120)}
                  {cleanText(t(character.overview)).length > 120 && '...'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Single Page Layout */}
        <div className="space-y-10">
          {/* 1. Profile Section */}
          {character.profile && (
            <section id="profile" className="scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'vi' ? 'Hồ Sơ' : 'Profile'}
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {character.profile.gender && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm font-semibold text-gray-700">
                        {language === 'vi' ? 'Giới tính' : 'Gender'}
                      </dt>
                      <dd className="text-sm text-gray-900">{character.profile.gender}</dd>
                    </div>
                  )}
                  {character.profile.birthplace && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm font-semibold text-gray-700">
                        {language === 'vi' ? 'Nơi sinh' : 'Birthplace'}
                      </dt>
                      <dd className="text-sm text-gray-900">{character.profile.birthplace}</dd>
                    </div>
                  )}
                  {character.profile.birthday && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm font-semibold text-gray-700">
                        {language === 'vi' ? 'Ngày sinh' : 'Birthday'}
                      </dt>
                      <dd className="text-sm text-gray-900">{character.profile.birthday}</dd>
                    </div>
                  )}
                  {character.profile.allegiance && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <dt className="text-sm font-semibold text-gray-700">
                        {language === 'vi' ? 'Liên minh' : 'Allegiance'}
                      </dt>
                      <dd className="text-sm text-gray-900">{character.profile.allegiance}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>
          )}

          {/* 2. Trait Section */}
          {character.traits && character.traits.length > 0 && (
            <section id="traits" className="scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'vi' ? 'Đặc Điểm' : 'Traits'}
                </h2>
                <div className="space-y-4">
                  {character.traits.map((trait, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-indigo-900 mb-1">
                          {trait.name ? cleanText(t(trait.name)) : '—'}
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {trait.effect ? cleanText(t(trait.effect)) : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 3. Skills Section - HIGHEST PRIORITY */}
          <SkillsSection character={character} />

          {/* 4. Passive Upgrades Section */}
          {character.passiveUpgrades && character.passiveUpgrades.length > 0 && (
            <section id="passive-upgrades" className="scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'vi' ? 'Nâng Cấp Bị Động' : 'Passive Upgrades'}
                </h2>
                <div className="space-y-3">
                  {character.passiveUpgrades.map((upgrade, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-base font-bold text-amber-900 break-words">
                            {upgrade.upgrade ? cleanText(t(upgrade.upgrade)) : '—'}
                          </h3>
                          {upgrade.value && (
                            <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full inline-block w-fit">
                              {cleanText(t(upgrade.value))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 5. Intron / Constellation Progression */}
          {intronLevels && intronLevels.length > 0 && (
            <section id="intron" className="scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'vi' ? 'Intron' : 'Intron'}
                </h2>
                <IntronLevels levels={intronLevels} />
              </div>
            </section>
          )}

          {/* 6. Stats Section */}
          {character.baseStats && character.baseStats.length > 0 && (
            <section id="stats" className="scroll-mt-8">
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'vi' ? 'Chỉ số' : 'Stats'}
                </h2>
                <div className="max-w-3xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {language === 'vi' ? 'Chỉ số cơ bản & Tăng trưởng' : 'Base Stats & Growth'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'vi' ? 'Thuộc tính' : 'Feature'}
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'vi' ? 'Giá trị' : 'Value'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {character.baseStats.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-sm font-semibold text-gray-700">
                              {row.stat || '—'}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right font-mono">
                              {row.lv1 || '—'} → {row.lvMax || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 7. Build Guide Section */}
          <section id="build-guide" className="scroll-mt-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'vi' ? 'Hướng dẫn Build' : 'Build Guide'}
                </h2>
                {/* Link to AI-Powered Build Guide */}
                <Link
                  href={`/builds/${character.slug?.current}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{language === 'vi' ? 'Xem Build AI' : 'View AI Build'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {character.build ? (
                <div className="space-y-8">
                  {/* Role Overview (if available) */}
                  {character.build.roleOverview && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
                      <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {language === 'vi' ? 'Tổng Quan Vai Trò' : 'Role Overview'}
                      </h3>
                      <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none">
                        {cleanText(t(character.build.roleOverview))}
                      </div>
                    </div>
                  )}

                  {/* Team Composition */}
                  {character.build.teamComposition && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {language === 'vi' ? 'Đội Hình' : 'Team Composition'}
                      </h3>
                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none">
                          {cleanText(t(character.build.teamComposition))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Weapons Section - Card Display */}
                  {character.recommendedWeapons && character.recommendedWeapons.length > 0 && (
                    <RecommendedWeaponsSection recommendedWeapons={character.recommendedWeapons} />
                  )}

                  {/* Recommended Weapons - Text (Legacy) */}
                  {character.build.recommendedWeapons && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        {language === 'vi' ? 'Vũ Khí Đề Xuất' : 'Recommended Weapons'}
                      </h3>
                      <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none whitespace-pre-line">
                          {cleanText(t(character.build.recommendedWeapons))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommended Artifacts */}
                  {character.build.recommendedArtifacts && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {language === 'vi' ? 'Hiện Vật Đề Xuất' : 'Recommended Artifacts'}
                      </h3>
                      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none whitespace-pre-line">
                          {cleanText(t(character.build.recommendedArtifacts))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stat Priority */}
                  {character.build.statPriority && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {language === 'vi' ? 'Ưu Tiên Chỉ Số' : 'Stat Priority'}
                      </h3>
                      <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none whitespace-pre-line">
                          {cleanText(t(character.build.statPriority))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demon Wedges */}
                  {character.build.demonWedges && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {language === 'vi' ? 'Demon Wedges' : 'Demon Wedges'}
                      </h3>
                      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none whitespace-pre-line">
                          {cleanText(t(character.build.demonWedges))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Recommendations (optional) */}
                  {character.build.teamRecommendations && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {language === 'vi' ? 'Đề Xuất Đội Hình' : 'Team Recommendations'}
                      </h3>
                      <div className="bg-teal-50 p-6 rounded-xl border border-teal-200">
                        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none whitespace-pre-line">
                          {cleanText(t(character.build.teamRecommendations))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">
                      {language === 'vi' ? 'Chưa có hướng dẫn build thủ công.' : 'No manual build guide available yet.'}
                    </p>
                  </div>

                  {/* CTA to AI Build Guide */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h3 className="text-lg font-bold text-gray-900">
                        {language === 'vi' ? 'Build AI Có Sẵn!' : 'AI Build Available!'}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {language === 'vi'
                        ? 'Xem khuyến nghị build được tính toán bởi AI với cặp vũ khí tối ưu và đội hình cho 3 chế độ chơi.'
                        : 'View AI-calculated build recommendations with optimal weapon pairs and team compositions for 3 game modes.'}
                    </p>
                    <Link
                      href={`/builds/${character.slug?.current}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{language === 'vi' ? 'Xem Build AI Đầy Đủ' : 'View Full AI Build Guide'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {language === 'vi' ? 'Điểm Mạnh' : 'Strengths'}
                  </h3>
                  {character.pros && character.pros.length > 0 ? (
                    <ul className="space-y-2">
                      {character.pros.map((pro, index) => (
                        <li key={index} className="flex items-start text-green-800">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {cleanText(t(pro))}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      {language === 'vi' ? 'Chưa có điểm mạnh nào được liệt kê.' : 'No strengths listed yet.'}
                    </p>
                  )}
                </div>

                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {language === 'vi' ? 'Điểm Yếu' : 'Weaknesses'}
                  </h3>
                  {character.cons && character.cons.length > 0 ? (
                    <ul className="space-y-2">
                      {character.cons.map((con, index) => (
                        <li key={index} className="flex items-start text-red-800">
                          <span className="w-2 h-2 bg-red-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {cleanText(t(con))}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      {language === 'vi' ? 'Chưa có điểm yếu nào được liệt kê.' : 'No weaknesses listed yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CharacterDetailClient({ character }: CharacterDetailClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading character details...</p>
        </div>
      </div>
    }>
      <CharacterDetailContent character={character} />
    </Suspense>
  );
}
