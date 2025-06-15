import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

const JewelryFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  activeFilterCount,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    material: true,
    carat: true,
    price: true,
    centerStone: false,
    brand: false,
    classification: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter options based on actual jewelrySpecs schema
  const jewelryCategories = [
    { label: 'Engagement Ring', value: 'Engagement Ring' },
    { label: 'Wedding Band', value: 'Wedding Band' },
    { label: 'Earrings', value: 'Earrings' },
    { label: 'Necklace', value: 'Necklace' },
    { label: 'Bracelet', value: 'Bracelet' },
    { label: 'Pendant', value: 'Pendant' },
    { label: 'Tennis Bracelet', value: 'Tennis Bracelet' },
    { label: 'Eternity Band', value: 'Eternity Band' }
  ];

  const jewelrySubCategories = [
    { label: 'Solitaire Ring', value: 'Solitaire Ring' },
    { label: 'Classic Ring', value: 'Classic Ring' },
    { label: 'Halo Ring', value: 'Halo Ring' },
    { label: 'Three Stone Ring', value: 'Three Stone Ring' },
    { label: 'Diamond Ring', value: 'Diamond Ring' },
    { label: 'Stacking Ring', value: 'Stacking Ring' },
    { label: 'Huggie Earrings', value: 'Huggie Earrings' },
    { label: 'Stud Earrings', value: 'Stud Earrings' },
    { label: 'Drop Earrings', value: 'Drop Earrings' },
    { label: 'Tennis Necklace', value: 'Tennis Necklace' },
    { label: 'Chain Bracelet', value: 'Chain Bracelet' }
  ];

  const metals = [
    { label: '14K White Gold', value: '14K White Gold' },
    { label: '18K White Gold', value: '18K White Gold' },
    { label: '14K Yellow Gold', value: '14K Yellow Gold' },
    { label: '18K Yellow Gold', value: '18K Yellow Gold' },
    { label: '14K Rose Gold', value: '14K Rose Gold' },
    { label: '18K Rose Gold', value: '18K Rose Gold' },
    { label: 'Platinum', value: 'Platinum' },
    { label: 'Silver', value: 'Silver' }
  ];

  const caratWeights = [
    { label: 'Under 0.50ct', value: '0-0.50' },
    { label: '0.50 - 1.00ct', value: '0.50-1.00' },
    { label: '1.00 - 2.00ct', value: '1.00-2.00' },
    { label: '2.00 - 3.00ct', value: '2.00-3.00' },
    { label: '3.00 - 5.00ct', value: '3.00-5.00' },
    { label: '5.00ct+', value: '5.00-' }
  ];

  const priceRanges = [
    { label: 'Under $500', value: '0-500' },
    { label: '$500 - $1,000', value: '500-1000' },
    { label: '$1,000 - $3,000', value: '1000-3000' },
    { label: '$3,000 - $5,000', value: '3000-5000' },
    { label: '$5,000 - $10,000', value: '5000-10000' },
    { label: '$10,000 - $25,000', value: '10000-25000' },
    { label: '$25,000+', value: '25000-' }
  ];

  const jewelryClassifications = [
    { label: 'Natural Diamond', value: 'Natural Diamond' },
    { label: 'Lab Grown Diamond', value: 'Lab Grown Diamond' },
    { label: 'Wedding Band', value: 'Wedding Band' },
    { label: 'Precious Metal', value: 'Precious Metal' },
    { label: 'Other', value: 'Other' }
  ];

  const centerStoneTypes = [
    { label: 'Diamond', value: 'Diamond' },
    { label: 'Lab Grown Diamond', value: 'Lab Grown Diamond' },
    { label: 'Gemstone', value: 'Gemstone' }
  ];

  const gemTypes = [
    { label: 'Diamond', value: 'Diamond' },
    { label: 'Ruby', value: 'Ruby' },
    { label: 'Sapphire', value: 'Sapphire' },
    { label: 'Emerald', value: 'Emerald' },
    { label: 'Other', value: 'Other' }
  ];

  const stoneShapes = [
    { label: 'Round', value: 'Round' },
    { label: 'Oval', value: 'Oval' },
    { label: 'Princess', value: 'Princess' },
    { label: 'Emerald', value: 'Emerald' },
    { label: 'Asscher', value: 'Asscher' },
    { label: 'Marquise', value: 'Marquise' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Heart', value: 'Heart' },
    { label: 'Cushion', value: 'Cushion' },
    { label: 'Radiant', value: 'Radiant' },
    { label: 'Baguette', value: 'Baguette' }
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

  const MetalOption = ({ metal, selected, onClick }) => {
    const getMetalColor = (metalType) => {
      const colors = {
        '14K Yellow Gold': 'bg-yellow-400',
        '18K Yellow Gold': 'bg-yellow-500',
        '22K Yellow Gold': 'bg-yellow-600',
        '24K Yellow Gold': 'bg-yellow-700',
        '14K White Gold': 'bg-gray-300',
        '18K White Gold': 'bg-gray-400',
        '22K White Gold': 'bg-gray-500',
        '24K White Gold': 'bg-gray-600',
        '14K Rose Gold': 'bg-pink-300',
        '18K Rose Gold': 'bg-pink-400',
        'Platinum': 'bg-gray-400',
        'Silver': 'bg-gray-200'
      };
      return colors[metalType] || 'bg-gray-300';
    };

    return (
      <button
        onClick={() => onClick(selected ? '' : metal.value)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
          selected 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full border-2 ${getMetalColor(metal.value)} ${
            selected ? 'border-primary' : 'border-gray-300'
          }`}></div>
          <div className="text-left">
            <div className="font-medium text-gray-900">{metal.label}</div>
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

  const CategoryOption = ({ category, selected, onClick }) => {
    const getCategoryIcon = (categoryType) => {
      const icons = {
        'Engagement Ring': '💍',
        'Wedding Band': '💒',
        'Earrings': '👂',
        'Necklace': '📿',
        'Bracelet': '🔗',
        'Pendant': '🔸',
        'Tennis Bracelet': '🎾',
        'Eternity Band': '♾️'
      };
      return icons[categoryType] || '💎';
    };

    return (
      <button
        onClick={() => onClick(selected ? '' : category.value)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
          selected 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{getCategoryIcon(category.value)}</span>
          <div className="text-left">
            <div className="font-medium text-gray-900">{category.label}</div>
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
          <h2 className="font-bold text-gray-900">Filter Jewelry</h2>
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
        {/* Jewelry Category Filter */}
        <FilterSection title="Category" sectionKey="category">
          <div className="space-y-2">
            {jewelryCategories.map((category) => (
              <CategoryOption
                key={category.value}
                category={category}
                selected={filters.jewelryCategory === category.value}
                onClick={(value) => onFilterChange('jewelryCategory', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sub Category Filter */}
        <FilterSection title="Sub Category" sectionKey="subCategory">
          <div className="space-y-2">
            {jewelrySubCategories.map((subCategory) => (
              <CheckboxOption
                key={subCategory.value}
                value={subCategory.value}
                label={subCategory.label}
                selectedValue={filters.jewelrySubCategory}
                onChange={(value) => onFilterChange('jewelrySubCategory', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Metal Filter */}
        <FilterSection title="Metal" sectionKey="material">
          <div className="space-y-2">
            {metals.map((metal) => (
              <MetalOption
                key={metal.value}
                metal={metal}
                selected={filters.metal === metal.value}
                onClick={(value) => onFilterChange('metal', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Total Carat Weight */}
        <FilterSection title="Total Carat Weight" sectionKey="carat">
          <div className="space-y-2">
            {caratWeights.map((range) => (
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

        {/* Jewelry Classification */}
        <FilterSection title="Classification" sectionKey="classification">
          <div className="space-y-2">
            {jewelryClassifications.map((classification) => (
              <CheckboxOption
                key={classification.value}
                value={classification.value}
                label={classification.label}
                selectedValue={filters.jewelryClassification}
                onChange={(value) => onFilterChange('jewelryClassification', value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Center Stone Details */}
        <FilterSection title="Center Stone" sectionKey="centerStone">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Stone Type</h4>
              <div className="space-y-2">
                {centerStoneTypes.map((type) => (
                  <CheckboxOption
                    key={type.value}
                    value={type.value}
                    label={type.label}
                    selectedValue={filters.centerStoneType}
                    onChange={(value) => onFilterChange('centerStoneType', value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Shape</h4>
              <div className="space-y-2">
                {stoneShapes.map((shape) => (
                  <CheckboxOption
                    key={shape.value}
                    value={shape.value}
                    label={shape.label}
                    selectedValue={filters.centerStoneShape}
                    onChange={(value) => onFilterChange('centerStoneShape', value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Gem Type</h4>
              <div className="space-y-2">
                {gemTypes.map((gem) => (
                  <CheckboxOption
                    key={gem.value}
                    value={gem.value}
                    label={gem.label}
                    selectedValue={filters.centerStoneGemType}
                    onChange={(value) => onFilterChange('centerStoneGemType', value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand" sectionKey="brand">
          <div className="space-y-2">
            <CheckboxOption
              value="House Collection"
              label="House Collection"
              selectedValue={filters.brand}
              onChange={(value) => onFilterChange('brand', value)}
            />
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default JewelryFilters; 