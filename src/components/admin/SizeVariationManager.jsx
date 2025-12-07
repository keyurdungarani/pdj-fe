import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Star, Ruler } from 'lucide-react';

/**
 * SizeVariationManager Component
 * Allows admins to add, edit, and remove size variations for jewelry items
 * Examples: Different chain lengths for necklaces, ring sizes, bracelet sizes, etc.
 */
const SizeVariationManager = ({ 
  variations = [], 
  onChange, 
  defaultVariation, 
  onDefaultChange,
  categoryType = 'general' // 'necklace', 'bracelet', 'ring', 'earring', 'general'
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Pre-defined size options based on category type
  const sizeOptions = {
    necklace: [
      '14 inch', '16 inch', '18 inch', '20 inch', '22 inch', '24 inch', '26 inch', '30 inch'
    ],
    bracelet: [
      '6 inch', '6.5 inch', '7 inch', '7.5 inch', '8 inch', '8.5 inch', '9 inch'
    ],
    ring: [
      '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'
    ],
    earring: [
      'Small', 'Medium', 'Large', 'Extra Large'
    ],
    general: [
      'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
    ]
  };

  const currentSizeOptions = sizeOptions[categoryType] || sizeOptions.general;

  const addVariation = () => {
    const newVariation = {
      size: '',
      displayName: '',
      priceAdjustment: 0,
      available: true,
      stockCount: 1,
      description: ''
    };
    onChange([...variations, newVariation]);
    setExpandedIndex(variations.length);
  };

  const removeVariation = (index) => {
    const updated = variations.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) setExpandedIndex(null);
    if (defaultVariation === index) onDefaultChange(0);
    else if (defaultVariation > index) onDefaultChange(defaultVariation - 1);
  };

  const updateVariation = (index, field, value) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate display name if size is set
    if (field === 'size' && value) {
      if (categoryType === 'ring') {
        updated[index].displayName = `Size ${value}`;
      } else if (categoryType === 'necklace' || categoryType === 'bracelet') {
        updated[index].displayName = value;
      } else {
        updated[index].displayName = value;
      }
    }
    
    onChange(updated);
  };

  const getSizeIcon = () => {
    switch (categoryType) {
      case 'necklace':
        return '📿';
      case 'bracelet':
        return '💍';
      case 'ring':
        return '💍';
      case 'earring':
        return '👂';
      default:
        return '📏';
    }
  };

  const getSizeLabel = () => {
    switch (categoryType) {
      case 'necklace':
        return 'Chain Length';
      case 'bracelet':
        return 'Bracelet Length';
      case 'ring':
        return 'Ring Size';
      case 'earring':
        return 'Earring Size';
      default:
        return 'Size';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
            <span className="text-xl">{getSizeIcon()}</span>
            Size Variations
          </h4>
          <p className="text-sm text-gray-600">Configure different {getSizeLabel().toLowerCase()} options with unique pricing</p>
        </div>
        <button
          type="button"
          onClick={addVariation}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Size
        </button>
      </div>

      {variations.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 mb-2">
            <Ruler size={40} className="mx-auto" />
          </div>
          <p className="text-gray-500 font-medium">No size variations added yet</p>
          <p className="text-sm text-gray-400">Click "Add Size" to create size options</p>
        </div>
      ) : (
        <div className="space-y-3">
          {variations.map((variation, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl border-2 transition-all ${
                defaultVariation === index ? 'border-purple-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                    {variation.size || index + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {variation.displayName || variation.size || `Size ${index + 1}`}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {variation.priceAdjustment > 0 ? '+' : ''}{variation.priceAdjustment !== 0 ? `$${variation.priceAdjustment}` : 'Base price'}
                      {' • '}Stock: {variation.stockCount || 0}
                      {!variation.available && ' • Unavailable'}
                    </p>
                  </div>
                  {defaultVariation === index && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDefaultChange(index);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      defaultVariation === index ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-400'
                    }`}
                    title="Set as default"
                  >
                    <Star size={18} fill={defaultVariation === index ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVariation(index);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{getSizeLabel()}</label>
                      <select
                        value={variation.size || ''}
                        onChange={(e) => updateVariation(index, 'size', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select {getSizeLabel()}</option>
                        {currentSizeOptions.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                        <option value="custom">Custom (enter below)</option>
                      </select>
                      {variation.size === 'custom' && (
                        <input
                          type="text"
                          value={variation.displayName || ''}
                          onChange={(e) => updateVariation(index, 'displayName', e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter custom size"
                        />
                      )}
                    </div>

                    {/* Price Adjustment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment ($)</label>
                      <input
                        type="number"
                        value={variation.priceAdjustment || 0}
                        onChange={(e) => updateVariation(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="+/- from base price"
                      />
                    </div>

                    {/* Stock Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                      <input
                        type="number"
                        min="0"
                        value={variation.stockCount || 0}
                        onChange={(e) => updateVariation(index, 'stockCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    {/* Availability */}
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variation.available !== false}
                          onChange={(e) => updateVariation(index, 'available', e.target.checked)}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Available for Purchase</span>
                      </label>
                    </div>
                  </div>

                  {/* Display Name & Description */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name (Optional)</label>
                      <input
                        type="text"
                        value={variation.displayName || ''}
                        onChange={(e) => updateVariation(index, 'displayName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`e.g., ${currentSizeOptions[0] || 'Medium'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={variation.description || ''}
                        onChange={(e) => updateVariation(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Most popular size, Perfect for everyday wear"
                      />
                    </div>
                  </div>

                  {/* Price Preview */}
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <span className={`text-lg font-bold ${variation.priceAdjustment > 0 ? 'text-red-600' : variation.priceAdjustment < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                      {variation.priceAdjustment > 0 ? '+' : ''}{variation.priceAdjustment !== 0 ? `$${Math.abs(variation.priceAdjustment)}` : 'Base Price'}
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {variation.priceAdjustment > 0 ? 'above base' : variation.priceAdjustment < 0 ? 'below base' : 'no adjustment'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeVariationManager;

