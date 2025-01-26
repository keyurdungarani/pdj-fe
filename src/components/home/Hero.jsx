// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh]">
        {/* Background Video - Replace src with your video */}
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
          src="/diamond-video-bg.mp4"
        >
          {/* Fallback image if video doesn't load */}
          <img 
            src="/hero-fallback.jpg" 
            alt="Luxury Diamonds" 
            className="w-full h-full object-cover"
          />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center text-white">
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            Exquisite Jewelry for<br />
            Life's Special Moments
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl">
            Discover our collection of handcrafted diamonds and jewelry pieces, 
            created by master artisans with centuries of tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/diamonds" 
              className="group flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 text-lg rounded-full hover:bg-gray-100 transition-all w-full sm:w-auto"
            >
              Explore Diamonds
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/book-appointment" 
              className="group flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 text-lg rounded-full hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              Book Consultation
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collection Cards */}
            <CollectionCard 
              title="CVD Diamonds"
              image="/diamonds.jpg"
              description="Ethically sourced, lab-grown diamonds of exceptional quality"
              link="/diamonds"
            />
            <CollectionCard 
              title="Wedding Rings"
              image="/wedding-rings.jpg"
              description="Timeless designs for your special day"
              link="/wedding-rings"
            />
            <CollectionCard 
              title="Custom Jewelry"
              image="/custom-jewelry.jpg"
              description="Bespoke pieces crafted to your unique vision"
              link="/custom-jewelry"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCarrd 
              icon={<Star />}
              title="Expert Craftsmanship"
              description="Traditional artisans with generations of expertise"
            />
            {/* Add more feature cards */}
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function CollectionCard({ title, image, description, link }) {
  return (
    <Link to={link} className="group relative overflow-hidden rounded-lg aspect-[3/4]">
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-light mb-2">{title}</h3>
          <p className="text-sm text-gray-200 mb-4">{description}</p>
          <span className="inline-flex items-center text-sm">
            Explore Collection
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeatureCarrd({ icon, title, description }) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;