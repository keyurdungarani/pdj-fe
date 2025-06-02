import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission would be implemented here
    alert('Thank you for your message. This feature is currently under development.');
  };

  return (
    <div className="container mx-auto pt-24 px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-6">
            We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required 
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone (optional)</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                rows="4" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              ></textarea>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-center text-amber-800">
                Contact form submission is currently under development.
              </p>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-amber-500 text-white font-medium py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Visit Our Store</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Address</h3>
            <p className="text-gray-700">123 Jewelry Lane</p>
            <p className="text-gray-700">London, UK</p>
            <p className="text-gray-700">WC1X 9JY</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Opening Hours</h3>
            <p className="text-gray-700">Monday - Friday: 10:00 AM - 7:00 PM</p>
            <p className="text-gray-700">Saturday: 10:00 AM - 5:00 PM</p>
            <p className="text-gray-700">Sunday: Closed</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Contact Information</h3>
            <p className="text-gray-700">Phone: +44 20 1234 5678</p>
            <p className="text-gray-700">Email: info@pdjjewellery.com</p>
          </div>
          
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-600">Map will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 