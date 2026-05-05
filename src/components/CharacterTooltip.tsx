'use client';

import { Character } from '@/lib/data';
import { getCharacterTiers, TierLevel } from '@/data/modeTierlist';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState, useRef } from 'react';

interface CharacterTooltipProps {
  character: Character;
  isVisible: boolean;
  position?: { x: number; y: number };
}

export default function CharacterTooltip({ character, isVisible, position }: CharacterTooltipProps) {
  const { t } = useLanguage();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Adjust position to prevent viewport overflow
  useEffect(() => {
    if (!isVisible || !position || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = position.x;
    let newY = position.y;

    // Check horizontal overflow
    const tooltipWidth = rect.width;
    const halfWidth = tooltipWidth / 2;

    if (newX - halfWidth < 10) {
      // Too close to left edge
      newX = halfWidth + 10;
    } else if (newX + halfWidth > viewportWidth - 10) {
      // Too close to right edge
      newX = viewportWidth - halfWidth - 10;
    }

    // Check vertical overflow
    const tooltipHeight = rect.height;
    const spaceAbove = newY;
    const spaceBelow = viewportHeight - newY;

    // If not enough space above, show below instead
    if (spaceAbove < tooltipHeight + 20 && spaceBelow > tooltipHeight + 20) {
      // Show below
      newY = newY + 60; // Offset to show below the card
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [isVisible, position]);

  if (!isVisible) return null;

  // Get tier rankings across all modes
  const tiers = getCharacterTiers(character.slug?.current || '');

  // Get element border color
  const getElementBorderColor = (element?: string) => {
    if (!element) return 'border-gray-300';
    
    switch (element.toLowerCase()) {
      case 'fire':
        return 'border-orange-400';
      case 'water':
        return 'border-blue-400';
      case 'ice':
        return 'border-cyan-400';
      case 'wind':
        return 'border-green-400';
      case 'earth':
        return 'border-yellow-400';
      case 'light':
        return 'border-yellow-400';
      case 'dark':
        return 'border-gray-400';
      case 'psychic':
        return 'border-pink-400';
      case 'lightning':
        return 'border-yellow-400';
      default:
        return 'border-gray-300';
    }
  };

  // Get tier pill color
  const getTierPillColor = (tier: TierLevel | null) => {
    if (!tier) return 'bg-gray-300 text-gray-500';
    
    switch (tier) {
      case 'T0':
        return 'bg-red-500 text-white';
      case 'T1':
        return 'bg-amber-500 text-white';
      case 'T2':
        return 'bg-green-500 text-white';
      case 'T3':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-300 text-gray-500';
    }
  };

  // Format mode name for display
  const formatModeName = (mode: string) => {
    switch (mode) {
      case 'farming':
        return 'Farming';
      case 'party':
        return 'Party';
      case 'boss':
        return 'Boss';
      default:
        return mode;
    }
  };

  // Extract features from character data (using pros as features for now)
  const features = character.pros?.slice(0, 3).map(pro => t(pro)) || [];

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none"
      style={{
        left: adjustedPosition?.x || position?.x || 0,
        top: adjustedPosition?.y || position?.y || 0,
        transform: 'translate(-50%, -100%) translateY(-12px)',
      }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80 max-w-[90vw] pointer-events-auto animate-in fade-in duration-150">
        {/* Mini Portrait */}
        <div className="flex justify-center mb-3">
          <div className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${getElementBorderColor(character.element)}`}>
            <Image
              src={character.image || `/characters-img/${character.slug?.current}.png`}
              alt={`${t(character.name)} portrait`}
              fill
              className="object-cover"
              sizes="64px"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/characters/placeholder.svg';
              }}
            />
          </div>
        </div>

        {/* Character Name */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
          {t(character.name)}
        </h3>

        {/* Subline Metadata */}
        <p className="text-sm text-gray-600 text-center mb-3">
          {character.element || 'Unknown'} | {character.role || 'Unknown'}
        </p>

        {/* Proficiency Row */}
        <div className="mb-2">
          <p className="text-xs text-gray-700">
            <span className="font-medium">Proficiency:</span>{' '}
            <span className="text-gray-600">{character.weapon || 'Unknown'}</span>
          </p>
        </div>

        {/* Feature Tags Row */}
        {features.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-700">
              <span className="font-medium">Features:</span>{' '}
              <span className="text-gray-600 line-clamp-2">
                {features.join(', ')}
              </span>
            </p>
          </div>
        )}

        {/* Mode Tier Pills */}
        <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-200">
          {(['farming', 'party', 'boss'] as const).map((mode) => {
            const tier = tiers[mode];
            return (
              <div
                key={mode}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTierPillColor(tier)}`}
              >
                {formatModeName(mode)} {tier || 'T—'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

