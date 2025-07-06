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
import { featuredImagesAPI } from '../services/api';

const Home = () => {
  const [featuredDiamonds, setFeaturedDiamonds] = useState([]);
  const [featuredJewelry, setFeaturedJewelry] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(true);

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

  // Customer testimonials
  const testimonials = [
    {
      name: "Sarah Mitchell",
      location: "London",
      rating: 5,
      text: "Absolutely stunning craftsmanship. The team helped me create the perfect engagement ring that exceeded all expectations.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c0763e11?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "James Wilson",
      location: "Manchester", 
      rating: 5,
      text: "Outstanding service from start to finish. The quality is exceptional and the attention to detail is remarkable.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Emma Thompson",
      location: "Birmingham",
      rating: 5,
      text: "Beautiful jewelry and wonderful customer experience. I couldn't be happier with my custom necklace.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
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

  // Product categories
  const categories = [
    {
      title: 'Engagement Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/jewelry?category=engagement',
      description: 'Begin your love story'
    },
    {
      title: 'Wedding Bands',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/jewelry?category=wedding',
      description: 'Symbols of eternal love'
    },
    {
      title: 'Premium Diamonds',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/diamonds',
      description: 'Exceptional brilliance'
    },
    {
      title: 'Fine Jewelry',
      image: 'https://images.unsplash.com/photo-1587467512961-120760940315?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      link: '/jewelry',
      description: 'Elegant pieces for every occasion'
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

    fetchFeaturedImages();
  }, []);

  // Get current slides (featured images or fallback)
  const getCurrentSlides = () => {
    if (featuredImages.length > 0) {
      return featuredImages.map(img => ({
        image: img.imageUrl,
        title: img.title,
        subtitle: img.subtitle,
        linkUrl: img.linkUrl || '/jewelry',
        linkText: img.linkText || 'Learn More',
        category: img.category || 'Featured'
      }));
    }
    return fallbackHeroSlides;
  };

  const heroSlides = getCurrentSlides();

  useEffect(() => {
    // Auto advance hero slider
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

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
        const jewelryResponse = await axios.get(`${import.meta.env.VITE_LOCAL_API || 'http://localhost:8081'}/products?featured=true&productType=jewelry&limit=4&sort=-createdAt`);
        
        // Fetch featured diamond products (including lab-grown and natural diamonds)
        const diamondResponse = await axios.get(`${import.meta.env.VITE_LOCAL_API || 'http://localhost:8081'}/products?featured=true&productType=diamond&limit=4&sort=-createdAt`);
        
        // Also fetch lab-grown diamonds
        const labGrownResponse = await axios.get(`${import.meta.env.VITE_LOCAL_API || 'http://localhost:8081'}/products?featured=true&productType=lab-grown&limit=4&sort=-createdAt`);
        
        // Also fetch natural diamonds
        const naturalDiamondResponse = await axios.get(`${import.meta.env.VITE_LOCAL_API || 'http://localhost:8081'}/products?featured=true&productType=natural-diamond&limit=4&sort=-createdAt`);
        
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

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Enhanced Design */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>
            
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
                      {slide.category}
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={slide.linkUrl}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-all duration-300 group"
                >
                  {slide.linkText}
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/book-appointment"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      Book Consultation
                </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 border border-white/20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Service Features */}
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections, each piece crafted with exceptional attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
            <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-lg aspect-square bg-white shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
            </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Diamond Shapes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">Shop Diamonds by Shape</h2>
            <p className="text-lg text-gray-600">Each shape offers its own unique character and brilliance</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {diamondShapes.map((shape, index) => (
              <Link
                key={index}
                to={`/diamonds?shape=${shape.name.toLowerCase()}`}
                className="group relative p-6 bg-gray-50 hover:bg-primary/5 rounded-lg text-center transition-all duration-300 hover:shadow-md"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Diamond className="w-6 h-6 text-primary" />
              </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {shape.name}
                </h3>
                {shape.popular && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
            )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jewelry Collection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">Featured Jewelry Collection</h2>
              <p className="text-gray-600">Handpicked jewelry pieces showcasing exceptional craftsmanship</p>
            </div>
            <Link
              to="/jewelry"
              className="hidden sm:flex items-center text-primary hover:text-primary-dark font-medium group"
            >
              View All
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All Collection
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Diamonds Collection */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">Featured Diamonds Collection</h2>
              <p className="text-gray-600">Exceptional diamonds with superior cut, clarity, and brilliance</p>
            </div>
            <Link
              to="/diamonds"
              className="hidden sm:flex items-center text-primary hover:text-primary-dark font-medium group"
            >
              View All
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All Diamonds
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Join over 30,000+ delighted customers worldwide</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    currentTestimonial === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl lg:text-2xl text-gray-900 font-light leading-relaxed mb-8 italic">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center justify-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTestimonial === index ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light mb-6">Create Something Truly Unique</h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Work with our master craftsmen to design a bespoke piece that reflects your personal style 
                and celebrates your most precious moments. From initial concept to final creation, 
                we'll guide you through every step of the process.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-white/80" />
                  <span>Personal design consultation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-white/80" />
                  <span>3D visualization and prototyping</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-white/80" />
                  <span>Handcrafted by master jewelers</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/custom-jewelry"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-md hover:bg-gray-100 transition-colors"
                >
                  Start Your Design
                </Link>
              <Link
                  to="/book-appointment"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
              >
                  Book Consultation
              </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Jewelry Craftsmanship"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Visit our showroom or book a virtual consultation with our jewelry experts 
            who will guide you through our collection and help you find the perfect piece.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Our Showroom</h3>
              <p className="text-gray-400">Experience our collection in person</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Our Experts</h3>
              <p className="text-gray-400">Speak with our jewelry specialists</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Virtual Consultation</h3>
              <p className="text-gray-400">Book an online appointment</p>
            </div>
          </div>

          <Link
            to="/book-appointment"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors text-lg"
          >
            Book Your Appointment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;