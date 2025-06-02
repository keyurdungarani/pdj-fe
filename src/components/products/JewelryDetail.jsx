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
  Users
} from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

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
  
  // Extract jewelry specifications
  const {
    material = jewelrySpecs?.material,
    caratWeight = jewelrySpecs?.caratWeight,
    diamondType = jewelrySpecs?.diamondType,
    totalDiamonds = jewelrySpecs?.totalDiamonds,
    setting = jewelrySpecs?.setting,
    style = jewelrySpecs?.style
  } = { ...details, ...jewelrySpecs };
  
  const formattedPrice = price?.toLocaleString('en-US') || '';
  const formattedOriginalPrice = originalPrice?.toLocaleString('en-US') || '';
  const formattedSalePrice = salePrice?.toLocaleString('en-US') || '';
  
  // Process images
  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.jewelry;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_LOCAL_API || ''}${imagePath}`;
  };
  
  const processedMainImage = processImageUrl(mainImage);
  const processedGalleryImages = galleryImages.map(img => processImageUrl(img));
  const allImages = processedMainImage ? [processedMainImage, ...processedGalleryImages] : processedGalleryImages;
  const currentImageUrl = allImages.length > 0 ? allImages[selectedImage] : PLACEHOLDER_IMAGES.jewelry;
  
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
      <div className="bg-gray-50 min-h-screen">
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
                    <span className="text-sm text-gray-500 uppercase tracking-wider">
                      {category || productType || type}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
                  {product._id && (
                    <span className="text-sm text-gray-500">Item ID: {product._id?.slice(-8)}</span>
                  )}
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    {onSale && salePrice ? (
                      <>
                        <span className="text-3xl font-bold text-red-600">${formattedSalePrice}</span>
                        <span className="text-lg text-gray-500 line-through">${formattedPrice}</span>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          {Math.round(((price - salePrice) / price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">${formattedPrice}</span>
                    )}
                  </div>
                </div>
                
                {/* Availability */}
                <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mb-6">
                  <span className="text-gray-700 font-medium">Availability:</span>
                  {countInStock > 0 ? (
                    <span className="text-green-600 font-medium flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      In Stock ({countInStock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
                
                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {material && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{material}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Material</div>
                    </div>
                  )}
                  {caratWeight && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{caratWeight}ct</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Total Weight</div>
                    </div>
                  )}
                  {totalDiamonds && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{totalDiamonds}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Diamonds</div>
                    </div>
                  )}
                  {customizable && (
                    <div className="text-center p-3 border border-purple-200 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-700">Custom</div>
                      <div className="text-xs text-purple-500 uppercase tracking-wider">Available</div>
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
                  {setting && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Setting:</span>
                      <span className="font-medium text-gray-900">{setting}</span>
                    </div>
                  )}
                  {style && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium text-gray-900">{style}</span>
                    </div>
                  )}
                  {diamondType && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Diamond Type:</span>
                      <span className="font-medium text-gray-900">{diamondType}</span>
                    </div>
                  )}
                  {details.weight && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className="font-medium text-gray-900">{details.weight}</span>
                    </div>
                  )}
                  {details.purity && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Metal Purity:</span>
                      <span className="font-medium text-gray-900">{details.purity}</span>
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
                      <span>Lifetime warranty coverage</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Free resizing service</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Certified authenticity</span>
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
      />
    </>
  );
};

export default JewelryDetail; 