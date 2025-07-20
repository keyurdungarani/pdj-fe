import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, ShoppingCart } from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

const ProductCard = ({ product, type = 'jewelry', viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideIntervalRef = useRef(null);
  const navigate = useNavigate();

  if (!product) return null;

  const { 
    _id, 
    name, 
    price, 
    mainImage,
    galleryImages = [], 
    isNewArrival, 
    type: productType,
    details,
    originalPrice,
    discount
  } = product;

  // Combine main image and gallery images for the carousel
  const images = mainImage ? [mainImage, ...galleryImages] : galleryImages;
  
  // Make sure we have at least a placeholder if no images
  const imageUrl = images.length > 0 && images[currentImageIndex] 
    ? (images[currentImageIndex].startsWith('http') 
        ? images[currentImageIndex] 
        : `${import.meta.env.VITE_LOCAL_API || ''}${images[currentImageIndex]}`)
    : PLACEHOLDER_IMAGES.product;

  // Format the price with commas
  const formattedPrice = price?.toLocaleString('en-US') || '';
  const formattedOriginalPrice = originalPrice?.toLocaleString('en-US') || '';
  
  // Handle image sliding on hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      // Start auto sliding through images when hovered
      slideIntervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex(prevIndex => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          );
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 250);
      }, 1500); // Change image every 1.5s for a more pleasant experience
    } else {
      // Reset to first image and clear interval when not hovered
      if (!isHovered) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex(0);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 250);
      }
      
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isHovered, images.length]);
  
  const handleBuyNow = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };
  
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${type}/${_id}`);
  };

  return (
    <>
      <div 
        className="relative group overflow-hidden rounded-md shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* New Arrival Tag */}
        {isNewArrival && (
          <div className="absolute top-0 left-0 bg-amber-400/90 text-xs font-montserrat font-semibold text-white py-1 px-3 rounded-br-lg z-10">
            NEW
          </div>
        )}

        {/* Discount Tag */}
        {discount && discount > 0 && (
          <div className="absolute top-0 right-0 bg-red-500/90 text-xs font-montserrat font-semibold text-white py-1 px-3 rounded-bl-lg z-10">
            {discount}% OFF
          </div>
        )}

        {/* Image Container */}
        <Link 
          to={`/${type}/${_id}`}
          className="relative block overflow-hidden pt-[125%]" // 4:5 aspect ratio
        >
          <img
            src={imageUrl}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 transform group-hover:scale-105 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                e.target.src = PLACEHOLDER_IMAGES.product;
              }
            }}
          />
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add wishlist functionality
            }}
          >
            <Heart size={18} className="text-gray-600" />
          </button>
          
          {/* Quick View Button - MONTSERRAT FOR UI TEXT */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={handleQuickView}
          >
            <span className="text-xs font-montserrat font-medium">QUICK VIEW</span>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Brand or product type - MONTSERRAT FOR BODY TEXT */}
          <span className="text-xs font-montserrat font-medium text-gray-700 mb-1 capitalize truncate">{productType}</span>
          
          {/* Product Name - BASKERVILLE FOR PRODUCT TITLES */}
          <h3 className="font-baskerville font-medium text-gray-800 mb-1 text-sm line-clamp-2 h-10">{name}</h3>
          
          {/* Price - MONTSERRAT FOR PRICING */}
          <div className="flex items-center mt-1">
            <span className="font-montserrat font-semibold text-base">${formattedPrice}</span>
            
            {/* Original price with strikethrough */}
            {originalPrice && originalPrice > price && (
              <span className="ml-2 text-xs font-montserrat text-gray-500 line-through">${formattedOriginalPrice}</span>
            )}
            
            {/* Discount percentage */}
            {discount && discount > 0 && (
              <span className="ml-2 text-xs font-montserrat text-green-600 font-medium">{discount}% off</span>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Order Modal */}
      <ConfirmOrderModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        productName={name}
        productPrice={price}
        productImage={images?.[0]}
        productId={_id}
        productType={productType || type}
        stockNumber={product?.stockNumber || product?.jewelrySpecs?.stockNumber}
        product={product}
      />
    </>
  );
};

export default ProductCard; 