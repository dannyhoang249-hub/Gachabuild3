'use client';

import { GameMode, getModeDisplayName, getModeIcon } from '@/data/modeTierlist';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  const modes: GameMode[] = ['farming', 'party', 'boss'];

  const getModeColor = (mode: GameMode, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400';
    }

    switch (mode) {
      case 'farming':
        return 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200';
      case 'party':
        return 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-200';
      case 'boss':
        return 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200';
      default:
        return 'bg-gray-600 text-white border-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Game Mode</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode;
          
          return (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`
                relative px-6 py-4 rounded-lg border-2 font-semibold
                transition-all duration-300 transform
                ${getModeColor(mode, isSelected)}
                ${isSelected ? 'scale-105' : 'hover:scale-102'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${getModeDisplayName(mode)} mode`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {getModeIcon(mode)}
                </span>
                <span className="text-sm sm:text-base">
                  {getModeDisplayName(mode)}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mode Description */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          {selectedMode === 'farming' && (
            <>
              <strong>Exploration Mode:</strong> Best characters for farming resources, clearing mobs, and general exploration content.
            </>
          )}
          {selectedMode === 'party' && (
            <>
              <strong>Party Mode:</strong> Optimal characters for cooperative play and AI team compositions.
            </>
          )}
          {selectedMode === 'boss' && (
            <>
              <strong>Boss Mode:</strong> Top performers for solo boss fights and challenging single-target encounters.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

