'use client';

import SearchWithSuggestions from './SearchWithSuggestions';
import FilterGroup from './FilterGroup';
import { ROLE_OPTIONS, ELEMENT_OPTIONS, WEAPON_OPTIONS, CHARACTER_RARITY_OPTIONS, getRoleColor, getElementColor, getWeaponColor, getCharacterRarityColor } from '@/data/filterConstants';

interface CharacterFiltersProps {
  onRoleFilter?: (role: string) => void;
  onElementFilter?: (element: string) => void;
  onWeaponFilter?: (weapon: string) => void;
  onRarityFilter?: (rarity: string) => void;
  onSearch?: (query: string) => void;
  selectedRole?: string;
  selectedElement?: string;
  selectedWeapon?: string;
  selectedRarity?: string;
  searchQuery?: string;
  // Legacy props for backward compatibility
  onRoleChange?: (role: string) => void;
  onWeaponChange?: (weapon: string) => void;
}

export default function CharacterFilters({
  onRoleFilter,
  onElementFilter,
  onWeaponFilter,
  onRarityFilter,
  onSearch,
  selectedRole,
  selectedElement,
  selectedWeapon,
  selectedRarity,
  searchQuery,
  // Legacy props
  onRoleChange,
  onWeaponChange,
}: CharacterFiltersProps) {
  // Determine which interface we're using (legacy vs new)
  const isLegacyInterface = onRoleChange && onWeaponChange && !onRoleFilter;

  // Map legacy props to new interface
  const currentRoleFilter = isLegacyInterface ? onRoleChange : onRoleFilter;
  const currentSelectedRole = isLegacyInterface ? selectedRole : selectedRole;
  const currentSelectedWeapon = selectedWeapon;

  const hasActiveFilters = currentSelectedRole || selectedElement || currentSelectedWeapon || selectedRarity || searchQuery;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="space-y-6">
        {/* Search Bar with Suggestions */}
        {onSearch && (
          <SearchWithSuggestions
            placeholder="Search by name, role, element, weapon..."
            onSearch={onSearch}
            origin="characters"
          />
        )}

        {/* Role Filters */}
        {currentRoleFilter && (
          <FilterGroup
            title={isLegacyInterface ? 'Filter by Weapon' : 'Filter by Role'}
            options={isLegacyInterface ? WEAPON_OPTIONS : ROLE_OPTIONS}
            selectedValue={currentSelectedRole || ''}
            onValueChange={(value) => currentRoleFilter(value)}
            getColorClass={isLegacyInterface ? getWeaponColor : getRoleColor}
          />
        )}

        {/* Element Filters */}
        {onElementFilter && (
          <FilterGroup
            title="Filter by Element"
            options={ELEMENT_OPTIONS}
            selectedValue={selectedElement || ''}
            onValueChange={(value) => onElementFilter(value)}
            getColorClass={getElementColor}
          />
        )}

        {/* Weapon Filters (for new interface) */}
        {onWeaponFilter && !isLegacyInterface && (
          <FilterGroup
            title="Filter by Weapon"
            options={WEAPON_OPTIONS}
            selectedValue={currentSelectedWeapon || ''}
            onValueChange={(value) => onWeaponFilter(value)}
            getColorClass={getWeaponColor}
          />
        )}

        {/* Rarity Filters */}
        {onRarityFilter && (
          <FilterGroup
            title="Filter by Rarity"
            options={CHARACTER_RARITY_OPTIONS}
            selectedValue={selectedRarity || ''}
            onValueChange={(value) => onRarityFilter(value)}
            getColorClass={getCharacterRarityColor}
          />
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                currentRoleFilter?.('');
                onElementFilter?.('');
                onWeaponFilter?.('');
                onRarityFilter?.('');
                onSearch?.('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700:text-gray-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}