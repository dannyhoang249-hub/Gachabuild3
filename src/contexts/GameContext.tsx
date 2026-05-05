'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { games, Game, getGameById } from '@/data/games';

interface GameContextType {
  currentGame: Game;
  setCurrentGame: (gameId: string) => void;
  allGames: Game[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentGame, setCurrentGameState] = useState<Game>(games[0]);

  // Load game preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGameId = localStorage.getItem('current-game');
      if (savedGameId) {
        const game = getGameById(savedGameId);
        if (game) {
          setCurrentGameState(game);
        }
      }
    }
  }, []);

  // Save game preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current-game', currentGame.id);
    }
  }, [currentGame]);

  const setCurrentGame = (gameId: string) => {
    const game = getGameById(gameId);
    if (game) {
      setCurrentGameState(game);
    }
  };

  return (
    <GameContext.Provider value={{ 
      currentGame, 
      setCurrentGame, 
      allGames: games 
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
