import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';
// import Logo from '../../assets/logo.png'; // Make sure to add a logo file

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    // { name: 'ENGAGEMENT', path: '/engagement' },
    // { name: 'WEDDING', path: '/wedding' },
    { name: 'DIAMONDS', path: '/diamonds' },
    { name: 'JEWELRY', path: '/jewelry' },
    { name: 'ABOUT US', path: '/why-choose-us' },
    { name: 'CONTACT', path: '/contact' },
  ];

  // Helper function to check if link is active
  const isLinkActive = (linkPath) => {
    return location.pathname === linkPath;
  };

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

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img 
            // src={Logo} 
            alt="PDJ Jewellery" 
            className="h-10 md:h-12"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGES.product;
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <div key={link.name} className="relative">
              <Link
                to={link.path}
                className={`text-sm font-medium hover:text-primary transition-colors pb-2 ${
                  isLinkActive(link.path) ? 'text-primary' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
              {isLinkActive(link.path) && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/book-appointment"
            className="bg-amber-200 hover:bg-amber-300 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            BOOK APPOINTMENT
          </Link>
          {/* <Link to="/cart" className="text-gray-700 hover:text-primary">
            <ShoppingBag size={24} />
          </Link> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium px-2 py-2 hover:bg-gray-100 rounded ${
                    isLinkActive(link.path) ? 'text-primary bg-primary/10' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/book-appointment"
                className="bg-amber-200 hover:bg-amber-300 text-gray-800 px-4 py-3 rounded text-sm font-medium text-center"
                onClick={closeMenu}
              >
                BOOK APPOINTMENT
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 rounded"
                onClick={closeMenu}
              >
                <ShoppingBag size={20} />
                <span className="text-sm font-medium">CART</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;