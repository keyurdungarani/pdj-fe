import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';

const ConfirmOrderModal = ({ isOpen, onClose, productDetails }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const { name, price, image } = productDetails || {};

  const handleConfirmOrder = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrderPlaced(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">
            {orderPlaced ? 'Order Placed!' : 'Confirm Order'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {orderPlaced ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-green-100 text-green-500 rounded-full mb-4">
                <ShoppingBag size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
              <p className="text-gray-600 mb-4">
                Your order has been placed successfully. We'll contact you shortly.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <img 
                  src={image || 'https://via.placeholder.com/80'} 
                  alt={name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h4 className="font-medium">{name}</h4>
                  <p className="text-gray-500">₹{price?.toLocaleString() || '0'}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Confirm your interest in this product. Our team will contact you to complete the purchase.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="flex-1 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal; 