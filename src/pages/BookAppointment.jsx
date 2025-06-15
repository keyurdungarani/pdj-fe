import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { appointmentAPI } from '../services/api';

const BookAppointment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const consultationOptions = [
    { value: 'Diamond', label: 'Diamond Selection' },
    { value: 'Engagement Ring', label: 'Engagement Ring' },
    { value: 'Wedding Ring', label: 'Wedding Ring' },
    { value: 'Customize Jewelry', label: 'Custom Jewelry' }
  ];

  // Watch the consultation datetime to provide business hours info
  const watchedDateTime = watch('consultationDateTime');

  // Helper function to get business hours info
  const getBusinessHoursInfo = (dateTimeString) => {
    if (!dateTimeString) return 'Mon-Fri: 10:30 AM - 6:30 PM | Sat: 10:30 AM - 5:30 PM | Sun: Closed';
    
    const date = new Date(dateTimeString);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0) {
      return 'Closed on Sundays';
    } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return 'Weekday Hours: 10:30 AM - 6:30 PM';
    } else if (dayOfWeek === 6) {
      return 'Saturday Hours: 10:30 AM - 5:30 PM';
    }
    
    return 'Mon-Fri: 10:30 AM - 6:30 PM | Sat: 10:30 AM - 5:30 PM';
  };

  // Helper function to validate business hours
  const validateBusinessHours = (dateTimeString) => {
    if (!dateTimeString) return 'Consultation date and time is required';
    
    const dateTime = new Date(dateTimeString);
    
    // Check if it's in the past
    if (dateTime <= new Date()) {
      return 'Consultation date and time must be in the future';
    }
    
    const dayOfWeek = dateTime.getDay();
    
    // Check if it's Sunday
    if (dayOfWeek === 0) {
      return 'No consultations available on Sundays';
    }
    
    // Check business hours
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Monday-Friday: 10:30 AM (630 minutes) to 6:30 PM (1110 minutes)
      if (timeInMinutes < 630 || timeInMinutes > 1110) {
        return 'Weekday consultations are available from 10:30 AM to 6:30 PM';
      }
    } else if (dayOfWeek === 6) {
      // Saturday: 10:30 AM (630 minutes) to 5:30 PM (1050 minutes)
      if (timeInMinutes < 630 || timeInMinutes > 1050) {
        return 'Saturday consultations are available from 10:30 AM to 5:30 PM';
      }
    }
    
    return true;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // Format the data as required by the backend
      const formattedData = {
        fullName: data.fullName,
        email: data.email || undefined, // Email is now optional
        phone: data.phone,
        city: data.city,
        state: data.state,
        consultationDateTime: data.consultationDateTime,
        assistanceType: data.consultationType, // Map to backend field name
        budget: data.budget ? parseInt(data.budget) : undefined,
        additionalDetails: data.additionalDetails
      };

      // Send the appointment data to your backend API
      const response = await appointmentAPI.create(formattedData);

      setSubmitStatus({
        success: true,
        message: 'Your appointment has been booked! We will contact you shortly to confirm.'
      });
      
      // Reset the form on success
      reset();
    } catch (error) {
      console.error('Appointment submission error:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.msg || error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum datetime (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour buffer
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary/90 text-white p-6">
            <h1 className="text-3xl font-bold">Book Your Consultation</h1>
            <p className="mt-2 opacity-90">Our experts are ready to help you find the perfect piece.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Status Message */}
            {submitStatus.message && (
              <div 
                className={`p-4 rounded-md ${
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

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('fullName', { 
                    required: 'Full name is required' 
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                    placeholder="Optional"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Optional - we'll primarily contact you by phone</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Consultation Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Date & Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    {...register('consultationDateTime', { 
                      required: 'Consultation date and time is required',
                      validate: validateBusinessHours
                    })}
                    min={getMinDateTime()}
                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                      errors.consultationDateTime ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                </div>
                {errors.consultationDateTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultationDateTime.message}</p>
                )}
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800 font-medium">
                    {getBusinessHoursInfo(watchedDateTime)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Please select a date and time within our business hours. No consultations on Sundays.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What can we help you with? *
                </label>
                <select
                  {...register('consultationType', { 
                    required: 'Please select what we can help you with' 
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.consultationType ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <option value="">Select an option</option>
                  {consultationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.consultationType && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultationType.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Do you have a rough budget?
                </label>
                <select
                  {...register('budget')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select budget range</option>
                  <option value="0">Under $5,000</option>
                  <option value="5000">$5,000 - $10,000</option>
                  <option value="10000">$10,000 - $25,000</option>
                  <option value="25000">$25,000 - $50,000</option>
                  <option value="50000">Above $50,000</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">We'll work with you to find the best options for your budget</p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please provide us with any further details
                </label>
                <textarea
                  {...register('additionalDetails')}
                  rows={4}
                  placeholder="Do you have a particular design in mind, or a preferred diamond shape? Interested in seeing a particular diamond grade?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
