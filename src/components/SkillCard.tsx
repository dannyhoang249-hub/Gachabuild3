'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skill } from '@/lib/data';
import { cleanText } from '@/lib/textUtils';
import Image from 'next/image';

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const { language, t } = useLanguage();
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Get badge color for skill type
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'active':
        return 'bg-blue-500 text-white';
      case 'ultimate':
        return 'bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold shadow-md';
      case 'passive':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'active':
        return language === 'vi' ? 'CHỦ ĐỘNG' : 'ACTIVE';
      case 'ultimate':
        return language === 'vi' ? 'TUYỆT KỸ' : 'ULTIMATE';
      case 'passive':
        return language === 'vi' ? 'BỊ ĐỘNG' : 'PASSIVE';
      default:
        return type.toUpperCase();
    }
  };

  const skillName = cleanText(t(skill.name));
  const skillSubtype = skill.subtype ? cleanText(skill.subtype) : '';
  const skillDescription = cleanText(t(skill.description));
  
  // Check if description is long (more than 150 characters)
  const isLongDescription = skillDescription.length > 150;
  const displayDescription = showFullDescription || !isLongDescription 
    ? skillDescription 
    : skillDescription.substring(0, 150) + '...';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      {/* Header Row: Icon + Name + Badge */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-start gap-4">
          {/* Skill Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
            {skill.icon?.asset?.url ? (
              <Image
                src={skill.icon.asset.url}
                alt={skill.icon.alt || skillName}
                width={48}
                height={48}
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>

          {/* Skill Name + Subtype */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {skillName || '—'}
            </h3>
            {skillSubtype && (
              <p className="text-sm text-gray-600 italic">
                {skillSubtype}
              </p>
            )}
          </div>

          {/* Type Badge */}
          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getTypeBadgeColor(skill.type)}`}>
            {getTypeLabel(skill.type)}
          </span>
        </div>
      </div>

      {/* Description (1-2 lines) */}
      <div className="p-4 border-b border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed">
          {displayDescription || '—'}
        </p>
        {isLongDescription && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            {showFullDescription 
              ? (language === 'vi' ? 'Thu gọn' : 'Show less')
              : (language === 'vi' ? 'Xem thêm' : 'Show more')
            }
          </button>
        )}
      </div>

      {/* Primary Stats Table */}
      {skill.stats && skill.stats.length > 0 && (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {language === 'vi' ? 'Chỉ số' : 'Stat'}
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                  Lv.1
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                  Lv.Max
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                  {language === 'vi' ? 'Ghi chú' : 'Notes'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {skill.stats.map((stat, index) => {
                const statName = cleanText(stat.stat || '—');
                const lv1Value = cleanText(stat.lv1 || '—');
                const lvMaxValue = cleanText(stat.lvMax || '—');
                const notes = stat.notes ? cleanText(stat.notes) : '';

                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {statName}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 font-mono bg-blue-50/30">
                      {lv1Value}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 font-mono bg-purple-50/30">
                      {lvMaxValue}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 italic">
                      {notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Stacked View */}
          <div className="md:hidden divide-y divide-gray-200">
            {/* Sticky Mini Header */}
            <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b-2 border-gray-200 z-10">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 uppercase">
                <span>{language === 'vi' ? 'Chỉ số' : 'Stat'}</span>
                <span>{language === 'vi' ? 'Giá trị' : 'Values'}</span>
              </div>
            </div>

            {skill.stats.map((stat, index) => {
              const statName = cleanText(stat.stat || '—');
              const lv1Value = cleanText(stat.lv1 || '—');
              const lvMaxValue = cleanText(stat.lvMax || '—');
              const notes = stat.notes ? cleanText(stat.notes) : '';

              return (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-sm text-gray-900 mb-2">
                    {statName}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-mono font-semibold border border-blue-200">
                      Lv.1: {lv1Value}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-purple-50 text-purple-700 text-xs font-mono font-semibold border border-purple-200">
                      Lv.Max: {lvMaxValue}
                    </span>
                  </div>
                  {notes && (
                    <div className="text-xs text-gray-500 italic mt-2 pl-2 border-l-2 border-gray-300">
                      {notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legacy Stats Fallback (if no new stats array) */}
      {(!skill.stats || skill.stats.length === 0) && (
        <div className="p-4">
          <div className="text-sm text-gray-500 italic text-center py-4">
            {language === 'vi' ? 'Thông tin chi tiết sẽ có sớm.' : 'Detailed stats coming soon.'}
          </div>
        </div>
      )}
    </div>
  );
}

