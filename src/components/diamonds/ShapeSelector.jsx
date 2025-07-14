import React from 'react';

// Beautiful and detailed diamond shape SVG icons with facet patterns
const shapeIcons = {
  Round: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="roundGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
      {/* Main circle */}
      <circle cx="50" cy="50" r="40" fill="url(#roundGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
      {/* Star facets */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.4"
        />
      ))}
    </svg>
  ),
  Princess: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="princessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Main square */}
      <polygon points="15,15 85,15 85,85 15,85" fill="url(#princessGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <polygon points="25,25 75,25 75,75 25,75" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <polygon points="35,35 65,35 65,65 35,65" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      {/* Diagonal facets */}
      <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    </svg>
  ),
  Emerald: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Main emerald shape */}
      <polygon points="20,25 80,25 85,30 85,70 80,75 20,75 15,70 15,30" fill="url(#emeraldGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Step cut facets */}
      <polygon points="25,30 75,30 78,33 78,67 75,70 25,70 22,67 22,33" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <polygon points="30,35 70,35 72,37 72,63 70,65 30,65 28,63 28,37" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      <polygon points="35,40 65,40 67,42 67,58 65,60 35,60 33,58 33,42" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
      {/* Vertical lines */}
      <line x1="40" y1="25" x2="40" y2="75" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="60" y1="25" x2="60" y2="75" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
    </svg>
  ),
  Asscher: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="asscherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Main octagon */}
      <polygon points="30,15 70,15 85,30 85,70 70,85 30,85 15,70 15,30" fill="url(#asscherGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Step cut facets */}
      <polygon points="35,22 65,22 78,35 78,65 65,78 35,78 22,65 22,35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <polygon points="40,29 60,29 71,40 71,60 60,71 40,71 29,60 29,40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      <polygon points="45,36 55,36 64,45 64,55 55,64 45,64 36,55 36,45" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
      {/* Corner cuts */}
      <line x1="30" y1="15" x2="15" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="70" y1="15" x2="85" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="85" y1="70" x2="70" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="15" y1="70" x2="30" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
    </svg>
  ),
  Marquise: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="marquiseGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Main marquise shape */}
      <path d="M50,15 C65,15 85,30 85,50 C85,70 65,85 50,85 C35,85 15,70 15,50 C15,30 35,15 50,15 Z" fill="url(#marquiseGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <path d="M50,22 C62,22 78,35 78,50 C78,65 62,78 50,78 C38,78 22,65 22,50 C22,35 38,22 50,22 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <path d="M50,29 C59,29 71,40 71,50 C71,60 59,71 50,71 C41,71 29,60 29,50 C29,40 41,29 50,29 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      {/* Center line */}
      <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      {/* Pointed ends */}
      <line x1="50" y1="15" x2="50" y2="35" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="50" y1="65" x2="50" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
    </svg>
  ),
  Oval: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="ovalGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
      {/* Main oval */}
      <ellipse cx="50" cy="50" rx="30" ry="40" fill="url(#ovalGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <ellipse cx="50" cy="50" rx="22" ry="32" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <ellipse cx="50" cy="50" rx="15" ry="24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      <ellipse cx="50" cy="50" rx="8" ry="16" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
      {/* Radial facets */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={50 + 30 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.4"
        />
      ))}
    </svg>
  ),
  Radiant: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="radiantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      {/* Main radiant shape */}
      <polygon points="25,20 75,20 80,25 80,75 75,80 25,80 20,75 20,25" fill="url(#radiantGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <polygon points="30,27 70,27 73,30 73,70 70,73 30,73 27,70 27,30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <polygon points="35,34 65,34 66,35 66,65 65,66 35,66 34,65 34,35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      {/* Brilliant cut facets */}
      <line x1="25" y1="20" x2="75" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="75" y1="20" x2="25" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      {/* Corner cuts */}
      <line x1="25" y1="20" x2="20" y2="25" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="75" y1="20" x2="80" y2="25" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="80" y1="75" x2="75" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="20" y1="75" x2="25" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
    </svg>
  ),
  Pear: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="pearGradient" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
      {/* Main pear shape */}
      <path d="M50,15 C65,15 80,30 80,45 C80,60 70,70 60,75 L50,85 L40,75 C30,70 20,60 20,45 C20,30 35,15 50,15 Z" fill="url(#pearGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <path d="M50,22 C62,22 73,35 73,48 C73,58 65,66 58,70 L50,78 L42,70 C35,66 27,58 27,48 C27,35 38,22 50,22 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <path d="M50,29 C59,29 66,40 66,51 C66,58 61,63 57,66 L50,71 L43,66 C39,63 34,58 34,51 C34,40 41,29 50,29 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      {/* Center line */}
      <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      {/* Radial facets */}
      {[30, 60, 120, 150, 210, 240, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1="50"
          y1="45"
          x2={50 + 25 * Math.cos((angle * Math.PI) / 180)}
          y2={45 + 20 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.4"
        />
      ))}
    </svg>
  ),
  Heart: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="heartGradient" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
      {/* Main heart shape */}
      <path d="M50,85 C35,75 15,60 15,40 C15,30 22,20 32,20 C40,20 46,25 50,32 C54,25 60,20 68,20 C78,20 85,30 85,40 C85,60 65,75 50,85 Z" fill="url(#heartGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <path d="M50,78 C38,70 22,57 22,42 C22,34 27,27 35,27 C41,27 46,30 50,36 C54,30 59,27 65,27 C73,27 78,34 78,42 C78,57 62,70 50,78 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <path d="M50,71 C41,65 29,54 29,44 C29,38 32,33 38,33 C42,33 46,35 50,40 C54,35 58,33 62,33 C68,33 71,38 71,44 C71,54 59,65 50,71 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      {/* Center line */}
      <line x1="50" y1="32" x2="50" y2="85" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      {/* Heart cleft */}
      <path d="M32,20 C40,25 45,30 50,32 C55,30 60,25 68,20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
    </svg>
  ),
  Cushion: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="cushionGradient" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
      {/* Main cushion shape */}
      <rect x="20" y="20" width="60" height="60" rx="15" ry="15" fill="url(#cushionGradient)" stroke="currentColor" strokeWidth="1"/>
      {/* Facet lines */}
      <rect x="27" y="27" width="46" height="46" rx="11" ry="11" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6"/>
      <rect x="34" y="34" width="32" height="32" rx="8" ry="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
      <rect x="41" y="41" width="18" height="18" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
      {/* Brilliant cut facets */}
      <line x1="20" y1="35" x2="80" y2="65" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="80" y1="35" x2="20" y2="65" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="35" y1="20" x2="65" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="65" y1="20" x2="35" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.4"/>
      <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
      <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.5"/>
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
      <div className="grid grid-cols-5 gap-3">
        {shapes.map((shape) => (
          <button
            key={shape.value}
            onClick={() => onShapeChange(selectedShape === shape.value ? '' : shape.value)}
            className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md group ${
              selectedShape === shape.value
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Shape Icon */}
            <div className={`w-10 h-10 mb-2 transition-colors ${
              selectedShape === shape.value 
                ? 'text-primary' 
                : 'text-gray-400 group-hover:text-gray-600'
            }`}>
              {shapeIcons[shape.value]}
            </div>
            
            {/* Shape Label */}
            <span className={`text-xs font-medium transition-colors text-center leading-tight ${
              selectedShape === shape.value 
                ? 'text-primary' 
                : 'text-gray-600 group-hover:text-gray-800'
            }`}>
              {shape.label}
            </span>
            
            {/* Selection indicator */}
            {selectedShape === shape.value && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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