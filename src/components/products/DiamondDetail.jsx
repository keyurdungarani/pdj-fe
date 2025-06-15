import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Truck, 
  Shield, 
  Award,
  Eye,
  Star,
  Sparkles,
  Gem,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from 'lucide-react';
import ConfirmOrderModal from '../common/ConfirmOrderModal';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholderImage';

const DiamondDetail = ({ product, type = 'diamonds' }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    specifications: true,
    about: false,
    quality: false,
    ethical: false
  });

  
  if (!product) return <div className="p-8 text-center">Diamond not found</div>;
  
  const { 
    name, 
    price, 
    mainImage,
    galleryImages = [], 
    description, 
    details = {},
    diamondSpecs = {},
    labGrownSpecs = {},
    productType,
    countInStock,
    originalPrice,
    discount,
    onSale,
    salePrice,
    rating,
    numReviews,
    featured
  } = product;
  
  // Get the appropriate specs based on diamond type - VDB compliant
  const specs = productType === 'lab-grown' ? labGrownSpecs : 
                productType === 'natural-diamond' ? product.naturalDiamondSpecs || diamondSpecs :
                diamondSpecs;
  
  // Extract VDB-compliant diamond characteristics
  const {
    // VDB Core Fields
    stockNumber = specs.stockNumber,
    shape = specs.shape,
    weight = specs.weight, // Carat weight
    color = specs.color,
    clarity = specs.clarity,
    cutGrade = specs.cutGrade,
    polish = specs.polish,
    symmetry = specs.symmetry,
    fluorescenceIntensity = specs.fluorescenceIntensity,
    fluorescenceColor = specs.fluorescenceColor,
    lab = specs.lab, // Certification lab
    certificateNumber = specs.certificateNumber,
    certificateUrl = specs.certificateUrl, // Direct certificate URL
    availability = specs.availability,
    
    // Additional VDB Fields
    depthPercent = specs.depthPercent,
    tablePercent = specs.tablePercent,
    measurements = specs.measurements,
    pricePerCarat = specs.pricePerCarat,
    totalPrice = specs.totalPrice,
    fancyColor = specs.fancyColor,
    fancyColorIntensity = specs.fancyColorIntensity,
    fancyColorOvertone = specs.fancyColorOvertone,
    culetSize = specs.culetSize,
    girdleThick = specs.girdleThick,
    girdleThin = specs.girdleThin,
    crownAngle = specs.crownAngle,
    crownHeight = specs.crownHeight,
    pavilionAngle = specs.pavilionAngle,
    pavilionDepth = specs.pavilionDepth,
    starLength = specs.starLength,
    lowerHalf = specs.lowerHalf,
    girdlePercent = specs.girdlePercent,
    
    // Lab-grown specific
    growthType = specs.growthType, // CVD, HPHT
    
    // Location
    location = specs.location || {},
    
    // Legacy fields for backward compatibility
    carat: legacyCarat = details.carat,
    cut: legacyCut = details.cut,
    certification: legacyCertification = details.certification,
    fluorescence: legacyFluorescence = details.fluorescence,
    table: legacyTable = details.table,
    depth: legacyDepth = details.depth,
    ratio = details.ratio
  } = { ...details, ...specs };
  
  // Use new or legacy values
  const displayCarat = weight || legacyCarat;
  const displayCut = cutGrade || legacyCut;
  const displayCertification = lab || legacyCertification;
  const displayFluorescence = fluorescenceIntensity || legacyFluorescence;
  const displayTable = tablePercent || legacyTable;
  const displayDepth = depthPercent || legacyDepth;
  
  // Certificate verification URL helper - prioritizes certificateUrl if available
  const getCertificateUrl = (certUrl, certNumber, labName) => {
    // Priority 1: Use direct certificate URL if available
    if (certUrl && certUrl.trim()) {
      return certUrl;
    }
    
    // Priority 2: Construct URL using certificate number and lab
    if (!certNumber) return '';
    
    const labUpper = labName?.toUpperCase() || '';
    
    switch (labUpper) {
      case 'GIA':
        return `https://www.gia.edu/report-check?reportno=${certNumber}`;
      case 'IGI':
        return `https://www.igi.org/verify-your-report/?r=${certNumber}`;
      case 'AGS':
        return `https://www.americangemsociety.org/diamond-grading-services/light-performance/ideal-cut-diamonds/`;
      case 'GCAL':
        return `https://www.gcal.com/certificate-search/?certificate_id=${certNumber}`;
      case 'EGL':
        return `https://www.eglusa.com/verify-report/?report=${certNumber}`;
      case 'GSI':
        return `https://www.gemsciences.com/certificate-verification/?cert=${certNumber}`;
      default:
        // Default to IGI for unknown labs
        return `https://www.igi.org/verify-your-report/?r=${certNumber}`;
    }
  };
  
  const formattedPrice = price?.toLocaleString('en-US') || '';
  const formattedOriginalPrice = originalPrice?.toLocaleString('en-US') || '';
  const formattedSalePrice = salePrice?.toLocaleString('en-US') || '';
  
  // Process images
  const processImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_IMAGES.diamond;
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${import.meta.env.VITE_LOCAL_API || ''}${imagePath}`;
  };
  
  const processedMainImage = processImageUrl(mainImage);
  const processedGalleryImages = galleryImages.map(img => processImageUrl(img));
  const allImages = processedMainImage ? [processedMainImage, ...processedGalleryImages] : processedGalleryImages;
  const currentImageUrl = allImages.length > 0 ? allImages[selectedImage] : PLACEHOLDER_IMAGES.diamond;
  
  // Grade color coding for diamond characteristics
  const getGradeColor = (grade, type) => {
    if (!grade) return 'text-gray-500';
    
    const gradeUpper = grade.toString().toUpperCase();
    
    if (type === 'cut') {
      return gradeUpper === 'IDEAL' || gradeUpper === 'EXCELLENT' ? 'text-green-600' :
             gradeUpper === 'VERY GOOD' ? 'text-blue-600' :
             gradeUpper === 'GOOD' ? 'text-yellow-600' : 'text-gray-600';
    }
    
    if (type === 'color') {
      return ['D', 'E', 'F'].includes(gradeUpper) ? 'text-green-600' :
             ['G', 'H', 'I', 'J'].includes(gradeUpper) ? 'text-blue-600' :
             ['K', 'L', 'M'].includes(gradeUpper) ? 'text-yellow-600' : 'text-orange-600';
    }
    
    if (type === 'clarity') {
      return ['FL', 'IF'].includes(gradeUpper) ? 'text-green-600' :
             gradeUpper.includes('VVS') ? 'text-blue-600' :
             gradeUpper.includes('VS') ? 'text-yellow-600' : 'text-orange-600';
    }
    
    if (type === 'fluorescence') {
      return gradeUpper === 'NONE' ? 'text-green-600' :
             gradeUpper === 'FAINT' ? 'text-blue-600' :
             ['MEDIUM', 'STRONG'].includes(gradeUpper) ? 'text-yellow-600' : 'text-orange-600';
    }
    
    return 'text-gray-600';
  };
  
  // Get description for grades
  const getGradeDescription = (grade, type) => {
    if (!grade) return '';
    
    const gradeUpper = grade.toString().toUpperCase();
    
    if (type === 'color') {
      if (['D', 'E', 'F'].includes(gradeUpper)) return 'Colorless';
      if (['G', 'H', 'I', 'J'].includes(gradeUpper)) return 'Near Colorless';
      if (['K', 'L', 'M'].includes(gradeUpper)) return 'Faint Yellow';
      return 'Light Yellow';
    }
    
    if (type === 'clarity') {
      if (gradeUpper === 'FL') return 'Flawless';
      if (gradeUpper === 'IF') return 'Internally Flawless';
      if (gradeUpper.includes('VVS')) return 'Very Very Slightly Included';
      if (gradeUpper.includes('VS')) return 'Very Slightly Included';
      if (gradeUpper.includes('SI')) return 'Slightly Included';
    }
    
    return '';
  };
  
  // Get availability status dynamically with fallback to VDB specs
  const getAvailabilityStatus = () => {
    // First check if countInStock is properly set
    if (countInStock !== undefined && countInStock !== null) {
      if (countInStock > 5) {
        return { 
          text: `In Stock (${countInStock} available)`, 
          color: 'text-green-600', 
          icon: <CheckCircle size={16} className="mr-1" /> 
        };
      } else if (countInStock > 0) {
        return { 
          text: `Limited Stock (${countInStock} remaining)`, 
          color: 'text-yellow-600', 
          icon: <CheckCircle size={16} className="mr-1" /> 
        };
      } else {
        return { 
          text: 'Currently Unavailable', 
          color: 'text-red-600', 
          icon: null 
        };
      }
    }
    
    // Fallback to VDB availability from specs
    let vdbAvailability = null;
    if (productType === 'lab-grown' && product.labGrownSpecs?.availability) {
      vdbAvailability = product.labGrownSpecs.availability;
    } else if (productType === 'natural-diamond' && product.naturalDiamondSpecs?.availability) {
      vdbAvailability = product.naturalDiamondSpecs.availability;
    }
    
    if (vdbAvailability) {
      const availabilityLower = vdbAvailability.toString().toLowerCase();
      if (availabilityLower === 'available' || availabilityLower === 'guaranteed available' || availabilityLower === 'g') {
        return { 
          text: 'Available', 
          color: 'text-green-600', 
          icon: <CheckCircle size={16} className="mr-1" /> 
        };
      } else if (availabilityLower === 'unavailable' || availabilityLower === 'na') {
        return { 
          text: 'Currently Unavailable', 
          color: 'text-red-600', 
          icon: null 
        };
      }
    }
    
    // Final fallback
    return { text: 'Availability Unknown', color: 'text-gray-600', icon: null };
  };
  
  const availabilityStatus = getAvailabilityStatus();
  
  // Helper function to check if product is available for purchase
  const isProductAvailable = () => {
    // First check countInStock
    if (countInStock !== undefined && countInStock !== null) {
      return countInStock > 0;
    }
    
    // Fallback to VDB availability from specs
    let vdbAvailability = null;
    if (productType === 'lab-grown' && product.labGrownSpecs?.availability) {
      vdbAvailability = product.labGrownSpecs.availability;
    } else if (productType === 'natural-diamond' && product.naturalDiamondSpecs?.availability) {
      vdbAvailability = product.naturalDiamondSpecs.availability;
    }
    
    if (vdbAvailability) {
      const availabilityLower = vdbAvailability.toString().toLowerCase();
      return availabilityLower === 'available' || availabilityLower === 'guaranteed available' || availabilityLower === 'g';
    }
    
    // Default to unavailable if no availability info
    return false;
  };
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const openFullscreen = () => {
    setShowFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
    document.body.style.overflow = '';
  };
  

  
  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <span>Home</span>
              <ChevronRight size={16} className="mx-2" />
              <span>Diamonds</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-gray-900">{name}</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Diamond Images - Same size as JewelryDetail */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg aspect-square bg-white border border-gray-200">
                <img
                  src={currentImageUrl}
                  alt={name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGES.diamond;
                  }}
                />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button 
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="360° View"
                  >
                    <RotateCw size={20} className="text-gray-700" />
                  </button>
                  
                  <button 
                    onClick={openFullscreen}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="View Fullscreen"
                  >
                    <Eye size={20} className="text-gray-700" />
                  </button>
                </div>
                
                {/* Diamond Type Badge */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    productType === 'lab-grown' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {productType === 'lab-grown' ? 'Lab-Grown Diamond' : 'Natural Diamond'}
                  </div>
                  {featured && (
                    <div className="bg-amber-400 text-white text-xs font-medium py-1 px-2 rounded">
                      Featured
                    </div>
                  )}
                  {onSale && (
                    <div className="bg-red-500 text-white text-xs font-medium py-1 px-2 rounded">
                      SALE
                    </div>
                  )}
                </div>
                
                {/* Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight size={24} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex overflow-x-auto space-x-2 py-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden ${
                        selectedImage === idx ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${name} - view ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMAGES.thumbnail;
                        }}
                      />
                    </button>
                  ))}
                  {/* Certificate Thumbnail - Attractive Design */}
                  {certificateNumber && (
                                          <button
                        onClick={() => window.open(getCertificateUrl(certificateUrl, certificateNumber, displayCertification), '_blank')}
                        className="flex-shrink-0 w-16 h-16 border-2 border-orange-200 rounded overflow-hidden bg-gradient-to-br from-orange-200 via-orange-300 to-amber-300 hover:from-orange-300 hover:via-orange-400 hover:to-amber-400 text-gray-800 flex flex-col items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="View Certificate"
                      >
                        <Award size={16} className="mb-1 text-red-700" />
                        <span className="text-[8px] font-bold uppercase tracking-wider leading-tight text-center text-gray-800">
                          View<br />Cert
                        </span>
                      </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Right: Diamond Details */}
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">💎</span>
                    <span className="text-sm text-gray-500 uppercase tracking-wider">
                      {productType === 'lab-grown' ? 'Lab-Grown Diamond' : 'Natural Diamond'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
                  <div className="flex items-center space-x-2 mb-2">
                    {displayCertification && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {displayCertification} Certified
                      </span>
                    )}
                    {stockNumber && (
                      <span className="text-sm text-gray-500">SKU: {stockNumber}</span>
                    )}
                    {certificateNumber && (
                      <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Cert #: </span>
                      <button
                        onClick={() => window.open(getCertificateUrl(certificateUrl, certificateNumber, displayCertification), '_blank')}
                        className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        title="View Certificate"
                      >
                        {certificateNumber}
                      </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    {onSale && salePrice ? (
                      <>
                        <span className="text-3xl font-bold text-red-600">${formattedSalePrice}</span>
                        <span className="text-lg text-gray-500 line-through">${formattedPrice}</span>
                        {discount && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                            {discount}% OFF
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">${formattedPrice}</span>
                    )}
                  </div>
                </div>
                
                {/* Availability - Dynamic */}
                {(countInStock !== undefined && countInStock !== null) && (
                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mb-6">
                    <span className="text-gray-700 font-medium">Availability:</span>
                    <span className={`font-medium flex items-center ${availabilityStatus.color}`}>
                      {availabilityStatus.icon}
                      {availabilityStatus.text}
                    </span>
                  </div>
                )}
                
                {/* Key Specifications Grid - 4Cs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {displayCarat && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{displayCarat} ct</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Carat</div>
                      {pricePerCarat && (
                        <div className="text-xs text-gray-400">${pricePerCarat.toLocaleString()}/ct</div>
                      )}
                    </div>
                  )}
                  {displayCut && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-lg font-bold ${getGradeColor(displayCut, 'cut')}`}>{displayCut}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Cut</div>
                    </div>
                  )}
                  {color && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-lg font-bold ${getGradeColor(color, 'color')}`}>{color}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Color</div>
                      {getGradeDescription(color, 'color') && (
                        <div className="text-xs text-gray-400">{getGradeDescription(color, 'color')}</div>
                      )}
                      {fancyColor && (
                        <div className="text-xs text-blue-600 font-medium">{fancyColor}</div>
                      )}
                    </div>
                  )}
                  {clarity && (
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className={`text-lg font-bold ${getGradeColor(clarity, 'clarity')}`}>{clarity}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Clarity</div>
                      {getGradeDescription(clarity, 'clarity') && (
                        <div className="text-xs text-gray-400">{getGradeDescription(clarity, 'clarity')}</div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Certificate Section */}
                {/* {certificateNumber && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Diamond Certificate</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Certified by {displayCertification || 'IGI'}
                        </p>
                        <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Cert #: </span>
                        <button
                          onClick={() => window.open(getCertificateUrl(certificateUrl, certificateNumber, displayCertification), '_blank')}
                          className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                        >
                          {certificateNumber}
                        </button>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(getCertificateUrl(certificateUrl, certificateNumber, displayCertification), '_blank')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Award size={16} />
                        View Certificate
                      </button>
                    </div>
                  </div>
                )} */}
                
                {/* Ratings - Only show if rating exists */}
                {rating > 0 && (
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">{rating.toFixed(1)} ({numReviews || 0} reviews)</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowConfirmModal(true)}
                    disabled={!isProductAvailable()}
                    className={`flex-1 py-3 px-6 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isProductAvailable() 
                        ? 'bg-primary hover:bg-primary-dark text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={18} />
                    Place Order
                  </button>
                  
                  {/* <button 
                    className="p-3 border border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center"
                    title="Add to Wishlist"
                  >
                    <Heart size={18} />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          
          {/* Description - Only show if exists */}
          {description && (
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          )}
          
          {/* Detailed Specifications */}
          <div className="mt-8 bg-white rounded-lg shadow-sm">
            <button
              onClick={() => toggleSection('specifications')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900">Diamond Specifications</h3>
              {expandedSections.specifications ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
            {expandedSections.specifications && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 gap-3">
                  {/* Basic Information */}
                  {stockNumber && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium text-gray-900">{stockNumber}</span>
                    </div>
                  )}
                  {shape && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Shape:</span>
                      <span className="font-medium text-gray-900">{shape}</span>
                    </div>
                  )}
                  {displayCarat && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Carat Weight:</span>
                      <span className="font-medium text-gray-900">{displayCarat} ct</span>
                    </div>
                  )}
                  {pricePerCarat && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Price Per Carat:</span>
                      <span className="font-medium text-gray-900">${pricePerCarat.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {/* Quality Grades */}
                  <div className="mt-4 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Quality Grades</h4>
                  </div>
                  {color && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Color:</span>
                      <div className="text-right">
                        <span className={`font-medium ${getGradeColor(color, 'color')}`}>{color}</span>
                        {getGradeDescription(color, 'color') && (
                          <div className="text-xs text-gray-500">{getGradeDescription(color, 'color')}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {clarity && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Clarity:</span>
                      <div className="text-right">
                        <span className={`font-medium ${getGradeColor(clarity, 'clarity')}`}>{clarity}</span>
                        {getGradeDescription(clarity, 'clarity') && (
                          <div className="text-xs text-gray-500">{getGradeDescription(clarity, 'clarity')}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {displayCut && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Cut Grade:</span>
                      <span className={`font-medium ${getGradeColor(displayCut, 'cut')}`}>{displayCut}</span>
                    </div>
                  )}
                  {polish && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Polish:</span>
                      <span className={`font-medium ${getGradeColor(polish, 'cut')}`}>{polish}</span>
                    </div>
                  )}
                  {symmetry && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Symmetry:</span>
                      <span className={`font-medium ${getGradeColor(symmetry, 'cut')}`}>{symmetry}</span>
                    </div>
                  )}
                  
                  {/* Optical Properties */}
                  <div className="mt-4 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Optical Properties</h4>
                  </div>
                  {displayFluorescence && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Fluorescence:</span>
                      <div className="text-right">
                        <span className={`font-medium ${getGradeColor(displayFluorescence, 'fluorescence')}`}>{displayFluorescence}</span>
                        {fluorescenceColor && (
                          <div className="text-xs text-gray-500">{fluorescenceColor}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {displayTable && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Table:</span>
                      <span className="font-medium text-gray-900">{displayTable}%</span>
                    </div>
                  )}
                  {displayDepth && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Depth:</span>
                      <span className="font-medium text-gray-900">{displayDepth}%</span>
                    </div>
                  )}
                  {ratio && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Length/Width Ratio:</span>
                      <span className="font-medium text-gray-900">{ratio}</span>
                    </div>
                  )}
                  
                  {/* Physical Measurements */}
                  {(measurements || crownAngle || pavilionAngle) && (
                    <>
                      <div className="mt-4 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Physical Measurements</h4>
                      </div>
                      {measurements && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Measurements:</span>
                          <span className="font-medium text-gray-900">{measurements} mm</span>
                        </div>
                      )}
                      {crownAngle && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Crown Angle:</span>
                          <span className="font-medium text-gray-900">{crownAngle}°</span>
                        </div>
                      )}
                      {pavilionAngle && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Pavilion Angle:</span>
                          <span className="font-medium text-gray-900">{pavilionAngle}°</span>
                        </div>
                      )}
                      {girdleThick && girdleThin && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Girdle:</span>
                          <span className="font-medium text-gray-900">{girdleThin} to {girdleThick}</span>
                        </div>
                      )}
                      {culetSize && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Culet:</span>
                          <span className="font-medium text-gray-900">{culetSize}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Fancy Color Details */}
                  {fancyColor && (
                    <>
                      <div className="mt-4 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Fancy Color</h4>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Fancy Color:</span>
                        <span className="font-medium text-blue-600">{fancyColor}</span>
                      </div>
                      {fancyColorIntensity && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Intensity:</span>
                          <span className="font-medium text-gray-900">{fancyColorIntensity}</span>
                        </div>
                      )}
                      {fancyColorOvertone && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Overtone:</span>
                          <span className="font-medium text-gray-900">{fancyColorOvertone}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Lab-Grown Specific */}
                  {productType === 'lab-grown' && growthType && (
                    <>
                      <div className="mt-4 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Lab-Grown Details</h4>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Growth Method:</span>
                        <span className="font-medium text-green-600">{growthType}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Certification */}
                  <div className="mt-4 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Certification</h4>
                  </div>
                  {displayCertification && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Laboratory:</span>
                      <span className="font-medium text-blue-600">{displayCertification}</span>
                    </div>
                  )}
                  {certificateNumber && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Certificate Number:</span>
                      <button
                        onClick={() => window.open(getCertificateUrl(certificateUrl, certificateNumber, displayCertification), '_blank')}
                        className="font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer flex items-center gap-1"
                        title="View Certificate"
                      >
                        {certificateNumber}
                        <Award size={14} />
                      </button>
                    </div>
                  )}
                  
                  {/* Location */}
                  {location && (location.city || location.state || location.country) && (
                    <>
                      <div className="mt-4 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Location</h4>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900">
                          {[location.city, location.state, location.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Educational Content Sections */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Lab-Grown Diamonds */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('about')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Sparkles size={20} className="text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    About {productType === 'lab-grown' ? 'Lab-Grown' : 'Natural'} Diamonds
                  </h3>
                </div>
                {expandedSections.about ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.about && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    {productType === 'lab-grown' ? (
                      <>
                        <p>Lab-grown diamonds are real diamonds created in controlled laboratory environments using advanced technological processes.</p>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Chemically, physically, and optically identical to natural diamonds</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>More environmentally sustainable</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Exceptional value and quality</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Available in larger sizes and rare colors</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>Natural diamonds are formed deep within the Earth over billions of years under extreme pressure and temperature.</p>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Each diamond is completely unique</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Billions of years in the making</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Traditional symbol of enduring love</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Exceptional rarity and value</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quality Services */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('quality')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Award size={20} className="text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Our Quality Promise</h3>
                </div>
                {expandedSections.quality ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.quality && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Lifetime warranty on all diamonds</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Free worldwide shipping</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Expert gemologist certification</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Ethical Sourcing */}
            <div className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection('ethical')}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Shield size={20} className="text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Ethical Sourcing</h3>
                </div>
                {expandedSections.ethical ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.ethical && (
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>We are committed to ethical practices in every aspect of our diamond sourcing and creation.</p>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>100% conflict-free diamonds</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Environmentally responsible practices</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Full transparency in sourcing</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={closeFullscreen}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white border border-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={currentImageUrl}
              alt={name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onError={(e) => {
                e.target.src = PLACEHOLDER_IMAGES.diamond;
              }}
            />
            
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronLeft size={32} className="text-white" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronRight size={32} className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirm Order Modal */}
      <ConfirmOrderModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        productName={name}
        productPrice={onSale && salePrice ? salePrice : price}
        productImage={currentImageUrl}
        productId={product._id}
        productType="Diamond"
        stockNumber={product?.stockNumber}
        product={product}
      />
    </>
  );
};

export default DiamondDetail; 