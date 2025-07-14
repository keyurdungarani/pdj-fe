import React from 'react';
import { Check, Award, ShieldCheck, Users, Heart, Sparkles, Crown, Star } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
              Why Choose Love & Brilliance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Where timeless elegance meets exceptional craftsmanship. Discover why discerning customers trust us 
              with their most precious moments and treasured memories.
            </p>
          </div>
          
          {/* Legacy Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-primary/10 to-amber-50 p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-primary/20 p-4 rounded-full">
                <Heart size={48} className="text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{fontFamily: "'Playfair Display', serif"}}>
                  A Legacy of Love Stories
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  For generations, we've been the trusted custodians of love stories, celebrating life's most precious moments 
                  through exceptional jewelry. Our family of over 900 delighted customers speaks to our unwavering commitment 
                  to turning dreams into dazzling reality. Each piece we create becomes a cherished heirloom, carrying forward 
                  the beauty of your unique story.
                </p>
              </div>
            </div>
          </div>
          
          {/* Craftsmanship Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Crown size={36} className="text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                  Artistry Beyond Compare
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Sparkles size={20} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Master artisans with decades of experience create each piece using time-honored techniques passed down through generations of skilled craftspeople
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles size={20} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Every detail is meticulously handcrafted, ensuring that your jewelry possesses the soul and character that only comes from human artistry
                    </p>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Sparkles size={20} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      We blend traditional craftsmanship with contemporary design sensibilities to create pieces that are both timeless and modern
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles size={20} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Our workshop is where magic happens – where precious metals transform into symbols of love, celebration, and personal expression
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Value Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Star size={36} className="text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                  Exceptional Value & Transparency
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Direct relationships with master craftsmen and ethical suppliers ensure exceptional quality at fair prices
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Transparent pricing with detailed breakdowns, so you understand the true value of every component
                    </p>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      No hidden costs or surprise markups – our commitment to honesty builds lasting relationships
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Competitive market analysis ensures you receive the finest jewelry at the most favorable investment
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Personalized Experience Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users size={36} className="text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                  Your Vision, Our Passion
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Heart size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Personal consultation sessions where we listen to your dreams and translate them into stunning reality
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Custom design services that create one-of-a-kind pieces reflecting your unique style and story
                    </p>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Heart size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Dedicated jewelry consultants who guide you through every step of your journey with expertise and care
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Flexible design process that allows for refinements until your piece is absolutely perfect
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Quality Guarantee Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShieldCheck size={36} className="text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: "'Playfair Display', serif"}}>
                  Uncompromising Quality Promise
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Award size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Rigorous quality assurance at every stage ensures flawless finishing and lasting beauty
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Certified authenticity documentation for all precious metals, diamonds, and gemstones
                    </p>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Award size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Comprehensive lifetime care services including cleaning, maintenance, and repairs
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      Insurance and appraisal services to protect your precious investment for generations
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg shadow-lg text-white p-8 text-center">
            <h3 className="text-3xl font-semibold mb-4" style={{fontFamily: "'Playfair Display', serif"}}>
              Begin Your Love & Brilliance Journey
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Experience the difference that passion, expertise, and unwavering commitment to excellence can make. 
              Your perfect piece of jewelry awaits.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/book-appointment" 
                className="px-8 py-4 bg-white text-primary hover:bg-gray-100 font-semibold rounded-lg transition-colors shadow-lg"
              >
                Schedule Your Consultation
              </a>
              <a 
                href="/contact" 
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold rounded-lg transition-colors"
              >
                Speak with Our Experts
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
