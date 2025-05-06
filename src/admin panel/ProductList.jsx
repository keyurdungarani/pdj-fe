import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ProductList() {
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.mainImage) newErrors.mainImage = "Main Image is required";
    if (formData.galleryImages.length !== 3) newErrors.galleryImages = "Exactly 3 gallery images are required";
    if (!formData.video) newErrors.video = "Video is required";
    
    if (formData.type === "diamond") {
      if (!formData.rotation360) newErrors.rotation360 = "Rotation 360 image is required";
      if (formData.zoomImages.length < 1) newErrors.zoomImages = "At least one zoom image is required";
      Object.entries(formData.specifications).forEach(([key, value]) => {
        if (!value) newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      });
    }

    if (formData.type === "ring") {
      if (!formData.specifications.material) newErrors.material = "Material is required";
      if (!formData.specifications.size) newErrors.size = "Size is required";
    }

    if (formData.type === "jewelry") {
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.specifications.material) newErrors.material = "Material is required";
      if (!formData.specifications.diamondType) newErrors.diamondType = "Diamond type is required";
      if (!formData.specifications.caratWeight) newErrors.caratWeight = "Carat weight is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    form.append("mainImage", formData.mainImage[0]);
    
    Array.from(formData.galleryImages).forEach(file => {
      form.append("galleryImages", file);
    });
    
    form.append("video", formData.video[0]);
    
    // Convert specific specifications based on type
    if (formData.type === "diamond") {
      form.append("specifications", JSON.stringify(formData.specifications));
      form.append("rotation360", formData.rotation360[0]);
      Array.from(formData.zoomImages).forEach(file => {
        form.append("zoomImages", file);
      });
    }
    else if (formData.type === "ring") {
      form.append("specifications", JSON.stringify(formData.specifications));
    }
    else if (formData.type === "jewelry") {
      form.append("specifications", JSON.stringify(formData.specifications));
      form.append("category", formData.category);
    }

    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('pdjAdminToken');
      
      if (!adminToken) {
        setError('Admin authentication required. Please login again.');
        toast.error('Admin authentication required');
        navigate('/admin/login');
        return;
      }
      
      // Send request with admin token in Authorization header
      await axios.post(endpoint, form, {
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
    <div className="p-6 bg-[#F9F9F9] min-h-screen font-sans">
      <h1 className="text-4xl font-serif text-[#D4AF37] text-center mb-8">
        Admin Panel
      </h1>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12 max-w-4xl mx-auto border border-[#D4AF37]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-[#333] mb-6">
            Add a New Product
          </h2>

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
              <label className="block text-lg font-medium mb-2 text-[#555]">
                Price <span className="text-red-500">*</span>
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
              Upload 3 Images for Gallery <span className="text-red-500">*</span>
            </label>
            <label className="block text-sm font-medium mb-2 text-[#555]">
              (Upload 3 images for gallery view)
            </label>
            <input
              type="file"
              name="galleryImages"
              multiple
              onChange={handleFileChange}
              className={`w-full p-2 border cursor-pointer ${errors.galleryImages ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md focus:outline-none focus:ring focus:ring-[#D4AF37]`}
            />
            {errors.galleryImages && <p className="text-red-500 text-sm">{errors.galleryImages}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-[#555]">
              Upload Video <span className="text-red-500">*</span>
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
                Category <span className="text-red-500">*</span>
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
                  Rotation 360 Image <span className="text-red-500">*</span>
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
                  Zoom Images <span className="text-red-500">*</span>
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
                <td className="py-2 px-4 border-b border-[#D4AF37]">{product.price}</td>
                <td className="py-2 px-4 border-b border-[#D4AF37]">
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;