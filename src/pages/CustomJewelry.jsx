import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Check, ChevronLeft, ChevronRight, Diamond, Gem, Star, Calculator, Send, ChevronDown, ChevronUp, Settings, Heart } from 'lucide-react';
import ConfirmOrderModal from '../components/common/ConfirmOrderModal';
import axios from 'axios';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

const CustomJewelry = () => {
  const [step, setStep] = useState(1);
  const [selectedDiamond, setSelectedDiamond] = useState(null);
  const [selectedRing, setSelectedRing] = useState(null);
  const [diamonds, setDiamonds] = useState([]);
  const [rings, setRings] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // Fetch diamonds and rings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [diamondsRes, ringsRes] = await Promise.all([
          axios.get('/api/diamonds?limit=12'),
          axios.get('/api/rings?limit=12')
        ]);
        
        setDiamonds(diamondsRes.data.diamonds || []);
        setRings(ringsRes.data.rings || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate total cost whenever selections change
  useEffect(() => {
    let cost = 0;
    if (selectedDiamond) cost += selectedDiamond.price;
    if (selectedRing) cost += selectedRing.price;
    
    setTotalCost(cost);
  }, [selectedDiamond, selectedRing]);
  
  const nextStep = () => {
    if ((step === 1 && !selectedDiamond) || (step === 2 && !selectedRing)) {
      // Show validation error
      return;
    }
    
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  const onSubmitOrder = async (data) => {
    if (!selectedDiamond || !selectedRing) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerInfo: {
          ...data
        },
        orderDetails: {
          diamondId: selectedDiamond._id,
          ringId: selectedRing._id,
          totalCost
        },
        status: 'pending'
      };
      
      await axios.post('/api/orders/custom', orderData);
      setSubmitSuccess(true);
      reset();
      
      // Reset selections after successful submission
      setTimeout(() => {
        setSelectedDiamond(null);
        setSelectedRing(null);
        setStep(1);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Step 1: Choose Diamond
  const renderDiamondSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Select Your Diamond</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {diamonds.map((diamond) => (
          <div 
            key={diamond._id}
            onClick={() => setSelectedDiamond(diamond)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedDiamond?._id === diamond._id 
                ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-square mb-3 relative overflow-hidden rounded-md bg-gray-50">
              <img 
                src={diamond.images?.[0]} 
                alt={diamond.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGES.jewelry;
                }}
              />
              {selectedDiamond?._id === diamond._id && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-gray-800">{diamond.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600 text-sm">
                {diamond.carat}ct {diamond.cut} 
              </span>
              <span className="font-bold">${diamond.price?.toLocaleString('en-US')}</span>
            </div>
          </div>
        ))}
      </div>
      
      {diamonds.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading diamonds...</p>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <button
          onClick={nextStep}
          disabled={!selectedDiamond}
          className={`px-6 py-3 flex items-center gap-2 rounded-md ${
            selectedDiamond 
              ? 'bg-primary hover:bg-primary-dark text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
  
  // Step 2: Choose Ring
  const renderRingSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Select Your Ring Setting</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rings.map((ring) => (
          <div 
            key={ring._id}
            onClick={() => setSelectedRing(ring)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedRing?._id === ring._id 
                ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-square mb-3 relative overflow-hidden rounded-md bg-gray-50">
              <img 
                src={ring.images?.[0]} 
                alt={ring.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGES.jewelry;
                }}
              />
              {selectedRing?._id === ring._id && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-gray-800">{ring.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600 text-sm">
                {ring.metal} {ring.setting} 
              </span>
              <span className="font-bold">${ring.price?.toLocaleString('en-US')}</span>
            </div>
          </div>
        ))}
      </div>
      
      {rings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading ring settings...</p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 flex items-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        <button
          onClick={nextStep}
          disabled={!selectedRing}
          className={`px-6 py-3 flex items-center gap-2 rounded-md ${
            selectedRing 
              ? 'bg-primary hover:bg-primary-dark text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
  
  // Step 3: Cost Summary
  const renderCostSummary = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Your Custom Creation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Diamond size={20} className="text-primary" /> Diamond Details
          </h3>
          
          {selectedDiamond && (
            <div className="space-y-4">
              <div className="aspect-square mb-3 relative overflow-hidden rounded-md bg-gray-50">
                <img 
                  src={selectedDiamond.images?.[0]} 
                  alt={selectedDiamond.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <h4 className="font-medium text-lg">{selectedDiamond.name}</h4>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shape:</span>
                  <span className="font-medium">{selectedDiamond.shape}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carat:</span>
                  <span className="font-medium">{selectedDiamond.carat}ct</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cut:</span>
                  <span className="font-medium">{selectedDiamond.cut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{selectedDiamond.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clarity:</span>
                  <span className="font-medium">{selectedDiamond.clarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold">${selectedDiamond.price?.toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gem size={20} className="text-primary" /> Ring Setting
          </h3>
          
          {selectedRing && (
            <div className="space-y-4">
              <div className="aspect-square mb-3 relative overflow-hidden rounded-md bg-gray-50">
                <img 
                  src={selectedRing.images?.[0]} 
                  alt={selectedRing.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <h4 className="font-medium text-lg">{selectedRing.name}</h4>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Metal:</span>
                  <span className="font-medium">{selectedRing.metal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Setting:</span>
                  <span className="font-medium">{selectedRing.setting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Style:</span>
                  <span className="font-medium">{selectedRing.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold">${selectedRing.price?.toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calculator size={20} /> Total Cost
          </h3>
          <div className="text-center">
            <span className="text-2xl font-bold">${totalCost.toLocaleString('en-US')}</span>
            <p className="text-gray-600 mt-1">Total Cost</p>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>This price includes both the diamond and the ring setting. Custom design services are included at no additional cost.</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 flex items-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
        
        <button
          onClick={nextStep}
          className="px-6 py-3 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-md"
        >
          Proceed to Order <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
  
  // Step 4: Contact Form
  const renderContactForm = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Complete Your Order</h2>
      
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-4">
            <Check size={30} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Order Submitted Successfully!</h3>
          <p className="text-green-700 mb-6">
            Thank you for your custom jewelry order. Our team will contact you shortly to discuss your creation.
          </p>
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
          >
            Start New Custom Design
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmitOrder)} className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Please provide your contact information to finalize your custom jewelry order. 
              Our team will reach out to discuss any details and confirm your design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              placeholder="Please share any special requests or questions about your custom jewelry..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 flex items-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ChevronLeft size={18} /> Back
            </button>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-3 border border-primary text-primary hover:bg-primary/5 rounded-md"
              >
                Contact Manager
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-md ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'} <Send size={18} />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
  
  // Progress Indicator
  const renderProgressSteps = () => (
    <div className="mb-12">
      <div className="flex justify-between items-center">
        {[
          { icon: <Diamond size={20} />, label: 'Choose Diamond' },
          { icon: <Gem size={20} />, label: 'Choose Ring' },
          { icon: <Calculator size={20} />, label: 'View Cost' },
          { icon: <Send size={20} />, label: 'Complete Order' },
        ].map((stepItem, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center ${index < step - 1 ? 'text-primary' : index === step - 1 ? 'text-primary' : 'text-gray-400'}`}
          >
            <div 
              className={`rounded-full h-12 w-12 flex items-center justify-center mb-2 ${
                index < step - 1 
                  ? 'bg-primary text-white' 
                  : index === step - 1 
                    ? 'bg-primary/10 text-primary border-2 border-primary' 
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index < step - 1 ? <Check size={20} /> : stepItem.icon}
            </div>
            
            <span className={`text-xs font-medium ${step === index + 1 ? 'font-semibold' : ''}`}>
              {stepItem.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress Line */}
      <div className="relative mt-5 mb-10 hidden md:block">
        <div className="h-1 bg-gray-200 absolute inset-x-0 top-0"></div>
        <div 
          className="h-1 bg-primary absolute left-0 top-0 transition-all" 
          style={{ width: `${(step - 1) * 33.33}%` }}
        ></div>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Dream Jewelry</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Design your perfect piece by selecting a diamond and ring setting. Our expert craftsmen will bring your vision to life.
            </p>
          </div>
          
          {renderProgressSteps()}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            {step === 1 && renderDiamondSelection()}
            {step === 2 && renderRingSelection()}
            {step === 3 && renderCostSummary()}
            {step === 4 && renderContactForm()}
          </div>
        </div>
      </div>
      
      {/* Confirm Order Modal */}
      <ConfirmOrderModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        productDetails={{
          name: "Custom Jewelry Creation",
          price: totalCost,
          details: {
            Diamond: selectedDiamond?.name,
            "Ring Setting": selectedRing?.name,
          }
        }}
      />
    </div>
  );
};

export default CustomJewelry;
