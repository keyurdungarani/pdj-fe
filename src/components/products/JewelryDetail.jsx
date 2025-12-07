import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  RotateCw, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Truck, 
  Shield, 
  Award,
  Eye,
  Star,
  Sparkles,
  Gem,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Package,
  RefreshCw,
  Users,
  ShoppingBag
} from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';
import WishlistButton from '../common/WishlistButton';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';
import { useNavigate } from 'react-router-dom';

const JewelryDetail = ({ product, type = 'jewelry' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [is360Active, setIs360Active] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [imageError, setImageError] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    specifications: true,
    materials: false,
    quality: false,
    care: false
  });
  
  // Jewelry Variations State
  const [selectedMetalIndex, setSelectedMetalIndex] = useState(
    product?.jewelrySpecs?.defaultMetalVariation || 0
  );
  const [selectedOriginIndex, setSelectedOriginIndex] = useState(
    product?.jewelrySpecs?.defaultDiamondOrigin || 0
  );
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(
    product?.jewelrySpecs?.defaultSizeVariation || 0
  );
  
  const navigate = useNavigate();
  
  const imageContainerRef = useRef(null);
  const fullscreenImageRef = useRef(null);
  
  if (!product) return <div className="p-8 text-center">Jewelry not found</div>;
  
  const { 
    name, 
    price, 
    mainImage,
    galleryImages = [], 
    description, 
    details = {},
    jewelrySpecs = {},
    productType,
    category,
    countInStock,
    originalPrice,
    discount,
    onSale,
    salePrice,
    rating,
    numReviews,
    featured,
    materials = [],
    customizable,
    customizationOptions = {}
  } = product;
  
  // Extract jewelry specifications from VDB-compliant schema
  const {
    // Basic jewelry info
    stockNumber = jewelrySpecs?.stockNumber,
    jewelryStyle = jewelrySpecs?.jewelryStyle,
    jewelryClassification = jewelrySpecs?.jewelryClassification,
    metal = jewelrySpecs?.metal,
    totalCaratWeight = jewelrySpecs?.totalCaratWeight,
    totalNumberOfStones = jewelrySpecs?.totalNumberOfStones,
    mount = jewelrySpecs?.mount,
    brand = jewelrySpecs?.brand,
    
    // Center stone details
    centerStone = jewelrySpecs?.centerStone || {},
    sideStone = jewelrySpecs?.sideStone || {},
    
    // Legacy fields for backward compatibility
    material: legacyMaterial = jewelrySpecs?.material || details?.material,
    caratWeight: legacyCaratWeight = jewelrySpecs?.caratWeight || details?.caratWeight,
    diamondType = jewelrySpecs?.diamondType || details?.diamondType,
    totalDiamonds = jewelrySpecs?.totalDiamonds || details?.totalDiamonds,
    setting = jewelrySpecs?.setting || details?.setting,
    style: legacyStyle = jewelrySpecs?.style || details?.style
  } = { ...details, ...jewelrySpecs };
  
  // Use new or legacy values
  const displayMetal = metal || legacyMaterial;
  const displayCaratWeight = totalCaratWeight || legacyCaratWeight;
  const displayStyle = jewelryStyle || legacyStyle;
  
  // Get jewelry variations
  const metalVariations = jewelrySpecs?.metalVariations || [];
  const diamondOriginOptions = jewelrySpecs?.diamondOriginOptions || [];
  const sizeVariations = jewelrySpecs?.sizeVariations || [];
  
  // Calculate dynamic price based on selected variations
  const calculateFinalPrice = () => {
    let finalPrice = price;
    
    // Add metal variation price adjustment
    if (metalVariations.length > 0 && metalVariations[selectedMetalIndex]) {
      finalPrice += metalVariations[selectedMetalIndex].priceAdjustment || 0;
    }
    
    // Add diamond origin price adjustment
    if (diamondOriginOptions.length > 0 && diamondOriginOptions[selectedOriginIndex]) {
      finalPrice += diamondOriginOptions[selectedOriginIndex].priceAdjustment || 0;
    }
    
    // Add size variation price adjustment
    if (sizeVariations.length > 0 && sizeVariations[selectedSizeIndex]) {
      finalPrice += sizeVariations[selectedSizeIndex].priceAdjustment || 0;
    }
    
    return finalPrice;
  };
  
  const finalPrice = calculateFinalPrice();
  const formattedPrice = finalPrice?.toLocaleString('en-US') || '';
  const formattedOriginalPrice = originalPrice?.toLocaleString('en-US') || '';
  const formattedSalePrice = salePrice?.toLocaleString('en-US') || '';
  
  // Determine which images to use based on selected metal variation
  const getDisplayImages = () => {
    // If metal variation has specific images, use them
    if (metalVariations.length > 0 && metalVariations[selectedMetalIndex]) {
      const variation = metalVariations[selectedMetalIndex];
      const variationImages = [];
      
      // Add variation main image
      if (variation.mainImage) {
        variationImages.push(variation.mainImage);
      }
      
      // Add variation gallery images
      if (variation.images && variation.images.length > 0) {
        variationImages.push(...variation.images);
      }
      
      // If variation has images, return them; otherwise fall back to default
      if (variationImages.length > 0) {
        return variationImages;
      }
    }
    
    // Fall back to default product images
    return [mainImage, ...galleryImages].filter(Boolean);
  };
  
  // Process images
  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.jewelry;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_API_URL || ''}${imagePath}`;
  };
  
  const displayImages = getDisplayImages();
  const processedImages = displayImages.map(img => processImageUrl(img));
  const allImages = processedImages.length > 0 ? processedImages : [PLACEHOLDER_IMAGES.jewelry];
  const currentImageUrl = allImages[selectedImage] || PLACEHOLDER_IMAGES.jewelry;
  
  // Get selected metal variation name for display
  const selectedMetalName = metalVariations[selectedMetalIndex]?.displayName || 
                            metalVariations[selectedMetalIndex]?.metal || 
                            displayMetal;
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  
  const openFullscreen = () => {
    setShowFullscreen(true);
    setShowZoom(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
    document.body.style.overflow = '';
  };
  
  // Handle mouse movement for zoom
  const handleMouseMove = (e) => {
    if (!showZoom) return;
    
    const container = imageContainerRef.current;
    if (!container) return;
    
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };
  
  // Get availability status dynamically
  const getAvailabilityStatus = () => {
    if (countInStock === undefined || countInStock === null) {
      return { text: 'Availability Unknown', color: 'text-gray-600', icon: null };
    }
    
    if (countInStock > 5) {
      return { 
        text: `In Stock (${countInStock} available)`, 
        color: 'text-green-600', 
        icon: <CheckCircle size={16} className="mr-1" /> 
      };
    } else if (countInStock > 0) {
      return { 
        text: `Limited Stock (${countInStock} remaining)`, 
        color: 'text-yellow-600', 
        icon: <CheckCircle size={16} className="mr-1" /> 
      };
    } else {
      return { 
        text: 'Currently Unavailable', 
        color: 'text-red-600', 
        icon: null 
      };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  // Helper function to check if product is available for purchase
  const isProductAvailable = () => {
    return countInStock !== undefined && countInStock !== null && countInStock > 0;
  };

  // Get jewelry type icon
  const getJewelryIcon = () => {
    const categoryLower = category?.toLowerCase();
    if (categoryLower?.includes('necklace')) return '📿';
    if (categoryLower?.includes('earring')) return '👂';
    if (categoryLower?.includes('bracelet')) return '📿';
    if (categoryLower?.includes('ring')) return '💍';
    if (categoryLower?.includes('pendant')) return '🔸';
    return '💎';
  };
  
  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <span>Home</span>
              <ChevronRight size={16} className="mx-2" />
              <span>Jewelry</span>
              <ChevronRight size={16} className="mx-2" />
              {category && (
                <>
                  <span>{category}</span>
                  <ChevronRight size={16} className="mx-2" />
                </>
              )}
              <span className="text-gray-900">{name}</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Jewelry Images - Keep same size as original ProductDetail */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div 
                ref={imageContainerRef}
                className="relative overflow-hidden rounded-lg aspect-square bg-white border border-gray-200 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onClick={openFullscreen}
              >
                <img
                  src={currentImageUrl}
                  alt={name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGES.jewelry;
                  }}
                />
                
                {showZoom && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${currentImageUrl})`,
                      backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                      backgroundSize: '200%',
                      backgroundRepeat: 'no-repeat',
                      opacity: 0.9,
                    }}
                  />
                )}
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {/* <WishlistButton 
                    productId={product._id}
                    productType={productType || type}
                    size="md"
                  /> */}
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openFullscreen();
                    }}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="View Fullscreen"
                  >
                    <ZoomIn size={20} className="text-gray-700" />
                  </button>
                  
                  <button 
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Video Available"
                  >
                    <Eye size={20} className="text-gray-700" />
                  </button>
                </div>
                
                {/* Status badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {featured && (
                    <div className="bg-amber-400 text-white text-xs font-medium py-1 px-2 rounded">
                      Featured
                    </div>
                  )}
                  {onSale && (
                    <div className="bg-red-500 text-white text-xs font-medium py-1 px-2 rounded">
                      SALE
                    </div>
                  )}
                  {customizable && (
                    <div className="bg-purple-500 text-white text-xs font-medium py-1 px-2 rounded">
                      Customizable
                    </div>
                  )}
                </div>
                
                {/* Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight size={24} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 py-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden ${
                        selectedImage === idx ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${name} - view ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGES.thumbnail;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right: Product Info - Enhanced professional styling */}
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getJewelryIcon()}</span>
                    <span className="text-sm font-montserrat text-gray-500 uppercase tracking-wider">
                      {category || productType || type}
                    </span>
                  </div>
                  <h1 className="text-2xl font-didot font-medium text-gray-900 mb-2">{name}</h1>
                                  {stockNumber && (
                  <span className="text-sm font-montserrat text-gray-500">SKU: {stockNumber}</span>
                )}
                </div>
                
                {/* Metal Variation Selector */}
                {metalVariations && metalVariations.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Metal: <span className="font-semibold">{selectedMetalName}</span>
                      {metalVariations[selectedMetalIndex]?.priceAdjustment !== 0 && (
                        <span className={`ml-2 text-sm ${
                          metalVariations[selectedMetalIndex].priceAdjustment > 0 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          ({metalVariations[selectedMetalIndex].priceAdjustment > 0 ? '+' : ''}
                          ${metalVariations[selectedMetalIndex].priceAdjustment})
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {metalVariations.map((variation, index) => {
                        const colorClass = variation.color === 'Yellow' ? 'bg-yellow-400' :
                                          variation.color === 'Rose' ? 'bg-rose-400' :
                                          variation.color === 'White' ? 'bg-gray-300' :
                                          'bg-gray-400';
                        
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedMetalIndex(index);
                              setSelectedImage(0); // Reset to first image when changing metal
                            }}
                            disabled={!variation.available}
                            className={`relative p-3 border-2 rounded-lg transition-all ${
                              selectedMetalIndex === index
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-gray-400'
                            } ${!variation.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 rounded-full ${colorClass} border-2 border-gray-400`} />
                              <div className="text-left flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {variation.displayName || variation.metal}
                                </div>
                                {variation.priceAdjustment !== 0 && (
                                  <div className={`text-xs font-medium ${
                                    variation.priceAdjustment > 0 ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {variation.priceAdjustment > 0 ? '+' : ''}${variation.priceAdjustment}
                                  </div>
                                )}
                              </div>
                            </div>
                            {!variation.available && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/75 rounded-lg">
                                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Diamond Origin Selector */}
                {diamondOriginOptions && diamondOriginOptions.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Diamond Origin
                      {diamondOriginOptions[selectedOriginIndex]?.priceAdjustment !== 0 && (
                        <span className={`ml-2 text-sm ${
                          diamondOriginOptions[selectedOriginIndex].priceAdjustment > 0 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          ({diamondOriginOptions[selectedOriginIndex].priceAdjustment > 0 ? '+' : ''}
                          ${diamondOriginOptions[selectedOriginIndex].priceAdjustment})
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {diamondOriginOptions.map((origin, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedOriginIndex(index)}
                          disabled={!origin.available}
                          className={`relative p-4 border-2 rounded-lg transition-all text-left ${
                            selectedOriginIndex === index
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${!origin.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              {origin.displayName || origin.origin}
                            </span>
                            {origin.origin === 'Lab-Grown' && (
                              <span className="text-green-600 text-xs">♻️ Eco-Friendly</span>
                            )}
                          </div>
                          {origin.priceAdjustment !== 0 && (
                            <div className={`text-sm font-medium ${
                              origin.priceAdjustment > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {origin.priceAdjustment > 0 ? '+' : ''}${origin.priceAdjustment}
                            </div>
                          )}
                          {origin.description && (
                            <p className="text-xs text-gray-600 mt-1">{origin.description}</p>
                          )}
                          {!origin.available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/75 rounded-lg">
                              <span className="text-xs text-red-600 font-medium">Not Available</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Variations Section */}
                {sizeVariations.length > 0 && (
                  <div className="mb-6">
                    <label className="block font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-lg">📏</span>
                      <span>Select Size</span>
                      {sizeVariations[selectedSizeIndex]?.priceAdjustment !== 0 && (
                        <span className={`ml-2 text-sm ${
                          sizeVariations[selectedSizeIndex].priceAdjustment > 0 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          ({sizeVariations[selectedSizeIndex].priceAdjustment > 0 ? '+' : ''}
                          ${sizeVariations[selectedSizeIndex].priceAdjustment})
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {sizeVariations.map((sizeOption, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSizeIndex(index)}
                          disabled={!sizeOption.available}
                          className={`relative p-3 border-2 rounded-lg transition-all text-center ${
                            selectedSizeIndex === index
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${!sizeOption.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="font-medium text-gray-900 text-sm">
                            {sizeOption.displayName || sizeOption.size}
                          </div>
                          {sizeOption.priceAdjustment !== 0 && (
                            <div className={`text-xs font-medium mt-1 ${
                              sizeOption.priceAdjustment > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {sizeOption.priceAdjustment > 0 ? '+' : ''}${sizeOption.priceAdjustment}
                            </div>
                          )}
                          {sizeOption.description && (
                            <p className="text-xs text-gray-500 mt-1">{sizeOption.description}</p>
                          )}
                          {selectedSizeIndex === index && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle size={16} className="text-purple-600" fill="currentColor" />
                            </div>
                          )}
                          {!sizeOption.available && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/75 rounded-lg">
                              <span className="text-xs text-red-600 font-medium">Not Available</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Price - MONTSERRAT FOR PRICING */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    {onSale && salePrice ? (
                      <>
                        <span className="text-3xl font-montserrat font-bold text-red-600">${formattedSalePrice}</span>
                        <span className="text-lg font-montserrat text-gray-500 line-through">${formattedPrice}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-montserrat font-medium">
                          {Math.round(((price - salePrice) / price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-montserrat font-bold text-gray-900">${formattedPrice}</span>
                    )}
                  </div>
                </div>
                
                {/* Availability - Dynamic */}
                {(countInStock !== undefined && countInStock !== null) && (
                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mb-6">
                    <span className="text-gray-700 font-medium">Availability:</span>
                    <span className={`font-medium flex items-center ${availabilityStatus.color}`}>
                      {availabilityStatus.icon}
                      {availabilityStatus.text}
                    </span>
                  </div>
                )}
                
                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {displayMetal && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{displayMetal}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Metal</div>
                    </div>
                  )}
                  {displayCaratWeight && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{displayCaratWeight}ct</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Total Carat</div>
                    </div>
                  )}
                  {(totalNumberOfStones || totalDiamonds) && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{totalNumberOfStones || totalDiamonds}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Stones</div>
                    </div>
                  )}
                  {jewelryClassification && (
                    <div className="text-center p-3 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">{jewelryClassification}</div>
                      <div className="text-xs text-blue-500 uppercase tracking-wider">Type</div>
                    </div>
                  )}
                </div>
                
                {/* Ratings */}
                {rating > 0 && (
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">{rating.toFixed(1)} ({numReviews || 0} reviews)</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!isProductAvailable()}
                    className={`flex-1 py-3 px-6 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isProductAvailable() 
                        ? 'bg-primary hover:bg-primary-dark text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={18} />
                    Confirm Order
                  </button>
                  
                  <WishlistButton 
                    productId={product._id}
                    productType={productType || type}
                    size="lg"
                    className="!border-primary !text-primary hover:!bg-primary/5"
                  />
                </div>
                
                {/* Customization Section */}
                <div className="mt-6 bg-gradient-to-r from-rose-25 to-amber-25 border border-rose-100 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-rose-200 to-amber-200 rounded-full flex items-center justify-center shadow-sm">
                        <Sparkles size={24} className="text-rose-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-rose-700 mb-2">
                        Make It Uniquely Yours
                      </h4>
                      <p className="text-gray-500 mb-1 text-sm">
                        You can customize this jewelry according to your preferences
                      </p>
                      <h2 className="text-base font-medium text-amber-600 mb-4">
                        Any customization?
                      </h2>
                      <button 
                        onClick={() => navigate('/book-appointment')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-300 to-amber-300 hover:from-rose-400 hover:to-amber-400 text-rose-700 hover:text-rose-800 font-medium py-2.5 px-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-rose-600">Better</span>
                        Book Appointment
                        <Sparkles size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          {description && (
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          )}
          
          {/* Detailed Specifications */}
          <div className="mt-8 bg-white rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection('specifications')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Jewelry Specifications</h3>
              {expandedSections.specifications ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {expandedSections.specifications && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 gap-3">
                  {/* Basic Information */}
                  {stockNumber && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium text-gray-900">{stockNumber}</span>
                    </div>
                  )}
                  {displayStyle && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium text-gray-900">{displayStyle}</span>
                    </div>
                  )}
                  {jewelryClassification && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Classification:</span>
                      <span className="font-medium text-gray-900">{jewelryClassification}</span>
                    </div>
                  )}
                  {displayMetal && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Metal:</span>
                      <span className="font-medium text-gray-900">{displayMetal}</span>
                    </div>
                  )}
                  {mount && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Mount:</span>
                      <span className="font-medium text-gray-900">{mount}</span>
                    </div>
                  )}
                  {displayCaratWeight && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Carat Weight:</span>
                      <span className="font-medium text-gray-900">{displayCaratWeight} ct</span>
                    </div>
                  )}
                  {(totalNumberOfStones || totalDiamonds) && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Stones:</span>
                      <span className="font-medium text-gray-900">{totalNumberOfStones || totalDiamonds}</span>
                    </div>
                  )}
                  {brand && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium text-gray-900">{brand}</span>
                    </div>
                  )}
                  
                  {/* Center Stone Details */}
                  {centerStone && Object.keys(centerStone).length > 0 && (
                    <>
                      <div className="mt-4 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Center Stone</h4>
                      </div>
                      {centerStone.type && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-900">{centerStone.type}</span>
                        </div>
                      )}
                      {centerStone.shape && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Shape:</span>
                          <span className="font-medium text-gray-900">{centerStone.shape}</span>
                        </div>
                      )}
                      {centerStone.caratWeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Carat Weight:</span>
                          <span className="font-medium text-gray-900">{centerStone.caratWeight} ct</span>
                        </div>
                      )}
                      {centerStone.color && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium text-gray-900">{centerStone.color}</span>
                        </div>
                      )}
                      {centerStone.clarity && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Clarity:</span>
                          <span className="font-medium text-gray-900">{centerStone.clarity}</span>
                        </div>
                      )}
                      {centerStone.cut && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Cut:</span>
                          <span className="font-medium text-gray-900">{centerStone.cut}</span>
                        </div>
                      )}
                      {centerStone.fluorescence && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Fluorescence:</span>
                          <span className="font-medium text-gray-900">{centerStone.fluorescence}</span>
                        </div>
                      )}
                      {centerStone.lab && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Lab:</span>
                          <span className="font-medium text-gray-900">{centerStone.lab}</span>
                        </div>
                      )}
                      {centerStone.certNumber && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Certificate #:</span>
                          <span className="font-medium text-gray-900">{centerStone.certNumber}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Side Stone Details */}
                  {sideStone && Object.keys(sideStone).length > 0 && (
                    <>
                      <div className="mt-4 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Side Stones</h4>
                      </div>
                      {sideStone.type && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-900">{sideStone.type}</span>
                        </div>
                      )}
                      {sideStone.totalStones && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Stones:</span>
                          <span className="font-medium text-gray-900">{sideStone.totalStones}</span>
                        </div>
                      )}
                      {sideStone.shape && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Shape:</span>
                          <span className="font-medium text-gray-900">{sideStone.shape}</span>
                        </div>
                      )}
                      {sideStone.caratWeight && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total Carat Weight:</span>
                          <span className="font-medium text-gray-900">{sideStone.caratWeight} ct</span>
                        </div>
                      )}
                      {sideStone.color && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium text-gray-900">{sideStone.color}</span>
                        </div>
                      )}
                      {sideStone.clarity && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Clarity:</span>
                          <span className="font-medium text-gray-900">{sideStone.clarity}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Legacy fields for backward compatibility */}
                  {setting && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Setting:</span>
                      <span className="font-medium text-gray-900">{setting}</span>
                    </div>
                  )}
                  {diamondType && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Diamond Type:</span>
                      <span className="font-medium text-gray-900">{diamondType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Educational Content Sections */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Materials & Craftsmanship */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('materials')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Gem size={20} className="text-amber-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Materials & Craftsmanship</h3>
                </div>
                {expandedSections.materials ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.materials && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>Our jewelry is crafted with the finest materials and exceptional attention to detail.</p>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Premium metals and alloys</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Hand-selected gemstones</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Expert craftsmanship</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Quality control standards</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quality Assurance */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('quality')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Award size={20} className="text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Quality Assurance</h3>
                </div>
                {expandedSections.quality ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.quality && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Expert craftsmanship guarantee</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ethically sourced materials</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Professional consultation included</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Certified authenticity</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Bespoke customization available</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Quality control standards</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Care Instructions */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Shield size={20} className="text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Care Instructions</h3>
                </div>
                {expandedSections.care ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.care && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>Proper care ensures your jewelry maintains its beauty for years to come.</p>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Store in provided jewelry box</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Clean with soft cloth regularly</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Avoid harsh chemicals</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Professional cleaning available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={closeFullscreen}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-black border border-black transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div 
            ref={fullscreenImageRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onMouseMove={(e) => {
              if (!fullscreenImageRef.current) return;
              const container = fullscreenImageRef.current;
              const { left, top, width, height } = container.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              setMousePosition({ x, y });
            }}
          >
            <img
              src={currentImageUrl}
              alt={name}
              className="max-h-[90vh] max-w-[90vw] object-contain opacity-40"
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGES.jewelry;
              }}
            />
            
            <div 
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{
                backgroundImage: `url(${currentImageUrl})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
            
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronLeft size={32} className="text-white" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronRight size={32} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Confirm Order Modal */}
      <ConfirmOrderModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        productName={name}
        productPrice={onSale && salePrice ? salePrice : price}
        productImage={currentImageUrl}
        productId={product._id}
        productType="Jewelry"
        stockNumber={product?.jewelrySpecs?.stockNumber}
        product={product}
      />
    </>
  );
};

export default JewelryDetail; 