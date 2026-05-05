'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSearchSuggestions, SearchSuggestion, initializeSearchData } from '@/lib/simpleSearchData';
import Image from 'next/image';

interface SearchWithSuggestionsProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  origin?: string;
}

export default function SearchWithSuggestions({ 
  placeholder = "Search characters and weapons...",
  className = "",
  onSearch,
  origin = 'tier-list'
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLanguage();
  
  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize search data on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeSearchData();
        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true); // Continue anyway
      }
    };
    init();
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsLoading(true);
      const results = await getSearchSuggestions(searchQuery, 10, true);
      
      // Translate display names
      const translatedResults = results.map(item => ({
        ...item,
        displayName: t(item.name)
      }));

      setSuggestions(translatedResults);
      setShowSuggestions(translatedResults.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Handle input change with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      if (isInitialized) {
        performSearch(value);
      }
    }, 150); // 150ms debounce
  }, [onSearch, performSearch, isInitialized]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.displayName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (suggestion.category === 'character') {
      router.push(`/characters/${suggestion.slug?.current || 'unknown'}?from=${origin}`);
    } else {
      router.push(`/weapon/${suggestion.slug?.current || 'unknown'}?from=${origin}`);
    }
  }, [router, origin]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        onSearch?.(query);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          onSearch?.(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, query, onSearch, handleSuggestionClick]);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  // Handle blur
  const handleBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicks on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  }, []);

  // Highlight matched text
  const highlightText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  }, []);

  // Get category badge color
  const getCategoryBadgeColor = useCallback((category: string) => {
    switch (category.toLowerCase()) {
      case 'character':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'weapon':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }, []);

  // Get role badge color for characters
  const getRoleBadgeColor = useCallback((role: string) => {
    switch (role.toLowerCase()) {
      case 'vanguard':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'support':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'annihilator':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        suggestions.length > 0 ? (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion._type}-${suggestion._id}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedIndex === index ? 'bg-blue-50 dark:bg-blue-50/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Item Image */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={suggestion.image || (suggestion.category === 'character' ? '/characters/placeholder.svg' : '/weapons/placeholder.svg')}
                    alt={suggestion.displayName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = suggestion.category === 'character' ? '/characters/placeholder.svg' : '/weapons/placeholder.svg';
                    }}
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {highlightText(suggestion.displayName, query)}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(suggestion.category)}`}>
                      {suggestion.category === 'character' ? 'Character' : 'Weapon'}
                    </span>
                    {suggestion.rarity && (
                      <span className="text-xs text-gray-500">
                        {suggestion.rarity}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {suggestion.category === 'character' && suggestion.role && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(suggestion.role)}`}>
                        {suggestion.role}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {suggestion.subtitle}
                    </span>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 py-3 text-gray-500 text-center">
              No results found
            </div>
          </div>
        )
      )}
    </div>
  );
}