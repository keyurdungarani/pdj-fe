import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, AlertCircle, Phone, Mail, MapPin, Clock, Heart, Sparkles } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-3">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900">
                Contact Us
              </h1>
              <div className="bg-primary/10 p-3 rounded-full ml-3">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="font-baskerville text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed italic">
              Let's begin a conversation about your perfect piece
            </p>
            <p className="font-montserrat text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            We'd love to hear from you. Get in touch with us for any questions about
            our jewelry collection or services.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Contact Form - Takes up 2 columns */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-primary/5 to-amber-50 p-8 border-b border-gray-100">
                  <h2 className="font-baskerville text-3xl font-bold text-gray-900 mb-2">
                    Share Your Vision
                  </h2>
                  <p className="font-montserrat text-gray-600">
                    Tell us about your dream piece and we'll bring it to life
                  </p>
                </div>

                <div className="p-8">
                  {/* Status Message */}
                  {submitStatus.message && (
                    <div 
                      className={`p-6 rounded-xl mb-8 border-l-4 ${
                        submitStatus.success 
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800' 
                          : 'bg-red-50 border-red-400 text-red-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {submitStatus.success ? (
                            <Check className="h-6 w-6 text-emerald-600" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <p className="font-montserrat font-medium">{submitStatus.message}</p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-baskerville text-sm font-semibold text-gray-800 mb-3">
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
                          className={`w-full px-4 py-4 font-montserrat border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                            errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                          <p className="mt-2 font-montserrat text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block font-baskerville text-sm font-semibold text-gray-800 mb-3">
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
                          className={`w-full px-4 py-4 font-montserrat border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                            errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                          <p className="mt-2 font-montserrat text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-baskerville text-sm font-semibold text-gray-800 mb-3">
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
                        className={`w-full px-4 py-4 font-montserrat border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                          errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-2 font-montserrat text-sm text-red-600">{errors.email.message}</p>
                      )}
                      <p className="mt-2 font-montserrat text-xs text-gray-500">We'll primarily contact you by phone</p>
                    </div>
                    
                    <div>
                      <label className="block font-baskerville text-sm font-semibold text-gray-800 mb-3">
                        Tell Us About Your Vision *
                      </label>
                      <textarea 
                        {...register('message', { 
                          required: 'Message is required',
                          maxLength: {
                            value: 2000,
                            message: 'Message must be less than 2000 characters'
                          }
                        })}
                        rows={6}
                        className={`w-full px-4 py-4 font-montserrat border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none ${
                          errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Describe your ideal piece, occasion, preferences, budget range, or any questions you have..."
                      />
                      {errors.message && (
                        <p className="mt-2 font-montserrat text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-baskerville font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed transform-none' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending Your Message...
                        </span>
                      ) : (
                        'Begin Our Conversation'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Contact Information Sidebar */}
            <div className="space-y-8">
              {/* Visit Our Atelier */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-primary/5 p-6 border-b border-gray-100">
                  <h2 className="font-baskerville text-2xl font-bold text-gray-900 mb-1">
                    Visit Our Atelier
                  </h2>
                  <p className="font-montserrat text-sm text-gray-600">Experience luxury in person</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="font-montserrat text-gray-700 leading-relaxed">123 Jewelry Lane<br />Mayfair District<br />London, UK<br />WC1X 9JY</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg font-semibold text-gray-900 mb-2">Consultation Hours</h3>
                      <div className="font-montserrat text-gray-700 space-y-1">
                        <p>Monday - Friday: 10:30 AM - 6:30 PM</p>
                        <p>Saturday: 10:30 AM - 5:30 PM</p>
                        <p>Sunday: By appointment only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                  <h2 className="font-baskerville text-2xl font-bold text-gray-900 mb-1">
                    Direct Contact
                  </h2>
                  <p className="font-montserrat text-sm text-gray-600">Speak with our experts</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                      <a 
                        href="tel:+442012345678" 
                        className="font-montserrat text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        +44 20 1234 5678
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-baskerville text-lg font-semibold text-gray-900 mb-2">Email</h3>
                      <a 
                        href="mailto:info@loveandbrilliance.com" 
                        className="font-montserrat text-purple-600 hover:text-purple-800 transition-colors font-medium"
                      >
                        info@loveandbrilliance.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment CTA */}
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-xl text-white p-8 text-center">
                <div className="mb-4">
                  <Heart className="h-12 w-12 mx-auto text-white/90" />
                </div>
                <h3 className="font-baskerville text-2xl font-bold mb-4">
                  Book a Private Consultation
                </h3>
                <p className="font-montserrat text-white/90 mb-6 leading-relaxed">
                  Schedule a one-on-one session with our master jewelers to explore your perfect piece.
                </p>
                <a 
                  href="/book-appointment"
                  className="inline-block bg-white text-primary hover:bg-gray-100 font-baskerville font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Schedule Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 