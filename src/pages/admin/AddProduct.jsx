import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Diamond, Gem, Crown, Upload, Link, X, Plus } from 'lucide-react';
import { productAPI } from '../../services/api';
import JewelryVariationManager from '../../components/admin/JewelryVariationManager';
import DiamondOriginManager from '../../components/admin/DiamondOriginManager';
import SizeVariationManager from '../../components/admin/SizeVariationManager';

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

  // Natural diamond form state based on VDB Natural Diamond specifications
  const [naturalDiamondForm, setNaturalDiamondForm] = useState({
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
    
    // Pricing fields
    totalPrice: '',
    discountPercent: '',
    priceMemo: '',
    pricePerCaratMemo: '',
    discountPercentMemo: '',
    
    // Cut and quality fields
    cutGrade: '',
    polish: '',
    symmetry: '',
    depthPercent: '',
    tablePercent: '',
    
    // Fluorescence
    fluorescenceIntensity: '',
    fluorescenceColor: '',
    
    // Certification
    lab: '',
    certificateNumber: '',
    certificateUrl: '',
    certComment: '',
    certificateDate: '',
    certificateImage: '',
    certificateVerified: 'No',
    certificateGrade: '',
    certificateReport: '',
    certificateFile: null,
    
    // Girdle and Culet
    culetCondition: '',
    culetSize: '',
    girdlePercent: '',
    girdleCondition: '',
    girdleThick: '',
    girdleThin: '',
    girdleOpen: '',
    
    // Measurements
    measurements: '',
    measurementsDepth: '',
    measurementsLength: '',
    measurementsWidth: '',
    
    // Additional characteristics
    milky: '',
    pavilionDepth: '',
    pavilionAngle: '',
    treatment: '',
    bgm: '',
    crownHeight: '',
    crownAngle: '',
    crownOpen: '',
    laserInscription: '',
    memberComments: '',
    
    // Pairing
    pair: 'Single',
    stockNumberForMatchingPair: '',
    heartsAndArrows: 'None',
    
    // Origin and brand
    origin: '',
    brand: '',
    
    // Location
    city: '',
    state: '',
    country: '',
    
    // Access and visibility
    shareAccess: 'Yes',
    eyeClean: '',
    featured: 'No',
    
    // Table and crown characteristics
    tableOpen: '',
    tableInclusion: '',
    starLength: '',
    
    // Type and characteristics
    type: '',
    tinge: '',
    luster: '',
    blackInclusion: '',
    locationOfBlack: '',
    keyToSymbol: '',
    surfaceGraining: '',
    internalGraining: '',
    inclusionPattern: '',
    
    // Reports and documentation
    diamondOriginReport: '',
    shortTitle: '',
    arrivalDate: '',
    tags: '',
    certificateUpdatedAt: '',
    
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

  // Jewelry form state based on VDB jewelry inventory structure
  const [jewelryForm, setJewelryForm] = useState({
    // Basic Info
    name: '',
    description: '',
    price: '',
    
    // Basic Classification
    stockNumber: '',
    jewelryClassification: '',
    jewelryCategory: '',
    jewelrySubCategory: '',
    
    // Basic Specifications
    totalCaratWeight: '',
    totalPrice: '',
    metal: '',
    mount: '',
    
    // Setting Information
    settingSupportedCaratFrom: '',
    settingSupportedCaratTo: '',
    supportedShapes: [],
    totalNumberOfStones: '',
    brand: '',
    
    // Center Stone Details
    centerType: '',
    centerGemType: '',
    centerShape: '',
    centerColor: '',
    centerClarity: '',
    centerFancyColor: '',
    centerIntensity: '',
    centerFluorescence: '',
    centerLab: '',
    centerCertNum: '',
    centerEnhancement: '',
    centerTotalStones: '',
    centerComments: '',
    centerCaratWeight: '',
    centerMeasDepth: '',
    centerMeasLength: '',
    centerMeasWidth: '',
    centerPolish: '',
    centerSymmetry: '',
    centerCut: '',
    centerDepth: '',
    centerTable: '',
    
    // Side Stone Details
    sideType: '',
    sideShape: '',
    sideCaratWeight: '',
    sideColor: '',
    sideClarity: '',
    sideFancyColor: '',
    sideFancyColorIntensity: '',
    sideGemType: '',
    sideTotalStones: '',
    
    // Location Information
    city: '',
    state: '',
    country: '',
    
    // Additional Fields
    rank: '',
    
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
    videoFile: null,
    
    // Jewelry Variations (Metal/Carat options, Diamond origin, Size)
    metalVariations: [],
    diamondOriginOptions: [],
    sizeVariations: [],
    defaultMetalVariation: 0,
    defaultDiamondOrigin: 0,
    defaultSizeVariation: 0
  });

  const [errors, setErrors] = useState({});

  // Category selection data
  const categories = [
    {
      id: 'natural-diamonds',
      name: 'Natural-Diamonds',
      icon: Diamond,
      description: 'Natural diamonds with certificates',
      available: true
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
      available: true
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

  // VDB field options for jewelry based on the document and sample data
  const jewelryOptions = {
    jewelryClassifications: ['Natural Diamond', 'Lab Grown Diamond', 'Other', 'Wedding Band', 'Precious Metal'],
    jewelryCategories: ['Ring', 'Band', 'Earrings', 'Necklace', 'Bracelet', 'Pendant', 'Tennis Bracelet', 'Eternity Band'],
    jewelrySubCategories: ['Solitaire', 'Halo', 'Three Stone', 'Side Stone', 'Classic', 'Vintage', 'Modern', 'Stud', 'Drop', 'Huggie', 'Hoop', 'Tennis', 'Chain'],
    metals: ['14K White Gold', '18K White Gold', '22K White Gold', '24K White Gold', '14K Yellow Gold', '18K Yellow Gold', '22K Yellow Gold', '24K Yellow Gold', '14K Rose Gold', '18K Rose Gold', 'Platinum', 'Silver'],
    mounts: ['Mount', 'Semimount'],
    shapes: ['Round', 'Oval', 'Princess', 'Square', 'Emerald', 'Asscher', 'Marquise', 'Pear', 'Heart', 'Cushion', 'Radiant', 'Baguette', 'Briolette', 'Bullet', 'Eurocut'],
    colors: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    clarity: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
    stoneTypes: ['Diamond', 'Gemstone', 'Lab Grown Diamond'],
    gemTypes: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Other'],
    intensities: ['Faint', 'Very Light', 'Light', 'Fancy Light', 'Fancy', 'Fancy Intense', 'Fancy Vivid', 'Fancy Deep'],
    fluorescence: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'],
    labs: ['GIA', 'AGS', 'GCAL', 'EGL', 'IGI', 'GSI', 'HRD', 'OTHER'],
    enhancements: ['HPHT', 'DRILL', 'CLARITY ENHANCEMENT', 'None'],
    grades: ['POOR', 'FAIR', 'GOOD', 'VERY GOOD', 'EXCELLENT']
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

  const handleJewelryChange = (e) => {
    const { name, value } = e.target;
    setJewelryForm(prev => ({
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

  const handleNaturalDiamondChange = (e) => {
    const { name, value } = e.target;
    setNaturalDiamondForm(prev => ({
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
    
    if (selectedCategory === 'lab-grown') {
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
    } else if (selectedCategory === 'natural-diamonds') {
      if (type === 'mainImage') {
        setNaturalDiamondForm(prev => ({
          ...prev,
          mainImageFile: files[0]
        }));
      } else if (type === 'galleryImages') {
        setNaturalDiamondForm(prev => ({
          ...prev,
          galleryImageFiles: Array.from(files)
        }));
      } else if (type === 'video') {
        setNaturalDiamondForm(prev => ({
          ...prev,
          videoFile: files[0]
        }));
      } else if (type === 'certificate') {
        setNaturalDiamondForm(prev => ({
          ...prev,
          certificateFile: files[0]
        }));
      }
    } else if (selectedCategory === 'jewelry') {
      if (type === 'mainImage') {
        setJewelryForm(prev => ({
          ...prev,
          mainImageFile: files[0]
        }));
      } else if (type === 'galleryImages') {
        setJewelryForm(prev => ({
          ...prev,
          galleryImageFiles: Array.from(files)
        }));
      } else if (type === 'video') {
        setJewelryForm(prev => ({
          ...prev,
          videoFile: files[0]
        }));
      }
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

  const validateJewelryForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!jewelryForm.name.trim()) newErrors.name = 'Name is required';
    if (!jewelryForm.description.trim()) newErrors.description = 'Description is required';
    if (!jewelryForm.price || jewelryForm.price <= 0) newErrors.price = 'Valid price is required';
    if (!jewelryForm.stockNumber.trim()) newErrors.stockNumber = 'Stock number is required';
    if (!jewelryForm.jewelryClassification) newErrors.jewelryClassification = 'Jewelry classification is required';
    if (!jewelryForm.jewelryCategory) newErrors.jewelryCategory = 'Jewelry category is required';
    if (!jewelryForm.metal) newErrors.metal = 'Metal is required';
    
    // At least one image required
    if (!jewelryForm.imageLink && !jewelryForm.mainImageFile) {
      newErrors.imageLink = 'At least one image (file or URL) is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleJewelrySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateJewelryForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Basic product info
      formData.append('name', jewelryForm.name);
      formData.append('description', jewelryForm.description);
      formData.append('price', jewelryForm.price);
      formData.append('type', 'jewelry');
      
      // Image links
      if (jewelryForm.imageLink) formData.append('imageLink', jewelryForm.imageLink);
      if (jewelryForm.imageLink2) formData.append('imageLink2', jewelryForm.imageLink2);
      if (jewelryForm.imageLink3) formData.append('imageLink3', jewelryForm.imageLink3);
      if (jewelryForm.imageLink4) formData.append('imageLink4', jewelryForm.imageLink4);
      if (jewelryForm.imageLink5) formData.append('imageLink5', jewelryForm.imageLink5);
      if (jewelryForm.imageLink6) formData.append('imageLink6', jewelryForm.imageLink6);
      
      // Video link
      if (jewelryForm.videoLink) formData.append('videoLink', jewelryForm.videoLink);
      
      // File uploads
      if (jewelryForm.mainImageFile) {
        formData.append('mainImage', jewelryForm.mainImageFile);
      }
      
      if (jewelryForm.galleryImageFiles.length > 0) {
        jewelryForm.galleryImageFiles.forEach(file => {
          formData.append('galleryImages', file);
        });
      }
      
      if (jewelryForm.videoFile) {
        formData.append('video', jewelryForm.videoFile);
      }
      
      // Handle Metal Variations with file uploads
      if (jewelryForm.metalVariations && jewelryForm.metalVariations.length > 0) {
        jewelryForm.metalVariations.forEach((variation, index) => {
          // Upload main image for variation
          if (variation.mainImageFile) {
            formData.append(`metalVariation_${index}_mainImage`, variation.mainImageFile);
          }
          // Upload gallery images for variation
          if (variation.imageFiles && variation.imageFiles.length > 0) {
            variation.imageFiles.forEach(file => {
              formData.append(`metalVariation_${index}_images`, file);
            });
          }
        });
        
        // Clean variations data (remove file fields before JSON stringify)
        const cleanVariations = jewelryForm.metalVariations.map(v => ({
          metal: v.metal,
          displayName: v.displayName,
          carat: v.carat,
          color: v.color,
          priceAdjustment: v.priceAdjustment || 0,
          images: v.images || [],
          mainImage: v.mainImage || '',
          available: v.available !== false,
          stockCount: v.stockCount || 1
        }));
        
        formData.append('metalVariations', JSON.stringify(cleanVariations));
      }
      
      // Handle Diamond Origin Options
      if (jewelryForm.diamondOriginOptions && jewelryForm.diamondOriginOptions.length > 0) {
        formData.append('diamondOriginOptions', JSON.stringify(jewelryForm.diamondOriginOptions));
      }
      
      // Handle Size Variations
      if (jewelryForm.sizeVariations && jewelryForm.sizeVariations.length > 0) {
        formData.append('sizeVariations', JSON.stringify(jewelryForm.sizeVariations));
      }
      
      // Default selections
      if (jewelryForm.defaultMetalVariation !== undefined) {
        formData.append('defaultMetalVariation', jewelryForm.defaultMetalVariation);
      }
      if (jewelryForm.defaultDiamondOrigin !== undefined) {
        formData.append('defaultDiamondOrigin', jewelryForm.defaultDiamondOrigin);
      }
      if (jewelryForm.defaultSizeVariation !== undefined) {
        formData.append('defaultSizeVariation', jewelryForm.defaultSizeVariation);
      }
      
      // Prepare specifications object with proper structure
      const specifications = {
        stockNumber: jewelryForm.stockNumber,
        jewelryClassification: jewelryForm.jewelryClassification,
        jewelryCategory: jewelryForm.jewelryCategory,
        jewelrySubCategory: jewelryForm.jewelrySubCategory,
        totalCaratWeight: jewelryForm.totalCaratWeight ? parseFloat(jewelryForm.totalCaratWeight) : undefined,
        totalPrice: jewelryForm.totalPrice ? parseFloat(jewelryForm.totalPrice) : undefined,
        metal: jewelryForm.metal,
        mount: jewelryForm.mount,
        settingSupportedCaratFrom: jewelryForm.settingSupportedCaratFrom ? parseFloat(jewelryForm.settingSupportedCaratFrom) : undefined,
        settingSupportedCaratTo: jewelryForm.settingSupportedCaratTo ? parseFloat(jewelryForm.settingSupportedCaratTo) : undefined,
        supportedShapes: jewelryForm.supportedShapes,
        totalNumberOfStones: jewelryForm.totalNumberOfStones ? parseInt(jewelryForm.totalNumberOfStones) : undefined,
        brand: jewelryForm.brand,
        
        // Center Stone Details
        centerStone: {
          type: jewelryForm.centerType,
          gemType: jewelryForm.centerGemType,
          shape: jewelryForm.centerShape,
          color: jewelryForm.centerColor,
          clarity: jewelryForm.centerClarity,
          fancyColor: jewelryForm.centerFancyColor,
          intensity: jewelryForm.centerIntensity,
          fluorescence: jewelryForm.centerFluorescence,
          lab: jewelryForm.centerLab,
          certNum: jewelryForm.centerCertNum,
          enhancement: jewelryForm.centerEnhancement,
          totalStones: jewelryForm.centerTotalStones ? parseInt(jewelryForm.centerTotalStones) : undefined,
          comments: jewelryForm.centerComments,
          caratWeight: jewelryForm.centerCaratWeight ? parseFloat(jewelryForm.centerCaratWeight) : undefined,
          measDepth: jewelryForm.centerMeasDepth ? parseFloat(jewelryForm.centerMeasDepth) : undefined,
          measLength: jewelryForm.centerMeasLength ? parseFloat(jewelryForm.centerMeasLength) : undefined,
          measWidth: jewelryForm.centerMeasWidth ? parseFloat(jewelryForm.centerMeasWidth) : undefined,
          polish: jewelryForm.centerPolish,
          symmetry: jewelryForm.centerSymmetry,
          cut: jewelryForm.centerCut,
          depth: jewelryForm.centerDepth ? parseFloat(jewelryForm.centerDepth) : undefined,
          table: jewelryForm.centerTable ? parseFloat(jewelryForm.centerTable) : undefined
        },
        
        // Side Stone Details
        sideStone: {
          type: jewelryForm.sideType,
          shape: jewelryForm.sideShape,
          caratWeight: jewelryForm.sideCaratWeight ? parseFloat(jewelryForm.sideCaratWeight) : undefined,
          color: jewelryForm.sideColor,
          clarity: jewelryForm.sideClarity,
          fancyColor: jewelryForm.sideFancyColor,
          fancyColorIntensity: jewelryForm.sideFancyColorIntensity,
          gemType: jewelryForm.sideGemType,
          totalStones: jewelryForm.sideTotalStones ? parseInt(jewelryForm.sideTotalStones) : undefined
        },
        
        // Location Information
        location: {
          city: jewelryForm.city,
          state: jewelryForm.state,
          country: jewelryForm.country
        },
        
        // Additional Fields
        rank: jewelryForm.rank ? parseInt(jewelryForm.rank) : undefined
      };
      
      // Remove empty values from specifications
      const cleanSpecs = JSON.parse(JSON.stringify(specifications, (key, value) => {
        if (value === '' || value === undefined || value === null) {
          return undefined;
        }
        return value;
      }));
      
      formData.append('specifications', JSON.stringify(cleanSpecs));
      
      const response = await productAPI.addJewelry(formData);
      
      toast.success('Jewelry added successfully!');
      navigate('/admin/product-panel');
      
    } catch (error) {
      console.error('Error adding jewelry:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.msg || 'Failed to add jewelry';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateNaturalDiamondForm = () => {
    const newErrors = {};
    
    // Required fields based on VDB documentation
    if (!naturalDiamondForm.name.trim()) newErrors.name = 'Name is required';
    if (!naturalDiamondForm.description.trim()) newErrors.description = 'Description is required';
    if (!naturalDiamondForm.price || naturalDiamondForm.price <= 0) newErrors.price = 'Valid price is required';
    if (!naturalDiamondForm.stockNumber.trim()) newErrors.stockNumber = 'Stock number is required (VDB mandatory)';
    if (!naturalDiamondForm.shape) newErrors.shape = 'Shape is required';
    if (!naturalDiamondForm.weight || naturalDiamondForm.weight <= 0) newErrors.weight = 'Valid carat weight is required';
    if (!naturalDiamondForm.clarity) newErrors.clarity = 'Clarity is required';
    
    // Color OR Fancy Color required (VDB rule)
    if (!naturalDiamondForm.color && !naturalDiamondForm.fancyColor) {
      newErrors.color = 'Either Color or Fancy Color is required';
      newErrors.fancyColor = 'Either Color or Fancy Color is required';
    }
    
    // At least one image required (VDB requirement)
    if (!naturalDiamondForm.imageLink && !naturalDiamondForm.mainImageFile) {
      newErrors.imageLink = 'At least one image (file or URL) is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNaturalDiamondSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateNaturalDiamondForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Basic product info
      formData.append('name', naturalDiamondForm.name);
      formData.append('description', naturalDiamondForm.description);
      formData.append('price', naturalDiamondForm.price);
      formData.append('type', 'natural-diamond');
      
      // Image links (VDB standard - up to 6 images)
      if (naturalDiamondForm.imageLink) formData.append('imageLink', naturalDiamondForm.imageLink);
      if (naturalDiamondForm.imageLink2) formData.append('imageLink2', naturalDiamondForm.imageLink2);
      if (naturalDiamondForm.imageLink3) formData.append('imageLink3', naturalDiamondForm.imageLink3);
      if (naturalDiamondForm.imageLink4) formData.append('imageLink4', naturalDiamondForm.imageLink4);
      if (naturalDiamondForm.imageLink5) formData.append('imageLink5', naturalDiamondForm.imageLink5);
      if (naturalDiamondForm.imageLink6) formData.append('imageLink6', naturalDiamondForm.imageLink6);
      
      // Video link
      if (naturalDiamondForm.videoLink) formData.append('videoLink', naturalDiamondForm.videoLink);
      
      // File uploads
      if (naturalDiamondForm.mainImageFile) {
        formData.append('mainImage', naturalDiamondForm.mainImageFile);
      }
      
      if (naturalDiamondForm.galleryImageFiles.length > 0) {
        naturalDiamondForm.galleryImageFiles.forEach(file => {
          formData.append('galleryImages', file);
        });
      }
      
      if (naturalDiamondForm.videoFile) {
        formData.append('video', naturalDiamondForm.videoFile);
      }
      
      if (naturalDiamondForm.certificateFile) {
        formData.append('certificateFile', naturalDiamondForm.certificateFile);
      }
      
      // Prepare VDB specifications object
      const specifications = {
        // Required VDB fields
        stockNumber: naturalDiamondForm.stockNumber,
        shape: naturalDiamondForm.shape,
        weight: parseFloat(naturalDiamondForm.weight),
        color: naturalDiamondForm.color,
        clarity: naturalDiamondForm.clarity,
        
        // Optional VDB fields
        availability: naturalDiamondForm.availability,
        fancyColor: naturalDiamondForm.fancyColor,
        fancyColorIntensity: naturalDiamondForm.fancyColorIntensity,
        fancyColorOvertone: naturalDiamondForm.fancyColorOvertone,
        
        // Pricing fields
        totalPrice: naturalDiamondForm.totalPrice ? parseFloat(naturalDiamondForm.totalPrice) : undefined,
        discountPercent: naturalDiamondForm.discountPercent ? parseFloat(naturalDiamondForm.discountPercent) : undefined,
        priceMemo: naturalDiamondForm.priceMemo ? parseFloat(naturalDiamondForm.priceMemo) : undefined,
        pricePerCaratMemo: naturalDiamondForm.pricePerCaratMemo ? parseFloat(naturalDiamondForm.pricePerCaratMemo) : undefined,
        discountPercentMemo: naturalDiamondForm.discountPercentMemo ? parseFloat(naturalDiamondForm.discountPercentMemo) : undefined,
        
        // Cut and quality fields
        cutGrade: naturalDiamondForm.cutGrade,
        polish: naturalDiamondForm.polish,
        symmetry: naturalDiamondForm.symmetry,
        depthPercent: naturalDiamondForm.depthPercent ? parseFloat(naturalDiamondForm.depthPercent) : undefined,
        tablePercent: naturalDiamondForm.tablePercent ? parseFloat(naturalDiamondForm.tablePercent) : undefined,
        
        // Fluorescence
        fluorescenceIntensity: naturalDiamondForm.fluorescenceIntensity,
        fluorescenceColor: naturalDiamondForm.fluorescenceColor,
        
        // Certification
        lab: naturalDiamondForm.lab,
        certificateNumber: naturalDiamondForm.certificateNumber,
        certificateUrl: naturalDiamondForm.certificateUrl,
        certComment: naturalDiamondForm.certComment,
        certificateDate: naturalDiamondForm.certificateDate ? new Date(naturalDiamondForm.certificateDate) : undefined,
        certificateImage: naturalDiamondForm.certificateImage,
        certificateVerified: naturalDiamondForm.certificateVerified,
        certificateGrade: naturalDiamondForm.certificateGrade,
        certificateReport: naturalDiamondForm.certificateReport,
        
        // Girdle and Culet
        culetCondition: naturalDiamondForm.culetCondition,
        culetSize: naturalDiamondForm.culetSize,
        girdlePercent: naturalDiamondForm.girdlePercent ? parseFloat(naturalDiamondForm.girdlePercent) : undefined,
        girdleCondition: naturalDiamondForm.girdleCondition,
        girdleThick: naturalDiamondForm.girdleThick,
        girdleThin: naturalDiamondForm.girdleThin,
        girdleOpen: naturalDiamondForm.girdleOpen,
        
        // Measurements
        measurements: naturalDiamondForm.measurements,
        measurementsDepth: naturalDiamondForm.measurementsDepth ? parseFloat(naturalDiamondForm.measurementsDepth) : undefined,
        measurementsLength: naturalDiamondForm.measurementsLength ? parseFloat(naturalDiamondForm.measurementsLength) : undefined,
        measurementsWidth: naturalDiamondForm.measurementsWidth ? parseFloat(naturalDiamondForm.measurementsWidth) : undefined,
        
        // Additional characteristics
        milky: naturalDiamondForm.milky,
        pavilionDepth: naturalDiamondForm.pavilionDepth ? parseFloat(naturalDiamondForm.pavilionDepth) : undefined,
        pavilionAngle: naturalDiamondForm.pavilionAngle ? parseFloat(naturalDiamondForm.pavilionAngle) : undefined,
        treatment: naturalDiamondForm.treatment,
        bgm: naturalDiamondForm.bgm,
        crownHeight: naturalDiamondForm.crownHeight ? parseFloat(naturalDiamondForm.crownHeight) : undefined,
        crownAngle: naturalDiamondForm.crownAngle ? parseFloat(naturalDiamondForm.crownAngle) : undefined,
        crownOpen: naturalDiamondForm.crownOpen,
        laserInscription: naturalDiamondForm.laserInscription,
        memberComments: naturalDiamondForm.memberComments,
        
        // Pairing
        pair: naturalDiamondForm.pair,
        stockNumberForMatchingPair: naturalDiamondForm.stockNumberForMatchingPair,
        heartsAndArrows: naturalDiamondForm.heartsAndArrows,
        
        // Origin and brand
        origin: naturalDiamondForm.origin,
        brand: naturalDiamondForm.brand,
        
        // Location
        city: naturalDiamondForm.city,
        state: naturalDiamondForm.state,
        country: naturalDiamondForm.country,
        
        // Access and visibility
        shareAccess: naturalDiamondForm.shareAccess,
        eyeClean: naturalDiamondForm.eyeClean,
        featured: naturalDiamondForm.featured,
        
        // Table and crown characteristics
        tableOpen: naturalDiamondForm.tableOpen,
        tableInclusion: naturalDiamondForm.tableInclusion,
        starLength: naturalDiamondForm.starLength ? parseFloat(naturalDiamondForm.starLength) : undefined,
        
        // Type and characteristics
        type: naturalDiamondForm.type,
        tinge: naturalDiamondForm.tinge,
        luster: naturalDiamondForm.luster,
        blackInclusion: naturalDiamondForm.blackInclusion,
        locationOfBlack: naturalDiamondForm.locationOfBlack,
        keyToSymbol: naturalDiamondForm.keyToSymbol,
        surfaceGraining: naturalDiamondForm.surfaceGraining,
        internalGraining: naturalDiamondForm.internalGraining,
        inclusionPattern: naturalDiamondForm.inclusionPattern,
        
        // Reports and documentation
        diamondOriginReport: naturalDiamondForm.diamondOriginReport,
        shortTitle: naturalDiamondForm.shortTitle,
        arrivalDate: naturalDiamondForm.arrivalDate ? new Date(naturalDiamondForm.arrivalDate) : undefined,
        tags: naturalDiamondForm.tags ? naturalDiamondForm.tags.split(',').map(tag => tag.trim()) : [],
        certificateUpdatedAt: naturalDiamondForm.certificateUpdatedAt ? new Date(naturalDiamondForm.certificateUpdatedAt) : undefined
      };
      
      // Remove empty values from specifications
      const cleanSpecs = JSON.parse(JSON.stringify(specifications, (key, value) => {
        if (value === '' || value === undefined || value === null) {
          return undefined;
        }
        return value;
      }));
      
      formData.append('specifications', JSON.stringify(cleanSpecs));
      
      const response = await productAPI.addNaturalDiamond(formData);
      
      toast.success('Natural diamond added successfully!');
      navigate('/admin/product-panel');
      
    } catch (error) {
      console.error('Error adding natural diamond:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.msg || 'Failed to add natural diamond';
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
              Price ($) <span className="text-red-500">*</span>
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

  const renderNaturalDiamondForm = () => (
    <form onSubmit={handleNaturalDiamondSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Natural Diamond</h3>
          <p className="text-gray-600">Based on VDB Natural Diamond specifications</p>
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
              value={naturalDiamondForm.name}
              onChange={handleNaturalDiamondChange}
              placeholder="Enter product name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={naturalDiamondForm.price}
              onChange={handleNaturalDiamondChange}
              placeholder="Enter price"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={naturalDiamondForm.description}
              onChange={handleNaturalDiamondChange}
              placeholder="Enter product description"
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>
      
      {/* VDB Required Fields */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">VDB Required Fields</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="stockNumber"
              value={naturalDiamondForm.stockNumber}
              onChange={handleNaturalDiamondChange}
              placeholder="e.g., ND12345"
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
              value={naturalDiamondForm.shape}
              onChange={handleNaturalDiamondChange}
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
              value={naturalDiamondForm.weight}
              onChange={handleNaturalDiamondChange}
              placeholder="e.g., 1.50"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.weight ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <select
              name="color"
              value={naturalDiamondForm.color}
              onChange={handleNaturalDiamondChange}
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
              Clarity <span className="text-red-500">*</span>
            </label>
            <select
              name="clarity"
              value={naturalDiamondForm.clarity}
              onChange={handleNaturalDiamondChange}
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
      
      {/* Certificate Section */}
      <div className="bg-blue-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Certificate Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification Lab
            </label>
            <select
              name="lab"
              value={naturalDiamondForm.lab}
              onChange={handleNaturalDiamondChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Lab</option>
              {vdbOptions.labs.map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Number
            </label>
            <input
              type="text"
              name="certificateNumber"
              value={naturalDiamondForm.certificateNumber}
              onChange={handleNaturalDiamondChange}
              placeholder="e.g., 2141438171"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Date
            </label>
            <input
              type="date"
              name="certificateDate"
              value={naturalDiamondForm.certificateDate}
              onChange={handleNaturalDiamondChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Grade
            </label>
            <input
              type="text"
              name="certificateGrade"
              value={naturalDiamondForm.certificateGrade}
              onChange={handleNaturalDiamondChange}
              placeholder="e.g., Excellent"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Verified
            </label>
            <select
              name="certificateVerified"
              value={naturalDiamondForm.certificateVerified}
              onChange={handleNaturalDiamondChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        
        {/* Certificate URLs and Files */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate URL
            </label>
            <input
              type="url"
              name="certificateUrl"
              value={naturalDiamondForm.certificateUrl}
              onChange={handleNaturalDiamondChange}
              placeholder="https://example.com/certificate.pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Certificate File
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileChange(e, 'certificate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">PDF or image files accepted</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Image URL
            </label>
            <input
              type="url"
              name="certificateImage"
              value={naturalDiamondForm.certificateImage}
              onChange={handleNaturalDiamondChange}
              placeholder="https://example.com/certificate-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Report Type
            </label>
            <input
              type="text"
              name="certificateReport"
              value={naturalDiamondForm.certificateReport}
              onChange={handleNaturalDiamondChange}
              placeholder="e.g., Grading Report, Origin Report"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* Certificate Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Comments
          </label>
          <textarea
            name="certComment"
            value={naturalDiamondForm.certComment}
            onChange={handleNaturalDiamondChange}
            placeholder="Additional comments about the certificate..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Images & Video Section */}
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
              value={naturalDiamondForm.imageLink}
              onChange={handleNaturalDiamondChange}
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
        
        {/* Additional Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[2, 3, 4, 5, 6].map(num => (
            <div key={num}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image {num} URL</label>
              <input
                type="url"
                name={`imageLink${num}`}
                value={naturalDiamondForm[`imageLink${num}`]}
                onChange={handleNaturalDiamondChange}
                placeholder={`https://example.com/image${num}.jpg`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        
        {/* Gallery Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'galleryImages')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-sm text-gray-500 mt-1">You can select multiple images</p>
        </div>
        
        {/* Video */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
            <input
              type="url"
              name="videoLink"
              value={naturalDiamondForm.videoLink}
              onChange={handleNaturalDiamondChange}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
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
          {loading ? 'Adding...' : 'Add Natural Diamond'}
        </button>
      </div>
    </form>
  );

  const renderJewelryForm = () => (
    <form onSubmit={handleJewelrySubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add Jewelry</h3>
          <p className="text-gray-600">Based on VDB jewelry inventory specifications</p>
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
              value={jewelryForm.name}
              onChange={handleJewelryChange}
              placeholder="Enter product name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={jewelryForm.price}
              onChange={handleJewelryChange}
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
            value={jewelryForm.description}
            onChange={handleJewelryChange}
            placeholder="Enter product description"
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>
      
      {/* Classification & Category */}
      <div className="bg-blue-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Classification & Category</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="stockNumber"
              value={jewelryForm.stockNumber}
              onChange={handleJewelryChange}
              placeholder="Unique stock number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.stockNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stockNumber && <p className="text-red-500 text-sm mt-1">{errors.stockNumber}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jewelry Classification <span className="text-red-500">*</span>
            </label>
            <select
              name="jewelryClassification"
              value={jewelryForm.jewelryClassification}
              onChange={handleJewelryChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.jewelryClassification ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Classification</option>
              {jewelryOptions.jewelryClassifications.map(classification => (
                <option key={classification} value={classification}>{classification}</option>
              ))}
            </select>
            {errors.jewelryClassification && <p className="text-red-500 text-sm mt-1">{errors.jewelryClassification}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jewelry Category <span className="text-red-500">*</span>
            </label>
            <select
              name="jewelryCategory"
              value={jewelryForm.jewelryCategory}
              onChange={handleJewelryChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.jewelryCategory ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {jewelryOptions.jewelryCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.jewelryCategory && <p className="text-red-500 text-sm mt-1">{errors.jewelryCategory}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jewelry Sub-Category</label>
            <select
              name="jewelrySubCategory"
              value={jewelryForm.jewelrySubCategory}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Sub-Category</option>
              {jewelryOptions.jewelrySubCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={jewelryForm.brand}
              onChange={handleJewelryChange}
              placeholder="e.g., Tiffany, Cartier"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      {/* Basic Specifications */}
      <div className="bg-green-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Basic Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metal <span className="text-red-500">*</span>
            </label>
            <select
              name="metal"
              value={jewelryForm.metal}
              onChange={handleJewelryChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.metal ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Metal</option>
              {jewelryOptions.metals.map(metal => (
                <option key={metal} value={metal}>{metal}</option>
              ))}
            </select>
            {errors.metal && <p className="text-red-500 text-sm mt-1">{errors.metal}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mount</label>
            <select
              name="mount"
              value={jewelryForm.mount}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Mount</option>
              {jewelryOptions.mounts.map(mount => (
                <option key={mount} value={mount}>{mount}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Carat Weight</label>
            <input
              type="number"
              step="0.01"
              name="totalCaratWeight"
              value={jewelryForm.totalCaratWeight}
              onChange={handleJewelryChange}
              placeholder="e.g., 1.25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
            <input
              type="number"
              name="totalPrice"
              value={jewelryForm.totalPrice}
              onChange={handleJewelryChange}
              placeholder="Total price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Number of Stones</label>
            <input
              type="number"
              name="totalNumberOfStones"
              value={jewelryForm.totalNumberOfStones}
              onChange={handleJewelryChange}
              placeholder="e.g., 12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      {/* Setting Information */}
      <div className="bg-yellow-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Setting Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Setting Supported Carat (From)</label>
            <input
              type="number"
              step="0.01"
              name="settingSupportedCaratFrom"
              value={jewelryForm.settingSupportedCaratFrom}
              onChange={handleJewelryChange}
              placeholder="e.g., 0.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Setting Supported Carat (To)</label>
            <input
              type="number"
              step="0.01"
              name="settingSupportedCaratTo"
              value={jewelryForm.settingSupportedCaratTo}
              onChange={handleJewelryChange}
              placeholder="e.g., 2.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supported Shapes</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {jewelryOptions.shapes.map(shape => (
              <label key={shape} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={jewelryForm.supportedShapes.includes(shape)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setJewelryForm(prev => ({
                        ...prev,
                        supportedShapes: [...prev.supportedShapes, shape]
                      }));
                    } else {
                      setJewelryForm(prev => ({
                        ...prev,
                        supportedShapes: prev.supportedShapes.filter(s => s !== shape)
                      }));
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{shape}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Center Stone Details */}
      <div className="bg-purple-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Center Stone Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Stone Type</label>
            <select
              name="centerType"
              value={jewelryForm.centerType}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Type</option>
              {jewelryOptions.stoneTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Gem Type</label>
            <select
              name="centerGemType"
              value={jewelryForm.centerGemType}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Gem Type</option>
              {jewelryOptions.gemTypes.map(gemType => (
                <option key={gemType} value={gemType}>{gemType}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Shape</label>
            <select
              name="centerShape"
              value={jewelryForm.centerShape}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Shape</option>
              {jewelryOptions.shapes.map(shape => (
                <option key={shape} value={shape}>{shape}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Color</label>
            <select
              name="centerColor"
              value={jewelryForm.centerColor}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Color</option>
              {jewelryOptions.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Clarity</label>
            <select
              name="centerClarity"
              value={jewelryForm.centerClarity}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Clarity</option>
              {jewelryOptions.clarity.map(clarity => (
                <option key={clarity} value={clarity}>{clarity}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Carat Weight</label>
            <input
              type="number"
              step="0.01"
              name="centerCaratWeight"
              value={jewelryForm.centerCaratWeight}
              onChange={handleJewelryChange}
              placeholder="e.g., 1.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Lab</label>
            <select
              name="centerLab"
              value={jewelryForm.centerLab}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Lab</option>
              {jewelryOptions.labs.map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Polish</label>
            <select
              name="centerPolish"
              value={jewelryForm.centerPolish}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Polish</option>
              {jewelryOptions.grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Symmetry</label>
            <select
              name="centerSymmetry"
              value={jewelryForm.centerSymmetry}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Symmetry</option>
              {jewelryOptions.grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Fancy Color</label>
            <input
              type="text"
              name="centerFancyColor"
              value={jewelryForm.centerFancyColor}
              onChange={handleJewelryChange}
              placeholder="e.g., Yellow, Pink"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Certificate Number</label>
            <input
              type="text"
              name="centerCertNum"
              value={jewelryForm.centerCertNum}
              onChange={handleJewelryChange}
              placeholder="Certificate number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Center Stone Comments</label>
          <textarea
            name="centerComments"
            value={jewelryForm.centerComments}
            onChange={handleJewelryChange}
            placeholder="Additional comments about center stone"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {/* Side Stone Details */}
      <div className="bg-orange-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Side Stone Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Stone Type</label>
            <select
              name="sideType"
              value={jewelryForm.sideType}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Type</option>
              {jewelryOptions.stoneTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Shape</label>
            <select
              name="sideShape"
              value={jewelryForm.sideShape}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Shape</option>
              {jewelryOptions.shapes.map(shape => (
                <option key={shape} value={shape}>{shape}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Carat Weight</label>
            <input
              type="number"
              step="0.01"
              name="sideCaratWeight"
              value={jewelryForm.sideCaratWeight}
              onChange={handleJewelryChange}
              placeholder="e.g., 0.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Color</label>
            <select
              name="sideColor"
              value={jewelryForm.sideColor}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Color</option>
              {jewelryOptions.colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Clarity</label>
            <select
              name="sideClarity"
              value={jewelryForm.sideClarity}
              onChange={handleJewelryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Clarity</option>
              {jewelryOptions.clarity.map(clarity => (
                <option key={clarity} value={clarity}>{clarity}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Side Total Stones</label>
            <input
              type="number"
              name="sideTotalStones"
              value={jewelryForm.sideTotalStones}
              onChange={handleJewelryChange}
              placeholder="e.g., 6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      {/* Location Information */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h4 className="font-semibold text-gray-900">Location Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={jewelryForm.city}
              onChange={handleJewelryChange}
              placeholder="e.g., New York"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={jewelryForm.state}
              onChange={handleJewelryChange}
              placeholder="e.g., NY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={jewelryForm.country}
              onChange={handleJewelryChange}
              placeholder="e.g., USA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      {/* Metal Variations Section */}
      <div className="bg-indigo-50 p-6 rounded-lg space-y-4">
        <JewelryVariationManager
          variations={jewelryForm.metalVariations}
          onChange={(variations) => setJewelryForm(prev => ({ ...prev, metalVariations: variations }))}
          onFileChange={(variationIndex, files, isMain) => {
            // Handle file uploads for variations
            const updated = [...jewelryForm.metalVariations];
            if (isMain && files[0]) {
              updated[variationIndex] = {
                ...updated[variationIndex],
                mainImageFile: files[0]
              };
            } else if (files.length > 0) {
              updated[variationIndex] = {
                ...updated[variationIndex],
                imageFiles: Array.from(files)
              };
            }
            setJewelryForm(prev => ({ ...prev, metalVariations: updated }));
          }}
        />
      </div>
      
      {/* Diamond Origin Options Section */}
      <div className="bg-green-50 p-6 rounded-lg space-y-4">
        <DiamondOriginManager
          origins={jewelryForm.diamondOriginOptions}
          onChange={(origins) => setJewelryForm(prev => ({ ...prev, diamondOriginOptions: origins }))}
          defaultOrigin={jewelryForm.defaultDiamondOrigin}
          onDefaultChange={(index) => setJewelryForm(prev => ({ ...prev, defaultDiamondOrigin: index }))}
        />
      </div>
      
      {/* Size Variations Section */}
      <div className="bg-purple-50 p-6 rounded-lg space-y-4">
        <SizeVariationManager
          variations={jewelryForm.sizeVariations}
          onChange={(variations) => setJewelryForm(prev => ({ ...prev, sizeVariations: variations }))}
          defaultVariation={jewelryForm.defaultSizeVariation}
          onDefaultChange={(index) => setJewelryForm(prev => ({ ...prev, defaultSizeVariation: index }))}
          categoryType={
            jewelryForm.jewelryCategory === 'Ring' ? 'ring' :
            jewelryForm.jewelryCategory === 'Band' ? 'ring' :
            jewelryForm.jewelryCategory === 'Necklace' ? 'necklace' :
            jewelryForm.jewelryCategory === 'Bracelet' ? 'bracelet' :
            jewelryForm.jewelryCategory === 'Earrings' ? 'earring' :
            'general'
          }
        />
      </div>
      
      {/* Images & Video Section */}
      <div className="space-y-6">
        <h4 className="font-semibold text-gray-900">Images & Video (Base Product)</h4>
        <p className="text-sm text-gray-600">These are fallback images if no metal variation is selected</p>
        
        {/* Main Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="imageLink"
              value={jewelryForm.imageLink}
              onChange={handleJewelryChange}
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
        
        {/* Additional Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[2, 3, 4, 5, 6].map(num => (
            <div key={num}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image {num} URL</label>
              <input
                type="url"
                name={`imageLink${num}`}
                value={jewelryForm[`imageLink${num}`]}
                onChange={handleJewelryChange}
                placeholder={`https://example.com/image${num}.jpg`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        
        {/* Gallery Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'galleryImages')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-sm text-gray-500 mt-1">You can select multiple images</p>
        </div>
        
        {/* Video */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
            <input
              type="url"
              name="videoLink"
              value={jewelryForm.videoLink}
              onChange={handleJewelryChange}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
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
          {loading ? 'Adding...' : 'Add Jewelry'}
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
        {selectedCategory === 'natural-diamonds' ? renderNaturalDiamondForm() : null}
        {selectedCategory === 'jewelry' ? renderJewelryForm() : null}
      </div>
    </div>
  );
};

export default AddProduct; 