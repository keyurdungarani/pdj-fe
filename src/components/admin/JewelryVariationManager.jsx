import React, { useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';

const JewelryVariationManager = ({ variations, onChange, onFileChange }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const metalOptions = {
    carats: ['10K', '14K', '18K', '22K', '24K', 'Platinum', 'Silver'],
    colors: ['White', 'Yellow', 'Rose'],
    metals: ['Gold', 'Platinum', 'Silver']
  };

  const addVariation = () => {
    const newVariation = {
      metal: '',
      displayName: '',
      carat: '',
      color: '',
      priceAdjustment: 0,
      images: [],
      mainImage: '',
      available: true,
      stockCount: 1,
      // Temp fields for file uploads
      imageFiles: [],
      mainImageFile: null
    };
    onChange([...variations, newVariation]);
    setExpandedIndex(variations.length);
  };

  const removeVariation = (index) => {
    const updated = variations.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const updateVariation = (index, field, value) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate metal name if carat or color changes
    if (field === 'carat' || field === 'color') {
      const carat = field === 'carat' ? value : updated[index].carat;
      const color = field === 'color' ? value : updated[index].color;
      
      if (carat && color) {
        if (carat === 'Platinum' || carat === 'Silver') {
          updated[index].metal = carat;
          updated[index].displayName = carat;
        } else {
          updated[index].metal = `${carat} ${color} Gold`;
          updated[index].displayName = `${color} Gold (${carat})`;
        }
      }
    }
    
    onChange(updated);
  };

  const handleFileUpload = (index, files, isMain = false) => {
    if (onFileChange) {
      onFileChange(index, files, isMain);
    }
  };

  const removeImage = (variationIndex, imageIndex) => {
    const updated = [...variations];
    updated[variationIndex].images = updated[variationIndex].images.filter((_, i) => i !== imageIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">Metal Variations</h4>
          <p className="text-sm text-gray-600">Add different metal/carat options with unique pricing and images</p>
        </div>
        <button
          type="button"
          onClick={addVariation}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          <span>Add Variation</span>
        </button>
      </div>

      {variations.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No metal variations added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Variation" to create metal/carat options</p>
        </div>
      )}

      <div className="space-y-3">
        {variations.map((variation, index) => (
          <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${
                    variation.color === 'Yellow' ? 'bg-yellow-400' :
                    variation.color === 'Rose' ? 'bg-rose-400' :
                    variation.color === 'White' ? 'bg-gray-300' :
                    'bg-gray-400'
                  }`} />
                  <span className="font-medium text-gray-900">
                    {variation.displayName || variation.metal || `Variation ${index + 1}`}
                  </span>
                </div>
                {variation.priceAdjustment !== 0 && (
                  <span className={`text-sm font-medium ${
                    variation.priceAdjustment > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {variation.priceAdjustment > 0 ? '+' : ''}${variation.priceAdjustment}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {variation.images?.length || 0} image(s)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVariation(index);
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedIndex === index && (
              <div className="p-4 space-y-4 bg-white">
                {/* Metal Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carat/Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={variation.carat}
                      onChange={(e) => updateVariation(index, 'carat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Carat</option>
                      {metalOptions.carats.map(carat => (
                        <option key={carat} value={carat}>{carat}</option>
                      ))}
                    </select>
                  </div>

                  {variation.carat && variation.carat !== 'Platinum' && variation.carat !== 'Silver' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={variation.color}
                        onChange={(e) => updateVariation(index, 'color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Color</option>
                        {metalOptions.colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Adjustment ($)
                    </label>
                    <input
                      type="number"
                      value={variation.priceAdjustment}
                      onChange={(e) => updateVariation(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use negative for discount (e.g., -460), positive for surcharge (e.g., +40)
                    </p>
                  </div>
                </div>

                {/* Stock & Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Count</label>
                    <input
                      type="number"
                      value={variation.stockCount}
                      onChange={(e) => updateVariation(index, 'stockCount', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-7">
                    <input
                      type="checkbox"
                      id={`available-${index}`}
                      checked={variation.available}
                      onChange={(e) => updateVariation(index, 'available', e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`available-${index}`} className="text-sm text-gray-700">
                      Available for purchase
                    </label>
                  </div>
                </div>

                {/* Images for this variation */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Main Image for this variation
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(index, e.target.files, true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {variation.mainImage && (
                    <div className="relative inline-block mt-2">
                      <img src={variation.mainImage} alt="Main" className="h-20 w-20 object-cover rounded border" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gallery Images for this variation
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(index, e.target.files, false)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {variation.images && variation.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variation.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img src={img} alt={`Gallery ${imgIndex}`} className="h-20 w-20 object-cover rounded border" />
                          <button
                            type="button"
                            onClick={() => removeImage(index, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JewelryVariationManager;

