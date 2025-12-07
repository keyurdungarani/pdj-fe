import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { wishlistAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ productId, productType, size = 'md', className = '' }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && productId) {
      checkWishlistStatus();
    }
  }, [currentUser, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistAPI.checkWishlistItem(productId);
      setInWishlist(response.data.inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Prevent triggering parent click events
    
    console.log('Wishlist button clicked!', { productId, productType, currentUser });
    
    if (!currentUser) {
      console.log('User not logged in, redirecting to login');
      toast.info('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      console.log('Toggling wishlist, inWishlist:', inWishlist);
      if (inWishlist) {
        console.log('Removing from wishlist...');
        await wishlistAPI.removeFromWishlist(productId);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        console.log('Adding to wishlist...', { productId, productType });
        const response = await wishlistAPI.addToWishlist(productId, productType);
        console.log('Add to wishlist response:', response.data);
        setInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.msg || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 24
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${inWishlist ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-white'}
        border-2
        ${inWishlist ? 'border-red-600' : 'border-gray-300'}
        rounded-full
        hover:scale-110
        transition-all
        duration-200
        shadow-md
        hover:shadow-lg
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        size={iconSizes[size]} 
        fill={inWishlist ? 'currentColor' : 'none'}
        className="transition-all"
      />
    </button>
  );
};

export default WishlistButton;

