import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Input } from '@shadcn/ui';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    type: 'diamond',
    name: '',
    description: '',
    price: '',
    images: null,
    specifications: {
      carat: '',
      cut: '',
      color: '',
      clarity: '',
      shape: '',
      fluorescence: '',
      availability: '',
      growthMethod: '',
      polish: '',
      symmetry: '',
      table: '',
      depth: '',
      ratio: '',
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/products');
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
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < formData[key].length; i++) {
          form.append('images', formData[key][i]);
        }
      }else if (key === 'specifications') {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    });

    await axios.post(`${ import.meta.env.VITE_LOCAL_API}/products/addProducts`, form);
    fetchProducts();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded p-2 mb-2"
        >
          <option value="diamond">Diamond</option>
          <option value="jewelry">Jewelry</option>
          <option value="ring">Ring</option>
        </select>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        ></textarea>

        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
          className="mb-2"
        />

        {Object.keys(formData.specifications).map((spec) => (
          <input
            key={spec}
            type="text"
            name={spec}
            value={formData.specifications[spec]}
            onChange={handleSpecificationsChange}
            placeholder={spec.charAt(0).toUpperCase() + spec.slice(1)}
          />
        ))}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Product
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-2">Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id} className="border-b py-2">
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductList;