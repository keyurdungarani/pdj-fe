import React, { useState } from 'react';
import { X, Check, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  filterOptions, 
  currentFilters, 
  onApplyFilters,
  resetFilters 
}) => {
  const [selectedFilters, setSelectedFilters] = useState({...currentFilters});
  const [expandedSections, setExpandedSections] = useState({});

  // Initialize expandedSections on first render
  React.useEffect(() => {
    if (filterOptions.length > 0 && Object.keys(expandedSections).length === 0) {
      const initial = {};
      filterOptions.forEach((option, index) => {
        initial[option.name] = index === 0; // Only expand first filter by default
      });
      setExpandedSections(initial);
    }
  }, [filterOptions]);

  const handleFilterChange = (name, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };
  
  const handleReset = () => {
    setSelectedFilters(resetFilters);
  };

  // Toggle filter section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Render the filter list with checkboxes
  const renderFilterOptions = (filter) => {
    return (
      <div className="space-y-2 pl-1">
        {filter.options.map((option) => (
          <div 
            key={option.value} 
            className="flex items-center cursor-pointer group py-1"
            onClick={() => handleFilterChange(filter.name, option.value)}
          >
            <div className={`w-4 h-4 mr-3 border rounded-sm flex items-center justify-center ${
              selectedFilters[filter.name] === option.value 
                ? 'bg-primary border-primary' 
                : 'border-gray-400 bg-white'
            }`}>
              {selectedFilters[filter.name] === option.value && (
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              )}
            </div>
            <span className={`text-sm ${
              selectedFilters[filter.name] === option.value 
                ? 'text-primary font-medium' 
                : 'text-gray-800'
            }`}>
              {option.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-start" onClick={onClose}>
      <div 
        className="bg-white w-full md:max-w-[320px] h-full animate-slide-from-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">FILTERS</h2>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="h-[calc(100%-8rem)] overflow-y-auto divide-y">
          {filterOptions.map((filter) => (
            <div key={filter.name} className="p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(filter.name)}
              >
                <h3 className="font-semibold text-gray-800">{filter.label}</h3>
                {expandedSections[filter.name] ? 
                  <ChevronUp size={16} className="text-gray-500" /> :
                  <ChevronDown size={16} className="text-gray-500" />
                }
              </div>
              
              {expandedSections[filter.name] && (
                <div className="mt-3">
                  {renderFilterOptions(filter)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4 grid grid-cols-2 gap-3">
          <button 
            onClick={handleReset}
            className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-sm text-gray-800"
          >
            CLEAR ALL
          </button>
          <button 
            onClick={handleApply}
            className="p-3 bg-primary text-white rounded-md hover:bg-primary-dark font-medium text-sm"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer; 