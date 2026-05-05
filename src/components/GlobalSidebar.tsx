'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { getNavigationCategories } from '@/data/games';
import LanguageSwitcher from './LanguageSwitcher';
import GameSwitcher from './GameSwitcher';

interface GlobalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSidebar({ isOpen, onClose }: GlobalSidebarProps) {
  const pathname = usePathname();
  const { currentGame } = useGame();
  const navigationCategories = getNavigationCategories(currentGame);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        h-full w-full bg-white border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:shadow-none lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="block">
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Image
                  src="/Gachabuild_icon.png"
                  alt="Duet Night Abyss Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Game Switcher */}
          <div className="p-4 border-b border-gray-200">
            <GameSwitcher />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {Object.entries(navigationCategories).map(([category, items]) => (
                <div key={category}>
                  {/* Category Header */}
                  {category !== 'main' && (
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                      {category === 'tier-lists' ? 'Tier Lists' : 
                       category === 'database' ? 'Database' : 
                       category === 'tools' ? 'Tools' : category}
                    </h3>
                  )}
                  
                  {/* Navigation Items */}
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`
                          flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                          ${item.disabled 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                        onClick={item.disabled ? (e) => e.preventDefault() : onClose}
                      >
                        <span className="text-lg mr-3">{item.icon}</span>
                        {item.label}
                        {item.disabled && (
                          <span className="ml-auto text-xs text-gray-400">Soon</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="px-4">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Fan-made website</p>
              <p>Duet Night Abyss Guide © 2026</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
