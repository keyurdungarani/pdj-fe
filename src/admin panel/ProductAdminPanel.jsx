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
  const [fileData, setFileData] = useState({
    mainImage: null,
    galleryImages: [],
    video: null
  });
  
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

  // Fetch products on initial load and when activeType changes
  useEffect(() => {
    fetchRecentProducts(activeType);
  }, [activeType]);

  // Fetch 10 most recent products by type
  const fetchRecentProducts = async (type) => {
    setLoading(true);
    try {
      const response = await adminAPI.getProductPanel(type);
      setProducts(response.data.products);
      setCounts(response.data.counts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return fetchRecentProducts(activeType);
    }
    
    setLoading(true);
    try {
      const response = await adminAPI.searchProducts(searchQuery, activeType === 'all' ? '' : activeType);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error searching products:", error);
      setLoading(false);
    }
  };

  // Handle type switching
  const switchProductType = (type) => {
    setActiveType(type);
    setSearchQuery('');
  };

  // Handle edit action
  const handleEdit = (product) => {
    setEditingProduct(product);
    // Reset file data
    setFileData({
      mainImage: null,
      galleryImages: [],
      video: null
    });
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
      
      // Add files if they were selected
      if (fileData.mainImage) {
        formData.append('mainImage', fileData.mainImage);
      }
      
      // Handle gallery images - append them individually with indexes to ensure proper order
      if (fileData.galleryImages.length > 0) {
        // If we have multiple new files from bulk upload, use them directly
        if (fileData.galleryImages.length > 1) {
          fileData.galleryImages.forEach((file, index) => {
            if (file instanceof File) {
              formData.append(`galleryImages`, file);
            }
          });
        } 
        // For individual replacements, we need to preserve the order
        else {
          // Get existing gallery image count
          const existingCount = editingProduct.galleryImages ? editingProduct.galleryImages.length : 0;
          
          // For individual replacements, we need to include index information
          fileData.galleryImages.forEach((file, index) => {
            if (file instanceof File) {
              // Include the index information in the field name
              formData.append(`galleryImage_${index}`, file);
            }
          });
          
          // Include a map of which indexes should be replaced
          formData.append('galleryImageIndexes', JSON.stringify(
            fileData.galleryImages.map((file, index) => 
              file instanceof File ? index : null
            ).filter(index => index !== null)
          ));
        }
      }
      
      if (fileData.video) {
        formData.append('video', fileData.video);
      }
      
      // Send update request through our API service
      await adminAPI.updateProduct(editingProduct._id, formData);
      
      // Refresh products
      setEditingProduct(null);
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
  };

  // Handle input change for text fields
  const handleInputChange = (e, field) => {
    setEditingProduct({
      ...editingProduct,
      [field]: field === 'price' ? parseFloat(e.target.value) : e.target.value
    });
  };

  // Handle file change for images and video
  const handleFileChange = (e, field) => {
    if (field === 'galleryImages') {
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
    // Create a new array with the same files as before
    const updatedGalleryImages = [...fileData.galleryImages];
    // Replace the file at the specified index
    updatedGalleryImages[index] = file;
    // Update the state
    setFileData({
      ...fileData,
      galleryImages: updatedGalleryImages,
    });
    // Reset the index
    setGalleryImageToReplace(null);
    // Reset error state
    setGalleryImageError(null);
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

  // Render product row in table
  const renderProductRow = (product) => {
    const imageUrl = product.mainImage && (
      product.mainImage.startsWith('http') 
        ? product.mainImage 
        : `${import.meta.env.VITE_LOCAL_API}${product.mainImage}`
    );
    const isSelected = selectedProducts.some(p => p._id === product._id);
    
    return (
      <tr key={product._id} className={`border-b ${isSelected ? 'bg-blue-50' : ''}`}>
        <td className="p-4">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => handleSelectProduct(product)}
            className="h-4 w-4"
          />
        </td>
      <td className="p-4">{product.name}</td>
        <td className="p-4">{`$${product.price?.toFixed(2)}`}</td>
        <td className="p-4">
          <ImagePreview 
            src={imageUrl} 
            alt={product.name} 
            thumbnailHeight="48px"
            placeholderImage={PLACEHOLDER_IMAGE}
          />
        </td>
      <td className="p-4">
          {new Date(product.createdAt).toLocaleDateString()}
      </td>
        <td className="p-4 flex items-center space-x-2">
          <Button 
            onClick={() => handleEdit(product)} 
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDeleteConfirm(product)} 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </Button>
      </td>
    </tr>
  );
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center">Product Management Panel</h1>
        
        {/* Search Bar */}
        <div className="mb-6 flex">
          <Input
            type="text"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-grow mr-2 p-2 border rounded"
          />
          <Button 
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {/* Type Tabs */}
        <div className="mb-6 flex space-x-2 border-b">
          <button 
            onClick={() => switchProductType('jewelry')}
            className={`p-3 font-medium ${activeType === 'jewelry' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            Jewelry ({counts.jewelry})
          </button>
          <button 
            onClick={() => switchProductType('ring')}
            className={`p-3 font-medium ${activeType === 'ring' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            Rings ({counts.rings})
          </button>
          <button 
            onClick={() => switchProductType('diamond')}
            className={`p-3 font-medium ${activeType === 'diamond' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            Diamonds ({counts.diamonds})
          </button>
          <button 
            onClick={() => switchProductType('lab-grown')}
            className={`p-3 font-medium ${activeType === 'lab-grown' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            Lab-Grown ({counts.labGrown})
          </button>
          <button 
            onClick={() => switchProductType('all')}
            className={`p-3 font-medium ${activeType === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
          >
            All Products
          </button>
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
                  <th className="p-4 text-left">Name</th>
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
        
        {/* Edit Modal */}
        {editingProduct && (
          <Modal onClose={handleCancel}>
            <div className="max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b text-gray-800">Edit Product</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                      <p className="text-xs text-gray-500 mb-1">The display name of the product as shown to customers</p>
                      <input
                        type="text"
                        value={editingProduct.name || ''}
                onChange={(e) => handleInputChange(e, 'name')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Diamond Solitaire Ring"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) <span className="text-red-500">*</span></label>
                      <p className="text-xs text-gray-500 mb-1">The retail price in US dollars (numbers only)</p>
                      <input
                        type="number"
                        value={editingProduct.price || ''}
                onChange={(e) => handleInputChange(e, 'price')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1299.99"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-1">Detailed description of the product, including features and benefits</p>
                    <textarea
                      value={editingProduct.description || ''}
                onChange={(e) => handleInputChange(e, 'description')}
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your product in detail. Include material, design features, and any special characteristics."
                    />
                  </div>
                </div>

                {/* Media Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-700">Product Media</h3>
                  <p className="text-sm text-gray-500 mb-3">High-quality images help customers make purchasing decisions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image</label>
                      <p className="text-xs text-gray-500 mb-1">Primary photo shown in catalog and product page</p>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {editingProduct.mainImage && (
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
                    
              <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                      <p className="text-xs text-gray-500 mb-1">Additional product photos (up to 5)</p>
                      
                      {/* Gallery Images Manager */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current gallery images:</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {/* Existing Gallery Images */}
                          {(editingProduct.galleryImages || []).map((img, index) => (
                            <div 
                              key={index} 
                              className="relative border border-gray-300 rounded-lg p-2 h-48 flex items-center justify-center bg-white overflow-hidden"
                            >
                              {/* Image Preview with zoom functionality */}
                              <ImagePreview 
                                src={
                                  // If this is a replaced image in fileData, use the local preview
                                  fileData.galleryImages && fileData.galleryImages[index] instanceof File
                                    ? URL.createObjectURL(fileData.galleryImages[index])
                                    // Otherwise use the server image with proper path handling
                                    : (img.startsWith('http') ? img : `${import.meta.env.VITE_LOCAL_API}${img}`)
                                }
                                alt={`Gallery image ${index + 1}`} 
                                thumbnailHeight="100%"
                                placeholderImage={PLACEHOLDER_IMAGE}
                                className="w-full h-full"
                              />

                              {/* Error message */}
                              {galleryImageError && galleryImageToReplace === index && (
                                <div className="absolute inset-0 bg-red-100 bg-opacity-90 flex items-center justify-center p-4">
                                  <p className="text-red-600 text-sm text-center">{galleryImageError}</p>
                                </div>
                              )}

                              {/* Control buttons */}
                              <div className="absolute top-2 right-2 flex space-x-1">
                                {/* Replace button */}
                                <label 
                                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                                  title="Replace image"
                                >
                                  <Upload size={16} className="text-white" />
                                  <input 
                                    type="file"
                                    id={`gallery-img-${index}`}
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

                                {/* Remove button - only if we have more than 1 image */}
                                {editingProduct.galleryImages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Create a new array without this image
                                      const newGalleryImages = [...editingProduct.galleryImages];
                                      newGalleryImages.splice(index, 1);
                                      
                                      // Update the editingProduct
                                      setEditingProduct({
                                        ...editingProduct,
                                        galleryImages: newGalleryImages
                                      });
                                      
                                      // If we have replaced files, update those too
                                      if (fileData.galleryImages && fileData.galleryImages.length > 0) {
                                        const newFileData = [...fileData.galleryImages];
                                        if (newFileData.length > index) {
                                          newFileData.splice(index, 1);
                                          setFileData({
                                            ...fileData,
                                            galleryImages: newFileData
                                          });
                                        }
                                      }
                                    }}
                                    className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm"
                                    title="Remove image"
                                  >
                                    <X size={16} className="text-white" />
                                  </button>
                                )}
                              </div>
                              
                              {/* Image number indicator */}
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}

                          {/* Add new image button - if we have less than 5 images */}
                          {(editingProduct.galleryImages || []).length < 5 && (
                            <div 
                              className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                              onClick={() => {
                                // Create input element and trigger click
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    if (validateGalleryImage(file)) {
                                      // Add a new image to the gallery
                                      const newImages = [...editingProduct.galleryImages, ''];
                                      setEditingProduct({
                                        ...editingProduct,
                                        galleryImages: newImages
                                      });
                                      
                                      // Update fileData with this new file
                                      const newFileDataImages = fileData.galleryImages ? [...fileData.galleryImages] : [];
                                      while (newFileDataImages.length < editingProduct.galleryImages.length) {
                                        newFileDataImages.push(null);
                                      }
                                      newFileDataImages.push(file);
                                      setFileData({
                                        ...fileData,
                                        galleryImages: newFileDataImages
                                      });
                                    }
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

                        <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                          <span>{(editingProduct.galleryImages || []).length} of 5 images</span>
                          
                          {/* Bulk upload option */}
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
                                    // Update the fileData with all the new files
                                    setFileData({
                                      ...fileData,
                                      galleryImages: Array.from(e.target.files),
                                    });
                                    
                                    // Create placeholder entries in galleryImages
                                    const newGalleryImages = Array(e.target.files.length).fill('');
                                    setEditingProduct({
                                      ...editingProduct,
                                      galleryImages: newGalleryImages,
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {fileData.galleryImages && fileData.galleryImages.some(file => file instanceof File) && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm font-medium text-blue-700">New images to be uploaded:</p>
                            <ul className="mt-2">
                              {fileData.galleryImages.map((file, idx) => 
                                file instanceof File && (
                                  <li key={idx} className="text-sm text-blue-600 flex items-center">
                                    <span className="mr-2">•</span>
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
              </div>
                  
                  <div className="w-full mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Video</label>
                    <p className="text-xs text-gray-500 mb-1">Video showcasing the product (MP4 format recommended)</p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'video')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="video/*"
                    />
                    {fileData.video && (
                      <p className="mt-2 text-sm text-green-600">New video selected: {fileData.video.name}</p>
                    )}
                    
                    {/* Display existing video info if available */}
                    {editingProduct.video && (
                      <p className="mt-2 text-sm text-blue-600">Current video: {
                        typeof editingProduct.video === 'string' 
                          ? editingProduct.video.split('/').pop() 
                          : 'Video available'
                      }</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
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