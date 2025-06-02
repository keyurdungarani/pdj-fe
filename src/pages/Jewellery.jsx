import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { Loader2, ChevronDown, ChevronUp, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import FilterDrawer from '../components/filters/FilterDrawer';
import FilterButton from '../components/filters/FilterButton';
import ActiveFilters from '../components/filters/ActiveFilters';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

const Jewellery = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    priceRange: false,
    sortBy: false,
  });
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'latest'
  });

  // Default empty filters for reset
  const defaultFilters = {
    category: '',
    priceRange: '',
    sortBy: 'latest'
  };

  // Filter options configuration
  const filterOptions = [
    {
      name: 'category',
      label: 'Category',
      options: [
        { value: '', label: 'All Categories' },
        { value: 'necklace', label: 'Necklaces' },
        { value: 'bracelet', label: 'Bracelets' },
        { value: 'earring', label: 'Earrings' },
        { value: 'pendant', label: 'Pendants' }
      ]
    },
    {
      name: 'priceRange',
      label: 'Price Range',
      options: [
        { value: '', label: 'All Prices' },
        { value: '0-1000', label: 'Under ₹1,000' },
        { value: '1000-5000', label: '₹1,000 - ₹5,000' },
        { value: '5000-10000', label: '₹5,000 - ₹10,000' },
        { value: '10000-50000', label: '₹10,000 - ₹50,000' },
        { value: '50000-', label: '₹50,000+' }
      ]
    },
    {
      name: 'sortBy',
      label: 'Sort By',
      options: [
        { value: 'latest', label: 'Latest Arrivals' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' }
      ]
    }
  ];
  
  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    value => value !== '' && value !== 'latest'
  ).length;

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on filters
      const params = new URLSearchParams();
      params.append('productType', 'jewelry');
      
      if (filters.category) {
        params.append('category', filters.category);
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) params.append('minPrice', min);
        if (max) params.append('maxPrice', max);
      }
      
      if (filters.sortBy === 'latest') {
        params.append('sort', '-createdAt');
      } else if (filters.sortBy === 'price-asc') {
        params.append('sort', 'price');
      } else if (filters.sortBy === 'price-desc') {
        params.append('sort', '-price');
      }
      
      // Fetch products with filters
      const response = await productAPI.getAll(`?${params.toString()}`);
      console.log('Fetched products:', response.data);
      
      // If there's no real data yet, generate some sample products for development
      if (!response.data.products || response.data.products.length === 0) {
        const sampleProducts = generateSampleProducts(12);
        setProducts(sampleProducts);
      } else {
        setProducts(response.data.products || []);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      
      // Generate sample products for development if API fails
      const sampleProducts = generateSampleProducts(12);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters from the drawer
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Remove a single filter
  const handleRemoveFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: filterName === 'sortBy' ? 'latest' : ''
    }));
  };
  
  // Clear all filters
  const handleClearAllFilters = () => {
    setFilters(defaultFilters);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Helper function to generate sample products for development
  const generateSampleProducts = (count) => {
    const productTypes = ['necklace', 'bracelet', 'earring', 'pendant'];
    const sampleProducts = [];
    
    for (let i = 1; i <= count; i++) {
      const randomType = productTypes[Math.floor(Math.random() * productTypes.length)];
      const randomPrice = Math.floor(Math.random() * 50000) + 1000;
      const hasDiscount = Math.random() > 0.5;
      const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
      const originalPrice = hasDiscount ? Math.floor(randomPrice * (100 / (100 - discount))) : randomPrice;
      
      sampleProducts.push({
        _id: `sample-${i}`,
        name: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} ${i}`,
        price: randomPrice,
        originalPrice: hasDiscount ? originalPrice : null,
        discount: hasDiscount ? discount : null,
        type: randomType,
        productType: 'jewelry',
        mainImage: PLACEHOLDER_IMAGES.jewelry,
        galleryImages: [
          PLACEHOLDER_IMAGES.jewelry,
          PLACEHOLDER_IMAGES.jewelry,
        ],
        isNewArrival: Math.random() > 0.7,
        details: {
          material: 'Gold',
          weight: `${(Math.random() * 20 + 5).toFixed(2)}g`,
          purity: '18K'
        }
      });
    }
    
    return sampleProducts;
  };

  // Render filter option
  const renderFilterOption = (option, value, onChange) => {
    return option.options.map((item) => (
      <div 
        key={item.value} 
        className="flex items-center mb-2 cursor-pointer group"
        onClick={() => onChange(option.name, item.value)}
      >
        <div className={`w-4 h-4 mr-2 border rounded-sm flex items-center justify-center ${
          value === item.value ? 'bg-primary border-primary' : 'border-gray-400 bg-white hover:border-primary'
        }`}>
          {value === item.value && <div className="w-2 h-2 bg-white rounded-sm"></div>}
        </div>
        <span className={`text-sm ${value === item.value ? 'text-primary font-medium' : 'text-gray-800 group-hover:text-primary'}`}>
          {item.label}
        </span>
      </div>
    ));
  };

  return (
    <div className="container mx-auto pt-24 px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Fine Jewellery Collection</h1>
      
      {/* Mobile Filter Button and Applied Filters */}
      <div className="md:hidden mb-4">
        <div className="flex justify-between items-center mb-2">
          <FilterButton 
            onClick={() => setShowFilterDrawer(true)} 
            activeFilterCount={activeFilterCount}
          />
          
          <div className="text-sm text-gray-600">
            {products.length} results
          </div>
        </div>
        
        <ActiveFilters
          activeFilters={filters}
          filterOptions={filterOptions}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      </div>
      
      {/* Desktop Content with Sidebar Filters */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Left Sidebar Filters */}
        <div className="hidden md:block w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-800">FILTERS</h2>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-primary hover:text-primary-dark"
                >
                  CLEAR ALL
                </button>
              )}
            </div>
            
            <div className="divide-y divide-gray-100">
              {filterOptions.map((filter) => (
                <div key={filter.name} className="px-4 py-3">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection(filter.name)}
                  >
                    <h3 className="font-semibold text-gray-800">{filter.label}</h3>
                    {expandedSections[filter.name] ? 
                      <ChevronUp size={16} className="text-gray-500" /> :
                      <ChevronDown size={16} className="text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections[filter.name] && (
                    <div className="mt-3 pl-1">
                      {renderFilterOption(filter, filters[filter.name], handleFilterChange)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Content */}
        <div className="flex-1">
          {/* Desktop Applied Filters */}
          <div className="hidden md:block mb-4">
            <ActiveFilters
              activeFilters={filters}
              filterOptions={filterOptions}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
          
          {/* Products Display */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={40} className="animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium text-amber-800 mb-2">No Products Found</h3>
              <p className="text-amber-700">Try adjusting your filters or check back later for new arrivals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} type="jewellery" />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        filterOptions={filterOptions}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        resetFilters={defaultFilters}
      />
    </div>
  );
};

export default Jewellery; 