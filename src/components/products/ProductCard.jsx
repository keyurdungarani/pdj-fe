import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingCart } from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';

const ProductCard = ({ product, type = 'jewelry' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!product) return null;

  const { 
    _id, 
    name, 
    price, 
    images, 
    isNewArrival, 
    type: productType,
    details 
  } = product;

  const formattedPrice = price?.toLocaleString() || '';
  
  const handleBuyNow = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <>
      <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col">
        {/* New Arrival Tag */}
        {isNewArrival && (
          <div className="absolute top-0 left-0 bg-amber-400/90 text-xs font-semibold text-white py-1 px-3 rounded-br-lg z-10">
            NEW ARRIVAL ✨
          </div>
        )}

        {/* Image Container */}
        <Link 
          to={`/${type}/${_id}`}
          className="relative block overflow-hidden pt-[100%]" // 1:1 aspect ratio
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={isHovered && images?.length > 1 ? images[1] : images?.[0]}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain transition-all duration-500 transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=No+Image';
            }}
          />
          
          {/* Quick Action Buttons - Appear on Hover */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
              <Heart size={20} className="text-gray-600" />
            </button>
            <Link to={`/${type}/${_id}`} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
              <Search size={20} className="text-gray-600" />
            </Link>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs text-gray-500 mb-1 capitalize">{productType}</span>
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{name}</h3>
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="font-semibold text-lg">₹{formattedPrice}</span>
            <button 
              onClick={handleBuyNow}
              className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white rounded-full w-10 h-10 transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
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
          image: images?.[0],
          details
        }}
      />
    </>
  );
};

export default ProductCard; 