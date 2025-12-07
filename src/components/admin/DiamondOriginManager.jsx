import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DiamondOriginManager = ({ origins, onChange }) => {
  const originTypes = [
    { value: 'Natural', label: 'Natural Diamond' },
    { value: 'Lab-Grown', label: 'Lab-Grown Diamond' }
  ];

  const addOrigin = () => {
    const newOrigin = {
      origin: '',
      displayName: '',
      priceAdjustment: 0,
      available: true,
      description: ''
    };
    onChange([...origins, newOrigin]);
  };

  const removeOrigin = (index) => {
    const updated = origins.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateOrigin = (index, field, value) => {
    const updated = [...origins];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-set display name based on origin type
    if (field === 'origin') {
      const selectedType = originTypes.find(t => t.value === value);
      if (selectedType) {
        updated[index].displayName = selectedType.label;
      }
    }
    
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">Diamond Origin Options</h4>
          <p className="text-sm text-gray-600">Configure Natural vs Lab-Grown diamond pricing</p>
        </div>
        <button
          type="button"
          onClick={addOrigin}
          disabled={origins.length >= 2}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          <span>Add Origin Option</span>
        </button>
      </div>

      {origins.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No diamond origin options added</p>
          <p className="text-sm text-gray-400 mt-1">Add Natural and/or Lab-Grown options with pricing</p>
        </div>
      )}

      <div className="space-y-3">
        {origins.map((origin, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between mb-4">
              <h5 className="font-medium text-gray-900">
                {origin.displayName || `Origin Option ${index + 1}`}
              </h5>
              <button
                type="button"
                onClick={() => removeOrigin(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={origin.origin}
                  onChange={(e) => updateOrigin(index, 'origin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Origin</option>
                  {originTypes.map(type => {
                    // Disable if already selected in another option
                    const isUsed = origins.some((o, i) => i !== index && o.origin === type.value);
                    return (
                      <option key={type.value} value={type.value} disabled={isUsed}>
                        {type.label} {isUsed ? '(Already added)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Adjustment ($)
                </label>
                <input
                  type="number"
                  value={origin.priceAdjustment}
                  onChange={(e) => updateOrigin(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lab-Grown typically costs less (use negative value)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={origin.description}
                  onChange={(e) => updateOrigin(index, 'description', e.target.value)}
                  placeholder="Brief description about this diamond type..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`origin-available-${index}`}
                  checked={origin.available}
                  onChange={(e) => updateOrigin(index, 'available', e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`origin-available-${index}`} className="text-sm text-gray-700">
                  Available for selection
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiamondOriginManager;

