import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BookAppointment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const consultationOptions = [
    { value: 'diamond', label: 'Diamond Selection' },
    { value: 'engagement', label: 'Engagement Ring' },
    { value: 'wedding', label: 'Wedding Ring' },
    { value: 'custom', label: 'Custom Jewelry' }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // Format the data if needed
      const formattedData = {
        ...data,
        createdAt: new Date()
      };

      // Send the appointment data to your backend API
      const response = await axios.post('/api/appointments', formattedData);

      setSubmitStatus({
        success: true,
        message: 'Your appointment has been booked! We will contact you shortly to confirm.'
      });
      
      // Reset the form on success
      reset();
    } catch (error) {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register('firstName', { 
                      required: 'First name is required' 
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
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
                    }`}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Consultation Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Date *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      {...register('consultationDate', { 
                        required: 'Consultation date is required',
                        validate: {
                          notSunday: (value) => {
                            const date = new Date(value);
                            return date.getDay() !== 0 || 'No consultations on Sunday';
                          }
                        }
                      })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 px-3 py-2 border rounded-md ${
                        errors.consultationDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.consultationDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.consultationDate.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">No consultations on Sunday or Bank Holidays</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Time *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register('consultationTime', { 
                        required: 'Consultation time is required' 
                      })}
                      className={`w-full pl-10 px-3 py-2 border rounded-md ${
                        errors.consultationTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a time</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="14:30">2:30 PM</option>
                      <option value="15:30">3:30 PM</option>
                      <option value="16:30">4:30 PM</option>
                      <option value="17:30">5:30 PM</option>
                    </select>
                  </div>
                  {errors.consultationTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.consultationTime.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Mon-Fri: 10.30am - 6.30pm | Sat: 10.30am - 5.30pm | Sun: Closed</p>
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
                  }`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a budget range</option>
                  <option value="0-25000">₹0 - ₹25,000</option>
                  <option value="25000-50000">₹25,000 - ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                  <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                  <option value="200000+">Above ₹2,00,000</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
