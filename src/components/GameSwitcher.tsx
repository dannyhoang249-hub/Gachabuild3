'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/contexts/GameContext';
import { Game } from '@/data/games';

export default function GameSwitcher() {
  const { currentGame, setCurrentGame, allGames } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const handleGameSelect = (game: Game) => {
    if (game.comingSoon) {
      return; // Don't allow selection of coming soon games
    }
    setCurrentGame(game.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Game Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          {currentGame.icon.startsWith('/') ? (
            <Image 
              src={currentGame.icon} 
              alt={currentGame.name}
              width={48}
              height={48}
              className="object-contain"
            />
          ) : (
            <span className="text-2xl">{currentGame.icon}</span>
          )}
          <span className="text-sm font-medium text-gray-900">{currentGame.name}</span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
            {allGames.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameSelect(game)}
                disabled={game.comingSoon}
                className={`w-full flex items-center px-4 py-3 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  game.comingSoon 
                    ? 'opacity-50 cursor-not-allowed text-gray-400' 
                    : game.id === currentGame.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {game.icon.startsWith('/') ? (
                  <Image 
                    src={game.icon} 
                    alt={game.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xl">{game.icon}</span>
                )}
                <span className="ml-3 text-sm font-medium">{game.name}</span>
                {game.comingSoon && (
                  <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
                {game.id === currentGame.id && !game.comingSoon && (
                  <svg className="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
