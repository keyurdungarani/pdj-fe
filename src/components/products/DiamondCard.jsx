import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Award, Star } from 'lucide-react';
import { DEFAULT_PLACEHOLDER, PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

const DiamondCard = ({ diamond, type = 'diamonds', viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!diamond) return null;

  const {
    _id,
    name,
    price,
    mainImage,
    galleryImages = [],
    isNewArrival,
    featured,
    details = {},
    labGrownSpecs = {},
    diamondSpecs = {},
    originalPrice,
    discount,
    productType
  } = diamond;

  // Get specs from the appropriate source
  const specs = productType === 'lab-grown' ? labGrownSpecs : diamondSpecs;
  
  const {
    carat = specs.weight,
    cut = specs.cutGrade,
    color,
    clarity,
    shape,
    certification = specs.lab,
    polish,
    symmetry,
    fluorescence = specs.fluorescenceIntensity
  } = details || specs || {};

  // Format the price
  const formattedPrice = price?.toLocaleString('en-US') || '';
  const formattedOriginalPrice = originalPrice?.toLocaleString('en-US') || '';

  // Get main image URL with proper fallback
  const imageUrl = mainImage 
    ? (mainImage.startsWith('http') 
        ? mainImage 
        : mainImage.startsWith('/api/placeholder')
        ? PLACEHOLDER_IMAGES.diamond
        : `${import.meta.env.VITE_LOCAL_API || ''}${mainImage}`)
    : PLACEHOLDER_IMAGES.diamond;

  // Get grade color for visual indicators
  const getGradeColor = (grade, type) => {
    const gradeMap = {
      cut: {
        'Ideal': 'text-green-600',
        'Excellent': 'text-green-600', 
        'Very Good': 'text-blue-600',
        'Good': 'text-yellow-600',
        'Fair': 'text-orange-600',
        'Poor': 'text-red-600'
      },
      color: {
        'D': 'text-green-600', 'E': 'text-green-600', 'F': 'text-green-600',
        'G': 'text-blue-600', 'H': 'text-blue-600', 'I': 'text-blue-600',
        'J': 'text-yellow-600', 'K': 'text-yellow-600'
      },
      clarity: {
        'FL': 'text-green-600', 'IF': 'text-green-600',
        'VVS1': 'text-green-600', 'VVS2': 'text-green-600',
        'VS1': 'text-blue-600', 'VS2': 'text-blue-600',
        'SI1': 'text-yellow-600', 'SI2': 'text-yellow-600'
      }
    };
    return gradeMap[type]?.[grade] || 'text-gray-600';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with badges */}
      <div className="relative">
        {/* New Arrival or Featured Badge - MONTSERRAT FOR UI TEXT */}
        {(isNewArrival || featured) && (
          <div className="absolute top-3 left-3 z-10">
            {isNewArrival && (
              <span className="inline-block bg-blue-500 text-white text-xs font-montserrat font-medium px-2 py-1 rounded mb-1">
                NEW
              </span>
            )}
            {featured && (
              <span className="inline-flex items-center bg-amber-500 text-white text-xs font-montserrat font-medium px-2 py-1 rounded">
                <Star size={12} className="mr-1" />
                FEATURED
              </span>
            )}
          </div>
        )}

        {/* Discount Badge - MONTSERRAT FOR UI TEXT */}
        {discount && discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-montserrat font-medium px-2 py-1 rounded z-10">
            {discount}% OFF
          </div>
        )}

        {/* Product Type Badge - MONTSERRAT FOR UI TEXT */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`inline-block text-xs font-montserrat font-medium px-2 py-1 rounded ${
            productType === 'lab-grown' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {productType === 'lab-grown' ? 'Lab Grown' : 'Natural'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button 
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart 
            size={16} 
            className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'} 
          />
        </button>
      </div>

      {/* Image */}
      <Link to={`/${type}/${_id}`} className="block relative overflow-hidden">
        <div className="aspect-square">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGES.diamond;
            }}
          />
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye size={24} className="text-white" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title - BASKERVILLE FOR PRODUCT NAMES */}
        <Link to={`/${type}/${_id}`}>
          <h3 className="font-baskerville font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Key Specifications - MONTSERRAT FOR TECHNICAL SPECS */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {carat && (
            <div className="flex justify-between">
              <span className="font-montserrat text-gray-600">Carat:</span>
              <span className="font-montserrat font-medium">{carat}</span>
            </div>
          )}
          {cut && (
            <div className="flex justify-between">
              <span className="font-montserrat text-gray-600">Cut:</span>
              <span className={`font-montserrat font-medium ${getGradeColor(cut, 'cut')}`}>{cut}</span>
            </div>
          )}
          {color && (
            <div className="flex justify-between">
              <span className="font-montserrat text-gray-600">Color:</span>
              <span className={`font-montserrat font-medium ${getGradeColor(color, 'color')}`}>{color}</span>
            </div>
          )}
          {clarity && (
            <div className="flex justify-between">
              <span className="font-montserrat text-gray-600">Clarity:</span>
              <span className={`font-montserrat font-medium ${getGradeColor(clarity, 'clarity')}`}>{clarity}</span>
            </div>
          )}
          {shape && (
            <div className="flex justify-between">
              <span className="font-montserrat text-gray-600">Shape:</span>
              <span className="font-montserrat font-medium">{shape}</span>
            </div>
          )}
          {certification && (
            <div className="flex justify-between">
              <span className="font-montserrat text-gray-600">Cert:</span>
              <span className="font-montserrat font-medium">{certification}</span>
            </div>
          )}
        </div>

        {/* Price - MONTSERRAT FOR PRICING */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-montserrat font-bold text-gray-900">${formattedPrice}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm font-montserrat text-gray-500 line-through">${formattedOriginalPrice}</span>
              )}
            </div>
            {discount && discount > 0 && (
              <span className="text-sm font-montserrat text-green-600 font-medium">{discount}% off</span>
            )}
          </div>
        </div>

        {/* Action Buttons - MONTSERRAT FOR UI TEXT */}
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/${type}/${_id}`}
            className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm font-montserrat font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DiamondCard; 