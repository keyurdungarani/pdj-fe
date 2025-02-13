import React, { useState, useEffect } from "react";
import axios from "axios";

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
    specifications: {
      carat: "",
      cut: "",
      color: "",
      clarity: "",
      shape: "",
      fluorescence: "",
      availability: "",
      growthMethod: "",
      polish: "",
      symmetry: "",
      table: "",
      depth: "",
      ratio: "",
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_LOCAL_API}/products`);
    setProducts(response.data);
  };

  const handleSpecificationsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      specifications: { ...formData.specifications, [name]: value },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.mainImage) newErrors.mainImage = "Main Image is required";
    if (formData.galleryImages.length !== 3) newErrors.galleryImages = "Exactly 3 gallery images are required";
    if (!formData.video) newErrors.video = "Video is required";
    if (formData.type === "diamond") {
      for (const key in formData.specifications) {
        if (!formData.specifications[key]) {
          newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < formData[key].length; i++) {
          form.append("images", formData[key][i]);
        }
      } else if (key === "specifications") {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    });

    await axios.post(`${import.meta.env.VITE_LOCAL_API}/products/addProducts`, form);
    fetchProducts();
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
                required
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
                required
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
              multiple
              onChange={handleFileChange}
              className={`w-full p-2 border cursor-pointer ${errors.mainImage ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md focus:outline-none focus:ring focus:ring-[#D4AF37]`}
              required
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
              required
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
              required
            />
            {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
          </div>

          {
            formData.type === "diamond" && (<>
              <h3 className="text-xl font-semibold text-[#333] mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
                {Object.keys(formData.specifications).map((spec) => (
                  <input
                    className={`border ${errors[spec] ? 'border-red-500' : 'border-[#D4AF37]'} rounded-md p-3 focus:outline-none focus:ring focus:ring-[#D4AF37]`}
                    key={spec}
                    type="text"
                    name={spec}
                    value={formData.specifications[spec]}
                    onChange={handleSpecificationsChange}
                    placeholder={spec.charAt(0).toUpperCase() + spec.slice(1)}
                    required
                  />
                ))}
                {Object.keys(errors).filter(key => formData.specifications.hasOwnProperty(key)).map((spec) => (
                  <p key={spec} className="text-red-500 text-sm">{errors[spec]}</p>
                ))}
              </div>
            </>)
          }
          <button
            type="submit"
            className="bg-gradient-to-r from-[#D4AF37] to-[#b9952e] text-white py-3 px-6 rounded-md hover:opacity-90 transition-opacity"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Product List Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto border border-[#D4AF37]">
        <h2 className="text-2xl font-bold text-[#333] mb-6">Products</h2>
        <ul>
          {products.map((product) => (
            <li
              key={product._id}
              className="border-b last:border-0 py-4 flex justify-between items-center"
            >
              <span className="text-lg font-medium">{product.name}</span>
              <span className="text-gray-600">${product.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductList;