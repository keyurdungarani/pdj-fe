import React from 'react';
import { Check, Award, ShieldCheck, Users } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
            Why Choose Us
          </h1>
          
          {/* Legacy Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="bg-primary/10 p-8 flex flex-col md:flex-row items-center gap-6">
              <Users size={60} className="text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  A Legacy of Delighted Customers
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We take pride in our family of over 900 satisfied customers who've trusted us with their precious moments. 
                  Each piece of jewelry we create becomes part of someone's story, and our growing customer base speaks to our 
                  commitment to excellence. Our customers return to us generation after generation, knowing their vision will 
                  be brought to life with exceptional care.
                </p>
              </div>
            </div>
          </div>
          
          {/* Craftsmanship Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Award size={36} className="text-primary flex-shrink-0" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Masters of Traditional Indian Craftsmanship
                </h2>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Our jewelry is crafted by traditional Indian artisans who carry forward centuries of heritage in their skilled hands
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Each craftsperson has learned their art through years of dedicated apprenticeship, preserving techniques passed down through generations
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    These master jewelers combine time-honored methods with contemporary precision to create pieces that honor both tradition and modern aesthetics
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Value Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Exceptional Value Without Compromise
                </h2>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Direct collaboration with master craftsmen eliminates unnecessary markups
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    We maintain the highest standards of quality while offering competitive prices
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Transparent pricing structure ensures you understand the value of every element in your piece
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Regular market analysis helps us offer you the best rates for precious metals and stones
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Quality Guarantee Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck size={36} className="text-primary flex-shrink-0" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Our Quality Guarantee
                </h2>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Every piece undergoes rigorous quality checks
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Certified authenticity for all precious metals and stones
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Detailed documentation provided with each purchase
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    Lifetime support and maintenance services available
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-6">Ready to Experience the Difference?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/book-appointment" 
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
              >
                Book a Consultation
              </a>
              <a 
                href="/contact" 
                className="px-8 py-3 border border-primary text-primary hover:bg-primary/5 font-medium rounded-md transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
