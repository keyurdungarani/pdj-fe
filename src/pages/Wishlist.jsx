import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [currentUser, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.wishlist);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load wishlist');
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      toast.success('Item removed from wishlist');
      fetchWishlist(); // Refresh
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }
    
    try {
      await wishlistAPI.clearWishlist();
      toast.success('Wishlist cleared');
      fetchWishlist();
    } catch (err) {
      toast.error('Failed to clear wishlist');
    }
  };

  const handleViewProduct = (item) => {
    const productType = item.productType === 'diamond' || item.productType === 'lab-grown' 
      ? 'diamonds' 
      : item.productType === 'natural-diamond'
      ? 'natural-diamonds'
      : item.productType;
    
    navigate(`/products/${productType}/${item.product._id}`);
  };

  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.jewelry;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_API_URL || ''}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-2xl font-semibold text-red-700 mb-2">Error Loading Wishlist</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Heart className="text-primary" size={32} fill="currentColor" />
              <h1 className="text-4xl font-didot font-bold text-gray-900">My Wishlist</h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Clear All</span>
              </button>
            )}
          </div>
          <p className="text-gray-600">
            {items.length === 0 
              ? 'Your wishlist is empty. Start adding items you love!' 
              : `You have ${items.length} item${items.length > 1 ? 's' : ''} in your wishlist`}
          </p>
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Heart className="mx-auto mb-4 text-gray-300" size={64} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-6">
              Discover our beautiful collection and save your favorites here
            </p>
            <button
              onClick={() => navigate('/jewelry')}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Jewelry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              if (!item.product) return null; // Skip if product was deleted
              
              const product = item.product;
              const imageUrl = processImageUrl(product.mainImage);
              const displayPrice = product.onSale && product.salePrice 
                ? product.salePrice 
                : product.price;
              
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Image */}
                  <div 
                    className="relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
                    onClick={() => handleViewProduct(item)}
                  >
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGES.jewelry;
                      }}
                    />
                    
                    {/* Sale badge */}
                    {product.onSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                    
                    {/* Stock status */}
                    {product.countInStock === 0 && (
                      <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(product._id);
                      }}
                      className="absolute top-2 right-2 bg-white hover:bg-red-50 p-2 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div 
                      className="cursor-pointer"
                      onClick={() => handleViewProduct(item)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-xl font-bold text-primary">
                          ${displayPrice?.toLocaleString()}
                        </span>
                        {product.onSale && product.salePrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(item)}
                        disabled={product.countInStock === 0}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                          product.countInStock === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-dark text-white'
                        }`}
                      >
                        <ShoppingBag size={16} />
                        <span>{product.countInStock === 0 ? 'Out of Stock' : 'View Details'}</span>
                      </button>
                    </div>

                    {/* Added date */}
                    <p className="text-xs text-gray-500 mt-3">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

