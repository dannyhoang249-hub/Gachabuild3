'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { IntronLevel } from '@/lib/data';
import { cleanText } from '@/lib/textUtils';

interface IntronLevelsProps {
  levels: IntronLevel[];
}

export default function IntronLevels({ levels }: IntronLevelsProps) {
  const { language, t } = useLanguage();

  // Sort levels by level number
  const sortedLevels = [...levels].sort((a, b) => a.level - b.level);

  // Determine role impact category based on effect keywords
  const getRoleImpact = (effect: string): string => {
    const desc = effect.toLowerCase();
    if (desc.includes('damage') || desc.includes('dmg') || desc.includes('attack')) {
      return language === 'vi' ? 'Tấn công' : 'Offensive';
    }
    if (desc.includes('heal') || desc.includes('shield') || desc.includes('hp')) {
      return language === 'vi' ? 'Hỗ trợ' : 'Sustain';
    }
    if (desc.includes('buff') || desc.includes('increase') || desc.includes('boost')) {
      return language === 'vi' ? 'Tăng sức mạnh' : 'DPS Scaling';
    }
    if (desc.includes('cooldown') || desc.includes('energy') || desc.includes('sanity')) {
      return language === 'vi' ? 'Tiện ích' : 'Utility';
    }
    return language === 'vi' ? 'Chung' : 'General';
  };

  return (
    <div className="relative pl-8">
      {/* Vertical timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-purple-200 to-transparent"></div>

      <div className="space-y-8">
        {sortedLevels.map((intronLevel, index) => {
          const effect = cleanText(t(intronLevel.effect));
          const roleImpact = getRoleImpact(effect);

          return (
            <div key={index} className="relative">
              {/* Level marker circle */}
              <div className="absolute -left-[26px] top-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10">
                <span className="text-white font-bold text-xs">{intronLevel.level}</span>
              </div>

              {/* Horizontal line from circle to content */}
              <div className="absolute -left-2 top-3 w-6 h-0.5 bg-purple-200"></div>

              {/* Content */}
              <div className="ml-6">
                {/* Level label */}
                <div className="text-sm font-bold text-purple-700 mb-1">
                  {language === 'vi' ? `Cấp ${intronLevel.level}` : `Lv.${intronLevel.level}`}
                </div>

                {/* Effect */}
                <p className="text-base text-gray-800 leading-relaxed mb-2">
                  {effect}
                </p>

                {/* Role Impact tag */}
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-gray-600">{language === 'vi' ? 'Tác động' : 'Role Impact'}:</span>
                  <span className="font-semibold text-purple-700">{roleImpact}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
