'use client';

import { useState, useMemo } from 'react';
import { Weapon } from '@/lib/data';
import WeaponCard from '@/components/WeaponCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWeaponElementColor, getWeaponDamageTypeColor } from '@/data/filterConstants';

interface WeaponsPageClientProps {
  weapons: Weapon[];
}

const MELEE_WEAPONS = ['Katana', 'Sword', 'Polearm', 'Whipsword', 'Greatsword', 'Dual Blades'];
const RANGE_WEAPONS = ['Shotgun', 'Dual Pistols', 'Assault Rifle', 'Bow', 'Grenade Launcher'];

export default function WeaponsPageClient({ weapons }: WeaponsPageClientProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'melee' | 'range'>('melee');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedDamageType, setSelectedDamageType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentWeaponTypes = activeTab === 'melee' ? MELEE_WEAPONS : RANGE_WEAPONS;

  // Get unique elements and damage types from weapons
  const availableElements = useMemo(() => {
    const elements = new Set<string>();
    weapons.forEach(w => {
      if (w.element) elements.add(w.element);
    });
    return Array.from(elements).sort();
  }, [weapons]);

  const availableDamageTypes = useMemo(() => {
    const damageTypes = new Set<string>();
    weapons.forEach(w => {
      if (w.damageType) damageTypes.add(w.damageType);
    });
    return Array.from(damageTypes).sort();
  }, [weapons]);

  const filteredWeapons = useMemo(() => {
    return weapons.filter(weapon => {
      // Filter by category (melee/range)
      const isMelee = MELEE_WEAPONS.includes(weapon.type);
      const isRange = RANGE_WEAPONS.includes(weapon.type);
      const categoryMatch = (activeTab === 'melee' && isMelee) || (activeTab === 'range' && isRange);

      // Filter by selected type
      const typeMatch = !selectedType || weapon.type === selectedType;

      // Filter by element
      const elementMatch = !selectedElement || weapon.element === selectedElement;

      // Filter by damage type
      const damageTypeMatch = !selectedDamageType || weapon.damageType === selectedDamageType;

      // Filter by search query
      const searchMatch = !searchQuery ||
        weapon.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        weapon.name.vi.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && typeMatch && elementMatch && damageTypeMatch && searchMatch;
    });
  }, [activeTab, selectedType, selectedElement, selectedDamageType, searchQuery, weapons]);

  const getWeaponTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'katana':
        return 'bg-red-200 text-red-800 border-red-300 hover:bg-red-300 shadow-sm';
      case 'sword':
        return 'bg-blue-200 text-blue-800 border-blue-300 hover:bg-blue-300 shadow-sm';
      case 'polearm':
        return 'bg-green-200 text-green-800 border-green-300 hover:bg-green-300 shadow-sm';
      case 'whipsword':
        return 'bg-purple-200 text-purple-800 border-purple-300 hover:bg-purple-300 shadow-sm';
      case 'greatsword':
        return 'bg-orange-200 text-orange-800 border-orange-300 hover:bg-orange-300 shadow-sm';
      case 'shotgun':
        return 'bg-yellow-200 text-yellow-800 border-yellow-300 hover:bg-yellow-300 shadow-sm';
      case 'dual pistols':
        return 'bg-pink-200 text-pink-800 border-pink-300 hover:bg-pink-300 shadow-sm';
      case 'assault rifle':
        return 'bg-indigo-200 text-indigo-800 border-indigo-300 hover:bg-indigo-300 shadow-sm';
      case 'bow':
        return 'bg-emerald-200 text-emerald-800 border-emerald-300 hover:bg-emerald-300 shadow-sm';
      case 'grenade launcher':
        return 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300 shadow-sm';
      default:
        return 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300 shadow-sm';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Poppins',sans-serif]">
              Weapon Database
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover all the weapons in Duet Night Abyss. Filter by weapon type and category to find the perfect weapons for your characters.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Search weapons..."
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('melee')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'melee'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Melee Weapons
              </button>
              <button
                onClick={() => setActiveTab('range')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'range'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Range Weapons
              </button>
            </div>
          </div>
        </div>

        {/* Category Description */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeTab === 'melee' ? 'Melee Weapons' : 'Range Weapons'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {activeTab === 'melee' 
                  ? 'Close-combat weapons designed for direct engagement. These weapons excel in melee combat with high damage potential and unique attack patterns.'
                  : 'Long-range weapons perfect for tactical combat. These weapons provide excellent range and precision, ideal for strategic positioning and area control.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filter Chips - Weapon Type */}
        <div className="mb-6">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Weapon Type</h3>
            <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  !selectedType
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-300'
                }`}
              >
                All {activeTab === 'melee' ? 'Melee' : 'Range'}
              </button>
              {currentWeaponTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? '' : type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedType === type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : `${getWeaponTypeColor(type)} hover:shadow-md`
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Chips - Element */}
        {availableElements.length > 0 && (
          <div className="mb-6">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Element</h3>
              <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                <button
                  onClick={() => setSelectedElement('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    !selectedElement
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  All Elements
                </button>
                {availableElements.map((element) => (
                  <button
                    key={element}
                    onClick={() => setSelectedElement(selectedElement === element ? '' : element)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                      selectedElement === element
                        ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                        : `${getWeaponElementColor(element)} hover:shadow-md`
                    }`}
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Chips - Damage Type */}
        {availableDamageTypes.length > 0 && (
          <div className="mb-8">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Damage Type</h3>
              <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                <button
                  onClick={() => setSelectedDamageType('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    !selectedDamageType
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  All Damage Types
                </button>
                {availableDamageTypes.map((damageType) => (
                  <button
                    key={damageType}
                    onClick={() => setSelectedDamageType(selectedDamageType === damageType ? '' : damageType)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                      selectedDamageType === damageType
                        ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                        : `${getWeaponDamageTypeColor(damageType)} hover:shadow-md`
                    }`}
                  >
                    {damageType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center">
            Showing {filteredWeapons.length} of {weapons.filter(w => 
              (activeTab === 'melee' && MELEE_WEAPONS.includes(w.type)) || 
              (activeTab === 'range' && RANGE_WEAPONS.includes(w.type))
            ).length} {activeTab} weapons
          </p>
        </div>

        {/* Weapons Grid */}
        <section aria-labelledby="weapons-heading">
          <h2 id="weapons-heading" className="sr-only">Weapon List</h2>
          {filteredWeapons.length > 0 ? (
            <div className="weapon-grid" role="list" aria-label="Weapon database">
              {filteredWeapons.map((weapon) => (
                <WeaponCard key={weapon._id} weapon={weapon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="text-gray-400 mb-4" aria-hidden="true">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No weapons found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more weapons.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
