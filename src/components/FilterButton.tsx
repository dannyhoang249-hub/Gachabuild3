'use client';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  colorClass?: string;
  className?: string;
}

export default function FilterButton({
  label,
  isActive,
  onClick,
  colorClass,
  className = '',
}: FilterButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium border transition-colors';
  const inactiveClasses = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200:bg-gray-600';
  const activeClasses = colorClass || 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200:bg-blue-800';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}
      aria-pressed={isActive}
      aria-label={`Filter by ${label}`}
    >
      {label}
    </button>
  );
}
