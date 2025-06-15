import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import ImagePreview from '../components/ImagePreview';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";
import { adminAPI } from "../services/api";
import './GalleryManager.css';
import { PLACEHOLDER_IMAGES } from '../utils/placeholderImage';

function ProductList({ hideProductList = false }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    type: "diamond",
    name: "",
    description: "",
    price: "",
    mainImage: null,
    galleryImages: [],
    video: null,
    rotation360: null,
    zoomImages: [],
    category: "",
    specifications: getDefaultSpecs("diamond"),
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Add state for gallery image management
  const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
  const [galleryImageErrors, setGalleryImageErrors] = useState([]);
  const [galleryFormData, setGalleryFormData] = useState(new FormData());

  function getDefaultSpecs(type) {
    switch (type) {
      case "diamond":
        return { carat: "", cut: "", color: "", clarity: "", shape: "", fluorescence: "", growthMethod: "", polish: "", symmetry: "", table: "", depth: "", ratio: "", size: "", weight: "", dimensions: "" };
      case "ring":
        return { material: "", width: 2.5, size: "", price: 585, style: "Full Court wedding band" };
      case "jewelry":
        return { material: "", diamondType: "", caratWeight: "", price: "", style: "", totalDiamonds: "", setting: "" };
      default:
        return {};
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
try {
      const adminToken = localStorage.getItem('pdjAdminToken');
      
      if (!adminToken) {
        setError('Admin authentication required. Please login again.');
        navigate('/admin/login');
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_LOCAL_API}/products`, {
        headers: { 
          "Authorization": `Bearer ${adminToken}`
        }
      });
    setProducts(response.data);
} catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const handleSpecificationsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData(prev => ({
...prev,
        ...getDefaultSpecs(value),
        type: value,
              }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add handler for individual gallery image changes
  const handleGalleryImageChange = (file, index) => {
    if (!file) return;

    // Validate file
    if (!validateGalleryImage(file, index)) return;

    // Update galleryImages array
    const updatedGalleryImages = [...formData.galleryImages];
    
    // Store reference to file for form submission
    if (!updatedGalleryImages[index]) {
      updatedGalleryImages[index] = file;
    } else {
      updatedGalleryImages[index] = file;
    }
    
    setFormData(prev => ({
      ...prev,
      galleryImages: updatedGalleryImages
    }));

    // Update preview
    updateGalleryPreview(file, index);
  };

  // Function to validate gallery images
  const validateGalleryImage = (file, index) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setGalleryImageErrors(prev => {
        const errors = [...prev];
        errors[index] = 'Invalid file type. Please use JPEG, PNG, WEBP or GIF';
        return errors;
      });
      return false;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setGalleryImageErrors(prev => {
        const errors = [...prev];
        errors[index] = 'File too large (max 5MB)';
        return errors;
      });
      return false;
    }

    // Clear error for this index
    setGalleryImageErrors(prev => {
      const errors = [...prev];
      errors[index] = null;
      return errors;
    });

    return true;
  };

  // Function to generate and update preview URLs
  const updateGalleryPreview = (file, index) => {
    const previewUrl = URL.createObjectURL(file);
    
    setGalleryImagePreviews(prev => {
      const previews = [...prev];
      // Clean up old preview URL
      if (previews[index]) URL.revokeObjectURL(previews[index]);
      previews[index] = previewUrl;
      return previews;
    });
  };

  // Function to remove a gallery image
  const removeGalleryImage = (index) => {
    // Update gallery images array
    const updatedGalleryImages = [...formData.galleryImages];
    updatedGalleryImages.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      galleryImages: updatedGalleryImages
    }));

    // Clean up preview URL
    setGalleryImagePreviews(prev => {
      const previews = [...prev];
      if (previews[index]) URL.revokeObjectURL(previews[index]);
      previews.splice(index, 1);
      return previews;
    });

    // Remove error entry
    setGalleryImageErrors(prev => {
      const errors = [...prev];
      errors.splice(index, 1);
      return errors;
    });
  };

  // Function to add a new empty slot
  const addGalleryImage = () => {
    // Maximum 5 images
    if (formData.galleryImages.length >= 5) return;
    
    // Add null as placeholder
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, null]
    }));
    
    // Add empty preview and error slots
    setGalleryImagePreviews(prev => [...prev, null]);
    setGalleryImageErrors(prev => [...prev, null]);
  };

  // Update the existing handleFileChange function to support this new approach
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      console.log(`File selected for ${name}:`, files[0].name, files[0].size);
      
      if (name === 'galleryImages') {
        // For bulk upload, convert FileList to Array and store
        const filesArray = Array.from(files);
        
        // Update formData with the new files
        setFormData(prev => ({ ...prev, [name]: filesArray }));
        
        // Reset gallery image previews and errors since we're replacing all images
        const previews = filesArray.map(file => URL.createObjectURL(file));
        setGalleryImagePreviews(previews);
        setGalleryImageErrors([]);
      } else {
    setFormData(prev => ({ ...prev, [name]: files }));
      }
    } else {
      console.log(`No files selected for ${name}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.mainImage) newErrors.mainImage = "Main Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
    const form = new FormData();
    const endpoint = `${import.meta.env.VITE_LOCAL_API}/products/${
      formData.type === "diamond" ? "addDiamonds" :
      formData.type === "ring" ? "addRing" : "addJewelry"
    }`;

    // Append common fields
    form.append("type", formData.type);
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);

      // Check files before appending
      if (!formData.mainImage || !formData.mainImage[0]) {
        setErrors(prev => ({...prev, mainImage: "Main image is required"}));
        return;
      }
      
      const mainImageFile = formData.mainImage[0];
      if (mainImageFile.size === 0) {
        setErrors(prev => ({...prev, mainImage: "Main image file is empty"}));
        return;
      }
      
      form.append("mainImage", mainImageFile);
      
      // Gallery images (optional)
      if (formData.galleryImages && formData.galleryImages.length > 0) {
        Array.from(formData.galleryImages).forEach((file, index) => {
          if (file && file.size > 0) {
      form.append("galleryImages", file);
          }
    });
      }
    
      // Video (optional)
      if (formData.video && formData.video[0] && formData.video[0].size > 0) {
    form.append("video", formData.video[0]);
      }
      
      // Add specific fields based on product type
      if (formData.type === "diamond") {
        // Diamond specific fields (optional)
    form.append("specifications", JSON.stringify(formData.specifications));

        if (formData.rotation360 && formData.rotation360[0] && formData.rotation360[0].size > 0) {
      form.append("rotation360", formData.rotation360[0]);
        }
        
        if (formData.zoomImages && formData.zoomImages.length > 0) {
          Array.from(formData.zoomImages).forEach((file, index) => {
            if (file && file.size > 0) {
        form.append("zoomImages", file);
            }
          });
        }
      }
      else if (formData.type === "ring") {
        form.append("specifications", JSON.stringify(formData.specifications));
      }
      else if (formData.type === "jewelry") {
        form.append("specifications", JSON.stringify(formData.specifications));
        if (formData.category) {
      form.append("category", formData.category);
        }
      }

      // Get admin token from localStorage
      const adminToken = localStorage.getItem('pdjAdminToken');
      
      if (!adminToken) {
        setError('Admin authentication required. Please login again.');
        toast.error('Admin authentication required');
        navigate('/admin/login');
        return;
      }
      
      // Send request with admin token in Authorization header
      const response = await axios.post(endpoint, form, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${adminToken}`
        }
      });
      
      toast.success('Product added successfully!');
      fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      const errorMessage = error.response?.data?.msg || 'Failed to add product';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  };

  const renderSpecifications = () => {
    switch (formData.type) {
      case "diamond":
        return Object.keys(formData.specifications).map((spec) => (
          <input
            key={spec}
            className={`border ${errors[spec] ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md p-3`}
            type="text"
            name={spec}
            value={formData.specifications[spec]}
            onChange={handleSpecificationsChange}
            placeholder={spec.charAt(0).toUpperCase() + spec.slice(1)}
          />
        ));

      case "ring":
        return (
          <>
            <select
              name="material"
              value={formData.specifications?.material}
              onChange={handleSpecificationsChange}
              className="border border-[#D4AF37] rounded-md p-3"
            >
              <option value="">Select Material</option>
              {["Platinum", "Yellow Gold", "Rose Gold", "White Gold"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              name="size"
              value={formData.specifications?.size}
              onChange={handleSpecificationsChange}
              className="border border-[#D4AF37] rounded-md p-3"
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
            <input
              type="number"
              name="width"
              value={formData.specifications.width}
              onChange={handleSpecificationsChange}
              placeholder="Width"
              className="border border-[#D4AF37] rounded-md p-3"
            />
          </>
        );

      case "jewelry":
        return (
          <>
            <select
              name="material"
              value={formData.specifications?.material}
              onChange={handleSpecificationsChange}
              className="border border-[#D4AF37] rounded-md p-3"
            >
              <option value="">Select Material</option>
              {["Platinum", "Yellow Gold", "White Gold"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              name="diamondType"
              value={formData.specifications?.diamondType}
              onChange={handleSpecificationsChange}
              className="border border-[#D4AF37] rounded-md p-3"
            >
              <option value="">Select Diamond Type</option>
              {["Lab Grown", "Natural"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              name="caratWeight"
              value={formData.specifications?.caratWeight}
              onChange={handleSpecificationsChange}
              className="border border-[#D4AF37] rounded-md p-3"
            >
              <option value="">Select Carat Weight</option>
              {[0.20, 0.40, 1.00, 1.50, 2.00].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={hideProductList ? "" : "p-6 bg-[#F9F9F9] min-h-screen font-sans"}>
      {!hideProductList && (
      <h1 className="text-4xl font-serif text-[#D4AF37] text-center mb-8">
        Admin Panel
      </h1>
      )}

      {/* Form Section */}
      <div className={hideProductList ? "" : "bg-white rounded-lg shadow-lg p-8 mb-12 max-w-4xl mx-auto border border-[#D4AF37]"}>
        <form onSubmit={handleSubmit}>
          {!hideProductList && (
          <h2 className="text-2xl font-semibold text-[#333] mb-6">
            Add a New Product
          </h2>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-[#555]">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`border ${errors.type ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md p-3 w-full focus:outline-none focus:ring focus:ring-[#D4AF37]`}
            >
              <option value="diamond">Diamond</option>
              <option value="jewelry">Jewelry</option>
              <option value="ring">Ring</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-medium mb-2 text-[#555]">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`border ${errors.name ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md p-3 w-full focus:outline-none focus:ring focus:ring-[#D4AF37]`}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                className={`border ${errors.price ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md p-3 w-full focus:outline-none focus:ring focus:ring-[#D4AF37]`}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-[#555]">
              Description
            </label>
            <textarea
              className="border border-[#D4AF37] rounded-md p-3 w-full focus:outline-none focus:ring focus:ring-[#D4AF37]"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-1 text-[#555]">
              Upload Main Image <span className="text-red-500">*</span>
            </label>
            <label className="block text-sm font-medium mb-2 text-[#555]">
              (This will be the main image of the product)
            </label>
            <input
              type="file"
              name="mainImage"
              onChange={handleFileChange}
              className={`w-full p-2 border cursor-pointer ${errors.mainImage ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md focus:outline-none focus:ring focus:ring-[#D4AF37]`}
            />
            {errors.mainImage && <p className="text-red-500 text-sm">{errors.mainImage}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-1 text-[#555]">
              Gallery Images
            </label>
            <label className="block text-sm font-medium mb-2 text-[#555]">
              (Upload up to 5 images for gallery view)
            </label>
            
            {/* Gallery Image Manager */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Existing Images */}
                {formData.galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative border border-gray-300 rounded-lg p-2 h-48 flex items-center justify-center bg-white overflow-hidden"
                  >
                    {/* Image Preview */}
                    {(image || galleryImagePreviews[index]) && (
                      <ImagePreview
                        src={galleryImagePreviews[index] || (typeof image === 'string' ? image : URL.createObjectURL(image))}
                        alt={`Gallery image ${index + 1}`} 
                        thumbnailHeight="100%"
                        placeholderImage={PLACEHOLDER_IMAGES.thumbnail}
                        className="w-full h-full"
                      />
                    )}

                    {!image && !galleryImagePreviews[index] && (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={32} />
                        <span className="mt-2 text-sm">No image</span>
                      </div>
                    )}

                    {/* Error message */}
                    {galleryImageErrors[index] && (
                      <div className="absolute inset-0 bg-red-100 bg-opacity-90 flex items-center justify-center p-4">
                        <p className="text-red-600 text-sm text-center">{galleryImageErrors[index]}</p>
                      </div>
                    )}

                    {/* Control buttons */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {/* Replace button */}
                      <label 
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                        title="Replace image"
                      >
                        <Upload size={16} className="text-white" />
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files[0] && handleGalleryImageChange(e.target.files[0], index)}
                        />
                      </label>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                        title="Remove image"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                    
                    {/* Image number indicator */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}

                {/* Add new image button */}
                {formData.galleryImages.length < 5 && (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-yellow-50 transition-colors"
                    onClick={addGalleryImage}
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Add image</p>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                {formData.galleryImages.length} of 5 images
                {galleryImageErrors.some(error => error) && (
                  <p className="text-red-500 mt-1">Please fix the errors before saving</p>
                )}
              </div>
              
              {/* Bulk upload option */}
              <div className="mt-4 border-t pt-4">
                <label className="block text-sm font-medium mb-2 text-[#555]">
                  Or replace all images at once:
            </label>
            <input
              type="file"
              name="galleryImages"
              multiple
              onChange={handleFileChange}
                  className="w-full p-2 border cursor-pointer border-[#D4AF37] rounded-md focus:outline-none focus:ring focus:ring-[#D4AF37]"
                  accept="image/*"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple files to replace all gallery images
                </p>
              </div>
            </div>
            
            {errors.galleryImages && <p className="text-red-500 text-sm mt-2">{errors.galleryImages}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-[#555]">
              Upload Video
            </label>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              className={`w-full p-2 border cursor-pointer ${errors.video ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md focus:outline-none focus:ring focus:ring-[#D4AF37]`}
            />
            {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
          </div>

          {formData.type === "jewelry" && (
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-[#555]">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`border ${errors.category ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md p-3 w-full`}
              >
                <option value="">Select Category</option>
                {['Earrings', 'Necklace', 'Bracelet', 'Pendant'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
          )}

          {formData.type === "diamond" && (
            <>
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2 text-[#555]">
                  Rotation 360 Image
                </label>
                <input
                  type="file"
                  name="rotation360"
                  onChange={handleFileChange}
                  className={`w-full p-2 border cursor-pointer ${errors.rotation360 ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md`}
                />
                {errors.rotation360 && <p className="text-red-500 text-sm">{errors.rotation360}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium mb-2 text-[#555]">
                  Zoom Images
                </label>
                <input
                  type="file"
                  name="zoomImages"
                  multiple
                  onChange={handleFileChange}
                  className={`w-full p-2 border cursor-pointer ${errors.zoomImages ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md`}
                />
                {errors.zoomImages && <p className="text-red-500 text-sm">{errors.zoomImages}</p>}
              </div>
            </>
          )}

          <h3 className="text-xl font-semibold text-[#333] mb-4">
            Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {renderSpecifications()}
          </div>

          <button
            type="submit"
            className="bg-[#D4AF37] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#b08f2e] transition duration-300"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Product List Section */}
      {!hideProductList && (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto border border-[#D4AF37]">
        <h2 className="text-2xl font-semibold text-[#333] mb-6">
          Product List
        </h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-[#D4AF37]">Name</th>
              <th className="py-2 px-4 border-b border-[#D4AF37]">Type</th>
              <th className="py-2 px-4 border-b border-[#D4AF37]">Price</th>
              <th className="py-2 px-4 border-b border-[#D4AF37]">Actions</th>
            </tr>
          </thead>
          <tbody>
            { products.length > 0 && products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b border-[#D4AF37]">{product.name}</td>
                <td className="py-2 px-4 border-b border-[#D4AF37]">{product.type}</td>
                <td className="py-2 px-4 border-b border-[#D4AF37]">${product.price}</td>
                <td className="py-2 px-4 border-b border-[#D4AF37]">
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default ProductList;