'use client';

import { useState } from 'react';
import { Character, BuildGuideMinimal } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface BuildGuidesListClientProps {
  characters: Character[];
  buildGuides: BuildGuideMinimal[];
}

export default function BuildGuidesListClient({ characters, buildGuides }: BuildGuidesListClientProps) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Get unique elements and roles
  const elements = Array.from(new Set(characters.map(c => c.element).filter(Boolean)));
  const roles = Array.from(new Set(characters.map(c => c.role).filter(Boolean)));

  // Create a map of character slug to build guide
  const buildGuideMap = new Map(
    buildGuides.map(bg => [bg.characterSlug, bg])
  );

  // Filter characters
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = !searchQuery ||
      t(character.name).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesElement = !selectedElement || character.element === selectedElement;
    const matchesRole = !selectedRole || character.role === selectedRole;

    return matchesSearch && matchesElement && matchesRole;
  });

  return (
    <main className="py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {language === 'vi' ? 'Hướng Dẫn Build Nhân Vật' : 'Character Build Guides'}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {language === 'vi'
            ? 'Khuyến nghị build được tạo bởi AI với cặp vũ khí tối ưu, đội hình và mẹo chơi cho các chế độ Solo, Farm và Boss.'
            : 'AI-powered build recommendations with optimal weapon pairs, team compositions, and playstyle tips for Solo, Farm, and Boss modes.'}
        </p>

        {/* Algorithm Info Badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{language === 'vi' ? 'Thuật toán v2.2' : 'Algorithm v2.2'}</span>
          <span className="text-blue-400">•</span>
          <span>{language === 'vi' ? '24 nhân vật' : '24 characters'}</span>
        </div>
      </header>

      {/* How It Works Overview */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'vi' ? 'Hệ Thống Tính Toán Build' : 'How Our Build System Works'}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {language === 'vi'
                  ? 'Tất cả khuyến nghị build được tính toán tự động bởi thuật toán AI tiên tiến, phân tích hàng nghìn kết hợp vũ khí và đội hình để tìm ra setup tối ưu cho từng nhân vật.'
                  : 'All build recommendations are automatically calculated by our advanced AI algorithm, analyzing thousands of weapon combinations and team compositions to find the optimal setup for each character.'}
              </p>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Weapon Proficiency Gate */}
            <div className="bg-white rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">
                  {language === 'vi' ? 'Kiểm Tra Thành Thạo' : 'Proficiency Gate'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'vi'
                  ? 'Chỉ khuyến nghị vũ khí phù hợp với khả năng của nhân vật. Vũ khí Main Proficiency nhận +3% điểm thưởng.'
                  : 'Only recommends weapons matching character proficiency. Main proficiency weapons receive +3% bonus score.'}
              </p>
            </div>

            {/* Multi-Mode Analysis */}
            <div className="bg-white rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">
                  {language === 'vi' ? '3 Chế Độ Chơi' : '3 Game Modes'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'vi'
                  ? 'Tối ưu riêng cho Solo/Ranking, Farm/Speedrun và Boss/Single-Target với trọng số khác nhau.'
                  : 'Optimized separately for Solo/Ranking, Farm/Speedrun, and Boss/Single-Target with different weightings.'}
              </p>
            </div>

            {/* Team Synergy */}
            <div className="bg-white rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900">
                  {language === 'vi' ? 'Phân Tích Đội Hình' : 'Team Synergy'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'vi'
                  ? 'Tính toán tương tác giữa các nhân vật, buff/debuff và element resonance để tối đa hóa hiệu quả đội.'
                  : 'Calculates character interactions, buff/debuff stacking, and element resonance to maximize team effectiveness.'}
              </p>
            </div>
          </div>

          {/* Calculation Process */}
          <div className="bg-white rounded-xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {language === 'vi' ? 'Quy Trình Tính Toán' : 'Calculation Process'}
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {language === 'vi' ? 'Lọc Vũ Khí' : 'Filter Weapons'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'vi' ? 'Kiểm tra proficiency' : 'Check proficiency'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {language === 'vi' ? 'Tính Điểm' : 'Score Pairs'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'vi' ? 'Phân tích tương tác' : 'Analyze synergy'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {language === 'vi' ? 'Xếp Hạng' : 'Rank Results'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'vi' ? 'Sắp xếp theo điểm' : 'Sort by score'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {language === 'vi' ? 'Khuyến Nghị' : 'Recommend'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === 'vi' ? 'Top 5 build' : 'Top 5 builds'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 flex items-start gap-3 text-sm text-gray-600">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="leading-relaxed">
              {language === 'vi'
                ? 'Tất cả dữ liệu được tính toán trước và lưu trữ trong CMS. Thuật toán được cập nhật thường xuyên dựa trên meta game và phản hồi từ cộng đồng.'
                : 'All data is pre-calculated and stored in our CMS. The algorithm is regularly updated based on game meta and community feedback.'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Tìm kiếm' : 'Search'}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm nhân vật...' : 'Search character...'}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Element Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Nguyên tố' : 'Element'}
              </label>
              <select
                value={selectedElement}
                onChange={(e) => setSelectedElement(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'vi' ? 'Tất cả' : 'All Elements'}</option>
                {elements.map(element => (
                  <option key={element} value={element}>{element}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Vai trò' : 'Role'}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{language === 'vi' ? 'Tất cả' : 'All Roles'}</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {language === 'vi'
              ? `Hiển thị ${filteredCharacters.length} / ${characters.length} nhân vật`
              : `Showing ${filteredCharacters.length} / ${characters.length} characters`}
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => {
            const buildGuide = buildGuideMap.get(character.slug.current);
            const topWeaponPair = buildGuide?.topWeaponPair;

            return (
              <Link
                key={character._id}
                href={`/builds/${character.slug.current}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400"
              >
                {/* Character Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <Image
                    src={character.image || `/characters-img/${character.slug.current}.png`}
                    alt={t(character.name)}
                    width={300}
                    height={300}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/characters/placeholder.svg';
                    }}
                  />

                  {/* Element Badge */}
                  {character.element && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                      {character.element}
                    </div>
                  )}
                </div>

                {/* Character Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {t(character.name)}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    {/* Role Badge */}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {character.role}
                    </span>

                    {/* Rarity */}
                    {character.rarity && (
                      <span className="text-yellow-500 text-sm">
                        {'★'.repeat(parseInt(character.rarity) || 0)}
                      </span>
                    )}
                  </div>

                  {/* Best Weapon Pair */}
                  {topWeaponPair && (
                    <div className="mb-3 pb-3 border-b border-gray-100">
                      <div className="text-xs text-gray-500 mb-2 font-medium">
                        {language === 'vi' ? 'Vũ khí tốt nhất' : 'Best Weapons'}
                      </div>
                      <div className="flex items-center gap-2">
                        {topWeaponPair.meleeWeapon && (
                          <div
                            className="relative w-10 h-10 rounded bg-gray-50 border border-gray-200 overflow-hidden hover:border-blue-400 transition-colors"
                            title={t(topWeaponPair.meleeWeapon.name)}
                          >
                            <Image
                              src={topWeaponPair.meleeWeapon.image || `/weapons-img/${topWeaponPair.meleeWeapon.slug.current}.png`}
                              alt={t(topWeaponPair.meleeWeapon.name)}
                              width={40}
                              height={40}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        )}
                        {topWeaponPair.rangedWeapon && (
                          <div
                            className="relative w-10 h-10 rounded bg-gray-50 border border-gray-200 overflow-hidden hover:border-blue-400 transition-colors"
                            title={t(topWeaponPair.rangedWeapon.name)}
                          >
                            <Image
                              src={topWeaponPair.rangedWeapon.image || `/weapons-img/${topWeaponPair.rangedWeapon.slug.current}.png`}
                              alt={t(topWeaponPair.rangedWeapon.name)}
                              width={40}
                              height={40}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Build Info */}
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{language === 'vi' ? 'Cặp vũ khí tối ưu' : 'Optimal weapon pairs'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{language === 'vi' ? 'Đội hình đề xuất' : 'Team compositions'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{language === 'vi' ? '3 chế độ chơi' : '3 game modes'}</span>
                  </div>
                </div>

                {/* View Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 flex items-center gap-1">
                    {language === 'vi' ? 'Xem hướng dẫn' : 'View build guide'}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>

        {/* No Results */}
        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">
              {language === 'vi' ? 'Không tìm thấy nhân vật nào.' : 'No characters found.'}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Về Hướng Dẫn Build' : 'About Build Guides'}
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              {language === 'vi'
                ? 'Các hướng dẫn build này được tạo tự động bởi thuật toán AI tiên tiến (v2.2) phân tích tương thích nguyên tố, tương đồng chỉ số và sự phù hợp vai trò.'
                : 'These build guides are automatically generated by an advanced AI algorithm (v2.2) that analyzes element compatibility, stat similarity, and role alignment.'}
            </p>
            <p>
              {language === 'vi'
                ? 'Mỗi hướng dẫn bao gồm khuyến nghị cho 3 chế độ chơi: Solo/Ranking, Farm/Speedrun và Boss/Single-Target.'
                : 'Each guide includes recommendations for 3 game modes: Solo/Ranking, Farm/Speedrun, and Boss/Single-Target.'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'vi'
                ? 'Lần cập nhật cuối: Dữ liệu được làm mới mỗi giờ'
                : 'Last updated: Data refreshed hourly'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

