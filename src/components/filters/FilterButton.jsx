import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const FilterButton = ({ onClick, activeFilterCount = 0 }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 bg-white px-4 py-2.5 rounded-md border shadow-sm"
    >
      <SlidersHorizontal size={18} />
      <span className="font-medium">Filters</span>
      {activeFilterCount > 0 && (
        <span className="flex items-center justify-center bg-primary text-white rounded-full w-5 h-5 text-xs">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
};

export default FilterButton; 