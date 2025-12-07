import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import JewelryFilters from '../components/jewelry/JewelryFilters';
import { 
  Loader2, 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  List, 
  ArrowUpDown,
  Sparkles,
  Gem as GemIcon,
  Filter
} from 'lucide-react';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

const Jewelry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Category mapping: URL parameter values to actual filter values (standardized)
  const categoryMapping = {
    'ring': 'Ring',
    'rings': 'Ring',
    'engagement': 'Ring', // Legacy support
    'band': 'Band',
    'bands': 'Band',
    'wedding': 'Band', // Legacy support
    'earrings': 'Earrings',
    'earring': 'Earrings',
    'necklace': 'Necklace',
    'necklaces': 'Necklace',
    'bracelet': 'Bracelet',
    'bracelets': 'Bracelet',
    'pendant': 'Pendant',
    'pendants': 'Pendant',
    'tennis-bracelet': 'Tennis Bracelet',
    'eternity-band': 'Eternity Band',
    'jewelry': '', // General jewelry - no specific category filter
  };

  // Reverse mapping: filter values to URL parameter values
  const reverseMapping = {
    'Ring': 'ring',
    'Band': 'band',
    'Earrings': 'earrings',
    'Necklace': 'necklace',
    'Bracelet': 'bracelet',
    'Pendant': 'pendant',
    'Tennis Bracelet': 'tennis-bracelet',
    'Eternity Band': 'eternity-band',
    // Legacy support
    'Engagement Ring': 'ring',
    'Wedding Band': 'band'
  };

  // Parse URL parameters and map them to filter values
  const urlParams = new URLSearchParams(location.search);
  const urlCategory = urlParams.get('category') || '';
  const mappedCategory = categoryMapping[urlCategory.toLowerCase()] || urlCategory;
  
  const [filters, setFilters] = useState({
    jewelryCategory: mappedCategory,
    jewelrySubCategory: urlParams.get('subCategory') || '',
    metal: urlParams.get('metal') || '',
    caratRange: urlParams.get('caratRange') || '',
    priceRange: urlParams.get('priceRange') || '',
    jewelryClassification: urlParams.get('classification') || '',
    centerStoneType: urlParams.get('stoneType') || '',
    centerStoneShape: urlParams.get('stoneShape') || '',
    centerStoneGemType: urlParams.get('gemType') || '',
    brand: urlParams.get('brand') || '',
    sortBy: urlParams.get('sortBy') || 'latest'
  });

  // Default empty filters for reset
  const defaultFilters = {
    jewelryCategory: '',
    jewelrySubCategory: '',
    metal: '',
    caratRange: '',
    priceRange: '',
    jewelryClassification: '',
    centerStoneType: '',
    centerStoneShape: '',
    centerStoneGemType: '',
    brand: '',
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
        // Map internal filter names to URL parameter names
        const urlParamMap = {
          jewelryCategory: 'category',
          jewelrySubCategory: 'subCategory',
          jewelryClassification: 'classification',
          centerStoneType: 'stoneType',
          centerStoneShape: 'stoneShape',
          centerStoneGemType: 'gemType'
        };
        
        const paramName = urlParamMap[key] || key;
        let paramValue = value;
        
        // Use reverse mapping for category values to make URLs user-friendly
        if (key === 'jewelryCategory' && reverseMapping[value]) {
          paramValue = reverseMapping[value];
        }
        
        params.append(paramName, paramValue);
      }
    });
    
    // Update URL without triggering a page reload
    const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    navigate(newUrl, { replace: true });
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Also update URL when filters change
  useEffect(() => {
    updateURL(filters);
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on filters
      const params = new URLSearchParams();
      params.append('productType', 'jewelry');
      
      // Add jewelry-specific filters
      if (filters.jewelryCategory) params.append('jewelryCategory', filters.jewelryCategory);
      if (filters.jewelrySubCategory) params.append('jewelrySubCategory', filters.jewelrySubCategory);
      if (filters.metal) params.append('metal', filters.metal);
      if (filters.jewelryClassification) params.append('jewelryClassification', filters.jewelryClassification);
      if (filters.centerStoneType) params.append('centerStoneType', filters.centerStoneType);
      if (filters.centerStoneShape) params.append('centerStoneShape', filters.centerStoneShape);
      if (filters.centerStoneGemType) params.append('centerStoneGemType', filters.centerStoneGemType);
      if (filters.brand) params.append('brand', filters.brand);
      
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
      
      // Add sorting
      if (filters.sortBy === 'latest') {
        params.append('sort', '-createdAt');
      } else if (filters.sortBy === 'price-asc') {
        params.append('sort', 'price');
      } else if (filters.sortBy === 'price-desc') {
        params.append('sort', '-price');
      } else if (filters.sortBy === 'carat-asc') {
        params.append('sort', 'totalCaratWeight');
      } else if (filters.sortBy === 'carat-desc') {
        params.append('sort', '-totalCaratWeight');
      }
      
      // Fetch products with filters
      let allProducts = [];
      
      try {
        // Pass category parameter to backend API
        const queryParams = new URLSearchParams();
        if (filters.jewelryCategory) {
          queryParams.append('category', filters.jewelryCategory);
        }
        
        const response = await productAPI.getJewelry(queryParams.toString());
        allProducts = response.data || [];
      } catch (apiError) {
        console.error('API error:', apiError);
        // Generate sample products for development if API fails
        allProducts = generateSampleProducts(12);
      }
      
      // Apply client-side filtering if backend doesn't support it
      if (allProducts.length > 0) {
        let filteredProducts = allProducts;
        
        // Apply filters with legacy support
        if (filters.jewelryCategory) {
          filteredProducts = filteredProducts.filter(product => {
            const filterValue = filters.jewelryCategory.toLowerCase();
            
            // Normalize product categories for comparison
            const topLevelCategory = product.category?.toLowerCase() || '';
            const jewelrySpecsCategory = product.jewelrySpecs?.jewelryCategory?.toLowerCase() || '';
            
            // Legacy mapping for old category names
            const legacyMap = {
              'ring': ['ring', 'engagement ring', 'engagement'],
              'band': ['band', 'wedding band', 'wedding'],
              'earrings': ['earrings', 'earring'],
              'necklace': ['necklace', 'necklaces'],
              'bracelet': ['bracelet', 'bracelets'],
              'pendant': ['pendant', 'pendants'],
              'tennis bracelet': ['tennis bracelet'],
              'eternity band': ['eternity band']
            };
            
            // Get all possible matches for the filter value
            const matchValues = legacyMap[filterValue] || [filterValue];
            
            // Check if any match
            return matchValues.some(matchVal => 
              topLevelCategory.includes(matchVal) || 
              jewelrySpecsCategory.includes(matchVal)
            );
          });
        }
        
        if (filters.jewelrySubCategory) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.jewelrySubCategory === filters.jewelrySubCategory
          );
        }
        
        if (filters.metal) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.metal === filters.metal ||
            product.details?.material?.toLowerCase().includes(filters.metal.toLowerCase())
          );
        }
        
        if (filters.jewelryClassification) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.jewelryClassification === filters.jewelryClassification
          );
        }
        
        if (filters.centerStoneType) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.centerStoneType === filters.centerStoneType
          );
        }
        
        if (filters.centerStoneShape) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.centerStoneShape === filters.centerStoneShape
          );
        }
        
        if (filters.centerStoneGemType) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.centerStoneGemType === filters.centerStoneGemType
          );
        }
        
        if (filters.brand) {
          filteredProducts = filteredProducts.filter(product =>
            product.brand?.toLowerCase().includes(filters.brand.toLowerCase())
          );
        }
        
        if (filters.caratRange) {
          const [min, max] = filters.caratRange.split('-');
          const minCarat = parseFloat(min) || 0;
          const maxCarat = max ? parseFloat(max) : Infinity;
          
          filteredProducts = filteredProducts.filter(product => {
            const carat = parseFloat(product.jewelrySpecs?.totalCaratWeight) || 0;
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
        
        // Apply sorting
        if (filters.sortBy === 'price-asc') {
          filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sortBy === 'price-desc') {
          filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (filters.sortBy === 'carat-asc') {
          filteredProducts.sort((a, b) => {
            const caratA = parseFloat(a.jewelrySpecs?.totalCaratWeight) || 0;
            const caratB = parseFloat(b.jewelrySpecs?.totalCaratWeight) || 0;
            return caratA - caratB;
          });
        } else if (filters.sortBy === 'carat-desc') {
          filteredProducts.sort((a, b) => {
            const caratA = parseFloat(a.jewelrySpecs?.totalCaratWeight) || 0;
            const caratB = parseFloat(b.jewelrySpecs?.totalCaratWeight) || 0;
            return caratB - caratA;
          });
        } else if (filters.sortBy === 'latest') {
          filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
        
        setProducts(filteredProducts);
      } else {
        // Generate sample products for development if no real data exists
        const sampleProducts = generateSampleProducts(12);
        setProducts(sampleProducts);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching jewelry:', err);
      setError('Failed to load jewelry. Please try again later.');
      
      // Generate sample products for development on error
      const sampleProducts = generateSampleProducts(12);
      setProducts(sampleProducts);
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

  const generateSampleProducts = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      _id: `sample-${index}`,
      name: `Sample Jewelry ${index + 1}`,
      price: Math.floor(Math.random() * 5000) + 500,
      images: [PLACEHOLDER_IMAGES.product],
      category: 'Jewelry',
      jewelrySpecs: {
        jewelryCategory: ['Ring', 'Band', 'Necklace', 'Earrings'][Math.floor(Math.random() * 4)],
        metal: ['Gold', 'Silver', 'Platinum'][Math.floor(Math.random() * 3)],
        totalCaratWeight: (Math.random() * 2 + 0.5).toFixed(2)
      },
      brand: 'Sample Brand',
      createdAt: new Date()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - DIDOT FOR MAIN HEADING, MONTSERRAT FOR BODY */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl lg:text-3xl font-didot font-medium text-gray-900 mb-2">
                {mappedCategory || 'Jewelry Collection'}
              </h1>
              <p className="font-montserrat text-gray-600">
                Discover our exquisite collection of handcrafted jewelry
              </p>
            </div>
            {/* Desktop View Mode Toggle - MONTSERRAT FOR UI */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-montserrat font-medium hover:bg-primary-dark transition-colors"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-white text-primary text-xs font-montserrat rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - MONTSERRAT FOR UI TEXT */}
      <div className="lg:hidden container mx-auto px-4 py-4">
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className={`hidden lg:block w-80 flex-shrink-0 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-8">
              <JewelryFilters
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
                  {filteredProducts.length > 0 ? 'Our Collection' : 'Browse Jewelry'}
                </h2>
                <p className="font-montserrat text-gray-600 text-sm lg:text-base">
                  {loading ? 'Loading...' : `${filteredProducts.length} items found`}
                </p>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Mobile View Mode Toggle */}
                <div className="lg:hidden flex items-center space-x-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  >
                    <Grid3X3 size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  >
                    <List size={14} />
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
                <GemIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-baskerville font-semibold text-gray-900 mb-2">No jewelry found</h3>
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
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    type="jewelry"
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal - BASKERVILLE FOR HEADINGS */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-baskerville font-semibold text-gray-900">Filter Jewelry</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full pb-20">
                <JewelryFilters
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

export default Jewelry; 