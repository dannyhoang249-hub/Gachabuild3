'use client';

import { Character } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import CharacterTooltip from './CharacterTooltip';

interface CharacterPortraitCardProps {
  character: Character;
  compact?: boolean;
}

export default function CharacterPortraitCard({ character, compact = false }: CharacterPortraitCardProps) {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse enter (desktop)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }

    setShowTooltip(true);
  };

  // Handle mouse leave (desktop)
  const handleMouseLeave = () => {
    if (isMobile) return;

    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 100);
  };

  // Handle click (mobile) - Show tooltip on first tap, navigate on second tap
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    // If tooltip is already showing, allow navigation
    if (showTooltip) {
      return; // Let the Link handle navigation
    }

    // First tap: show tooltip
    e.preventDefault();
    e.stopPropagation();

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }

    setShowTooltip(true);
  };

  // Close tooltip when clicking outside (mobile)
  useEffect(() => {
    if (!isMobile || !showTooltip) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, showTooltip]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const getElementColor = (element?: string) => {
    if (!element) return 'border-gray-200';
    
    switch (element.toLowerCase()) {
      case 'fire':
        return 'border-orange-400 bg-orange-50';
      case 'water':
        return 'border-blue-400 bg-blue-50';
      case 'ice':
        return 'border-cyan-400 bg-cyan-50';
      case 'wind':
        return 'border-green-400 bg-green-50';
      case 'earth':
        return 'border-yellow-400 bg-yellow-50';
      case 'light':
        return 'border-yellow-400 bg-yellow-50';
      case 'dark':
        return 'border-gray-400 bg-gray-50';
      case 'psychic':
        return 'border-pink-400 bg-pink-50';
      case 'lightning':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getRarityBorder = (rarity?: string) => {
    if (!rarity) return 'border-2';
    
    switch (rarity) {
      case '5★':
        return 'border-4 border-yellow-400 shadow-lg shadow-yellow-200';
      case '4★':
        return 'border-3 border-purple-400 shadow-md shadow-purple-200';
      case '3★':
        return 'border-2 border-blue-400 shadow-sm shadow-blue-200';
      default:
        return 'border-2 border-gray-300';
    }
  };

  if (compact) {
    // Compact card for tier list lanes
    return (
      <>
        <Link
          href={`/characters/${character.slug?.current || 'unknown'}?from=tier-list`}
          className="group block"
          onClick={(e) => {
            if (isMobile && showTooltip) {
              // Allow navigation on second tap
              return;
            }
            if (isMobile) {
              e.preventDefault();
            }
          }}
        >
          <div
            ref={cardRef}
            className={`
              relative rounded-lg overflow-hidden transition-all duration-300
              hover:scale-105 hover:shadow-xl
              ${getRarityBorder(character.rarity)}
              ${getElementColor(character.element)}
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            {/* Character Portrait */}
            <div className="relative aspect-square bg-gradient-to-br from-white to-gray-50">
              <Image
                src={character.image || `/characters-img/${character.slug?.current}.png`}
                alt={`${t(character.name)} portrait`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 80px, (max-width: 1024px) 100px, 120px"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/characters/placeholder.svg';
                }}
              />

              {/* Rarity Badge */}
              {character.rarity && (
                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-bold text-yellow-700 shadow-sm">
                  {character.rarity}
                </div>
              )}
            </div>

            {/* Character Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-white text-xs font-semibold text-center line-clamp-1 drop-shadow-lg">
                {t(character.name)}
              </p>
            </div>
          </div>
        </Link>

        {/* Tooltip */}
        <CharacterTooltip
          character={character}
          isVisible={showTooltip}
          position={tooltipPosition}
        />
      </>
    );
  }

  // Full card (not used in new tier list, but kept for compatibility)
  return (
    <>
      <Link
        href={`/characters/${character.slug?.current || 'unknown'}?from=tier-list`}
        className="group block"
        onClick={(e) => {
          if (isMobile && showTooltip) {
            // Allow navigation on second tap
            return;
          }
          if (isMobile) {
            e.preventDefault();
          }
        }}
      >
        <div
          ref={cardRef}
          className={`
            bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300
            hover:scale-105 border-2 overflow-hidden
            ${getElementColor(character.element)}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {/* Character Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden">
            <Image
              src={character.image || `/characters-img/${character.slug?.current}.png`}
              alt={`${t(character.name)} character portrait`}
              width={200}
              height={200}
              className="object-contain transition-transform duration-300 group-hover:scale-110 max-w-full max-h-full"
              sizes="(max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/characters/placeholder.svg';
              }}
            />

            {/* Rarity Badge */}
            {character.rarity && (
              <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold border border-yellow-300">
                {character.rarity}
              </div>
            )}
          </div>

          {/* Character Info */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
              {t(character.name)}
            </h3>

            {/* Role & Element */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                {character.role}
              </span>
              {character.element && (
                <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {character.element}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Tooltip */}
      <CharacterTooltip
        character={character}
        isVisible={showTooltip}
        position={tooltipPosition}
      />
    </>
  );
}

