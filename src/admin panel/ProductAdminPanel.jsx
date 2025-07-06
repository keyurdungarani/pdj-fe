import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";
import { adminAPI } from "../services/api";
import ImagePreview from '../components/ImagePreview';
import './GalleryManager.css';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

// Empty placeholder image as a data URI - gray square with "No Image" text
const PLACEHOLDER_IMAGE = "/placeholder-image.svg";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      console.error("Error caught by ErrorBoundary:", error);
    };

    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return children;
};

const ProductAdminPanel = () => {
  // State for products and UI
  const [products, setProducts] = useState([]);
  const [activeType, setActiveType] = useState('jewelry');
  const [counts, setCounts] = useState({ jewelry: 0, rings: 0, diamonds: 0, labGrown: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [fileData, setFileData] = useState({
    mainImage: null,
    galleryImages: [],
    video: null,
    rotation360: null,
    zoomImages: []
  });
  
  // Add state for URL-based images
  const [urlData, setUrlData] = useState({
    imageLink: '',
    imageLink2: '',
    imageLink3: '',
    imageLink4: '',
    imageLink5: '',
    imageLink6: '',
    videoLink: ''
  });
  
  // Add state for specifications
  const [specifications, setSpecifications] = useState({});
  
  // State for deletion
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showMultiDeleteConfirm, setShowMultiDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Add state for gallery image management
  const [galleryImageToReplace, setGalleryImageToReplace] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryImageError, setGalleryImageError] = useState(null);

  // Fetch products on initial load and when activeType or itemsPerPage changes
  useEffect(() => {
    fetchRecentProducts(activeType, 1);
  }, [activeType, itemsPerPage]);

  // Fetch products with pagination
  const fetchRecentProducts = async (type, page = 1) => {
    setLoading(true);
    try {
      const response = await adminAPI.getProductPanel(type, page, itemsPerPage);
      setProducts(response.data.products || []);
      setCounts(response.data.counts || {});
      
      // Handle pagination data
      const pagination = response.data.pagination || {};
      setTotalPages(pagination.totalPages || 1);
      setTotalProducts(pagination.totalProducts || 0);
      setCurrentPage(pagination.currentPage || page);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setLoading(false);
    }
  };

  // Handle search functionality with pagination
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      return fetchRecentProducts(activeType, page);
    }
    
    setLoading(true);
    try {
      const response = await adminAPI.searchProducts(
        searchQuery, 
        activeType === 'all' ? '' : activeType, 
        page, 
        itemsPerPage
      );
      setProducts(response.data.products || []);
      
      // Handle pagination data
      const pagination = response.data.pagination || {};
      setTotalPages(pagination.totalPages || 1);
      setTotalProducts(pagination.totalProducts || 0);
      setCurrentPage(pagination.currentPage || page);
      
      setLoading(false);
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setLoading(false);
    }
  };

  // Handle type switching
  const switchProductType = (type) => {
    setActiveType(type);
    setSearchQuery('');
    setCurrentPage(1);
    fetchRecentProducts(type, 1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (searchQuery.trim()) {
      handleSearch(page);
    } else {
      fetchRecentProducts(activeType, page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (searchQuery.trim()) {
      handleSearch(1);
    } else {
      fetchRecentProducts(activeType, 1);
    }
  };

  // Fetch complete product data for editing
  const fetchProductForEdit = async (productId) => {
    try {
      setLoading(true);
      // Get single product with complete data
      const response = await adminAPI.getProductById(productId);
      
      if (!response.data.success || !response.data.product) {
        console.error('Product not found');
        return null;
      }
      
      return response.data.product;
    } catch (error) {
      console.error('Error fetching product for edit:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = async (product) => {
    // Fetch complete product data
    const fullProduct = await fetchProductForEdit(product._id);
    
    if (!fullProduct) {
      console.error('Could not fetch complete product data');
      return;
    }
    
    // Use the complete product data
    const productToEdit = fullProduct;
    
    // Ensure all fields are properly populated
    const editProduct = {
      ...productToEdit,
      // Ensure numeric fields are properly set
      price: productToEdit.price || 0,
      originalPrice: productToEdit.originalPrice || '',
      salePrice: productToEdit.salePrice || '',
      discount: productToEdit.discount || '',
      countInStock: productToEdit.countInStock || 0,
      rating: productToEdit.rating || '',
      numReviews: productToEdit.numReviews || '',
      
      // Ensure boolean fields are properly set
      featured: productToEdit.featured || false,
      onSale: productToEdit.onSale || false,
      customizable: productToEdit.customizable || false,
      
      // Ensure string fields are properly set
      name: productToEdit.name || '',
      description: productToEdit.description || '',
      category: productToEdit.category || '',
      productType: productToEdit.productType || 'jewelry',
      
      // Handle array fields properly
      tags: productToEdit.tags || [],
      materials: productToEdit.materials || [],
      
      // Ensure gallery images array exists
      galleryImages: productToEdit.galleryImages || []
    };
    
    setEditingProduct(editProduct);
    
    // Reset file data
    setFileData({
      mainImage: null,
      galleryImages: [],
      video: null,
      rotation360: null,
      zoomImages: []
    });
    
    // Populate URL data - handle nested imageLinks structure
    const imageLinks = productToEdit.imageLinks || {};
    setUrlData({
      imageLink: imageLinks.imageLink || productToEdit.imageLink || '',
      imageLink2: imageLinks.imageLink2 || productToEdit.imageLink2 || '',
      imageLink3: imageLinks.imageLink3 || productToEdit.imageLink3 || '',
      imageLink4: imageLinks.imageLink4 || productToEdit.imageLink4 || '',
      imageLink5: imageLinks.imageLink5 || productToEdit.imageLink5 || '',
      imageLink6: imageLinks.imageLink6 || productToEdit.imageLink6 || '',
      videoLink: productToEdit.videoLink || ''
    });
    
    // Populate specifications based on product type
    let specs = {};
    switch (productToEdit.productType) {
      case 'jewelry':
        specs = productToEdit.jewelrySpecs || {};
        break;
      case 'diamond':
        specs = productToEdit.diamondSpecs || {};
        break;
      case 'ring':
        specs = productToEdit.ringSpecs || {};
        break;
      case 'lab-grown':
        specs = productToEdit.labGrownSpecs || {};
        break;
      case 'natural-diamond':
        specs = productToEdit.naturalDiamondSpecs || {};
        break;
      default:
        specs = {};
    }
    setSpecifications(specs);
  };

  // Handle save action for edited product
  const handleSave = async () => {
    setLoading(true);
    try {
      // Create FormData for file upload
    const formData = new FormData();
      
      // Add text fields
      formData.append('name', editingProduct.name || '');
      formData.append('price', editingProduct.price || 0);
      formData.append('description', editingProduct.description || '');
      
      // Add common fields
      if (editingProduct.category) formData.append('category', editingProduct.category);
      if (editingProduct.featured !== undefined) formData.append('featured', editingProduct.featured);
      if (editingProduct.onSale !== undefined) formData.append('onSale', editingProduct.onSale);
      if (editingProduct.salePrice) formData.append('salePrice', editingProduct.salePrice);
      if (editingProduct.countInStock !== undefined) formData.append('countInStock', editingProduct.countInStock);
      if (editingProduct.tags) formData.append('tags', Array.isArray(editingProduct.tags) ? editingProduct.tags.join(',') : editingProduct.tags);
      if (editingProduct.materials) formData.append('materials', Array.isArray(editingProduct.materials) ? editingProduct.materials.join(',') : editingProduct.materials);
      if (editingProduct.customizable !== undefined) formData.append('customizable', editingProduct.customizable);
      
      // Add specifications
      if (Object.keys(specifications).length > 0) {
        formData.append('specifications', JSON.stringify(specifications));
      }
      
      // Add URL-based image links
      Object.entries(urlData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });
      
      // Add files if they were selected
      if (fileData.mainImage) {
        formData.append('mainImage', fileData.mainImage);
      }
      
      // Handle gallery images - append them individually with indexes to ensure proper order
      if (fileData.galleryImages && fileData.galleryImages.length > 0) {
        // Filter out null/undefined files
        const validFiles = fileData.galleryImages.filter(file => file instanceof File);
        
        if (validFiles.length > 0) {
          // Check if this is a complete replacement (all new files)
          const isCompleteReplacement = validFiles.length === fileData.galleryImages.length;
          
          if (isCompleteReplacement) {
            // Replace all gallery images
            validFiles.forEach((file, index) => {
              formData.append('galleryImages', file);
            });
          } else {
            // Individual replacements - include index information
          fileData.galleryImages.forEach((file, index) => {
            if (file instanceof File) {
              formData.append(`galleryImage_${index}`, file);
            }
          });
          
          // Include a map of which indexes should be replaced
            const replacementIndexes = fileData.galleryImages
              .map((file, index) => file instanceof File ? index : null)
              .filter(index => index !== null);
            
            if (replacementIndexes.length > 0) {
              formData.append('galleryImageIndexes', JSON.stringify(replacementIndexes));
            }
          }
        }
      }
      
      if (fileData.video) {
        formData.append('video', fileData.video);
      }
      
      // Handle diamond-specific files
      if (editingProduct.productType === 'diamond') {
        if (fileData.rotation360) {
          formData.append('rotation360', fileData.rotation360);
        }
        if (fileData.zoomImages && fileData.zoomImages.length > 0) {
          fileData.zoomImages.forEach((file, index) => {
            if (file instanceof File) {
              formData.append('zoomImages', file);
            }
          });
        }
      }
      
      // Send update request through our API service
      await adminAPI.updateProduct(editingProduct._id, formData);
      
      // Refresh products
      setEditingProduct(null);
      setUrlData({
        imageLink: '',
        imageLink2: '',
        imageLink3: '',
        imageLink4: '',
        imageLink5: '',
        imageLink6: '',
        videoLink: ''
      });
      setSpecifications({});
      
      // Reset file data
      setFileData({
        mainImage: null,
        galleryImages: [],
        video: null,
        rotation360: null,
        zoomImages: []
      });
      
      // Reset gallery image error
      setGalleryImageError(null);
      
      fetchRecentProducts(activeType);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingProduct(null);
    setUrlData({
      imageLink: '',
      imageLink2: '',
      imageLink3: '',
      imageLink4: '',
      imageLink5: '',
      imageLink6: '',
      videoLink: ''
    });
    setSpecifications({});
    
    // Reset file data
    setFileData({
      mainImage: null,
      galleryImages: [],
      video: null,
      rotation360: null,
      zoomImages: []
    });
    
    // Reset gallery image error
    setGalleryImageError(null);
  };

  // Handle input change for text fields
  const handleInputChange = (e, field) => {
    let value = e.target.value;
    
    // Convert specific fields to numbers
    const numberFields = ['price', 'originalPrice', 'salePrice', 'discount', 'countInStock', 'rating', 'numReviews'];
    if (numberFields.includes(field)) {
      value = value === '' ? '' : parseFloat(value);
    }
    
    setEditingProduct({
      ...editingProduct,
      [field]: value
    });
  };

  // Handle URL data change
  const handleUrlChange = (e, field) => {
    setUrlData({
      ...urlData,
      [field]: e.target.value
    });
  };

  // Handle specifications change
  const handleSpecificationChange = (e, field) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setSpecifications({
      ...specifications,
      [field]: value
    });
  };

  // Handle file change for images and video
  const handleFileChange = (e, field) => {
    if (field === 'galleryImages' || field === 'zoomImages') {
      setFileData({
        ...fileData,
        [field]: Array.from(e.target.files)
      });
    } else {
      setFileData({
        ...fileData,
        [field]: e.target.files[0]
      });
    }
  };
  
  // Handle selection of multiple products for deletion
  const handleSelectProduct = (product) => {
    if (selectedProducts.some(p => p._id === product._id)) {
      setSelectedProducts(selectedProducts.filter(p => p._id !== product._id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };
  
  // Handle confirming single product deletion
  const handleDeleteConfirm = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };
  
  // Handle confirming multiple product deletion
  const handleMultiDeleteConfirm = () => {
    if (selectedProducts.length > 0) {
      setShowMultiDeleteConfirm(true);
    }
  };
  
  // Handle executing single product deletion
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await adminAPI.deleteProduct(productToDelete._id);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      
      // Update counts
      const newCounts = { ...counts };
      if (productToDelete.productType === 'jewelry') {
        newCounts.jewelry--;
      } else if (productToDelete.productType === 'ring') {
        newCounts.rings--;
      } else if (productToDelete.productType === 'diamond') {
        newCounts.diamonds--;
      }
      setCounts(newCounts);
      
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Handle executing multiple product deletion
  const handleDeleteMultipleProducts = async () => {
    if (selectedProducts.length === 0) return;
    
    setDeleteLoading(true);
    try {
      const productIds = selectedProducts.map(p => p._id);
      await adminAPI.deleteMultipleProducts(productIds);
      
      // Update product list
      setProducts(products.filter(p => !productIds.includes(p._id)));
      
      // Update counts
      const newCounts = { ...counts };
      selectedProducts.forEach(product => {
        if (product.productType === 'jewelry') {
          newCounts.jewelry--;
        } else if (product.productType === 'ring') {
          newCounts.rings--;
        } else if (product.productType === 'diamond') {
          newCounts.diamonds--;
        }
      });
      setCounts(newCounts);
      
      setShowMultiDeleteConfirm(false);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting multiple products:", error);
      alert("Error deleting products. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add function to handle replacing a single gallery image
  const handleReplaceGalleryImage = (index, file) => {
    // Ensure fileData.galleryImages array exists and has the right length
    const currentFileData = fileData.galleryImages || [];
    const updatedGalleryImages = [...currentFileData];
    
    // Extend array if needed to match the index
    while (updatedGalleryImages.length <= index) {
      updatedGalleryImages.push(null);
    }
    
    // Replace the file at the specified index
    updatedGalleryImages[index] = file;
    
    // Update the file data state
    setFileData({
      ...fileData,
      galleryImages: updatedGalleryImages,
    });
    
    // Reset error state
    setGalleryImageError(null);
  };

  // Add function to handle adding a new gallery image
  const handleAddGalleryImage = (file) => {
    if (!validateGalleryImage(file)) return;
    
    // Add to existing gallery images array
    const currentGalleryImages = editingProduct?.galleryImages || [];
    const newGalleryImages = [...currentGalleryImages, ''];
    
    // Update editing product
    setEditingProduct({
      ...editingProduct,
      galleryImages: newGalleryImages
    });
    
    // Add to file data array
    const currentFileData = fileData.galleryImages || [];
    const newFileDataImages = [...currentFileData];
    
    // Extend array to match gallery images length
    while (newFileDataImages.length < newGalleryImages.length - 1) {
      newFileDataImages.push(null);
    }
    
    // Add the new file
    newFileDataImages.push(file);
    
    setFileData({
      ...fileData,
      galleryImages: newFileDataImages
    });
  };

  // Add function to handle removing a gallery image
  const handleRemoveGalleryImage = (index) => {
    // Remove from gallery images
    const newGalleryImages = [...editingProduct?.galleryImages];
    newGalleryImages.splice(index, 1);
    
    setEditingProduct({
      ...editingProduct,
      galleryImages: newGalleryImages
    });
    
    // Remove from file data
    const newFileDataImages = fileData.galleryImages ? [...fileData.galleryImages] : [];
    if (newFileDataImages.length > index) {
      newFileDataImages.splice(index, 1);
    }
    
    setFileData({
      ...fileData,
      galleryImages: newFileDataImages
    });
  };

  // Add function to validate gallery image before upload
  const validateGalleryImage = (file) => {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setGalleryImageError(`Image too large (max 5MB): ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return false;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setGalleryImageError(`Invalid file type: ${file.type}. Use JPG, PNG, GIF or WEBP.`);
      return false;
    }
    
    return true;
  };

  // Render specification fields based on product type - matching detail pages exactly
  const renderSpecificationFields = () => {
    if (!editingProduct) return null;

    const { productType } = editingProduct;
    
    switch (productType) {
      case 'jewelry':
        return renderJewelrySpecifications();
      case 'diamond':
        return renderDiamondSpecifications();
      case 'ring':
        return renderRingSpecifications();
      case 'lab-grown':
        return renderLabGrownSpecifications();
      case 'natural-diamond':
        return renderNaturalDiamondSpecifications();
      default:
        return null;
    }
  };

  // Render jewelry specifications - matches JewelryDetail.jsx exactly
  const renderJewelrySpecifications = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-700 text-lg">Jewelry Specifications</h4>
      
      {/* Basic Information */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h5 className="font-medium text-gray-800 mb-3">Basic Information</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Number (SKU)</label>
            <input
              type="text"
              value={specifications.stockNumber || ''}
              onChange={(e) => handleSpecificationChange(e, 'stockNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., JR12345"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jewelry Style</label>
            <select
              value={specifications.jewelryStyle || ''}
              onChange={(e) => handleSpecificationChange(e, 'jewelryStyle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Style</option>
              <option value="Solitaire Engagement Ring">Solitaire Engagement Ring</option>
              <option value="Three Stone Engagement Ring">Three Stone Engagement Ring</option>
              <option value="Side Stone Engagement Ring">Side Stone Engagement Ring</option>
              <option value="Halo Engagement Ring">Halo Engagement Ring</option>
              <option value="Tennis Bracelet">Tennis Bracelet</option>
              <option value="Drop Earrings">Drop Earrings</option>
              <option value="Tennis Necklace">Tennis Necklace</option>
              <option value="Pendant">Pendant</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jewelry Classification</label>
            <select
              value={specifications.jewelryClassification || ''}
              onChange={(e) => handleSpecificationChange(e, 'jewelryClassification')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Classification</option>
              <option value="Natural Diamond">Natural Diamond</option>
              <option value="Lab-Grown Diamond">Lab-Grown Diamond</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metal</label>
            <select
              value={specifications.metal || ''}
              onChange={(e) => handleSpecificationChange(e, 'metal')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Metal</option>
              <option value="Platinum">Platinum</option>
              <option value="18K White Gold">18K White Gold</option>
              <option value="14K White Gold">14K White Gold</option>
              <option value="18K Yellow Gold">18K Yellow Gold</option>
              <option value="14K Yellow Gold">14K Yellow Gold</option>
              <option value="18K Rose Gold">18K Rose Gold</option>
              <option value="14K Rose Gold">14K Rose Gold</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mount</label>
            <input
              type="text"
              value={specifications.mount || ''}
              onChange={(e) => handleSpecificationChange(e, 'mount')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Prong Setting"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              value={specifications.brand || ''}
              onChange={(e) => handleSpecificationChange(e, 'brand')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., PDJ Jewelry"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Carat Weight</label>
            <input
              type="number"
              step="0.01"
              value={specifications.totalCaratWeight || ''}
              onChange={(e) => handleSpecificationChange(e, 'totalCaratWeight')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1.50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Number of Stones</label>
            <input
              type="number"
              value={specifications.totalNumberOfStones || ''}
              onChange={(e) => handleSpecificationChange(e, 'totalNumberOfStones')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 25"
            />
          </div>
        </div>
      </div>

      {/* Center Stone Details */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h5 className="font-medium text-gray-800 mb-3">Center Stone Details</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stone Type</label>
            <select
              value={specifications.centerStoneType || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Stone Type</option>
              <option value="Natural Diamond">Natural Diamond</option>
              <option value="Lab-Grown Diamond">Lab-Grown Diamond</option>
              <option value="Gemstone">Gemstone</option>
              <option value="None">None</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
            <select
              value={specifications.centerStoneShape || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneShape')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Shape</option>
              <option value="Round">Round</option>
              <option value="Princess">Princess</option>
              <option value="Emerald">Emerald</option>
              <option value="Asscher">Asscher</option>
              <option value="Marquise">Marquise</option>
              <option value="Oval">Oval</option>
              <option value="Radiant">Radiant</option>
              <option value="Pear">Pear</option>
              <option value="Heart">Heart</option>
              <option value="Cushion">Cushion</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carat Weight</label>
            <input
              type="number"
              step="0.01"
              value={specifications.centerStoneCaratWeight || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneCaratWeight')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1.25"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <select
              value={specifications.centerStoneColor || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneColor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Color</option>
              {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clarity</label>
            <select
              value={specifications.centerStoneClarity || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneClarity')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Clarity</option>
              <option value="FL">FL</option>
              <option value="IF">IF</option>
              <option value="VVS1">VVS1</option>
              <option value="VVS2">VVS2</option>
              <option value="VS1">VS1</option>
              <option value="VS2">VS2</option>
              <option value="SI1">SI1</option>
              <option value="SI2">SI2</option>
              <option value="I1">I1</option>
              <option value="I2">I2</option>
              <option value="I3">I3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cut</label>
            <select
              value={specifications.centerStoneCut || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneCut')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Cut</option>
              <option value="Excellent">Excellent</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fluorescence</label>
            <select
              value={specifications.centerStoneFluorescence || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneFluorescence')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Fluorescence</option>
              <option value="None">None</option>
              <option value="Faint">Faint</option>
              <option value="Medium">Medium</option>
              <option value="Strong">Strong</option>
              <option value="Very Strong">Very Strong</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lab</label>
            <select
              value={specifications.centerStoneLab || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneLab')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Lab</option>
              <option value="GIA">GIA</option>
              <option value="AGS">AGS</option>
              <option value="GCAL">GCAL</option>
              <option value="EGL">EGL</option>
              <option value="IGI">IGI</option>
              <option value="GSI">GSI</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Number</label>
            <input
              type="text"
              value={specifications.centerStoneCertNumber || ''}
              onChange={(e) => handleSpecificationChange(e, 'centerStoneCertNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1234567890"
            />
          </div>
        </div>
      </div>

      {/* Side Stone Details */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h5 className="font-medium text-gray-800 mb-3">Side Stone Details</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stone Type</label>
            <select
              value={specifications.sideStoneType || ''}
              onChange={(e) => handleSpecificationChange(e, 'sideStoneType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Stone Type</option>
              <option value="Natural Diamond">Natural Diamond</option>
              <option value="Lab-Grown Diamond">Lab-Grown Diamond</option>
              <option value="Gemstone">Gemstone</option>
              <option value="None">None</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Stones</label>
            <input
              type="number"
              value={specifications.sideStoneTotal || ''}
              onChange={(e) => handleSpecificationChange(e, 'sideStoneTotal')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
            <select
              value={specifications.sideStoneShape || ''}
              onChange={(e) => handleSpecificationChange(e, 'sideStoneShape')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Shape</option>
              <option value="Round">Round</option>
              <option value="Princess">Princess</option>
              <option value="Baguette">Baguette</option>
              <option value="Emerald">Emerald</option>
              <option value="Marquise">Marquise</option>
              <option value="Oval">Oval</option>
              <option value="Pear">Pear</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Carat Weight</label>
            <input
              type="number"
              step="0.01"
              value={specifications.sideStoneCaratWeight || ''}
              onChange={(e) => handleSpecificationChange(e, 'sideStoneCaratWeight')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 0.25"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <select
              value={specifications.sideStoneColor || ''}
              onChange={(e) => handleSpecificationChange(e, 'sideStoneColor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Color</option>
              {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clarity</label>
            <select
              value={specifications.sideStoneClarity || ''}
              onChange={(e) => handleSpecificationChange(e, 'sideStoneClarity')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Clarity</option>
              <option value="FL">FL</option>
              <option value="IF">IF</option>
              <option value="VVS1">VVS1</option>
              <option value="VVS2">VVS2</option>
              <option value="VS1">VS1</option>
              <option value="VS2">VS2</option>
              <option value="SI1">SI1</option>
              <option value="SI2">SI2</option>
              <option value="I1">I1</option>
              <option value="I2">I2</option>
              <option value="I3">I3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legacy Fields for Backward Compatibility */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h5 className="font-medium text-gray-800 mb-3">Legacy Fields</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Setting</label>
            <input
              type="text"
              value={specifications.setting || ''}
              onChange={(e) => handleSpecificationChange(e, 'setting')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Prong Setting"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diamond Type</label>
            <input
              type="text"
              value={specifications.diamondType || ''}
              onChange={(e) => handleSpecificationChange(e, 'diamondType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Natural Diamond"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
        <textarea
          value={specifications.comments || ''}
          onChange={(e) => handleSpecificationChange(e, 'comments')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional details about the jewelry piece..."
        />
      </div>
    </div>
  );

  // Render ring specifications
  const renderRingSpecifications = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Ring Specifications</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <select
            value={specifications.material || ''}
            onChange={(e) => handleSpecificationChange(e, 'material')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Material</option>
            <option value="Platinum">Platinum</option>
            <option value="Yellow Gold">Yellow Gold</option>
            <option value="Rose Gold">Rose Gold</option>
            <option value="White Gold">White Gold</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width (mm)</label>
          <select
            value={specifications.width || ''}
            onChange={(e) => handleSpecificationChange(e, 'width')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Width</option>
            <option value="2">2mm</option>
            <option value="2.5">2.5mm</option>
            <option value="3">3mm</option>
            <option value="4">4mm</option>
            <option value="5">5mm</option>
            <option value="6">6mm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <select
            value={specifications.size || ''}
            onChange={(e) => handleSpecificationChange(e, 'size')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Size</option>
            {['A', 'A½', 'B', 'B½', 'C', 'C½', 'D', 'D½', 'E', 'E½', 'F', 'F½', 
              'G', 'G½', 'H', 'H½', 'I', 'I½', 'J', 'J½', 'K', 'K½', 'L', 'L½', 
              'M', 'M½', 'N', 'N½', 'O', 'O½', 'P', 'P½', 'Q', 'Q½', 'R', 'R½', 
              'S', 'S½', 'T', 'T½', 'U', 'U½', 'V', 'V½', 'W', 'W½', 'X', 'X½', 
              'Y', 'Y½', 'Z'].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
          <input
            type="text"
            value={specifications.style || ''}
            onChange={(e) => handleSpecificationChange(e, 'style')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Full Court wedding band"
          />
        </div>
      </div>
    </div>
  );

  // Render diamond specifications
  const renderDiamondSpecifications = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Diamond Specifications</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Carat Weight</label>
          <input
            type="number"
            step="0.01"
            value={specifications.carat || ''}
            onChange={(e) => handleSpecificationChange(e, 'carat')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1.50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cut</label>
          <select
            value={specifications.cut || ''}
            onChange={(e) => handleSpecificationChange(e, 'cut')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Cut</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <select
            value={specifications.color || ''}
            onChange={(e) => handleSpecificationChange(e, 'color')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Color</option>
            {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clarity</label>
          <select
            value={specifications.clarity || ''}
            onChange={(e) => handleSpecificationChange(e, 'clarity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Clarity</option>
            <option value="FL">FL</option>
            <option value="IF">IF</option>
            <option value="VVS1">VVS1</option>
            <option value="VVS2">VVS2</option>
            <option value="VS1">VS1</option>
            <option value="VS2">VS2</option>
            <option value="SI1">SI1</option>
            <option value="SI2">SI2</option>
            <option value="I1">I1</option>
            <option value="I2">I2</option>
            <option value="I3">I3</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
          <select
            value={specifications.shape || ''}
            onChange={(e) => handleSpecificationChange(e, 'shape')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Shape</option>
            <option value="Round">Round</option>
            <option value="Princess">Princess</option>
            <option value="Emerald">Emerald</option>
            <option value="Asscher">Asscher</option>
            <option value="Marquise">Marquise</option>
            <option value="Oval">Oval</option>
            <option value="Radiant">Radiant</option>
            <option value="Pear">Pear</option>
            <option value="Heart">Heart</option>
            <option value="Cushion">Cushion</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fluorescence</label>
          <select
            value={specifications.fluorescence || ''}
            onChange={(e) => handleSpecificationChange(e, 'fluorescence')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Fluorescence</option>
            <option value="None">None</option>
            <option value="Faint">Faint</option>
            <option value="Medium">Medium</option>
            <option value="Strong">Strong</option>
            <option value="Very Strong">Very Strong</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render lab-grown diamond specifications
  const renderLabGrownSpecifications = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Lab-Grown Diamond Specifications</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Number *</label>
          <input
            type="text"
            value={specifications.stockNumber || ''}
            onChange={(e) => handleSpecificationChange(e, 'stockNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., LG12345"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (Carats) *</label>
          <input
            type="number"
            step="0.01"
            value={specifications.weight || ''}
            onChange={(e) => handleSpecificationChange(e, 'weight')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1.50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shape *</label>
          <select
            value={specifications.shape || ''}
            onChange={(e) => handleSpecificationChange(e, 'shape')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Shape</option>
            <option value="Round">Round</option>
            <option value="Princess">Princess</option>
            <option value="Emerald">Emerald</option>
            <option value="Asscher">Asscher</option>
            <option value="Marquise">Marquise</option>
            <option value="Oval">Oval</option>
            <option value="Radiant">Radiant</option>
            <option value="Pear">Pear</option>
            <option value="Heart">Heart</option>
            <option value="Cushion">Cushion</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
          <select
            value={specifications.color || ''}
            onChange={(e) => handleSpecificationChange(e, 'color')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Color</option>
            {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clarity *</label>
          <select
            value={specifications.clarity || ''}
            onChange={(e) => handleSpecificationChange(e, 'clarity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Clarity</option>
            <option value="FL">FL</option>
            <option value="IF">IF</option>
            <option value="VVS1">VVS1</option>
            <option value="VVS2">VVS2</option>
            <option value="VS1">VS1</option>
            <option value="VS2">VS2</option>
            <option value="SI1">SI1</option>
            <option value="SI2">SI2</option>
            <option value="I1">I1</option>
            <option value="I2">I2</option>
            <option value="I3">I3</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cut Grade</label>
          <select
            value={specifications.cutGrade || ''}
            onChange={(e) => handleSpecificationChange(e, 'cutGrade')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Cut Grade</option>
            <option value="Ideal">Ideal</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lab</label>
          <select
            value={specifications.lab || ''}
            onChange={(e) => handleSpecificationChange(e, 'lab')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Lab</option>
            <option value="GIA">GIA</option>
            <option value="AGS">AGS</option>
            <option value="GCAL">GCAL</option>
            <option value="EGL">EGL</option>
            <option value="IGI">IGI</option>
            <option value="GSI">GSI</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Growth Type</label>
          <select
            value={specifications.growthType || ''}
            onChange={(e) => handleSpecificationChange(e, 'growthType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Growth Type</option>
            <option value="CVD">CVD</option>
            <option value="HPHT">HPHT</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render natural diamond specifications
  const renderNaturalDiamondSpecifications = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Natural Diamond Specifications</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Number *</label>
          <input
            type="text"
            value={specifications.stockNumber || ''}
            onChange={(e) => handleSpecificationChange(e, 'stockNumber')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., ND12345"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (Carats) *</label>
          <input
            type="number"
            step="0.01"
            value={specifications.weight || ''}
            onChange={(e) => handleSpecificationChange(e, 'weight')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1.50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shape *</label>
          <select
            value={specifications.shape || ''}
            onChange={(e) => handleSpecificationChange(e, 'shape')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Shape</option>
            <option value="Round">Round</option>
            <option value="Princess">Princess</option>
            <option value="Emerald">Emerald</option>
            <option value="Asscher">Asscher</option>
            <option value="Marquise">Marquise</option>
            <option value="Oval">Oval</option>
            <option value="Radiant">Radiant</option>
            <option value="Pear">Pear</option>
            <option value="Heart">Heart</option>
            <option value="Cushion">Cushion</option>
            <option value="Baguette">Baguette</option>
            <option value="Trilliant">Trilliant</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
          <select
            value={specifications.color || ''}
            onChange={(e) => handleSpecificationChange(e, 'color')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Color</option>
            {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clarity *</label>
          <select
            value={specifications.clarity || ''}
            onChange={(e) => handleSpecificationChange(e, 'clarity')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Clarity</option>
            <option value="FL">FL</option>
            <option value="IF">IF</option>
            <option value="VVS1">VVS1</option>
            <option value="VVS2">VVS2</option>
            <option value="VS1">VS1</option>
            <option value="VS2">VS2</option>
            <option value="SI1">SI1</option>
            <option value="SI2">SI2</option>
            <option value="I1">I1</option>
            <option value="I2">I2</option>
            <option value="I3">I3</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cut Grade</label>
          <select
            value={specifications.cutGrade || ''}
            onChange={(e) => handleSpecificationChange(e, 'cutGrade')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Cut Grade</option>
            <option value="Ideal">Ideal</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lab</label>
          <select
            value={specifications.lab || ''}
            onChange={(e) => handleSpecificationChange(e, 'lab')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Lab</option>
            <option value="GIA">GIA</option>
            <option value="AGS">AGS</option>
            <option value="GCAL">GCAL</option>
            <option value="EGL">EGL</option>
            <option value="IGI">IGI</option>
            <option value="GSI">GSI</option>
            <option value="SSEF">SSEF</option>
            <option value="Gübelin">Gübelin</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
          <input
            type="text"
            value={specifications.origin || ''}
            onChange={(e) => handleSpecificationChange(e, 'origin')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Botswana, Canada"
          />
        </div>
      </div>
    </div>
  );

  // Render product row in table
  const renderProductRow = (product) => {
    const imageUrl = product.mainImage && (
      product.mainImage.startsWith('http') 
        ? product.mainImage 
        : `${import.meta.env.VITE_LOCAL_API}${product.mainImage}`
    );
    const isSelected = selectedProducts.some(p => p._id === product._id);
    
    // Get stock number from different specification types
    const getStockNumber = (product) => {
      if (product.jewelrySpecs?.stockNumber) return product.jewelrySpecs.stockNumber;
      if (product.diamondSpecs?.stockNumber) return product.diamondSpecs.stockNumber;
      if (product.ringSpecs?.stockNumber) return product.ringSpecs.stockNumber;
      if (product.labGrownSpecs?.stockNumber) return product.labGrownSpecs.stockNumber;
      if (product.naturalDiamondSpecs?.stockNumber) return product.naturalDiamondSpecs.stockNumber;
      return 'N/A';
    };
    
    const stockNumber = getStockNumber(product);
    
    return (
      <tr key={product._id} className={`border-b hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
        <td className="p-4">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => handleSelectProduct(product)}
            className="h-4 w-4"
          />
        </td>
        <td className="p-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">SKU: {stockNumber}</span>
            <span className="text-sm font-medium text-gray-900">{product.name}</span>
            <span className="text-xs text-gray-400 capitalize">{product.productType}</span>
          </div>
        </td>
        <td className="p-4">
          <span className="text-sm font-semibold text-gray-900">${product.price?.toFixed(2)}</span>
        </td>
        <td className="p-4">
          <ImagePreview 
            src={imageUrl} 
            alt={product.name} 
            thumbnailHeight="48px"
            placeholderImage={PLACEHOLDER_IMAGE}
          />
        </td>
      <td className="p-4">
          <span className="text-sm text-gray-600">
          {new Date(product.createdAt).toLocaleDateString()}
          </span>
      </td>
        <td className="p-4">
          <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleEdit(product)} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDeleteConfirm(product)} 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Delete
          </Button>
          </div>
      </td>
    </tr>
  );
  };

  // Add function to handle replacing all gallery images
  const handleReplaceAllGalleryImages = (files) => {
    if (!files || files.length === 0) return;
    
    // Validate all files first
    const validFiles = [];
    const errors = [];
    
    for (let i = 0; i < files.length && i < 5; i++) {
      const file = files[i];
      if (validateGalleryImage(file)) {
        validFiles.push(file);
      } else {
        errors.push(`File ${i + 1}: ${file.name} - Invalid`);
      }
    }
    
    if (errors.length > 0) {
      setGalleryImageError(`Some files were invalid: ${errors.join(', ')}`);
      return;
    }
    
    // Update both states
    setFileData({
      ...fileData,
      galleryImages: validFiles,
    });
    
    const newGalleryImages = Array(validFiles.length).fill('');
    setEditingProduct({
      ...editingProduct,
      galleryImages: newGalleryImages,
    });
    
    setGalleryImageError(null);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center">Product Management Panel</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex space-x-2">
          <Input
            type="text"
              placeholder="Search by stock number or item name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-grow p-2 border rounded"
          />
          <Button 
            onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
            {searchQuery && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                  fetchRecentProducts(activeType, 1);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Clear
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Searching for: "<span className="font-medium">{searchQuery}</span>"
            </div>
          )}
        </div>
        
        {/* Type Tabs */}
        <div className="mb-6 flex space-x-2 border-b">
          <button 
            onClick={() => switchProductType('jewelry')}
            className={`p-3 font-medium transition-colors ${activeType === 'jewelry' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Jewelry ({counts.jewelry || 0})
          </button>
          <button 
            onClick={() => switchProductType('ring')}
            className={`p-3 font-medium transition-colors ${activeType === 'ring' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Rings ({counts.rings || 0})
          </button>
          <button 
            onClick={() => switchProductType('diamond')}
            className={`p-3 font-medium transition-colors ${activeType === 'diamond' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Diamonds ({counts.diamonds || 0})
          </button>
          <button 
            onClick={() => switchProductType('lab-grown')}
            className={`p-3 font-medium transition-colors ${activeType === 'lab-grown' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Lab-Grown ({counts.labGrown || 0})
          </button>
          <button 
            onClick={() => switchProductType('all')}
            className={`p-3 font-medium transition-colors ${activeType === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Products
          </button>
        </div>
        
        {/* Summary and Refresh */}
        <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{totalProducts}</span> total products
              {searchQuery && <span> (filtered)</span>}
            </div>
            <div className="text-sm text-gray-600">
              Page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              setCurrentPage(1);
              if (searchQuery.trim()) {
                handleSearch(1);
              } else {
                fetchRecentProducts(activeType, 1);
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        {/* Selection toolbar */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 p-3 mb-4 flex justify-between items-center rounded border border-blue-200">
            <div className="font-medium">
              {selectedProducts.length} products selected
            </div>
            <div className="space-x-2">
              <Button 
                onClick={() => setSelectedProducts([])}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
              >
                Clear Selection
              </Button>
              <Button 
                onClick={handleMultiDeleteConfirm}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete Selected
              </Button>
            </div>
          </div>
        )}
        
        {/* Products Table */}
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
            <Table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                <th className="p-4 text-left w-10">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...products]);
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    checked={products.length > 0 && selectedProducts.length === products.length}
                    className="h-4 w-4"
                  />
                </th>
                  <th className="p-4 text-left">Product Details</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
              {products && products.length > 0 ? (
                products.map(renderProductRow)
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No products found
                  </td>
                </tr>
              )}
              </tbody>
            </Table>
        )}
        
        {/* Pagination Controls */}
        {!loading && products.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            {/* Items per page selector */}
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">items per page</span>
            </div>
            
            {/* Pagination info */}
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
            </div>
            
            {/* Pagination buttons */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                First
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </Button>
              <Button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Last
              </Button>
            </div>
          </div>
        )}
        
        {/* Edit Modal */}
        {editingProduct && (
          <Modal onClose={handleCancel}>
            <div className="max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b text-gray-800">Edit Product: {editingProduct.name}</h2>
              
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={editingProduct?.name || ''}
                onChange={(e) => handleInputChange(e, 'name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Diamond Solitaire Ring"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={editingProduct?.category || ''}
                        onChange={(e) => handleInputChange(e, 'category')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Rings, Necklaces, Earrings"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                      <select
                        value={editingProduct?.productType || ''}
                        onChange={(e) => handleInputChange(e, 'productType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="jewelry">Jewelry</option>
                        <option value="diamond">Diamond</option>
                        <option value="ring">Ring</option>
                        <option value="lab-grown">Lab-Grown Diamond</option>
                        <option value="natural-diamond">Natural Diamond</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct?.countInStock || 0}
                        onChange={(e) => handleInputChange(e, 'countInStock')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                    <textarea
                      value={editingProduct?.description || ''}
                onChange={(e) => handleInputChange(e, 'description')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (USD) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct?.price || ''}
                        onChange={(e) => handleInputChange(e, 'price')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1299.99"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct?.originalPrice || ''}
                        onChange={(e) => handleInputChange(e, 'originalPrice')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1499.99"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct?.salePrice || ''}
                        onChange={(e) => handleInputChange(e, 'salePrice')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 999.99"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingProduct?.discount || ''}
                        onChange={(e) => handleInputChange(e, 'discount')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Status & Flags */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Status & Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingProduct?.featured || false}
                          onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">Featured Product</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingProduct?.onSale || false}
                          onChange={(e) => setEditingProduct({...editingProduct, onSale: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">On Sale</label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingProduct?.customizable || false}
                          onChange={(e) => setEditingProduct({...editingProduct, customizable: e.target.checked})}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">Customizable</label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editingProduct?.rating || ''}
                          onChange={(e) => handleInputChange(e, 'rating')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 4.5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                        <input
                          type="number"
                          min="0"
                          value={editingProduct?.numReviews || ''}
                          onChange={(e) => handleInputChange(e, 'numReviews')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 25"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input
                        type="text"
                        value={editingProduct?.tags ? (Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : editingProduct.tags) : ''}
                        onChange={(e) => handleInputChange(e, 'tags')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="luxury, handcrafted, custom (comma-separated)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materials</label>
                      <input
                        type="text"
                        value={editingProduct?.materials ? (Array.isArray(editingProduct.materials) ? editingProduct.materials.join(', ') : editingProduct.materials) : ''}
                        onChange={(e) => handleInputChange(e, 'materials')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="gold, diamond, platinum (comma-separated)"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Specifications Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Specifications</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {renderSpecificationFields()}
                  </div>
                </div>

                {/* Media Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Media</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image</label>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {editingProduct?.mainImage && (
                            <ImagePreview 
                              src={editingProduct.mainImage.startsWith('http') 
                                ? editingProduct.mainImage 
                                : `${import.meta.env.VITE_LOCAL_API}${editingProduct.mainImage}`}
                              alt="Current main image"
                              thumbnailHeight="80px"
                              placeholderImage={PLACEHOLDER_IMAGE}
                            />
                          )}
                        </div>
                        <div className="flex-grow">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'mainImage')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                />
                          {fileData.mainImage && (
                            <p className="mt-2 text-sm text-green-600">New image selected: {fileData.mainImage.name}</p>
                          )}
                        </div>
                      </div>
              </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Video</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="video/*"
                      />
                      {fileData.video && (
                        <p className="mt-2 text-sm text-green-600">New video selected: {fileData.video.name}</p>
                      )}
                      {editingProduct?.video && (
                        <p className="mt-2 text-sm text-blue-600">Current video: {
                          typeof editingProduct?.video === 'string' 
                            ? editingProduct.video.split('/').pop() 
                            : 'Video available'
                        }</p>
                      )}
                    </div>
                  </div>
                      
                      {/* Gallery Images Manager */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Gallery Images</label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {/* Existing Gallery Images */}
                          {(editingProduct?.galleryImages || []).map((img, index) => (
                            <div 
                              key={index} 
                              className="relative border border-gray-300 rounded-lg p-2 h-48 flex items-center justify-center bg-white overflow-hidden"
                            >
                              <ImagePreview 
                                src={
                                  fileData.galleryImages && fileData.galleryImages[index] instanceof File
                                    ? URL.createObjectURL(fileData.galleryImages[index])
                                    : (img && img.startsWith('http') ? img : `${import.meta.env.VITE_LOCAL_API}${img}`)
                                }
                                alt={`Gallery image ${index + 1}`} 
                                thumbnailHeight="100%"
                                placeholderImage={PLACEHOLDER_IMAGE}
                                className="w-full h-full"
                              />

                              {/* Control buttons */}
                              <div className="absolute top-2 right-2 flex space-x-1">
                                <label 
                                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                                  title="Replace image"
                                >
                                  <Upload size={16} className="text-white" />
                                  <input 
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        if (validateGalleryImage(file)) {
                                          handleReplaceGalleryImage(index, file);
                                        }
                                      }
                                    }}
                                  />
                                </label>

                                {editingProduct?.galleryImages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleRemoveGalleryImage(index);
                                    }}
                                    className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm"
                                    title="Remove image"
                                  >
                                    <X size={16} className="text-white" />
                                  </button>
                                )}
                              </div>
                              
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                              </div>
                              
                              {/* New file indicator */}
                              {fileData.galleryImages && fileData.galleryImages[index] instanceof File && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                  New
                                </div>
                              )}
                            </div>
                          ))}

                      {/* Add new image button */}
                          {(editingProduct?.galleryImages || []).length < 5 && (
                            <div 
                              className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    handleAddGalleryImage(file);
                                  }
                                };
                                input.click();
                              }}
                            >
                              <Upload size={24} className="text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Add image</p>
                            </div>
                          )}
                        </div>

                        {/* Error display for gallery image validation */}
                        {galleryImageError && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{galleryImageError}</p>
                          </div>
                        )}

                        <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                          <span>{(editingProduct?.galleryImages || []).length} of 5 images</span>
                          
                          <div className="relative inline-block">
                            <label className="inline-flex items-center px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition cursor-pointer">
                              <Upload size={16} className="mr-1" />
                              <span className="text-sm font-medium">Replace All</span>
                <input
                  type="file"
                  multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleReplaceAllGalleryImages(e.target.files);
                                  }
                                }}
                              />
                            </label>
                      </div>
                    </div>
                          </div>
                        </div>

                {/* URL Links Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Image & Video URLs (VDB Compatibility)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                      <input
                        type="url"
                        value={urlData.imageLink}
                        onChange={(e) => handleUrlChange(e, 'imageLink')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image1.jpg"
                      />
                          </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL 2</label>
                      <input
                        type="url"
                        value={urlData.imageLink2}
                        onChange={(e) => handleUrlChange(e, 'imageLink2')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image2.jpg"
                      />
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL 3</label>
                      <input
                        type="url"
                        value={urlData.imageLink3}
                        onChange={(e) => handleUrlChange(e, 'imageLink3')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image3.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL 4</label>
                      <input
                        type="url"
                        value={urlData.imageLink4}
                        onChange={(e) => handleUrlChange(e, 'imageLink4')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image4.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL 5</label>
                      <input
                        type="url"
                        value={urlData.imageLink5}
                        onChange={(e) => handleUrlChange(e, 'imageLink5')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image5.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL 6</label>
                      <input
                        type="url"
                        value={urlData.imageLink6}
                        onChange={(e) => handleUrlChange(e, 'imageLink6')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image6.jpg"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                    <input
                      type="url"
                      value={urlData.videoLink}
                      onChange={(e) => handleUrlChange(e, 'videoLink')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/video.mp4"
                    />
                    </div>
              </div>
                  
                {/* Diamond-specific Media Section */}
                {editingProduct?.productType === 'diamond' && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Diamond-Specific Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">360° Rotation Image</label>
                <input
                  type="file"
                          onChange={(e) => handleFileChange(e, 'rotation360')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                    />
                        {fileData.rotation360 && (
                          <p className="mt-2 text-sm text-green-600">New rotation image selected: {fileData.rotation360.name}</p>
                    )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Images</label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(e, 'zoomImages')}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          accept="image/*"
                        />
                        {fileData.zoomImages && fileData.zoomImages.length > 0 && (
                          <p className="mt-2 text-sm text-green-600">
                            {fileData.zoomImages.length} zoom images selected
                          </p>
                    )}
                  </div>
                </div>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
        
        {/* Single Delete Confirmation Modal */}
        {showDeleteConfirm && productToDelete && (
          <Modal onClose={() => setShowDeleteConfirm(false)}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete <span className="font-semibold">{productToDelete.name}</span>? 
                This action cannot be undone and will permanently remove the product from both database and S3 storage.
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeleteProduct}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Product'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
        
        {/* Multiple Delete Confirmation Modal */}
        {showMultiDeleteConfirm && (
          <Modal onClose={() => setShowMultiDeleteConfirm(false)}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Confirm Multiple Deletion</h3>
              <p className="mb-4">
                Are you sure you want to delete <span className="font-semibold">{selectedProducts.length} products</span>? 
                This action cannot be undone and will permanently remove these products from both database and S3 storage.
              </p>
              
              <div className="max-h-40 overflow-y-auto mb-6 border p-2 rounded">
                <ul className="list-disc pl-5">
                  {selectedProducts.map(product => (
                    <li key={product._id} className="mb-1">{product.name}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setShowMultiDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeleteMultipleProducts}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : `Delete ${selectedProducts.length} Products`}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ProductAdminPanel;