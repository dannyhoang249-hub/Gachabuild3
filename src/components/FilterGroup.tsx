'use client';

import FilterButton from './FilterButton';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  title: string;
  options: readonly FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  getColorClass?: (value: string) => string;
  className?: string;
}

export default function FilterGroup({
  title,
  options,
  selectedValue,
  onValueChange,
  getColorClass,
  className = '',
}: FilterGroupProps) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            isActive={selectedValue === option.value}
            onClick={() => onValueChange(option.value)}
            colorClass={getColorClass?.(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
