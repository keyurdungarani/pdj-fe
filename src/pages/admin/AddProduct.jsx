import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Diamond, Gem, Crown, Upload, Link, X, Plus } from 'lucide-react';
import { productAPI } from '../../services/api';

const AddProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lab-grown diamond form state
  const [labGrownForm, setLabGrownForm] = useState({
    // Basic Info
    name: '',
    description: '',
    price: '',
    
    // VDB Required Fields
    stockNumber: '',
    shape: '',
    weight: '',
    color: '',
    clarity: '',
    
    // VDB Optional Fields
    availability: 'Available',
    fancyColor: '',
    fancyColorIntensity: '',
    fancyColorOvertone: '',
    totalPrice: '',
    pricePerCaratMemo: '',
    cutGrade: '',
    polish: '',
    symmetry: '',
    depthPercent: '',
    tablePercent: '',
    fluorescenceIntensity: '',
    fluorescenceColor: '',
    lab: '',
    certificateNumber: '',
    certificateUrl: '',
    certComment: '',
    culetCondition: '',
    culetSize: '',
    girdlePercent: '',
    girdleCondition: '',
    girdleThick: '',
    girdleThin: '',
    measurements: '',
    measurementsDepth: '',
    measurementsLength: '',
    measurementsWidth: '',
    milky: '',
    pavilionDepth: '',
    bgm: '',
    crownHeight: '',
    crownAngle: '',
    pavilionAngle: '',
    laserInscription: '',
    memberComments: '',
    pair: 'Single',
    heartsAndArrows: '',
    stockNumberForMatchingPair: '',
    shareAccess: 'Yes',
    eyeClean: '',
    featured: 'No',
    tableOpen: '',
    crownOpen: '',
    girdleOpen: '',
    starLength: '',
    type: '',
    tinge: '',
    luster: '',
    blackInclusion: '',
    locationOfBlack: '',
    tableInclusion: '',
    keyToSymbol: '',
    surfaceGraining: '',
    internalGraining: '',
    inclusionPattern: '',
    diamondOriginReport: '',
    shortTitle: '',
    arrivalDate: '',
    tags: '',
    certificateUpdatedAt: '',
    growthType: '',
    
    // Image and Video Fields
    imageLink: '',
    imageLink2: '',
    imageLink3: '',
    imageLink4: '',
    imageLink5: '',
    imageLink6: '',
    videoLink: '',
    
    // File uploads
    mainImageFile: null,
    galleryImageFiles: [],
    videoFile: null
  });

  const [errors, setErrors] = useState({});

  // Category selection data
  const categories = [
    {
      id: 'natural-diamonds',
      name: 'Natural-Diamonds',
      icon: Diamond,
      description: 'Natural diamonds with certificates',
      available: false
    },
    {
      id: 'lab-grown',
      name: 'Lab-Grown',
      icon: Gem,
      description: 'Lab-grown diamonds according to VDB standards',
      available: true
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      icon: Crown,
      description: 'Jewelry pieces including rings, necklaces, etc.',
      available: false
    }
  ];

  // VDB field options based on the document
  const vdbOptions = {
    shapes: ['Round', 'Princess', 'Emerald', 'Asscher', 'Marquise', 'Oval', 'Radiant', 'Pear', 'Heart', 'Cushion'],
    colors: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    clarity: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
    availability: ['Guaranteed Available', 'Available', 'Unavailable'],
    fancyColorIntensity: ['Faint', 'Very Light', 'Light', 'Fancy Light', 'Fancy', 'Fancy Intense', 'Fancy Vivid', 'Fancy Deep'],
    cutGrade: ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    polish: ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    symmetry: ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    fluorescenceIntensity: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'],
    fluorescenceColor: ['Blue', 'Yellow', 'White', 'Green', 'Orange'],
    labs: ['GIA', 'AGS', 'GCAL', 'EGL', 'IGI', 'GSI'],
    culetSize: ['None', 'Very Small', 'Small', 'Medium', 'Slightly Large', 'Large', 'Very Large', 'Extremely Large'],
    girdleThickness: ['Extremely Thin', 'Very Thin', 'Thin', 'Medium', 'Slightly Thick', 'Thick', 'Very Thick', 'Extremely Thick'],
    bgm: ['Yes', 'No', 'Milky'],
    pair: ['Pair', 'Single'],
    heartsAndArrows: ['Hearts and Arrows', 'H&A', 'None'],
    shareAccess: ['Yes', 'No'],
    featured: ['Yes', 'No'],
    growthType: ['CVD', 'HPHT', 'Unknown']
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setErrors({});
  };

  const handleLabGrownChange = (e) => {
    const { name, value } = e.target;
    setLabGrownForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const { files } = e.target;
    
    if (type === 'mainImage') {
      setLabGrownForm(prev => ({
        ...prev,
        mainImageFile: files[0]
      }));
    } else if (type === 'galleryImages') {
      setLabGrownForm(prev => ({
        ...prev,
        galleryImageFiles: Array.from(files)
      }));
    } else if (type === 'video') {
      setLabGrownForm(prev => ({
        ...prev,
        videoFile: files[0]
      }));
    }
  };

  const validateLabGrownForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!labGrownForm.name.trim()) newErrors.name = 'Name is required';
    if (!labGrownForm.description.trim()) newErrors.description = 'Description is required';
    if (!labGrownForm.price || labGrownForm.price <= 0) newErrors.price = 'Valid price is required';
    if (!labGrownForm.stockNumber.trim()) newErrors.stockNumber = 'Stock number is required';
    if (!labGrownForm.shape) newErrors.shape = 'Shape is required';
    if (!labGrownForm.weight || labGrownForm.weight <= 0) newErrors.weight = 'Weight is required';
    if (!labGrownForm.clarity) newErrors.clarity = 'Clarity is required';
    
    // Color or Fancy Color required
    if (!labGrownForm.color && !labGrownForm.fancyColor) {
      newErrors.color = 'Either Color or Fancy Color is required';
      newErrors.fancyColor = 'Either Color or Fancy Color is required';
    }
    
    // At least one image required
    if (!labGrownForm.imageLink && !labGrownForm.mainImageFile) {
      newErrors.imageLink = 'At least one image (file or URL) is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLabGrownSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLabGrownForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Basic product info
      formData.append('name', labGrownForm.name);
      formData.append('description', labGrownForm.description);
      formData.append('price', labGrownForm.price);
      formData.append('type', 'lab-grown');
      
      // Image links
      if (labGrownForm.imageLink) formData.append('imageLink', labGrownForm.imageLink);
      if (labGrownForm.imageLink2) formData.append('imageLink2', labGrownForm.imageLink2);
      if (labGrownForm.imageLink3) formData.append('imageLink3', labGrownForm.imageLink3);
      if (labGrownForm.imageLink4) formData.append('imageLink4', labGrownForm.imageLink4);
      if (labGrownForm.imageLink5) formData.append('imageLink5', labGrownForm.imageLink5);
      if (labGrownForm.imageLink6) formData.append('imageLink6', labGrownForm.imageLink6);
      
      // Video link
      if (labGrownForm.videoLink) formData.append('videoLink', labGrownForm.videoLink);
      
      // File uploads
      if (labGrownForm.mainImageFile) {
        formData.append('mainImage', labGrownForm.mainImageFile);
      }
      
      if (labGrownForm.galleryImageFiles.length > 0) {
        labGrownForm.galleryImageFiles.forEach(file => {
          formData.append('galleryImages', file);
        });
      }
      
      if (labGrownForm.videoFile) {
        formData.append('video', labGrownForm.videoFile);
      }
      
      // Prepare specifications object
      const specifications = {};
      
      // Add all VDB fields to specifications
      Object.keys(labGrownForm).forEach(key => {
        if (key !== 'name' && key !== 'description' && key !== 'price' && 
            !key.includes('File') && !key.includes('Link') && 
            labGrownForm[key] !== '') {
          specifications[key] = labGrownForm[key];
        }
      });
      
      formData.append('specifications', JSON.stringify(specifications));
      
      const response = await productAPI.addLabGrown(formData);
      
      toast.success('Lab-grown diamond added successfully!');
      navigate('/admin/product-panel');
      
    } catch (error) {
      console.error('Error adding lab-grown diamond:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.msg || 'Failed to add lab-grown diamond';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Product Category</h3>
        <p className="text-gray-600">Choose the type of product you want to add</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => category.available ? handleCategorySelect(category.id) : null}
              disabled={!category.available}
              className={`p-6 border-2 rounded-lg transition-all duration-200 ${
                category.available
                  ? 'border-gray-200 hover:border-primary hover:shadow-md cursor-pointer'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-full ${
                  category.available ? 'bg-primary/10' : 'bg-gray-200'
                }`}>
                  <IconComponent size={32} className={
                    category.available ? 'text-primary' : 'text-gray-400'
                  } />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  {!category.available && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderImageUploadSection = () => (
    <div className="space-y-6">
      <h4 className="font-semibold text-gray-900">Images & Video</h4>
      
      {/* Main Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="imageLink"
            value={labGrownForm.imageLink}
            onChange={handleLabGrownChange}
            placeholder="https://example.com/image.jpg"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.imageLink ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.imageLink && <p className="text-red-500 text-sm mt-1">{errors.imageLink}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload Main Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'mainImage')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Additional Image Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[2, 3, 4, 5, 6].map(num => (
          <div key={num}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Link {num}
            </label>
            <input
              type="url"
              name={`imageLink${num}`}
              value={labGrownForm[`imageLink${num}`]}
              onChange={handleLabGrownChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>
      
      {/* Gallery Images Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Gallery Images (Multiple)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(e, 'galleryImages')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Video */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            type="url"
            name="videoLink"
            value={labGrownForm.videoLink}
            onChange={handleLabGrownChange}
            placeholder="https://example.com/video.mp4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'video')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );

  const renderLabGrownForm = () => (
    <form onSubmit={handleLabGrownSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Lab-Grown Diamond</h3>
          <p className="text-gray-600">Based on VDB specifications</p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedCategory('')}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Basic Information */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={labGrownForm.name}
              onChange={handleLabGrownChange}
              placeholder="Enter product name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={labGrownForm.price}
              onChange={handleLabGrownChange}
              placeholder="Enter price"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={labGrownForm.description}
            onChange={handleLabGrownChange}
            placeholder="Enter product description"
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>
      
      {/* Required VDB Fields */}
      <div className="bg-blue-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Required VDB Fields</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="stockNumber"
              value={labGrownForm.stockNumber}
              onChange={handleLabGrownChange}
              placeholder="Unique stock number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.stockNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stockNumber && <p className="text-red-500 text-sm mt-1">{errors.stockNumber}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shape <span className="text-red-500">*</span>
            </label>
            <select
              name="shape"
              value={labGrownForm.shape}
              onChange={handleLabGrownChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.shape ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Shape</option>
              {vdbOptions.shapes.map(shape => (
                <option key={shape} value={shape}>{shape}</option>
              ))}
            </select>
            {errors.shape && <p className="text-red-500 text-sm mt-1">{errors.shape}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (Carat) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={labGrownForm.weight}
              onChange={handleLabGrownChange}
              placeholder="e.g., 1.25"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.weight ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-gray-500">(or Fancy Color required)</span>
            </label>
            <select
              name="color"
              value={labGrownForm.color}
              onChange={handleLabGrownChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.color ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Color</option>
              {vdbOptions.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fancy Color <span className="text-gray-500">(or Color required)</span>
            </label>
            <input
              type="text"
              name="fancyColor"
              value={labGrownForm.fancyColor}
              onChange={handleLabGrownChange}
              placeholder="e.g., Yellow, Pink"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.fancyColor ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fancyColor && <p className="text-red-500 text-sm mt-1">{errors.fancyColor}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clarity <span className="text-red-500">*</span>
            </label>
            <select
              name="clarity"
              value={labGrownForm.clarity}
              onChange={handleLabGrownChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.clarity ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Clarity</option>
              {vdbOptions.clarity.map(clarity => (
                <option key={clarity} value={clarity}>{clarity}</option>
              ))}
            </select>
            {errors.clarity && <p className="text-red-500 text-sm mt-1">{errors.clarity}</p>}
          </div>
        </div>
      </div>
      
      {/* Optional VDB Fields */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900">Optional VDB Fields</h4>
        
        {/* Quality & Grading */}
        <div className="bg-green-50 p-6 rounded-lg space-y-4">
          <h5 className="font-medium text-gray-900">Quality & Grading</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cut Grade</label>
              <select
                name="cutGrade"
                value={labGrownForm.cutGrade}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Cut Grade</option>
                {vdbOptions.cutGrade.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Polish</label>
              <select
                name="polish"
                value={labGrownForm.polish}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Polish</option>
                {vdbOptions.polish.map(polish => (
                  <option key={polish} value={polish}>{polish}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symmetry</label>
              <select
                name="symmetry"
                value={labGrownForm.symmetry}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Symmetry</option>
                {vdbOptions.symmetry.map(symmetry => (
                  <option key={symmetry} value={symmetry}>{symmetry}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                name="availability"
                value={labGrownForm.availability}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {vdbOptions.availability.map(availability => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Measurements & Dimensions */}
        <div className="bg-yellow-50 p-6 rounded-lg space-y-4">
          <h5 className="font-medium text-gray-900">Measurements & Dimensions</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depth %</label>
              <input
                type="number"
                step="0.1"
                name="depthPercent"
                value={labGrownForm.depthPercent}
                onChange={handleLabGrownChange}
                placeholder="e.g., 62.3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table %</label>
              <input
                type="number"
                step="0.1"
                name="tablePercent"
                value={labGrownForm.tablePercent}
                onChange={handleLabGrownChange}
                placeholder="e.g., 57.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (mm)</label>
              <input
                type="number"
                step="0.01"
                name="measurementsLength"
                value={labGrownForm.measurementsLength}
                onChange={handleLabGrownChange}
                placeholder="e.g., 6.52"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (mm)</label>
              <input
                type="number"
                step="0.01"
                name="measurementsWidth"
                value={labGrownForm.measurementsWidth}
                onChange={handleLabGrownChange}
                placeholder="e.g., 6.48"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Certificate Information */}
        <div className="bg-purple-50 p-6 rounded-lg space-y-4">
          <h5 className="font-medium text-gray-900">Certificate Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lab</label>
              <select
                name="lab"
                value={labGrownForm.lab}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Lab</option>
                {vdbOptions.labs.map(lab => (
                  <option key={lab} value={lab}>{lab}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Number</label>
              <input
                type="text"
                name="certificateNumber"
                value={labGrownForm.certificateNumber}
                onChange={handleLabGrownChange}
                placeholder="Certificate number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate URL</label>
              <input
                type="url"
                name="certificateUrl"
                value={labGrownForm.certificateUrl}
                onChange={handleLabGrownChange}
                placeholder="https://certificate-url.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Growth Type</label>
              <select
                name="growthType"
                value={labGrownForm.growthType}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Growth Type</option>
                {vdbOptions.growthType.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Additional Fields */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h5 className="font-medium text-gray-900">Additional Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fluorescence Intensity</label>
              <select
                name="fluorescenceIntensity"
                value={labGrownForm.fluorescenceIntensity}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Intensity</option>
                {vdbOptions.fluorescenceIntensity.map(intensity => (
                  <option key={intensity} value={intensity}>{intensity}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fluorescence Color</label>
              <select
                name="fluorescenceColor"
                value={labGrownForm.fluorescenceColor}
                onChange={handleLabGrownChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Color</option>
                {vdbOptions.fluorescenceColor.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Comments</label>
              <textarea
                name="memberComments"
                value={labGrownForm.memberComments}
                onChange={handleLabGrownChange}
                placeholder="Additional comments"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Laser Inscription</label>
              <input
                type="text"
                name="laserInscription"
                value={labGrownForm.laserInscription}
                onChange={handleLabGrownChange}
                placeholder="Laser inscription"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Images & Video Section */}
      {renderImageUploadSection()}
      
      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setSelectedCategory('')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Lab-Grown Diamond'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
        <p className="text-gray-600 mt-1">Create a new product for your jewelry store</p>
      </div>
      
      <div className="p-6">
        {!selectedCategory ? renderCategorySelection() : null}
        {selectedCategory === 'lab-grown' ? renderLabGrownForm() : null}
      </div>
    </div>
  );
};

export default AddProduct; 