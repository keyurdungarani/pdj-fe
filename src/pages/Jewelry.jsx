import React, { useState, useEffect } from 'react';
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const [filters, setFilters] = useState({
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

  useEffect(() => {
    fetchProducts();
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
        const response = await productAPI.getJewelry();
        allProducts = response.data || [];
      } catch (apiError) {
        console.error('API error:', apiError);
        // Generate sample products for development if API fails
        allProducts = generateSampleProducts(12);
      }
      
      // Apply client-side filtering if backend doesn't support it
      if (allProducts.length > 0) {
        let filteredProducts = allProducts;
        
        // Apply filters
        if (filters.jewelryCategory) {
          filteredProducts = filteredProducts.filter(product => 
            product.jewelrySpecs?.jewelryCategory === filters.jewelryCategory ||
            product.category?.toLowerCase() === filters.jewelryCategory.toLowerCase()
          );
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
            product.jewelrySpecs?.centerStone?.type === filters.centerStoneType
          );
        }
        
        if (filters.centerStoneShape) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.centerStone?.shape === filters.centerStoneShape
          );
        }
        
        if (filters.centerStoneGemType) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.centerStone?.gemType === filters.centerStoneGemType
          );
        }
        
        if (filters.brand) {
          filteredProducts = filteredProducts.filter(product =>
            product.jewelrySpecs?.brand === filters.brand ||
            product.brand === filters.brand
          );
        }
        
        if (filters.caratRange) {
          const [min, max] = filters.caratRange.split('-');
          const minCarat = parseFloat(min) || 0;
          const maxCarat = max ? parseFloat(max) : Infinity;
          
          filteredProducts = filteredProducts.filter(product => {
            const carat = parseFloat(product.jewelrySpecs?.totalCaratWeight) || 
                         parseFloat(product.details?.caratWeight) || 0;
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
        if (filters.sortBy === 'latest') {
          filteredProducts.sort((a, b) => {
            // Sort by createdAt (newest first), fallback to _id for deterministic ordering
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            
            // If dates are equal, use _id as secondary sort
            if (dateA.getTime() === dateB.getTime()) {
              return (b._id || '').localeCompare(a._id || '');
            }
            return dateB - dateA;
          });

        } else if (filters.sortBy === 'price-asc') {
          filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sortBy === 'price-desc') {
          filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (filters.sortBy === 'carat-asc') {
          filteredProducts.sort((a, b) => {
            const caratA = parseFloat(a.jewelrySpecs?.totalCaratWeight) || parseFloat(a.details?.caratWeight) || 0;
            const caratB = parseFloat(b.jewelrySpecs?.totalCaratWeight) || parseFloat(b.details?.caratWeight) || 0;
            return caratA - caratB;
          });
        } else if (filters.sortBy === 'carat-desc') {
          filteredProducts.sort((a, b) => {
            const caratA = parseFloat(a.jewelrySpecs?.totalCaratWeight) || parseFloat(a.details?.caratWeight) || 0;
            const caratB = parseFloat(b.jewelrySpecs?.totalCaratWeight) || parseFloat(b.details?.caratWeight) || 0;
            return caratB - caratA;
          });
        }
        
        setProducts(filteredProducts);
      } else {
        // Generate sample products for development
        let sampleProducts = generateSampleProducts(12);
        
        // Apply sorting to sample products as well
        if (filters.sortBy === 'latest') {
          sampleProducts.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            if (dateA.getTime() === dateB.getTime()) {
              return (b._id || '').localeCompare(a._id || '');
            }
            return dateB - dateA;
          });
        } else if (filters.sortBy === 'price-asc') {
          sampleProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sortBy === 'price-desc') {
          sampleProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        }
        
        setProducts(sampleProducts);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load jewelry. Please try again later.');
      
      // Generate sample products for development if everything fails
      let sampleProducts = generateSampleProducts(12);
      
      // Apply sorting to sample products in error case as well
      if (filters.sortBy === 'latest') {
        sampleProducts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          if (dateA.getTime() === dateB.getTime()) {
            return (b._id || '').localeCompare(a._id || '');
          }
          return dateB - dateA;
        });
      } else if (filters.sortBy === 'price-asc') {
        sampleProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (filters.sortBy === 'price-desc') {
        sampleProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      }
      
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleClearAllFilters = () => {
    setFilters(defaultFilters);
  };
  
  // Helper function to generate sample products for development
  const generateSampleProducts = (count) => {
    const categories = ['Engagement Ring', 'Wedding Band', 'Earrings', 'Necklace', 'Bracelet', 'Pendant'];
    const metals = ['14K White Gold', '18K Yellow Gold', '14K Rose Gold', 'Platinum'];
    const sampleProducts = [];
    
    for (let i = 1; i <= count; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomMetal = metals[Math.floor(Math.random() * metals.length)];
      const randomPrice = Math.floor(Math.random() * 20000) + 500;
      const hasDiscount = Math.random() > 0.7;
      const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
      const originalPrice = hasDiscount ? Math.floor(randomPrice * (100 / (100 - discount))) : randomPrice;
      
      // Generate random dates within the last 6 months for realistic "Latest Arrivals" sorting
      const now = new Date();
      const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
      const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
      
      sampleProducts.push({
        _id: `jewelry-sample-${i}`,
        name: `${randomCategory} ${i}`,
        price: randomPrice,
        originalPrice: hasDiscount ? originalPrice : null,
        discount: hasDiscount ? discount : null,
        productType: 'jewelry',
        category: randomCategory,
        mainImage: PLACEHOLDER_IMAGES.jewelry,
        galleryImages: [
          PLACEHOLDER_IMAGES.jewelry,
          PLACEHOLDER_IMAGES.jewelry,
        ],
        isNewArrival: Math.random() > 0.7,
        createdAt: randomDate.toISOString(), // Add realistic creation date
        jewelrySpecs: {
          jewelryCategory: randomCategory,
          metal: randomMetal,
          totalCaratWeight: (Math.random() * 3 + 0.5).toFixed(2),
          centerStone: {
            type: 'Diamond',
            shape: 'Round',
            gemType: 'Diamond'
          }
        },
        details: {
          material: randomMetal,
          caratWeight: (Math.random() * 3 + 0.5).toFixed(2)
        }
      });
    }
    
    return sampleProducts;
  };

  // Sort options
  const sortOptions = [
    { label: 'Latest Arrivals', value: 'latest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Carat: Low to High', value: 'carat-asc' },
    { label: 'Carat: High to Low', value: 'carat-desc' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <GemIcon className="mr-3 text-primary" size={32} />
                Fine Jewelry Collection
              </h1>
              <p className="text-gray-600 mt-2">Discover our exquisite collection of handcrafted jewelry</p>
            </div>
            
            {/* Desktop View Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{filteredProducts.length} items</span>
                {activeFilterCount > 0 && (
                  <span className="text-primary">({activeFilterCount} filters)</span>
                )}
              </div>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Filter size={16} className="mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <JewelryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Sort Controls */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredProducts.length} Jewelry Items
                </h2>
                {activeFilterCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-600">Loading jewelry collection...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-red-800 mb-2">Error Loading Jewelry</h3>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
                <Sparkles size={48} className="text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-amber-800 mb-2">No Jewelry Found</h3>
                <p className="text-amber-700 mb-4">
                  Try adjusting your filters or check back later for new arrivals.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
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
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <JewelryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearAllFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jewelry; 