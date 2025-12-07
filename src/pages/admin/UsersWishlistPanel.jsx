import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  Package
} from 'lucide-react';
import { wishlistAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

const UsersWishlistPanel = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWishlist, setExpandedWishlist] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchWishlists();
  }, [pagination.page, searchTerm]);

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getAllWishlists({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      });
      
      setWishlists(response.data.wishlists);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      toast.error('Failed to fetch wishlists');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const toggleWishlist = (wishlistId) => {
    setExpandedWishlist(expandedWishlist === wishlistId ? null : wishlistId);
  };

  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.jewelry;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_API_URL || ''}${imagePath}`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users Wishlist</h1>
        <p className="text-gray-600">View all customer wishlists and their saved items</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by user name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Wishlists */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center items-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : wishlists.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Wishlists Found</h3>
            <p className="text-gray-500">No users have added items to their wishlist yet</p>
          </div>
        ) : (
          wishlists.map((wishlist) => {
            if (!wishlist.user) return null;
            
            const isExpanded = expandedWishlist === wishlist._id;
            const itemCount = wishlist.items.length;
            
            return (
              <div key={wishlist._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* User Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleWishlist(wishlist._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {wishlist.user.username || wishlist.user.email.split('@')[0]}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail size={14} className="mr-1" />
                            {wishlist.user.email}
                          </span>
                          {wishlist.user.phoneNumber && (
                            <span className="flex items-center">
                              <Phone size={14} className="mr-1" />
                              {wishlist.user.phoneNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center space-x-2">
                          <Heart className="text-red-500" size={20} fill="currentColor" />
                          <span className="text-2xl font-bold text-gray-900">{itemCount}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {itemCount === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Calendar size={16} className="inline mr-1" />
                        Updated {new Date(wishlist.updatedAt).toLocaleDateString()}
                      </div>
                      <ChevronRight 
                        className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        size={24} 
                      />
                    </div>
                  </div>
                </div>

                {/* Wishlist Items */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {itemCount === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        This wishlist is empty
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {wishlist.items.map((item) => {
                          if (!item.product) return null;
                          
                          const product = item.product;
                          const imageUrl = processImageUrl(product.mainImage);
                          const displayPrice = product.onSale && product.salePrice 
                            ? product.salePrice 
                            : product.price;
                          
                          return (
                            <div 
                              key={item._id} 
                              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="aspect-square relative bg-gray-100">
                                <img
                                  src={imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = PLACEHOLDER_IMAGES.jewelry;
                                  }}
                                />
                                {product.onSale && (
                                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    SALE
                                  </div>
                                )}
                                {product.countInStock === 0 && (
                                  <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                                    Out of Stock
                                  </div>
                                )}
                              </div>
                              <div className="p-3">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                  {product.name}
                                </h4>
                                <div className="flex items-baseline space-x-2 mb-2">
                                  <span className="text-lg font-bold text-primary">
                                    ${displayPrice?.toLocaleString()}
                                  </span>
                                  {product.onSale && product.salePrice && (
                                    <span className="text-xs text-gray-500 line-through">
                                      ${product.price?.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Package size={12} className="mr-1" />
                                    {product.productType}
                                  </span>
                                  <span>
                                    Added {new Date(item.addedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && wishlists.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm px-6 py-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersWishlistPanel;

