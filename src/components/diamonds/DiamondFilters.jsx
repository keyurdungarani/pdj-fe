import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import ShapeSelector from './ShapeSelector';

const DiamondFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  activeFilterCount,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    shape: true,
    carat: true,
    cut: true,
    color: true,
    clarity: true,
    price: true,
    certification: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter options
  const cutGrades = ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair'];
  const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const certifications = ['GIA', 'AGS', 'GCAL', 'EGL', 'IGI', 'GSI'];
  
  const caratRanges = [
    { label: '0.30 - 0.49', value: '0.30-0.49' },
    { label: '0.50 - 0.69', value: '0.50-0.69' },
    { label: '0.70 - 0.89', value: '0.70-0.89' },
    { label: '0.90 - 0.99', value: '0.90-0.99' },
    { label: '1.00 - 1.49', value: '1.00-1.49' },
    { label: '1.50 - 1.99', value: '1.50-1.99' },
    { label: '2.00 - 2.99', value: '2.00-2.99' },
    { label: '3.00+', value: '3.00-' }
  ];

  const priceRanges = [
    { label: 'Under $1,000', value: '0-1000' },
    { label: '$1,000 - $3,000', value: '1000-3000' },
    { label: '$3,000 - $5,000', value: '3000-5000' },
    { label: '$5,000 - $10,000', value: '5000-10000' },
    { label: '$10,000 - $20,000', value: '10000-20000' },
    { label: '$20,000+', value: '20000-' }
  ];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="pb-4 px-1">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxOption = ({ value, label, selectedValue, onChange, description }) => (
    <label className="flex items-center py-2 cursor-pointer group hover:bg-gray-50 rounded px-2 -mx-2">
      <input
        type="checkbox"
        checked={selectedValue === value}
        onChange={() => onChange(selectedValue === value ? '' : value)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
      />
      <div className="ml-3 flex-1">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </label>
  );

  const ColorGradeOption = ({ color, selected, onClick }) => {
    const getColorDescription = (color) => {
      const descriptions = {
        'D': 'Colorless',
        'E': 'Colorless', 
        'F': 'Colorless',
        'G': 'Near Colorless',
        'H': 'Near Colorless',
        'I': 'Near Colorless',
        'J': 'Near Colorless',
        'K': 'Faint Yellow',
        'L': 'Faint Yellow',
        'M': 'Faint Yellow',
        'N': 'Very Light Yellow',
        'O': 'Very Light Yellow',
        'P': 'Very Light Yellow',
        'Q': 'Very Light Yellow',
        'R': 'Very Light Yellow',
        'S': 'Light Yellow',
        'T': 'Light Yellow',
        'U': 'Light Yellow',
        'V': 'Light Yellow',
        'W': 'Light Yellow',
        'X': 'Light Yellow',
        'Y': 'Light Yellow',
        'Z': 'Light Yellow'
      };
      return descriptions[color] || '';
    };

    return (
      <button
        onClick={() => onClick(selected ? '' : color)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
          selected 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
            selected ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-600'
          }`}>
            {color}
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">{color}</div>
            <div className="text-xs text-gray-500">{getColorDescription(color)}</div>
          </div>
        </div>
        {selected && (
          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="font-bold text-gray-900">Filter Diamonds</h2>
          {activeFilterCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">{activeFilterCount} filters applied</p>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-primary hover:text-primary-dark font-medium"
          >
            <RotateCcw size={14} className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="divide-y divide-gray-200">
        {/* Shape Filter */}
        <FilterSection title="Shape" sectionKey="shape">
          <ShapeSelector
            selectedShape={filters.shape}
            onShapeChange={(shape) => onFilterChange('shape', shape)}
          />
        </FilterSection>

        {/* Carat Weight */}
        <FilterSection title="Carat Weight" sectionKey="carat">
          <div className="space-y-2">
            {caratRanges.map((range) => (
              <CheckboxOption
                key={range.value}
                value={range.value}
                label={range.label}
                selectedValue={filters.caratRange}
                onChange={(value) => onFilterChange('caratRange', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Cut Grade */}
        <FilterSection title="Cut Grade" sectionKey="cut">
          <div className="space-y-2">
            {cutGrades.map((cut) => (
              <CheckboxOption
                key={cut}
                value={cut}
                label={cut}
                selectedValue={filters.cut}
                onChange={(value) => onFilterChange('cut', value)}
                description={cut === 'Ideal' ? 'Maximum brilliance' : cut === 'Excellent' ? 'Exceptional sparkle' : ''}
              />
            ))}
          </div>
        </FilterSection>

        {/* Color Grade */}
        <FilterSection title="Color Grade" sectionKey="color">
          <div className="grid grid-cols-1 gap-2">
            {colors.map((color) => (
              <ColorGradeOption
                key={color}
                color={color}
                selected={filters.color === color}
                onClick={(value) => onFilterChange('color', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Clarity */}
        <FilterSection title="Clarity" sectionKey="clarity">
          <div className="space-y-2">
            {clarities.map((clarity) => (
              <CheckboxOption
                key={clarity}
                value={clarity}
                label={clarity}
                selectedValue={filters.clarity}
                onChange={(value) => onFilterChange('clarity', value)}
                description={
                  clarity === 'FL' ? 'Flawless' :
                  clarity === 'IF' ? 'Internally Flawless' :
                  clarity.includes('VVS') ? 'Very Very Slightly Included' :
                  clarity.includes('VS') ? 'Very Slightly Included' :
                  clarity.includes('SI') ? 'Slightly Included' : ''
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <CheckboxOption
                key={range.value}
                value={range.value}
                label={range.label}
                selectedValue={filters.priceRange}
                onChange={(value) => onFilterChange('priceRange', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Certification */}
        <FilterSection title="Certification" sectionKey="certification">
          <div className="space-y-2">
            {certifications.map((cert) => (
              <CheckboxOption
                key={cert}
                value={cert}
                label={cert}
                selectedValue={filters.certification}
                onChange={(value) => onFilterChange('certification', value)}
                description={
                  cert === 'GIA' ? 'Gemological Institute of America' :
                  cert === 'AGS' ? 'American Gem Society' : ''
                }
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default DiamondFilters; 