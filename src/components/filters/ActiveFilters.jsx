import React from 'react';
import { X } from 'lucide-react';
import './filterStyles.css';

const ActiveFilters = ({ 
  activeFilters, 
  filterOptions, 
  onRemoveFilter, 
  onClearAll 
}) => {
  // Get applied filters count that are not empty/default
  const appliedFiltersCount = Object.entries(activeFilters)
    .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    .length;
  
  if (appliedFiltersCount === 0) return null;
  
  // Get readable filter values by mapping filter keys to their labels
  const getFilterLabel = (filterName, filterValue) => {
    const filterOption = filterOptions.find(option => option.name === filterName);
    if (!filterOption) return filterValue;
    
    const valueOption = filterOption.options.find(option => option.value === filterValue);
    return valueOption ? valueOption.label : filterValue;
  };
  
  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center">
        <div className="mr-2 mb-2">
          <span className="text-sm font-medium">Applied Filters:</span>
        </div>
        
        {Object.entries(activeFilters).map(([key, value]) => {
          if (!value) return null;
          
          return (
            <div key={key} className="filter-chip">
              <span>
                {filterOptions.find(opt => opt.name === key)?.label}: {getFilterLabel(key, value)}
              </span>
              <X 
                size={16} 
                className="ml-1 text-gray-500 hover:text-gray-700" 
                onClick={() => onRemoveFilter(key)}
              />
            </div>
          );
        })}
        
        {appliedFiltersCount > 0 && (
          <button 
            onClick={onClearAll}
            className="text-sm text-primary hover:text-primary-dark mb-2"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters; 