import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, RotateCw, Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw, Award } from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

const ProductDetail = ({ product, type = 'jewelry' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [is360Active, setIs360Active] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2); // Default zoom level
  const [imageError, setImageError] = useState(false);
  
  const imageContainerRef = useRef(null);
  const fullscreenImageRef = useRef(null);
  const rotationInterval = useRef(null);
  
  // Exit if product is null
  if (!product) return <div className="p-8 text-center">Product not found</div>;
  
  const { 
    name, 
    price, 
    mainImage,
    galleryImages = [], 
    rotationImages = [], // Array of images for 360° rotation
    description, 
    details = {},
    specifications = [],
    productType,
    category,
    material,
    weight,
    jewelrySpecs = {},
    featured,
    onSale,
    salePrice,
    rating,
    numReviews,
    countInStock,
  } = product;
  
  // Format the price with commas
  const formattedPrice = price?.toLocaleString('en-US') || '';
  const formattedSalePrice = salePrice?.toLocaleString('en-US') || '';
  
  // Process images to ensure proper URL format
  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.large;
    
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_LOCAL_API || ''}${imagePath}`;
  };
  
  // Prepare all images
  const processedMainImage = processImageUrl(mainImage);
  const processedGalleryImages = galleryImages.map(img => processImageUrl(img));
  const allImages = processedMainImage ? [processedMainImage, ...processedGalleryImages] : processedGalleryImages;
  
  const currentImageUrl = allImages.length > 0 ? allImages[selectedImage] : PLACEHOLDER_IMAGES.large;
  
  const has360Feature = rotationImages && rotationImages.length > 0;
  
  // Regular zoom functionality
  const handleMouseMove = (e) => {
    if (!showZoom) return;
    
    const container = imageContainerRef.current;
    if (!container) return;
    
    const { left, top, width, height } = container.getBoundingClientRect();
    
    // Calculate position as percentage
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  // Fullscreen zoom functionality
  const handleFullscreenMouseMove = (e) => {
    if (!fullscreenImageRef.current) return;
    
    const container = fullscreenImageRef.current;
    const { left, top, width, height } = container.getBoundingClientRect();
    
    // Calculate position as percentage
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };
  
  // Navigation through images
  const nextImage = () => {
    if (is360Active) return;
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    if (is360Active) return;
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };
  
  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    if (!showFullscreen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowFullscreen(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === '+') {
        setZoomLevel(prev => Math.min(prev + 0.5, 4)); // Max zoom 4x
      } else if (e.key === '-') {
        setZoomLevel(prev => Math.max(prev - 0.5, 1)); // Min zoom 1x
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen]);
  
  // 360° rotation feature
  const toggle360View = () => {
    if (!has360Feature) return;
    
    if (!is360Active) {
      setIs360Active(true);
      // Auto rotate
      rotationInterval.current = setInterval(() => {
        setCurrentRotation((prev) => (prev === rotationImages.length - 1 ? 0 : prev + 1));
      }, 100);
    } else {
      setIs360Active(false);
      clearInterval(rotationInterval.current);
    }
  };
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    };
  }, []);

  // Open fullscreen image view
  const openFullscreen = () => {
    setShowFullscreen(true);
    setShowZoom(true);
    // Lock body scroll when fullscreen is active
    document.body.style.overflow = 'hidden';
  };

  // Close fullscreen image view
  const closeFullscreen = () => {
    setShowFullscreen(false);
    // Restore body scroll
    document.body.style.overflow = '';
  };
  
  // Extract details from product object
  const allDetails = {
    Category: category,
    Material: material || jewelrySpecs?.material,
    Weight: weight || jewelrySpecs?.weight,
    Type: productType,
    Availability: countInStock > 0 ? 'In Stock' : 'Out of Stock',
    ...details,
    ...jewelrySpecs,
  };

  // Add diamond specifications if they exist
  if (product.diamondSpecs) {
    const diamondSpecs = product.diamondSpecs;
    // Flatten diamond specifications
    Object.entries(diamondSpecs).forEach(([key, value]) => {
      if (key !== '_id' && key !== '__v' && value !== null && value !== undefined) {
        // Format the key to be more readable
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        allDetails[formattedKey] = value;
      }
    });
  }

  // Add any other specifications objects that might exist
  ['gemSpecs', 'metalSpecs', 'customSpecs'].forEach(specType => {
    if (product[specType]) {
      Object.entries(product[specType]).forEach(([key, value]) => {
        if (key !== '_id' && key !== '__v' && value !== null && value !== undefined) {
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
          allDetails[formattedKey] = value;
        }
      });
    }
  });

  // Filter out any undefined or null values
  const filteredDetails = Object.entries(allDetails)
    .filter(([key, value]) => value !== undefined && value !== null && key !== "__v" && key !== "_id")
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  // Separate diamond specifications for special formatting
  const diamondSpecKeys = ['carat', 'clarity', 'color', 'cut', 'depth', 'dimensions', 'fluorescence', 'grademethod', 'polish', 'ratio', 'shape', 'symmetry', 'table', 'weight'];
  const diamondDetails = {};
  const otherDetails = {};

  Object.entries(filteredDetails).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (diamondSpecKeys.includes(lowerKey)) {
      diamondDetails[key] = value;
    } else {
      otherDetails[key] = value;
    }
  });

  const hasDiamondSpecs = Object.keys(diamondDetails).length > 0;
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Images */}
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
              {/* Main Image */}
              <img
                src={is360Active ? processImageUrl(rotationImages[currentRotation]) : currentImageUrl}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGES.large;
                }}
              />
              
              {/* Zoomed Image - Shown when hovering */}
              {showZoom && !is360Active && (
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
              
              {/* Feature Badges */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullscreen();
                  }}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ZoomIn size={20} className="text-gray-700" />
                </button>
                
                {has360Feature && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle360View();
                    }}
                    className={`p-2 rounded-full shadow-md transition-colors ${
                      is360Active ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <RotateCw size={20} />
                  </button>
                )}
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
              </div>
              
              {/* Navigation Arrows */}
              {!is360Active && allImages.length > 1 && (
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
            
            {/* Thumbnail Images */}
            {!is360Active && allImages.length > 1 && (
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
          
          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Product Type/Category */}
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {category || productType || type}
              </span>
            </div>
            
            {/* Product Name & Price */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">{name}</h1>
              <div className="flex items-center mt-2">
                {onSale && salePrice ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">${formattedSalePrice}</span>
                    <span className="ml-2 text-lg text-gray-500 line-through">${formattedPrice}</span>
                    <span className="ml-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
                      {Math.round(((price - salePrice) / price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">${formattedPrice}</span>
                )}
              </div>
            </div>
            
            {/* Availability */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Availability:</span>
                {countInStock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>
            
            {/* Product Description */}
            {description && (
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p>{description}</p>
              </div>
            )}
            
            {/* Product Details */}
            {Object.keys(otherDetails).length > 0 && (
              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="text-lg font-medium mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(otherDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diamond Specifications */}
            {hasDiamondSpecs && (
              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <span className="mr-2">💎</span>
                  Diamond Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(diamondDetails).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm uppercase tracking-wide">{key}:</span>
                        <span className="font-semibold text-gray-900">{value.toString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specifications */}
            {specifications && specifications.length > 0 && (
              <div className="border-b border-gray-200 py-4">
                <h3 className="text-lg font-medium mb-2">Specifications</h3>
                <ul className="space-y-2">
                  {specifications.map((spec, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Ratings */}
            {rating > 0 && (
              <div className="flex items-center space-x-2">
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
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 mt-6">
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={countInStock <= 0}
                className={`px-6 py-3 font-medium rounded transition-colors flex-1 text-center flex items-center justify-center gap-2 ${
                  countInStock > 0 
                    ? 'bg-primary hover:bg-primary-dark text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={18} />
                Buy Now
              </button>
              
              <button 
                className="px-6 py-3 border border-primary text-primary hover:bg-primary/5 font-medium rounded transition-colors flex-1 text-center flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Image Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={closeFullscreen}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/10 px-4 py-2 rounded-full text-white text-sm">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                className="hover:text-gray-300"
              >
                -
              </button>
              <span>Zoom: {zoomLevel}x</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}
                className="hover:text-gray-300"
              >
                +
              </button>
            </div>
          </div>
          
          <div 
            ref={fullscreenImageRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onMouseMove={handleFullscreenMouseMove}
          >
            <img
              src={currentImageUrl}
              alt={name}
              className="max-h-[90vh] max-w-[90vw] object-contain opacity-40"
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGES.large;
              }}
            />
            
            {/* Zoomed version */}
            <div 
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{
                backgroundImage: `url(${currentImageUrl})`,
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
            
            {/* Navigation Arrows */}
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
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
              {selectedImage + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Order Modal */}
      <ConfirmOrderModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        productDetails={{
          name,
          price: onSale && salePrice ? salePrice : price,
          image: allImages[0],
          details: otherDetails
        }}
      />
    </>
  );
};

export default ProductDetail; 