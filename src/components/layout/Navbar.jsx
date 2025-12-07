import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'DIAMONDS', path: '/diamonds' },
    { name: 'JEWELRY', path: '/jewelry' },
    { name: 'ABOUT US', path: '/about-us' },
    { name: 'CONTACT', path: '/contact' },
  ];

  // Helper function to check if link is active
  const isLinkActive = (linkPath) => {
    return location.pathname === linkPath;
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Dynamic navbar styling based on page and scroll state
  const getNavbarClasses = () => {
    return scrolled 
      ? 'bg-white shadow-md py-2' 
      : 'bg-white shadow-sm py-4';
  };

  // Dynamic text color - always consistent
  const getTextColor = (isActive = false) => {
    return isActive ? 'text-primary' : 'text-gray-700 hover:text-primary';
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarClasses()}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo - DIDOT FOR BRAND NAME */}
        <Link to="/" className="flex-shrink-0">
          <div className="relative">
            <h1 
              className="text-2xl font-medium tracking-wider text-gray-800 hover:text-primary transition-colors duration-300"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                letterSpacing: '1.5px',
                color: '#2C2C2C',
                fontSize: '24px'
              }}
            >
              LOVE & BRILLIANCE
            </h1>
            {/* Decorative underline */}
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-amber-400 to-primary opacity-60"></div>
          </div>
        </Link>

        {/* Desktop Navigation - BASKERVILLE FOR NAVIGATION LINKS */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <Link
                to={link.path}
                className={`text-sm font-baskerville font-medium transition-colors pb-2 ${getTextColor(isLinkActive(link.path))}`}
              >
                {link.name}
              </Link>
              {isLinkActive(link.path) && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons - MONTSERRAT FOR UI BUTTONS */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/wishlist"
            className="relative text-gray-700 hover:text-primary transition-colors p-2"
            title="Wishlist"
          >
            <Heart size={22} />
          </Link>
          
          <ProfileDropdown />
          
          <Link
            to="/book-appointment"
            className="bg-amber-200 hover:bg-amber-300 text-gray-800 px-4 py-2 rounded text-sm font-montserrat font-medium transition-colors"
          >
            BOOK APPOINTMENT
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - BASKERVILLE FOR NAVIGATION, MONTSERRAT FOR BUTTONS */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-baskerville font-medium px-2 py-2 hover:bg-gray-100 rounded ${
                    isLinkActive(link.path) ? 'text-primary bg-primary/10' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/book-appointment"
                className="bg-amber-200 hover:bg-amber-300 text-gray-800 px-4 py-3 rounded text-sm font-montserrat font-medium text-center"
                onClick={closeMenu}
              >
                BOOK APPOINTMENT
              </Link>
              {/* <Link 
                to="/cart" 
                className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 rounded"
                onClick={closeMenu}
              >
                <ShoppingBag size={20} />
                <span className="text-sm font-medium">CART</span>
              </Link> */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;