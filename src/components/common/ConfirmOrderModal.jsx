import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';
import { orderAPI } from '../../services/api';

const ConfirmOrderModal = ({ 
  isOpen, 
  onClose, 
  productName: name, 
  productPrice: price, 
  productImage: image, 
  productId,
  productType = 'Product',
  stockNumber = null,
  product = null
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [showForm, setShowForm] = useState(true);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // Prepare order data
      const orderData = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || undefined,
        message: data.message || undefined,
        productId: productId,
        productType: productType,
        productName: name,
        productPrice: price,
        productImage: image,
        stockNumber: stockNumber || product?.stockNumber || product?.jewelrySpecs?.stockNumber || undefined
      };

      const response = await orderAPI.create(orderData);

      setSubmitStatus({
        success: true,
        message: response.data.message || 'Thank you for your order! We will contact you soon to process your request.'
      });
      
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowForm(true);
    setSubmitStatus({ success: false, message: '' });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-bold">
            {!showForm ? 'Order Placed!' : 'Confirm Order'}
          </h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showForm ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-500 rounded-full mb-4">
                <ShoppingBag size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. We'll contact you shortly to process your request.
              </p>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Product Information */}
              <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={image || PLACEHOLDER_IMAGES.product} 
                  alt={name} 
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
                  <p className="text-lg font-bold text-primary mb-1">
                    ${price?.toLocaleString('en-US') || '0'}
                  </p>
                  {stockNumber && (
                    <p className="text-sm text-gray-600">Stock: {stockNumber}</p>
                  )}
                </div>
              </div>
              
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

              {/* Customer Information Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    Message
                  </label>
                  <textarea 
                    {...register('message', { 
                      maxLength: {
                        value: 2000,
                        message: 'Message must be less than 2000 characters'
                      }
                    })}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Any special requests or questions about this product..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal; 