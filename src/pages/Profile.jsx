import React, { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  Calendar, 
  Settings,
  Mail,
  Phone,
  Edit2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI } from '../services/api';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlist, setWishlist] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [currentUser, navigate, activeTab]);

  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.jewelry;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_API_URL || ''}${imagePath}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-didot font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile, wishlist, and orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* User Info */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <User size={32} className="text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {currentUser.username || currentUser.name || 'User'}
                </h3>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        <button className="text-primary hover:text-primary-dark">
                          <Edit2 size={18} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User size={18} className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="text-gray-900">
                              {currentUser.firstName && currentUser.lastName
                                ? `${currentUser.firstName} ${currentUser.lastName}`
                                : currentUser.username || currentUser.name || 'Not set'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail size={18} className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{currentUser.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone size={18} className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900">{currentUser.phoneNumber || 'Not set'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <button
                          onClick={() => setActiveTab('wishlist')}
                          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Heart size={24} className="text-red-600" />
                            <span className="font-medium text-gray-900">Wishlist Items</span>
                          </div>
                          <span className="text-2xl font-bold text-red-600">
                            {wishlist?.items?.length || 0}
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveTab('orders')}
                          className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <ShoppingBag size={24} className="text-blue-600" />
                            <span className="font-medium text-gray-900">Total Orders</span>
                          </div>
                          <span className="text-2xl font-bold text-blue-600">0</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('appointments')}
                          className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Calendar size={24} className="text-green-600" />
                            <span className="font-medium text-gray-900">Appointments</span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">0</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">My Wishlist</h2>
                    <button
                      onClick={() => navigate('/wishlist')}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      View Full Wishlist
                    </button>
                  </div>

                  {wishlistLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                  ) : wishlist?.items?.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="mx-auto mb-4 text-gray-300" size={64} />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h3>
                      <p className="text-gray-500 mb-6">
                        Start adding items you love to your wishlist
                      </p>
                      <button
                        onClick={() => navigate('/jewelry')}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Browse Jewelry
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.items.slice(0, 6).map((item) => {
                        if (!item.product) return null;
                        const product = item.product;
                        const imageUrl = processImageUrl(product.mainImage);
                        const displayPrice = product.onSale && product.salePrice 
                          ? product.salePrice 
                          : product.price;

                        return (
                          <div
                            key={item._id}
                            onClick={() => navigate(`/jewelry/${product._id}`)}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                            </div>
                            <div className="p-3">
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                {product.name}
                              </h4>
                              <p className="text-lg font-bold text-primary">
                                ${displayPrice?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Orders</h2>
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto mb-4 text-gray-300" size={64} />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500">Your order history will appear here</p>
                  </div>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">My Appointments</h2>
                    <button
                      onClick={() => navigate('/book-appointment')}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Book New Appointment
                    </button>
                  </div>
                  <div className="text-center py-12">
                    <Calendar className="mx-auto mb-4 text-gray-300" size={64} />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments</h3>
                    <p className="text-gray-500">Your upcoming appointments will appear here</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                      <button className="text-primary hover:text-primary-dark font-medium">
                        Change Password
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded text-primary" defaultChecked />
                          <span className="text-gray-700">Email notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded text-primary" defaultChecked />
                          <span className="text-gray-700">Order updates</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded text-primary" />
                          <span className="text-gray-700">Promotional emails</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

