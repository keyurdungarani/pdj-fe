import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Diamond, 
  Crown, 
  Award,
  Truck,
  Shield,
  RefreshCw,
  CheckCircle,
  Star,
  Heart,
  Sparkles,
  Users,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import Ring from '../components/icons/Ring';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import DiamondCard from '../components/products/DiamondCard';
import { featuredImagesAPI, shopCategoriesAPI, customerReviewsAPI } from '../services/api';

const Home = () => {
  const [featuredDiamonds, setFeaturedDiamonds] = useState([]);
  const [featuredJewelry, setFeaturedJewelry] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [shopCategories, setShopCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Fallback hero slides if no featured images are available
  const fallbackHeroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Timeless Elegance',
      subtitle: 'Discover our exquisite collection of handcrafted jewelry that celebrates life\'s most precious moments',
      linkUrl: '/diamonds',
      linkText: 'Explore Collection',
      category: 'Premium Diamonds'
    },
    {
      image: 'https://images.unsplash.com/photo-1587467512961-120760940315?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Bespoke Creations',
      subtitle: 'Create your perfect piece with our master craftsmen using the finest materials and traditional techniques',
      linkUrl: '/custom-jewelry',
      linkText: 'Start Designing',
      category: 'Custom Design'
    },
    {
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      title: 'Love Stories Begin',
      subtitle: 'Find the perfect engagement and wedding rings to mark your journey together',
      linkUrl: '/jewelry',
      linkText: 'Shop Rings',
      category: 'Engagement & Wedding'
    }
  ];

  // Fallback customer testimonials if no API data is available
  const fallbackTestimonials = [
    {
      customerName: "Sarah Mitchell",
      customerLocation: "London",
      rating: 5,
      reviewText: "Absolutely stunning craftsmanship. The team helped me create the perfect engagement ring that exceeded all expectations.",
      customerImage: "https://images.unsplash.com/photo-1494790108755-2616c0763e11?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      customerName: "James Wilson",
      customerLocation: "Manchester", 
      rating: 5,
      reviewText: "Outstanding service from start to finish. The quality is exceptional and the attention to detail is remarkable.",
      customerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      customerName: "Emma Thompson",
      customerLocation: "Birmingham",
      rating: 5,
      reviewText: "Beautiful jewelry and wonderful customer experience. I couldn't be happier with my custom necklace.",
      customerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  // Service features inspired by Queensmith
  const serviceFeatures = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Free Worldwide Delivery',
      description: 'Complimentary shipping on all orders'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Lifetime Warranty',
      description: 'Comprehensive protection for your investment'
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: 'Free Resizing',
      description: 'Perfect fit guarantee for life'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Certified Quality',
      description: 'All diamonds independently certified'
    }
  ];

  // Product categories (standardized naming)
  const categories = [
    {
      title: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/jewelry?category=ring',
      description: 'Begin your love story'
    },
    {
      title: 'Bands',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/jewelry?category=band',
      description: 'Symbols of eternal love'
    },
    {
      title: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/jewelry?category=necklace',
      description: 'Elegant necklaces for every occasion'
    },
    {
      title: 'Premium Diamonds',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/diamonds',
      description: 'Exceptional brilliance'
    }
  ];

  // Diamond shapes
  const diamondShapes = [
    { name: 'Round', popular: true },
    { name: 'Oval', popular: true },
    { name: 'Princess', popular: false },
    { name: 'Emerald', popular: false },
    { name: 'Cushion', popular: true },
    { name: 'Pear', popular: false },
    { name: 'Heart', popular: false },
    { name: 'Marquise', popular: false }
  ];

  useEffect(() => {
    // Fetch featured images for hero slider
    const fetchFeaturedImages = async () => {
      setImagesLoading(true);
      try {
        const response = await featuredImagesAPI.getCurrent();
        if (response.data.success && response.data.images) {
          setFeaturedImages(response.data.images);
        }
      } catch (error) {
        console.error('Error fetching featured images:', error);
        // Will use fallback slides
      } finally {
        setImagesLoading(false);
      }
    };

    // Fetch shop categories
    const fetchShopCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await shopCategoriesAPI.getActive();
        if (response.data.success && response.data.categories) {
          setShopCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching shop categories:', error);
        // Will use fallback categories
      } finally {
        setCategoriesLoading(false);
      }
    };

    // Fetch customer testimonials
    const fetchTestimonials = async () => {
      setTestimonialsLoading(true);
      try {
        const response = await customerReviewsAPI.getActive(10, false); // Get up to 10 active reviews
        if (response.data.success && response.data.data && response.data.data.reviews && response.data.data.reviews.length > 0) {
          setTestimonials(response.data.data.reviews);
        } else {
          // Use fallback testimonials if no API data
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Use fallback testimonials on error
        setTestimonials(fallbackTestimonials);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchFeaturedImages();
    fetchShopCategories();
    fetchTestimonials();
  }, []);

  // Get current slides (featured images or fallback)
  const getCurrentSlides = () => {
    // If we're still loading, return empty array to prevent blinking
    if (imagesLoading) {
      return [];
    }
    
    // If we have featured images from API, use them
    if (featuredImages.length > 0) {
      return featuredImages.map(img => ({
        image: img.imageUrl,
        title: img.title,
        subtitle: img.subtitle,
        linkUrl: img.linkUrl ? img.linkUrl : img.category === 'Diamonds' ? '/diamonds' : '/jewelry',
        linkText: img.linkText || 'Learn More',
        category: img.category || 'Featured'
      }));
    }
    
    // Only show fallback slides if loading is complete and no API images
    return fallbackHeroSlides;
  };

  const heroSlides = getCurrentSlides();

  useEffect(() => {
    // Only start the timer if we have slides to show
    if (heroSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  // Reset slide index when slides change
  useEffect(() => {
    if (heroSlides.length > 0 && currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length, currentSlide]);

  useEffect(() => {
    // Auto advance testimonials
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch featured jewelry products
        const jewelryResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/products?featured=true&productType=jewelry&limit=4&sort=-createdAt`);
        
        // Fetch featured diamond products (including lab-grown and natural diamonds)
        const diamondResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/products?featured=true&productType=diamond&limit=4&sort=-createdAt`);
        
        // Also fetch lab-grown diamonds
        const labGrownResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/products?featured=true&productType=lab-grown&limit=4&sort=-createdAt`);
        
        // Also fetch natural diamonds
        const naturalDiamondResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/products?featured=true&productType=natural-diamond&limit=4&sort=-createdAt`);
        
        if (jewelryResponse.data && jewelryResponse.data.products) {
          setFeaturedJewelry(jewelryResponse.data.products || []);
        }
        
        // Combine all diamond types and get the last 4
        const allDiamonds = [
          ...(diamondResponse.data?.products || []),
          ...(labGrownResponse.data?.products || []),
          ...(naturalDiamondResponse.data?.products || [])
        ];
        
        // Sort by creation date (newest first) and take the last 4
        const sortedDiamonds = allDiamonds
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        
        setFeaturedDiamonds(sortedDiamonds);
        
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedDiamonds([]);
        setFeaturedJewelry([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Get current categories (API-fetched or fallback)
  const getCurrentCategories = () => {
    if (shopCategories.length > 0) {
      return shopCategories.map(cat => ({
        title: cat.title,
        image: cat.imageUrl,
        link: cat.linkUrl,
        description: cat.description || 'Discover our collection'
      }));
    }
    return categories; // fallback categories
  };

  const displayCategories = getCurrentCategories();

  const nextCategorySlide = () => {
    const maxSlide = Math.ceil(displayCategories.length / 4) - 1;
    setCurrentCategorySlide((prev) => (prev === maxSlide ? 0 : prev + 1));
  };

  const prevCategorySlide = () => {
    const maxSlide = Math.ceil(displayCategories.length / 4) - 1;
    setCurrentCategorySlide((prev) => (prev === 0 ? maxSlide : prev - 1));
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      
      {/* Hero Section - Professional Jewelry Website Design */}
      <section className="relative h-screen overflow-hidden group">
        {/* Loading State */}
        {imagesLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="font-montserrat text-white/70 text-sm">Loading...</p>
            </div>
          </div>
        )}

        {/* Hero Slides */}
        {!imagesLoading && heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Subtle gradient overlay - lighter to not overpower the image */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            
            <div className="relative h-full flex items-end pb-16 sm:pb-20 lg:pb-24">
              <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="max-w-xl">
                  {/* Category badge */}
                  <div className="mb-3 sm:mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-montserrat font-medium border border-white/30">
                      <span className="w-1 h-1 bg-white rounded-full mr-1.5 animate-pulse"></span>
                      {slide.category}
                    </span>
                  </div>
                  
                  {/* Main heading - HIGH-CONTRAST SERIF FOR IMPACT */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-didot font-medium text-white mb-3 sm:mb-4 leading-tight tracking-wide">
                    {slide.title}
                  </h3>
                  
                  {/* Subtitle - CLEAN SANS-SERIF FOR READABILITY */}
                  <p className="text-sm sm:text-base lg:text-lg font-montserrat text-white/90 mb-5 sm:mb-6 leading-relaxed font-light">
                    {slide.subtitle}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                    <Link
                      to={slide.linkUrl}
                      className="group inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 font-montserrat font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="text-xs sm:text-sm">{slide.linkText}</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                    <Link
                      to="/book-appointment"
                      className="group inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-white/80 text-white font-montserrat font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
                    >
                      <span className="text-xs sm:text-sm">Book Consultation</span>
                      <div className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <ArrowRight className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced navigation buttons */}
        {!imagesLoading && heroSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 z-30"
            >
              <ChevronLeft size={16} className="lg:w-5 lg:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 z-30"
            >
              <ChevronRight size={16} className="lg:w-5 lg:h-5" />
            </button>
          </>
        )}

        {/* Enhanced slide indicators - positioned at bottom center */}
        {!imagesLoading && heroSlides.length > 1 && (
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  currentSlide === index 
                    ? 'w-8 h-2 bg-white rounded-full' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75 rounded-full hover:scale-125'
                }`}
              >
                {currentSlide === index && (
                  <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Service Features - BASKERVILLE FOR SUBHEADS, MONTSERRAT FOR BODY */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 group-hover:bg-primary/10 rounded-full mb-4 transition-colors duration-300">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-baskerville font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="font-montserrat text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category - DIDOT FOR MAIN HEADING, MONTSERRAT FOR BODY */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 md:mb-16">
            <div className="text-center flex-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-didot font-medium text-gray-900 mb-3 md:mb-4">Shop by Category</h2>
              <p className="text-base md:text-lg font-montserrat text-gray-600 max-w-2xl mx-auto">
                Discover our carefully curated collections, each piece crafted with exceptional attention to detail
              </p>
            </div>
            
            {/* Navigation buttons for slider */}
            {displayCategories.length > 4 && (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={prevCategorySlide}
                  className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={nextCategorySlide}
                  className="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm hover:shadow-md"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded mx-auto w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCategorySlide * 100}%)` }}
              >
                {/* Create slides of 4 categories each */}
                {Array.from({ length: Math.ceil(displayCategories.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      {displayCategories
                        .slice(slideIndex * 4, slideIndex * 4 + 4)
                        .map((category, index) => (
                          <Link
                            key={slideIndex * 4 + index}
                            to={category.link}
                            className="group text-center"
                          >
                            {/* Image Container - Rounded corners like Tanishq */}
                            <div className="aspect-square relative overflow-hidden rounded-lg mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                              <img
                                src={category.image}
                                alt={category.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              
                              {/* Subtle hover overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                            </div>
                            
                            {/* Title Below Image - BASKERVILLE FOR CATEGORY TITLES */}
                            <h3 className="text-lg md:text-xl font-baskerville font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">
                              {category.title}
                            </h3>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile navigation dots */}
              {displayCategories.length > 4 && (
                <div className="flex justify-center mt-6 space-x-2 md:hidden">
                  {Array.from({ length: Math.ceil(displayCategories.length / 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCategorySlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentCategorySlide === index ? 'bg-primary w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Diamond Shapes - DIDOT FOR HEADING, MONTSERRAT FOR BODY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-didot font-medium text-gray-900 mb-4">Shop Diamonds by Shape</h2>
            <p className="text-lg font-montserrat text-gray-600">Each shape offers its own unique character and brilliance</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {diamondShapes.map((shape, index) => {
              // Diamond shape SVG components
              const DiamondShapeIcon = ({ shapeName }) => {
                const shapeComponents = {
                  'Round': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  ),
                  'Oval': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <ellipse cx="50" cy="50" rx="25" ry="35" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <ellipse cx="50" cy="50" rx="18" ry="25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <ellipse cx="50" cy="50" rx="12" ry="18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  ),
                  'Princess': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <rect x="28" y="28" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <rect x="35" y="35" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                      <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                      <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  ),
                  'Emerald': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <polygon points="25,20 75,20 80,25 80,75 75,80 25,80 20,75 20,25" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <polygon points="32,28 68,28 72,32 72,68 68,72 32,72 28,68 28,32" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <polygon points="38,35 62,35 65,38 65,62 62,65 38,65 35,62 35,38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  ),
                  'Cushion': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <rect x="20" y="20" width="60" height="60" rx="15" ry="15" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <rect x="28" y="28" width="44" height="44" rx="10" ry="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <rect x="35" y="35" width="30" height="30" rx="7" ry="7" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  ),
                  'Pear': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <path d="M50,15 C65,15 75,25 75,40 C75,55 65,65 50,85 C35,65 25,55 25,40 C25,25 35,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M50,25 C60,25 67,32 67,42 C67,52 60,59 50,72 C40,59 33,52 33,42 C33,32 40,25 50,25 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <path d="M50,32 C55,32 60,37 60,42 C60,47 55,52 50,62 C45,52 40,47 40,42 C40,37 45,32 50,32 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  ),
                  'Heart': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <path d="M50,80 C50,80 20,50 20,35 C20,25 28,20 35,20 C42,20 50,25 50,35 C50,25 58,20 65,20 C72,20 80,25 80,35 C80,50 50,80 50,80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M50,70 C50,70 28,47 28,37 C28,30 33,27 37,27 C41,27 50,30 50,37 C50,30 59,27 63,27 C67,27 72,30 72,37 C72,47 50,70 50,70 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                    </svg>
                  ),
                  'Marquise': (
                    <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                      <path d="M50,15 C65,15 80,30 80,50 C80,70 65,85 50,85 C35,85 20,70 20,50 C20,30 35,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M50,25 C60,25 70,35 70,50 C70,65 60,75 50,75 C40,75 30,65 30,50 C30,35 40,25 50,25 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                      <path d="M50,35 C55,35 60,40 60,50 C60,60 55,65 50,65 C45,65 40,60 40,50 C40,40 45,35 50,35 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                    </svg>
                  )
                };
                
                return shapeComponents[shapeName] || (
                  <svg viewBox="0 0 100 100" className="w-12 h-12 text-primary">
                    <polygon points="50,15 65,35 80,50 65,65 50,85 35,65 20,50 35,35" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                );
              };

              return (
                <Link
                  key={index}
                  to={`/diamonds?shape=${shape.name.toLowerCase()}`}
                  className="group relative p-6 bg-gray-50 hover:bg-primary/5 rounded-lg text-center transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <DiamondShapeIcon shapeName={shape.name} />
                  </div>
                  <h3 className="text-sm font-baskerville font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {shape.name}
                  </h3>
                  {shape.popular && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jewelry Collection - DIDOT FOR HEADING, MONTSERRAT FOR BODY */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-didot font-medium text-gray-900 mb-2">Featured Jewelry Collection</h2>
              <p className="font-montserrat text-gray-600">Handpicked jewelry pieces showcasing exceptional craftsmanship</p>
            </div>
            <Link
              to="/jewelry"
              className="hidden sm:flex items-center font-montserrat text-primary hover:text-primary-dark font-medium group"
            >
              View All
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid layout: 2 items per row on mobile (like Tanishq), 4 on larger screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {featuredJewelry.length > 0 ? (
              featuredJewelry.map((item) => (
                <ProductCard key={item._id} product={item} type="jewelry" />
              ))
            ) : (
              // Placeholder cards
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
              </div>
              ))
            )}
          </div>

          <div className="text-center sm:hidden">
            <Link
              to="/jewelry"
              className="inline-flex items-center font-montserrat text-primary hover:text-primary-dark font-medium"
            >
              View All Collection
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Diamonds Collection - DIDOT FOR HEADING, MONTSERRAT FOR BODY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-didot font-medium text-gray-900 mb-2">Featured Diamonds Collection</h2>
              <p className="font-montserrat text-gray-600">Exceptional diamonds with superior cut, clarity, and brilliance</p>
            </div>
            <Link
              to="/diamonds"
              className="hidden sm:flex items-center font-montserrat text-primary hover:text-primary-dark font-medium group"
            >
              View All
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid layout: 2 items per row on mobile (like Tanishq), 4 on larger screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {featuredDiamonds.length > 0 ? (
              featuredDiamonds.map((item) => (
                <DiamondCard key={item._id} diamond={item} type="diamonds" />
              ))
            ) : (
              // Placeholder cards
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center sm:hidden">
            <Link
              to="/diamonds"
              className="inline-flex items-center font-montserrat text-primary hover:text-primary-dark font-medium"
            >
              View All Diamonds
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials - DIDOT FOR HEADING, ELEGANT SCRIPT FOR ACCENTS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <div className="flex items-center justify-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xs font-montserrat text-gray-500 font-medium tracking-wide uppercase">Trusted by 900+ happy customers</p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-didot font-medium text-gray-900 mb-4 leading-tight">
              What Our Customers Say
            </h2>
            <p className="text-lg font-montserrat text-gray-600 max-w-2xl mx-auto">
              Discover why our customers choose us for their most precious moments
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Main testimonial display */}
            <div className="relative mb-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-in-out ${
                    currentTestimonial === index 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 absolute inset-0 transform translate-y-4'
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 relative">
                    {/* Decorative quote mark */}
                    <div className="absolute -top-4 left-6">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                        </svg>
                      </div>
                    </div>

                    <div className="text-center pt-4">
                      {/* Star rating */}
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current mx-0.5" />
                        ))}
                      </div>

                      {/* Review text - ELEGANT SCRIPT FOR ACCENT */}
                      <blockquote className="text-xl lg:text-2xl font-elegant-script text-gray-800 font-light leading-relaxed mb-6 max-w-3xl mx-auto">
                        "{testimonial.reviewText}"
                      </blockquote>

                      {/* Customer info */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                            <span className="text-white font-montserrat font-semibold text-sm">
                              {testimonial.customerName?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-baskerville font-semibold text-gray-900">{testimonial.customerName}</div>
                            <div className="font-montserrat text-gray-500 text-sm flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {testimonial.customerLocation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center items-center space-x-2 mb-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 ${
                    currentTestimonial === index 
                      ? 'w-8 h-2 bg-primary rounded-full' 
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full hover:scale-125'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Trust indicators - BASKERVILLE FOR SUBHEADS, MONTSERRAT FOR BODY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-baskerville font-semibold text-gray-900 mb-1 text-sm">Verified Reviews</h3>
                <p className="font-montserrat text-gray-600 text-xs">All reviews are from genuine customers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-baskerville font-semibold text-gray-900 mb-1 text-sm">Award Winning</h3>
                <p className="font-montserrat text-gray-600 text-xs">Recognized for excellence in jewelry</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-baskerville font-semibold text-gray-900 mb-1 text-sm">Customer Love</h3>
                <p className="font-montserrat text-gray-600 text-xs">98% customer satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA - DIDOT FOR HEADING, MONTSERRAT FOR BODY */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-didot font-medium mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-lg font-montserrat text-gray-300 mb-12 max-w-2xl mx-auto">
            Visit our showroom or book a virtual consultation with our jewelry experts 
            who will guide you through our collection and help you find the perfect piece.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-baskerville font-semibold mb-2">Visit Our Showroom</h3>
              <p className="font-montserrat text-gray-400">Experience our collection in person</p>
            </div>
            <div className="text-center">
              <a 
                href="tel:+1234567890" 
                className="inline-block hover:transform hover:scale-105 transition-transform duration-200"
              >
                <div className="w-16 h-16 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-baskerville font-semibold mb-2 hover:text-primary transition-colors">Call Our Experts</h3>
                <p className="font-montserrat text-gray-400">Speak with our jewelry specialists</p>
              </a>
            </div>
            <div className="text-center">
              <a 
                href="mailto:info@pdjjewellery.com?subject=Virtual%20Consultation%20Request&body=Hello,%20I%20would%20like%20to%20schedule%20a%20virtual%20consultation." 
                className="inline-block hover:transform hover:scale-105 transition-transform duration-200"
              >
                <div className="w-16 h-16 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-baskerville font-semibold mb-2 hover:text-primary transition-colors">Virtual Consultation</h3>
                <p className="font-montserrat text-gray-400">Book an online appointment</p>
              </a>
            </div>
          </div>

          <Link
            to="/book-appointment"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-dark text-white font-montserrat font-semibold rounded-md transition-colors text-lg"
          >
            Book Your Virtual Appointment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;