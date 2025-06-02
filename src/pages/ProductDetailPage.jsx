import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductDetail from '../components/products/ProductDetail';
import DiamondDetail from '../components/products/DiamondDetail';
import JewelryDetail from '../components/products/JewelryDetail';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

const ProductDetailPage = ({ type = 'jewelry' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log(`Fetching product with id: ${id}, type: ${type}`);
        
        // Use the correct API method
        const response = await productAPI.getById(id);
        console.log('Product data received:', response.data);
        
        if (response.data) {
          // If the product has missing images, add placeholders
          const processedProduct = {
            ...response.data,
            mainImage: response.data.mainImage || PLACEHOLDER_IMAGES.large,
            galleryImages: response.data.galleryImages?.length > 0 ? 
              response.data.galleryImages : 
              [PLACEHOLDER_IMAGES.large, PLACEHOLDER_IMAGES.large]
          };
          
          setProduct(processedProduct);
        } else {
          setError('Product not found.');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        // Only create sample product for sample IDs, not for API failures
        if (id.startsWith('sample-')) {
          console.log('Creating sample product for development');
          const sampleProduct = createSampleProduct(id);
          setProduct(sampleProduct);
          setError(null);
        } else {
          setError('Product not found or unavailable. Please try again later.');
          // After a delay, navigate to the main product list
          setTimeout(() => {
            navigate(`/${type}`);
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate, type]);
  
  // Helper function to create a sample product for development (only for sample IDs)
  const createSampleProduct = (id) => {
    const types = ['Ring', 'Necklace', 'Earrings', 'Bracelet', 'Pendant'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const number = id.split('-').pop();
    
    return {
      _id: id,
      name: `${randomType} ${number}`,
      price: Math.floor(Math.random() * 50000) + 10000,
      description: `Beautiful ${randomType.toLowerCase()} crafted with precision and care.`,
      category: randomType,
      productType: 'jewelry',
      mainImage: PLACEHOLDER_IMAGES.jewelry,
      galleryImages: [
        PLACEHOLDER_IMAGES.jewelry,
        PLACEHOLDER_IMAGES.jewelry,
        PLACEHOLDER_IMAGES.jewelry
      ],
      material: "Gold",
      weight: "15g",
      countInStock: 5,
      rating: 4.5,
      numReviews: 12,
      featured: true,
      jewelrySpecs: {
        material: "Yellow Gold",
        caratWeight: 1.5,
        diamondType: "Lab Grown",
        totalDiamonds: 12,
        setting: "Prong Setting",
        style: "Classic"
      }
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-24 px-4 py-20 flex justify-center">
        <div className="text-center">
          <Loader2 size={50} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pt-24 px-4 py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops!</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting you back to the products page...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto pt-24 px-4 py-20">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-700 mb-2">Product Not Found</h2>
          <p className="text-amber-600">We couldn't find the product you're looking for.</p>
        </div>
      </div>
    );
  }

  // Route to appropriate detail component based on product type
  if (type === 'diamonds' || product.productType === 'diamond' || product.productType === 'lab-grown') {
    return <DiamondDetail product={product} type={type} />;
  }
  
  if (type === 'jewelry' || product.productType === 'jewelry') {
    return <JewelryDetail product={product} type={type} />;
  }

  // Fallback to original ProductDetail for other types (rings, etc.)
  return <ProductDetail product={product} type={type} />;
};

export default ProductDetailPage; 