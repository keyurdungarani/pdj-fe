import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import DiamondCard from '../components/products/DiamondCard';
import DiamondFilters from '../components/diamonds/DiamondFilters';
import { 
  Loader2, 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  List, 
  ArrowUpDown,
  Sparkles,
  Beaker,
  Diamond as DiamondIcon,
  Filter
} from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

const Diamonds = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [diamondType, setDiamondType] = useState('lab-grown'); // 'natural', 'lab-grown' - default to lab-grown
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  
  // Helper function to normalize shape name (capitalize first letter)
  const normalizeShape = (shape) => {
    if (!shape) return '';
    return shape.charAt(0).toUpperCase() + shape.slice(1).toLowerCase();
  };
  
  const [filters, setFilters] = useState({
    shape: normalizeShape(urlParams.get('shape')) || '',
    cut: urlParams.get('cut') || '',
    color: urlParams.get('color') || '',
    clarity: urlParams.get('clarity') || '',
    caratRange: urlParams.get('caratRange') || '',
    priceRange: urlParams.get('priceRange') || '',
    certification: urlParams.get('certification') || '',
    sortBy: urlParams.get('sortBy') || 'latest'
  });

  // Default empty filters for reset
  const defaultFilters = {
    shape: '',
    cut: '',
    color: '',
    clarity: '',
    caratRange: '',
    priceRange: '',
    certification: '',
    sortBy: 'latest'
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    value => value !== '' && value !== 'latest'
  ).length;

  // Products are already filtered in fetchProducts
  const filteredProducts = products;

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    
    // Add non-empty filters to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'latest') {
        // Convert shape to lowercase for consistent URLs
        const urlValue = key === 'shape' ? value.toLowerCase() : value;
        params.append(key, urlValue);
      }
    });
    
    // Update URL without triggering a page reload
    const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, diamondType]);

  // Also update URL when filters change
  useEffect(() => {
    updateURL(filters);
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on filters and diamond type
      const params = new URLSearchParams();
      
      // Add product type filter
      if (diamondType === 'natural') {
        params.append('productType', 'diamond');
      } else if (diamondType === 'lab-grown') {
        params.append('productType', 'lab-grown');
      }
      
      // Add other filters
      if (filters.shape) params.append('shape', filters.shape);
      if (filters.cut) params.append('cut', filters.cut);
      if (filters.color) params.append('color', filters.color);
      if (filters.clarity) params.append('clarity', filters.clarity);
      
      if (filters.caratRange) {
        const [min, max] = filters.caratRange.split('-');
        if (min) params.append('minCarat', min);
        if (max) params.append('maxCarat', max);
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) params.append('minPrice', min);
        if (max) params.append('maxPrice', max);
      }
      
      if (filters.certification) params.append('certification', filters.certification);
      
      // Add sorting
      if (filters.sortBy === 'latest') {
        params.append('sort', '-createdAt');
      } else if (filters.sortBy === 'price-asc') {
        params.append('sort', 'price');
      } else if (filters.sortBy === 'price-desc') {
        params.append('sort', '-price');
      } else if (filters.sortBy === 'carat-asc') {
        params.append('sort', 'carat');
      } else if (filters.sortBy === 'carat-desc') {
        params.append('sort', '-carat');
      }
      
      // Fetch products with filters
      let allProducts = [];
      
      // Create query string from params
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      if (diamondType === 'natural') {
        const response = await productAPI.getNaturalDiamonds();
        allProducts = response.data || [];
      } else if (diamondType === 'lab-grown') {
        const response = await productAPI.getLabGrown();
        allProducts = response.data || [];
      }
      
      // Apply client-side filtering if backend doesn't support it
      if (allProducts.length > 0) {
        let filteredProducts = allProducts;
        
        // Apply filters
        if (filters.shape) {
          filteredProducts = filteredProducts.filter(product => 
            product.details?.shape?.toLowerCase() === filters.shape.toLowerCase() ||
            product.diamondSpecs?.shape?.toLowerCase() === filters.shape.toLowerCase() ||
            product.labGrownSpecs?.shape?.toLowerCase() === filters.shape.toLowerCase() ||
            product.naturalDiamondSpecs?.shape?.toLowerCase() === filters.shape.toLowerCase()
          );
        }
        
        if (filters.cut) {
          filteredProducts = filteredProducts.filter(product =>
            product.details?.cut?.toLowerCase() === filters.cut.toLowerCase() ||
            product.diamondSpecs?.cutGrade?.toLowerCase() === filters.cut.toLowerCase() ||
            product.labGrownSpecs?.cutGrade?.toLowerCase() === filters.cut.toLowerCase() ||
            product.naturalDiamondSpecs?.cutGrade?.toLowerCase() === filters.cut.toLowerCase()
          );
        }
        
        if (filters.color) {
          filteredProducts = filteredProducts.filter(product =>
            product.details?.color?.toLowerCase() === filters.color.toLowerCase() ||
            product.diamondSpecs?.color?.toLowerCase() === filters.color.toLowerCase() ||
            product.labGrownSpecs?.color?.toLowerCase() === filters.color.toLowerCase() ||
            product.naturalDiamondSpecs?.color?.toLowerCase() === filters.color.toLowerCase()
          );
        }
        
        if (filters.clarity) {
          filteredProducts = filteredProducts.filter(product =>
            product.details?.clarity?.toLowerCase() === filters.clarity.toLowerCase() ||
            product.diamondSpecs?.clarity?.toLowerCase() === filters.clarity.toLowerCase() ||
            product.labGrownSpecs?.clarity?.toLowerCase() === filters.clarity.toLowerCase() ||
            product.naturalDiamondSpecs?.clarity?.toLowerCase() === filters.clarity.toLowerCase()
          );
        }
        
        if (filters.caratRange) {
          const [min, max] = filters.caratRange.split('-');
          const minCarat = parseFloat(min) || 0;
          const maxCarat = max ? parseFloat(max) : Infinity;
          
          filteredProducts = filteredProducts.filter(product => {
            const carat = parseFloat(product.details?.carat) || 
                         parseFloat(product.diamondSpecs?.weight) || 
                         parseFloat(product.labGrownSpecs?.weight) || 
                         parseFloat(product.naturalDiamondSpecs?.weight) || 0;
            return carat >= minCarat && carat <= maxCarat;
          });
        }
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          const minPrice = parseFloat(min) || 0;
          const maxPrice = max ? parseFloat(max) : Infinity;
          
          filteredProducts = filteredProducts.filter(product => {
            const price = product.price || 0;
            return price >= minPrice && price <= maxPrice;
          });
        }
        
        if (filters.certification) {
          filteredProducts = filteredProducts.filter(product =>
            product.details?.certification?.toLowerCase() === filters.certification.toLowerCase() ||
            product.diamondSpecs?.lab?.toLowerCase() === filters.certification.toLowerCase() ||
            product.labGrownSpecs?.lab?.toLowerCase() === filters.certification.toLowerCase() ||
            product.naturalDiamondSpecs?.lab?.toLowerCase() === filters.certification.toLowerCase()
          );
        }
        
        // Apply sorting
        if (filters.sortBy === 'price-asc') {
          filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sortBy === 'price-desc') {
          filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (filters.sortBy === 'carat-asc') {
          filteredProducts.sort((a, b) => {
            const caratA = parseFloat(a.details?.carat) || parseFloat(a.diamondSpecs?.weight) || parseFloat(a.labGrownSpecs?.weight) || parseFloat(a.naturalDiamondSpecs?.weight) || 0;
            const caratB = parseFloat(b.details?.carat) || parseFloat(b.diamondSpecs?.weight) || parseFloat(b.labGrownSpecs?.weight) || parseFloat(b.naturalDiamondSpecs?.weight) || 0;
            return caratA - caratB;
          });
        } else if (filters.sortBy === 'carat-desc') {
          filteredProducts.sort((a, b) => {
            const caratA = parseFloat(a.details?.carat) || parseFloat(a.diamondSpecs?.weight) || parseFloat(a.labGrownSpecs?.weight) || parseFloat(a.naturalDiamondSpecs?.weight) || 0;
            const caratB = parseFloat(b.details?.carat) || parseFloat(b.diamondSpecs?.weight) || parseFloat(b.labGrownSpecs?.weight) || parseFloat(b.naturalDiamondSpecs?.weight) || 0;
            return caratB - caratA;
          });
        } else if (filters.sortBy === 'latest') {
          filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
        
        setProducts(filteredProducts);
      } else {
        // Only generate sample products for lab-grown diamonds when no real data exists
        if (diamondType === 'lab-grown') {
          // Show sample data only for lab-grown diamonds
          const sampleProducts = generateSampleDiamonds(12, diamondType);
          setProducts(sampleProducts);
        } else {
          // For natural diamonds, show empty state instead of dummy data
          setProducts([]);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching diamonds:', err);
      setError('Failed to load diamonds. Please try again later.');
      
      // Only generate sample products for lab-grown diamonds on error
      if (diamondType === 'lab-grown') {
        const sampleProducts = generateSampleDiamonds(12, diamondType);
        setProducts(sampleProducts);
      } else {
        // For natural diamonds, show empty state on error
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilters(defaultFilters);
  };

  // Handle diamond type change
  const handleDiamondTypeChange = (type) => {
    setDiamondType(type);
    // Reset filters when changing diamond type
    setFilters(defaultFilters);
  };

  // Helper function to generate sample diamonds for development
  const generateSampleDiamonds = (count, type = 'lab-grown') => {
    const cutTypes = ['Ideal', 'Excellent', 'Very Good', 'Good'];
    const colorGrades = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    const clarityGrades = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
    const shapes = ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Radiant', 'Pear', 'Marquise'];
    const certifications = ['GIA', 'IGI', 'AGS'];
    
    const sampleDiamonds = [];
    
    for (let i = 1; i <= count; i++) {
      const carat = (Math.random() * 3 + 0.3).toFixed(2);
      const randomPrice = Math.floor(Math.random() * 5000) + 1000; // USD pricing
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const cut = cutTypes[Math.floor(Math.random() * cutTypes.length)];
      const color = colorGrades[Math.floor(Math.random() * colorGrades.length)];
      const clarity = clarityGrades[Math.floor(Math.random() * clarityGrades.length)];
      const certification = certifications[Math.floor(Math.random() * certifications.length)];
      const hasDiscount = Math.random() > 0.8;
      const discount = hasDiscount ? Math.floor(Math.random() * 15) + 5 : 0;
      const originalPrice = hasDiscount ? Math.floor(randomPrice * (100 / (100 - discount))) : randomPrice;
      
      // Determine product type
      let productType = 'lab-grown';
      if (type === 'natural') {
        productType = 'diamond';
      }
      
      sampleDiamonds.push({
        _id: `sample-diamond-${i}`,
        name: `${carat} Carat ${shape} ${productType === 'lab-grown' ? 'Lab-Grown' : 'Natural'} Diamond`,
        price: randomPrice,
        originalPrice: hasDiscount ? originalPrice : null,
        discount: hasDiscount ? discount : null,
        productType: productType,
        mainImage: PLACEHOLDER_IMAGES.diamond,
        galleryImages: [
          PLACEHOLDER_IMAGES.diamond,
          PLACEHOLDER_IMAGES.diamond,
        ],
        isNewArrival: Math.random() > 0.9,
        featured: Math.random() > 0.8,
        details: {
          shape: shape,
          carat: carat,
          cut: cut,
          color: color,
          clarity: clarity,
          certification: certification,
          polish: ['Excellent', 'Very Good'][Math.floor(Math.random() * 2)],
          symmetry: ['Excellent', 'Very Good'][Math.floor(Math.random() * 2)],
          fluorescence: ['None', 'Faint', 'Medium'][Math.floor(Math.random() * 3)],
        },
        // Add specs in the format expected by DiamondCard
        [productType === 'lab-grown' ? 'labGrownSpecs' : 'diamondSpecs']: {
          weight: carat,
          cutGrade: cut,
          color: color,
          clarity: clarity,
          shape: shape,
          lab: certification,
          fluorescenceIntensity: ['None', 'Faint', 'Medium'][Math.floor(Math.random() * 3)],
        }
      });
    }
    
    return sampleDiamonds;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - DIDOT FOR IMPACT */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-didot font-medium mb-4">
              Discover Your Perfect Diamond
            </h1>
            <p className="text-xl font-montserrat text-gray-300 max-w-3xl mx-auto">
              Explore our curated collection of certified natural and lab-grown diamonds. 
              Each stone is hand-selected for exceptional quality and brilliance.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Diamond Type Tabs - BASKERVILLE FOR SUBHEADS, MONTSERRAT FOR BODY */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-baskerville font-semibold text-gray-900 mb-2">Browse Our Collection</h2>
              <p className="font-montserrat text-gray-600">Filter by diamond type to find exactly what you're looking for</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDiamondTypeChange('lab-grown')}
                className={`flex items-center px-4 py-2 rounded-lg font-montserrat font-medium transition-all ${
                  diamondType === 'lab-grown'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Beaker size={18} className="mr-2" />
                Lab-Grown Diamonds
              </button>
              
              <button
                onClick={() => handleDiamondTypeChange('natural')}
                className={`flex items-center px-4 py-2 rounded-lg font-montserrat font-medium transition-all ${
                  diamondType === 'natural'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Sparkles size={18} className="mr-2" />
                Natural Diamonds
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button - MONTSERRAT FOR UI TEXT */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg py-3 px-4 font-montserrat font-medium text-gray-700 hover:bg-gray-50 relative"
          >
            <Filter size={20} className="mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs font-montserrat rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <DiamondFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearAllFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header - BASKERVILLE FOR SUBHEADS, MONTSERRAT FOR BODY */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-baskerville font-semibold text-gray-900 mb-2">
                  {diamondType === 'lab-grown' ? 'Lab-Grown' : 'Natural'} Diamonds
                </h2>
                <p className="font-montserrat text-gray-600 text-sm lg:text-base">
                  {loading ? 'Loading...' : `${filteredProducts.length} diamonds found`}
                </p>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Desktop View Mode Toggle */}
                <div className="hidden lg:flex items-center space-x-2">
                  <span className="text-sm font-montserrat text-gray-500">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
                {/* Sort Dropdown - MONTSERRAT FOR UI */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 lg:px-3 lg:py-2 text-sm lg:text-base font-montserrat focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="latest">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="carat-asc">Carat: Low to High</option>
                  <option value="carat-desc">Carat: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="font-montserrat text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-montserrat font-medium hover:bg-primary-dark transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <DiamondIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-baskerville font-semibold text-gray-900 mb-2">No diamonds found</h3>
                <p className="font-montserrat text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={handleClearAllFilters}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-montserrat font-medium hover:bg-primary-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 lg:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((diamond) => (
                  <DiamondCard
                    key={diamond._id}
                    diamond={diamond}
                    type="diamonds"
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal - BASKERVILLE FOR HEADINGS, MONTSERRAT FOR UI */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-baskerville font-semibold text-gray-900">Filter Diamonds</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full pb-20">
                <DiamondFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearAllFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diamonds;
