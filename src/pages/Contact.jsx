import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, AlertCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const response = await contactAPI.create({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || undefined, // Email is optional
        message: data.message
      });

      setSubmitStatus({
        success: true,
        message: response.data.message || 'Thank you for contacting us! We will get back to you soon.'
      });
      
      // Reset the form on success
      reset();
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with us for any questions about our jewelry collection or services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              
              {/* Status Message */}
              {submitStatus.message && (
                <div 
                  className={`p-4 rounded-md mb-6 ${
                    submitStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {submitStatus.success ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{submitStatus.message}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input 
                    type="text" 
                    {...register('fullName', { 
                      required: 'Full name is required',
                      maxLength: {
                        value: 100,
                        message: 'Name must be less than 100 characters'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9+\-\s()]{10,20}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    {...register('email', { 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">We'll primarily contact you by phone</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea 
                    {...register('message', { 
                      required: 'Message is required',
                      maxLength: {
                        value: 2000,
                        message: 'Message must be less than 2000 characters'
                      }
                    })}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold mb-6">Visit Our Store</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-700">123 Jewelry Lane</p>
                      <p className="text-gray-700">London, UK</p>
                      <p className="text-gray-700">WC1X 9JY</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Opening Hours</h3>
                      <p className="text-gray-700">Monday - Friday: 10:30 AM - 6:30 PM</p>
                      <p className="text-gray-700">Saturday: 10:30 AM - 5:30 PM</p>
                      <p className="text-gray-700">Sunday: Closed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-700">+44 20 1234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-700">info@pdjjewellery.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Find Us</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-600">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 