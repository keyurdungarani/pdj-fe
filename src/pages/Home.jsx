import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Diamond, Crown, Award } from 'lucide-react';
import Ring from '../components/icons/Ring';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const [featuredDiamonds, setFeaturedDiamonds] = useState([]);
  const [featuredRings, setFeaturedRings] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider content
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
      title: 'Timeless Elegance',
      subtitle: 'Discover our exquisite collection of handcrafted jewelry',
      link: '/diamonds',
      linkText: 'Shop Diamonds',
    },
    {
      image: 'https://images.unsplash.com/photo-1587467512961-120760940315?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
      title: 'Make It Personal',
      subtitle: 'Create your own custom jewelry with our expert craftsmen',
      link: '/custom-jewelry',
      linkText: 'Create Now',
    },
    {
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
      title: 'Wedding Perfection',
      subtitle: 'Find the perfect rings to celebrate your special day',
      link: '/rings',
      linkText: 'Explore Rings',
    }
  ];

  // Features content
  const features = [
    {
      icon: <Diamond className="h-10 w-10 text-primary" />,
      title: 'Exquisite Diamonds',
      description: 'Certified diamonds of exceptional quality and brilliance'
    },
    {
      icon: <Ring className="h-10 w-10 text-primary" />,
      title: 'Handcrafted Jewelry',
      description: 'Each piece meticulously crafted by master artisans'
    },
    {
      icon: <Crown className="h-10 w-10 text-primary" />,
      title: 'Custom Designs',
      description: 'Create your dream jewelry with our personalized service'
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: 'Quality Guaranteed',
      description: 'Lifetime support and maintenance for all purchases'
    }
  ];

  useEffect(() => {
    // Auto advance slider every 5 seconds
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // Update to use the correct API endpoints
        const response = await axios.get('/products?featured=true');
        
        // Filter products by category
        if (response.data && response.data.products) {
          const diamonds = response.data.products.filter(p => p.category === 'diamonds');
          const rings = response.data.products.filter(p => p.category === 'rings');
          
          setFeaturedDiamonds(diamonds.slice(0, 4) || []);
          setFeaturedRings(rings.slice(0, 4) || []);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Set empty arrays to prevent rendering errors
        setFeaturedDiamonds([]);
        setFeaturedRings([]);
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
    <div className="min-h-screen">
      {/* Hero Slider */}
      <div className="relative h-[70vh] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-8">{slide.subtitle}</p>
                <Link
                  to={slide.link}
                  className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors"
                >
                  {slide.linkText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-primary' : 'bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Diamonds */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Diamonds</h2>
            <Link
              to="/diamonds"
              className="flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredDiamonds.length > 0 ? (
              featuredDiamonds.map((diamond) => (
                <ProductCard key={diamond._id} product={diamond} type="diamonds" />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Loading featured diamonds...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Rings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Wedding & Engagement Rings</h2>
            <Link
              to="/rings"
              className="flex items-center text-primary hover:text-primary-dark font-medium"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredRings.length > 0 ? (
              featuredRings.map((ring) => (
                <ProductCard key={ring._id} product={ring} type="rings" />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Loading featured rings...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Custom Jewelry CTA */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Create Your Dream Jewelry</h2>
            <p className="text-lg text-gray-700 mb-8">
              Design a piece that's uniquely yours. Our master craftsmen will bring your vision to life 
              with exceptional attention to detail and the finest materials.
            </p>
            <Link
              to="/custom-jewelry"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md transition-colors"
            >
              Start Designing
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-6">A Legacy of Excellence</h2>
              <p className="text-gray-600 mb-6">
                For generations, we've been crafting exquisite jewelry that celebrates life's most precious moments.
                Our commitment to quality, craftsmanship, and customer satisfaction has earned us the trust of over
                900 delighted customers who return to us time and again.
              </p>
              <p className="text-gray-600 mb-8">
                Each piece we create is a testament to the skill of our master jewelers, who combine traditional
                techniques with contemporary design to create timeless treasures.
              </p>
              <Link
                to="/why-choose-us"
                className="inline-flex items-center text-primary hover:text-primary-dark font-bold"
              >
                Learn More About Us <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                alt="Jewelry Craftsmanship"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Piece?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Book a consultation with our jewelry experts who will guide you through our collection
            and help you find exactly what you're looking for.
          </p>
          <Link
            to="/book-appointment"
            className="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition-colors"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;