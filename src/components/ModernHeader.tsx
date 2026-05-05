'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SearchWithSuggestions from './SearchWithSuggestions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/data';

export default function ModernHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tier List', href: '/tier-list' },
    { name: 'Characters', href: '/characters' },
    { name: 'Weapons', href: '/weapons' },
    { name: 'Guide Hub', href: '/guides/builds' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/Gachabuild_icon.png"
              alt="Duet Night Abyss Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">
              Duet Night Abyss
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Search & Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Desktop Language Switcher */}
            <LanguageSwitcherButton mobile={false} />

            {/* Search Bar */}
            <div className="hidden sm:block">
              <SearchWithSuggestions
                placeholder="Search characters..."
                className="w-64"
              />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <SearchWithSuggestions
                  placeholder="Search characters..."
                />
              </div>

              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="px-3 py-3 border-t border-gray-200 mt-2">
                <LanguageSwitcherButton mobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Language Switcher Button Component
function LanguageSwitcherButton({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  if (mobile) {
    // Mobile version - Full width buttons
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Language
        </p>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${language === lang.code
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop version - Compact toggle
  return (
    <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
            ${language === lang.code
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
          title={lang.name}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
