import React, { useState, useRef, useEffect } from 'react';
import { User, Heart, ShoppingBag, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CustomerLoginModal from '../common/CustomerLoginModal';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    setIsOpen(false);
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 hover:text-primary transition-colors"
        >
          <User size={20} />
          <span className="hidden md:block text-sm font-medium">
            {currentUser ? (currentUser.username || currentUser.name || 'Account') : 'Sign In'}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {currentUser ? (
              // Logged in menu
              <>
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Account</p>
                  <p className="font-semibold text-gray-900">
                    {currentUser.username || currentUser.name || currentUser.email}
                  </p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <User size={18} className="text-gray-600" />
                    <span className="text-gray-800">My Profile</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/wishlist')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <Heart size={18} className="text-gray-600" />
                    <span className="text-gray-800">My Wishlist</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/orders')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <ShoppingBag size={18} className="text-gray-600" />
                    <span className="text-gray-800">My Orders</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/book-appointment')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  >
                    <Settings size={18} className="text-gray-600" />
                    <span className="text-gray-800">Appointments</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 transition-colors text-red-600"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              // Not logged in menu
              <div className="p-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Your Account</p>
                
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg mb-3 transition-colors"
                >
                  Sign In
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/register');
                  }}
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-lg border-2 border-gray-300 transition-colors"
                >
                  Create an Account
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Quick Links</p>
                  <button
                    onClick={() => handleNavigate('/book-appointment')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => handleNavigate('/contact')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Modal */}
      <CustomerLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        autoTrigger={false}
      />
    </>
  );
};

export default ProfileDropdown;

