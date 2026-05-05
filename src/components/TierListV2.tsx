'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Character } from '@/lib/data';
import { GameMode, TierLevel, getAllTierLevels, getTierDataForMode } from '@/data/modeTierlist';
import ModeSelector from './ModeSelector';
import FilterChips from './FilterChips';
import NoticesPanel from './NoticesPanel';
import TierSection from './TierSection';

interface TierListV2Props {
  characters: Character[];
}

export default function TierListV2({ characters }: TierListV2Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial state from URL or defaults
  const initialMode = (searchParams.get('mode') as GameMode) || 'farming';
  const initialElement = searchParams.get('element') || '';
  const initialRole = searchParams.get('role') || '';
  const initialWeapon = searchParams.get('weapon') || '';

  // State management
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [selectedElement, setSelectedElement] = useState(initialElement);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedWeapon, setSelectedWeapon] = useState(initialWeapon);

  // Update URL when filters change
  const updateURL = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    const queryString = newParams.toString();
    const newURL = queryString ? `/?${queryString}` : '/';

    router.push(newURL, { scroll: false });
  }, [router]);

  // Handle mode change
  const handleModeChange = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    updateURL({
      mode,
      element: selectedElement,
      role: selectedRole,
      weapon: selectedWeapon,
    });
  }, [selectedElement, selectedRole, selectedWeapon, updateURL]);

  // Handle filter changes
  const handleElementChange = useCallback((element: string) => {
    setSelectedElement(element);
    updateURL({
      mode: selectedMode,
      element,
      role: selectedRole,
      weapon: selectedWeapon,
    });
  }, [selectedMode, selectedRole, selectedWeapon, updateURL]);

  const handleRoleChange = useCallback((role: string) => {
    setSelectedRole(role);
    updateURL({
      mode: selectedMode,
      element: selectedElement,
      role,
      weapon: selectedWeapon,
    });
  }, [selectedMode, selectedElement, selectedWeapon, updateURL]);

  const handleWeaponChange = useCallback((weapon: string) => {
    setSelectedWeapon(weapon);
    updateURL({
      mode: selectedMode,
      element: selectedElement,
      role: selectedRole,
      weapon,
    });
  }, [selectedMode, selectedElement, selectedRole, updateURL]);

  // Get tier data for selected mode (fallback to hardcoded)
  const tierData = useMemo(() => getTierDataForMode(selectedMode), [selectedMode]);
  const tierLevels = useMemo(() => getAllTierLevels(), []);

  // Filter characters based on selected filters
  const filterCharacter = useCallback((character: Character) => {
    if (selectedElement && character.element?.toLowerCase() !== selectedElement.toLowerCase()) {
      return false;
    }
    // Role filtering: match if role starts with selected role (e.g., "DPS" matches "DPS / Skill DMG")
    if (selectedRole && !character.role?.toLowerCase().startsWith(selectedRole.toLowerCase())) {
      return false;
    }
    if (selectedWeapon && character.weapon?.toLowerCase() !== selectedWeapon.toLowerCase()) {
      return false;
    }
    return true;
  }, [selectedElement, selectedRole, selectedWeapon]);

  // Get characters for a specific tier and lane
  const getCharactersForLane = useCallback((tier: TierLevel, lane: 'dps' | 'support') => {
    const characterSlugs = tierData[tier]?.[lane] || [];

    return characterSlugs
      .map(slug => characters.find(char => char.slug?.current === slug))
      .filter((char): char is Character => char !== undefined)
      .filter(filterCharacter);
  }, [tierData, characters, filterCharacter]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Duet Night Abyss Tier List
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive character rankings optimized for different game modes.
            Select a mode and apply filters to find the best characters for your playstyle.
          </p>
        </header>

        {/* Notices Panel */}
        <div className="mb-6">
          <NoticesPanel />
        </div>

        {/* Mode Selector */}
        <div className="mb-6">
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterChips
            selectedElement={selectedElement}
            selectedRole={selectedRole}
            selectedWeapon={selectedWeapon}
            onElementChange={handleElementChange}
            onRoleChange={handleRoleChange}
            onWeaponChange={handleWeaponChange}
          />
        </div>

        {/* Tier Sections */}
        <div className="space-y-6">
          {tierLevels.map((tier) => {
            const dpsCharacters = getCharactersForLane(tier, 'dps');
            const supportCharacters = getCharactersForLane(tier, 'support');

            return (
              <TierSection
                key={tier}
                tier={tier}
                dpsCharacters={dpsCharacters}
                supportCharacters={supportCharacters}
              />
            );
          })}
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p className="mb-2">
            Tier rankings are based on character performance in specific game modes and may vary based on team composition and player skill.
          </p>
          <p className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </footer>
      </div>
    </main>
  );
}

