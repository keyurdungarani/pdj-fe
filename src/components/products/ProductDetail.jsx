import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Rotate3d } from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';

const ProductDetail = ({ product, type = 'jewelry' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [is360Active, setIs360Active] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const imageContainerRef = useRef(null);
  const rotationInterval = useRef(null);
  
  // Exit if product is null
  if (!product) return <div className="p-8 text-center">Product not found</div>;
  
  const { 
    name, 
    price, 
    images = [], 
    rotationImages = [], // Array of images for 360° rotation
    description, 
    details = {},
    specifications = []
  } = product;
  
  const formattedPrice = price?.toLocaleString() || '';
  const has360Feature = rotationImages && rotationImages.length > 0;
  
  // Zoom functionality
  const handleMouseMove = (e) => {
    if (!showZoom) return;
    
    const container = imageContainerRef.current;
    const { left, top, width, height } = container.getBoundingClientRect();
    
    // Calculate position as percentage
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };
  
  // Navigation through images
  const nextImage = () => {
    if (is360Active) return;
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    if (is360Active) return;
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
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
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Images */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              ref={imageContainerRef}
              className="relative overflow-hidden rounded-lg aspect-square bg-white border border-gray-200"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
            >
              {/* Main Image */}
              <img
                src={is360Active ? rotationImages[currentRotation] : images[selectedImage]}
                alt={name}
                className="w-full h-full object-contain"
              />
              
              {/* Zoomed Image - Shown when hovering */}
              {showZoom && !is360Active && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${images[selectedImage]})`,
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
                  onClick={() => setShowZoom(!showZoom)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ZoomIn size={20} className="text-gray-700" />
                </button>
                
                {has360Feature && (
                  <button 
                    onClick={toggle360View}
                    className={`p-2 rounded-full shadow-md transition-colors ${
                      is360Active ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Rotate3d size={20} />
                  </button>
                )}
              </div>
              
              {/* Navigation Arrows */}
              {!is360Active && images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={24} className="text-gray-700" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={24} className="text-gray-700" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {!is360Active && images.length > 1 && (
              <div className="flex overflow-x-auto space-x-2 py-2">
                {images.map((img, idx) => (
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
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800">{name}</h1>
              <p className="text-2xl font-bold mt-2">₹{formattedPrice}</p>
            </div>
            
            {/* Product Description */}
            <div className="prose prose-sm max-w-none">
              <p>{description}</p>
            </div>
            
            {/* Product Details */}
            {Object.keys(details).length > 0 && (
              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="text-lg font-medium mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-gray-600 mr-2">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specifications */}
            {specifications.length > 0 && (
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
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded transition-colors flex-1 text-center"
              >
                Buy Now
              </button>
              <button className="px-6 py-3 border border-primary text-primary hover:bg-primary/5 font-medium rounded transition-colors flex-1 text-center">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Order Modal */}
      <ConfirmOrderModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        productDetails={{
          name,
          price,
          image: images[0],
          details
        }}
      />
    </>
  );
};

export default ProductDetail; 