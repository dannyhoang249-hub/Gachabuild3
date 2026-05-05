'use client';

import { Character } from '@/lib/data';
import { TierLevel, getTierColor, getTierDescription } from '@/data/modeTierlist';
import CharacterPortraitCard from './CharacterPortraitCard';

interface TierSectionProps {
  tier: TierLevel;
  dpsCharacters: Character[];
  supportCharacters: Character[];
}

export default function TierSection({ tier, dpsCharacters, supportCharacters }: TierSectionProps) {
  const tierColors = getTierColor(tier);
  const description = getTierDescription(tier);
  
  const totalCharacters = dpsCharacters.length + supportCharacters.length;
  
  // Don't render empty tiers
  if (totalCharacters === 0) {
    return null;
  }

  return (
    <section 
      className="bg-white rounded-xl shadow-md border-2 overflow-hidden"
      aria-labelledby={`tier-${tier}-heading`}
    >
      {/* Tier Header */}
      <div className={`${tierColors.bg} ${tierColors.text} border-b-2 ${tierColors.border} px-6 py-4`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <h2 id={`tier-${tier}-heading`} className="text-2xl sm:text-3xl font-bold">
              {tier}
            </h2>
            <div className="text-sm sm:text-base font-medium opacity-90">
              {totalCharacters} character{totalCharacters !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="text-xs sm:text-sm font-medium opacity-80">
            {description}
          </div>
        </div>
      </div>

      {/* Dual Lane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* DPS Lane */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-red-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">DPS</h3>
            <span className="text-sm text-gray-600">({dpsCharacters.length})</span>
          </div>
          
          {dpsCharacters.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {dpsCharacters.map((character) => (
                <CharacterPortraitCard 
                  key={character._id} 
                  character={character} 
                  compact 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No DPS characters in this tier</p>
            </div>
          )}
        </div>

        {/* Support Lane */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">Support</h3>
            <span className="text-sm text-gray-600">({supportCharacters.length})</span>
          </div>
          
          {supportCharacters.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {supportCharacters.map((character) => (
                <CharacterPortraitCard 
                  key={character._id} 
                  character={character} 
                  compact 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">No Support characters in this tier</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

