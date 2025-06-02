import React from 'react';

// Diamond shape SVG icons
const shapeIcons = {
  Round: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <circle cx="20" cy="20" r="18" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Princess: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <polygon points="20,2 38,20 20,38 2,20" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Emerald: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <polygon points="8,12 32,12 38,20 32,28 8,28 2,20" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Asscher: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <polygon points="12,6 28,6 34,12 34,28 28,34 12,34 6,28 6,12" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Marquise: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <ellipse cx="20" cy="20" rx="18" ry="8" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Oval: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <ellipse cx="20" cy="20" rx="12" ry="18" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Radiant: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <polygon points="10,8 30,8 36,14 36,26 30,32 10,32 4,26 4,14" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Pear: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M20,4 C28,4 34,10 34,18 C34,26 28,32 20,32 C12,32 6,26 6,18 C6,15 8,12 12,10 L20,4 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Heart: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path d="M20,32 C8,24 2,18 2,12 C2,8 5,5 9,5 C13,5 17,8 20,12 C23,8 27,5 31,5 C35,5 38,8 38,12 C38,18 32,24 20,32 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Cushion: (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <rect x="6" y="6" width="28" height="28" rx="8" ry="8" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  )
};

const shapes = [
  { value: 'Round', label: 'Round' },
  { value: 'Princess', label: 'Princess' },
  { value: 'Emerald', label: 'Emerald' },
  { value: 'Asscher', label: 'Asscher' },
  { value: 'Marquise', label: 'Marquise' },
  { value: 'Oval', label: 'Oval' },
  { value: 'Radiant', label: 'Radiant' },
  { value: 'Pear', label: 'Pear' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Cushion', label: 'Cushion' }
];

const ShapeSelector = ({ selectedShape, onShapeChange, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-medium text-gray-900">Diamond Shape</h3>
      <div className="grid grid-cols-5 gap-3">
        {shapes.map((shape) => (
          <button
            key={shape.value}
            onClick={() => onShapeChange(selectedShape === shape.value ? '' : shape.value)}
            className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              selectedShape === shape.value
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Shape Icon */}
            <div className={`w-8 h-8 mb-2 transition-colors ${
              selectedShape === shape.value 
                ? 'text-primary' 
                : 'text-gray-400'
            }`}>
              {shapeIcons[shape.value]}
            </div>
            
            {/* Shape Label */}
            <span className={`text-xs font-medium transition-colors ${
              selectedShape === shape.value 
                ? 'text-primary' 
                : 'text-gray-600'
            }`}>
              {shape.label}
            </span>
            
            {/* Selection indicator */}
            {selectedShape === shape.value && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapeSelector; 