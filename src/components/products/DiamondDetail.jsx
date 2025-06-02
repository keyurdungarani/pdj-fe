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
  ChevronUp
} from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

const DiamondDetail = ({ product, type = 'diamonds' }) => {
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
    about: false,
    quality: false,
    ethical: false
  });
  
  const imageContainerRef = useRef(null);
  const fullscreenImageRef = useRef(null);
  
  if (!product) return <div className="p-8 text-center">Diamond not found</div>;
  
  const { 
    name, 
    price, 
    mainImage,
    galleryImages = [], 
    description, 
    details = {},
    diamondSpecs = {},
    labGrownSpecs = {},
    productType,
    countInStock,
    originalPrice,
    discount,
    onSale,
    salePrice,
    rating,
    numReviews,
    featured
  } = product;
  
  // Get the appropriate specs based on diamond type
  const specs = productType === 'lab-grown' ? labGrownSpecs : diamondSpecs;
  
  // Extract key diamond characteristics
  const {
    carat = specs.weight,
    cut = specs.cutGrade,
    color,
    clarity,
    shape,
    certification = specs.lab,
    polish,
    symmetry,
    fluorescence = specs.fluorescenceIntensity,
    table,
    depth,
    ratio
  } = { ...details, ...specs };
  
  const formattedPrice = price?.toLocaleString('en-US') || '';
  const formattedOriginalPrice = originalPrice?.toLocaleString('en-US') || '';
  const formattedSalePrice = salePrice?.toLocaleString('en-US') || '';
  
  // Process images
  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.diamond;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_LOCAL_API || ''}${imagePath}`;
  };
  
  const processedMainImage = processImageUrl(mainImage);
  const processedGalleryImages = galleryImages.map(img => processImageUrl(img));
  const allImages = processedMainImage ? [processedMainImage, ...processedGalleryImages] : processedGalleryImages;
  const currentImageUrl = allImages.length > 0 ? allImages[selectedImage] : PLACEHOLDER_IMAGES.diamond;
  
  // Grade color coding
  const getGradeColor = (grade, type) => {
    if (!grade) return 'text-gray-500';
    
    const gradeUpper = grade.toString().toUpperCase();
    
    if (type === 'cut') {
      return gradeUpper === 'IDEAL' || gradeUpper === 'EXCELLENT' ? 'text-green-600' :
             gradeUpper === 'VERY GOOD' ? 'text-blue-600' :
             gradeUpper === 'GOOD' ? 'text-yellow-600' : 'text-gray-600';
    }
    
    if (type === 'color') {
      return ['D', 'E', 'F'].includes(gradeUpper) ? 'text-green-600' :
             ['G', 'H', 'I', 'J'].includes(gradeUpper) ? 'text-blue-600' :
             ['K', 'L', 'M'].includes(gradeUpper) ? 'text-yellow-600' : 'text-orange-600';
    }
    
    if (type === 'clarity') {
      return ['FL', 'IF'].includes(gradeUpper) ? 'text-green-600' :
             gradeUpper.includes('VVS') ? 'text-blue-600' :
             gradeUpper.includes('VS') ? 'text-yellow-600' : 'text-orange-600';
    }
    
    return 'text-gray-600';
  };
  
  // Get description for grades
  const getGradeDescription = (grade, type) => {
    if (!grade) return '';
    
    const gradeUpper = grade.toString().toUpperCase();
    
    if (type === 'color') {
      if (['D', 'E', 'F'].includes(gradeUpper)) return 'Colorless';
      if (['G', 'H', 'I', 'J'].includes(gradeUpper)) return 'Near Colorless';
      if (['K', 'L', 'M'].includes(gradeUpper)) return 'Faint Yellow';
      return 'Light Yellow';
    }
    
    if (type === 'clarity') {
      if (gradeUpper === 'FL') return 'Flawless';
      if (gradeUpper === 'IF') return 'Internally Flawless';
      if (gradeUpper.includes('VVS')) return 'Very Very Slightly Included';
      if (gradeUpper.includes('VS')) return 'Very Slightly Included';
      if (gradeUpper.includes('SI')) return 'Slightly Included';
    }
    
    return '';
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
  
  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <span>Home</span>
              <ChevronRight size={16} className="mx-2" />
              <span>Diamonds</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-gray-900">{name}</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Diamond Images - Same size as JewelryDetail */}
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
                    e.target.src = PLACEHOLDER_IMAGES.diamond;
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
                    title="360° View"
                  >
                    <RotateCw size={20} className="text-gray-700" />
                  </button>
                  
                  <button 
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Video Available"
                  >
                    <Eye size={20} className="text-gray-700" />
                  </button>
                </div>
                
                {/* Diamond Type Badge */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    productType === 'lab-grown' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {productType === 'lab-grown' ? 'Lab-Grown Diamond' : 'Natural Diamond'}
                  </div>
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
            
            {/* Right: Diamond Details */}
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">💎</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wider">
                      {productType === 'lab-grown' ? 'Lab-Grown Diamond' : 'Natural Diamond'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
                  {certification && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {certification} Certified
                      </span>
                      {product._id && (
                        <span className="text-sm text-gray-500">Stock ID: {product._id?.slice(-8)}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    {onSale && salePrice ? (
                      <>
                        <span className="text-3xl font-bold text-red-600">${formattedSalePrice}</span>
                        <span className="text-lg text-gray-500 line-through">${formattedPrice}</span>
                        {discount && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                            {discount}% OFF
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">${formattedPrice}</span>
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
                
                {/* Key Specifications Grid - 4Cs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {carat && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{carat}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Carat</div>
                    </div>
                  )}
                  {cut && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-lg font-bold ${getGradeColor(cut, 'cut')}`}>{cut}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Cut</div>
                    </div>
                  )}
                  {color && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-lg font-bold ${getGradeColor(color, 'color')}`}>{color}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Color</div>
                      {getGradeDescription(color, 'color') && (
                        <div className="text-xs text-gray-400">{getGradeDescription(color, 'color')}</div>
                      )}
                    </div>
                  )}
                  {clarity && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-lg font-bold ${getGradeColor(clarity, 'clarity')}`}>{clarity}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Clarity</div>
                      {getGradeDescription(clarity, 'clarity') && (
                        <div className="text-xs text-gray-400">{getGradeDescription(clarity, 'clarity')}</div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Ratings - Only show if rating exists */}
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
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowConfirmModal(true)}
                    disabled={countInStock <= 0}
                    className={`w-full py-3 px-6 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      countInStock > 0 
                        ? 'bg-primary hover:bg-primary-dark text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    Buy Now
                  </button>
                  
                  <button className="w-full py-3 px-6 border border-primary text-primary hover:bg-primary/5 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Heart size={18} />
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description - Only show if exists */}
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
              <h3 className="text-lg font-semibold text-gray-900">Diamond Specifications</h3>
              {expandedSections.specifications ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {expandedSections.specifications && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 gap-3">
                  {shape && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Shape:</span>
                      <span className="font-medium text-gray-900">{shape}</span>
                    </div>
                  )}
                  {polish && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Polish:</span>
                      <span className="font-medium text-gray-900">{polish}</span>
                    </div>
                  )}
                  {symmetry && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Symmetry:</span>
                      <span className="font-medium text-gray-900">{symmetry}</span>
                    </div>
                  )}
                  {fluorescence && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Fluorescence:</span>
                      <span className="font-medium text-gray-900">{fluorescence}</span>
                    </div>
                  )}
                  {table && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Table:</span>
                      <span className="font-medium text-gray-900">{table}%</span>
                    </div>
                  )}
                  {depth && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Depth:</span>
                      <span className="font-medium text-gray-900">{depth}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Educational Content Sections */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Lab-Grown Diamonds */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('about')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Sparkles size={20} className="text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    About {productType === 'lab-grown' ? 'Lab-Grown' : 'Natural'} Diamonds
                  </h3>
                </div>
                {expandedSections.about ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.about && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    {productType === 'lab-grown' ? (
                      <>
                        <p>Lab-grown diamonds are real diamonds created in controlled laboratory environments using advanced technological processes.</p>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Chemically, physically, and optically identical to natural diamonds</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>More environmentally sustainable</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Exceptional value and quality</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Available in larger sizes and rare colors</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>Natural diamonds are formed deep within the Earth over billions of years under extreme pressure and temperature.</p>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Each diamond is completely unique</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Billions of years in the making</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Traditional symbol of enduring love</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Exceptional rarity and value</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quality Services */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('quality')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Award size={20} className="text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Our Quality Promise</h3>
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
                      <span>Lifetime warranty on all diamonds</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Free worldwide shipping</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Expert gemologist certification</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Ethical Sourcing */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('ethical')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Shield size={20} className="text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Ethical Sourcing</h3>
                </div>
                {expandedSections.ethical ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.ethical && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>We are committed to ethical practices in every aspect of our diamond sourcing and creation.</p>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>100% conflict-free diamonds</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Environmentally responsible practices</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Full transparency in sourcing</span>
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
                e.target.src = PLACEHOLDER_IMAGES.diamond;
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
      />
    </>
  );
};

export default DiamondDetail; 