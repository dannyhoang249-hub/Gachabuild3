'use client';

import { ROLE_OPTIONS, ELEMENT_OPTIONS, WEAPON_TYPE_OPTIONS, getElementColor, getRoleColor } from '@/data/filterConstants';

interface FilterChipsProps {
  selectedElement: string;
  selectedRole: string;
  selectedWeapon: string;
  onElementChange: (element: string) => void;
  onRoleChange: (role: string) => void;
  onWeaponChange: (weapon: string) => void;
}

export default function FilterChips({
  selectedElement,
  selectedRole,
  selectedWeapon,
  onElementChange,
  onRoleChange,
  onWeaponChange,
}: FilterChipsProps) {
  const hasActiveFilters = selectedElement || selectedRole || selectedWeapon;

  const clearAllFilters = () => {
    onElementChange('');
    onRoleChange('');
    onWeaponChange('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Element Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Element</h3>
          <div className="flex flex-wrap gap-2">
            {ELEMENT_OPTIONS.map((option) => {
              const isSelected = selectedElement === option.value;
              const isAll = option.value === '';
              
              return (
                <button
                  key={option.value}
                  onClick={() => onElementChange(option.value)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium border-2
                    transition-all duration-200 transform
                    ${isSelected 
                      ? `${isAll ? 'bg-gray-200 text-gray-900 border-gray-400' : getElementColor(option.value)} scale-105 shadow-md` 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  `}
                  aria-pressed={isSelected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Role</h3>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((option) => {
              const isSelected = selectedRole === option.value;
              const isAll = option.value === '';
              
              return (
                <button
                  key={option.value}
                  onClick={() => onRoleChange(option.value)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium border-2
                    transition-all duration-200 transform
                    ${isSelected 
                      ? `${isAll ? 'bg-gray-200 text-gray-900 border-gray-400' : getRoleColor(option.value)} scale-105 shadow-md` 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  `}
                  aria-pressed={isSelected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weapon Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Weapon Type</h3>
          <div className="flex flex-wrap gap-2">
            {WEAPON_TYPE_OPTIONS.slice(0, 6).map((option) => {
              const isSelected = selectedWeapon === option.value;
              const isAll = option.value === '';
              
              return (
                <button
                  key={option.value}
                  onClick={() => onWeaponChange(option.value)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium border-2
                    transition-all duration-200 transform
                    ${isSelected 
                      ? `${isAll ? 'bg-gray-200 text-gray-900 border-gray-400' : 'bg-slate-200 text-slate-900 border-slate-400'} scale-105 shadow-md` 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  `}
                  aria-pressed={isSelected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Active filters: 
            {selectedElement && <span className="ml-1 font-medium">{selectedElement}</span>}
            {selectedRole && <span className="ml-1 font-medium">{selectedRole}</span>}
            {selectedWeapon && <span className="ml-1 font-medium">{selectedWeapon}</span>}
          </p>
        </div>
      )}
    </div>
  );
}

