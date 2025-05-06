import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";

// Empty placeholder image as a data URI - gray square with "No Image" text
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23cccccc'/%3E%3Ctext x='75' y='75' font-family='Arial' font-size='14' fill='%23333333' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

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
  const [products, setProducts] = useState({ diamonds: [], rings: [], jewelry: [] });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_LOCAL_API}/products`);
      console.log("🚀 ~ fetchProducts ~ res:", res);
      
      // Check if the response data has a 'products' array
      if (res.data && res.data.products && Array.isArray(res.data.products)) {
        // Categorize products by type
        const categorizedProducts = {
          diamonds: [],
          rings: [],
          jewelry: []
        };
        
        // Sort products into categories by type
        res.data.products.forEach(product => {
          if (product.type === 'diamond') {
            categorizedProducts.diamonds.push(product);
          } else if (product.type === 'ring') {
            categorizedProducts.rings.push(product);
          } else if (product.type === 'jewelry') {
            categorizedProducts.jewelry.push(product);
          }
        });
        
        setProducts(categorizedProducts);
      } else {
        console.error("Unexpected response format:", res.data);
        setProducts({ diamonds: [], rings: [], jewelry: [] });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts({ diamonds: [], rings: [], jewelry: [] });
    }
  };

  const handleEdit = (product) => { setEditingProduct(product); };
  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(editingProduct).forEach(key => {
      if (key === 'galleryImages' || key === 'mainImage' || key === 'video') {
        if (editingProduct[key] instanceof FileList) {
          Array.from(editingProduct[key]).forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        } else {
          formData.append(key, editingProduct[key]);
        }
      } else {
        formData.append(key, editingProduct[key]);
      }
    });
    await axios.put(`${import.meta.env.VITE_LOCAL_API}/products/${editingProduct._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setEditingProduct(null);
    fetchProducts();
  };
  const handleCancel = () => { setEditingProduct(null); };

  const handleInputChange = (e, field) => {
    setEditingProduct({ ...editingProduct, [field]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    setEditingProduct({ ...editingProduct, [field]: e.target.files });
  };

  const renderProductRow = (product) => {
    // Get the proper image URL or use the embedded placeholder
    let imageUrl;
    try {
      // Try main image first
      if (product.mainImage) {
        imageUrl = `${import.meta.env.VITE_LOCAL_API}/${product.mainImage}`;
      }
      // Then try image array
      else if (product.image && product.image.length > 0 && product.image[0].url) {
        imageUrl = `${import.meta.env.VITE_LOCAL_API}/${product.image[0].url}`;
      }
      // Fallback to placeholder
      else {
        imageUrl = PLACEHOLDER_IMAGE;
      }
    } catch (error) {
      imageUrl = PLACEHOLDER_IMAGE;
    }

    return (
      <tr key={product._id} className="border-b">
        <td className="p-4">{product.name}</td>
        <td className="p-4">{`$${product.price}`}</td>
        <td className="p-4">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-12 h-12 object-cover" 
            onError={(e) => {e.target.src = PLACEHOLDER_IMAGE}} 
          />
        </td>
        <td className="p-4 flex items-center">
          <Button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</Button>
        </td>
      </tr>
    );
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>
        {['diamonds', 'rings', 'jewelry'].map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-700">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <Table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products[category] && products[category].length > 0 ? (
                  products[category].map(renderProductRow)
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">No {category} found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        ))}
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
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500 mb-1">Category of the product (determines where it appears in the catalog)</p>
                    <select
                      value={editingProduct.type || 'diamond'}
                      onChange={(e) => handleInputChange(e, 'type')}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="diamond">Diamond</option>
                      <option value="ring">Ring</option>
                      <option value="jewelry">Jewelry</option>
                    </select>
                  </div>
                </div>

                {/* Media Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-700">Product Media</h3>
                  <p className="text-sm text-gray-500 mb-3">High-quality images help customers make purchasing decisions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image <span className="text-red-500">*</span></label>
                      <p className="text-xs text-gray-500 mb-1">Primary photo shown in catalog and product page</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {editingProduct.mainImage && typeof editingProduct.mainImage === 'string' ? (
                            <img 
                              src={`${import.meta.env.VITE_LOCAL_API}/${editingProduct.mainImage}`}
                              alt="Current main image"
                              className="h-20 w-20 object-cover rounded-md border border-gray-300"
                              onError={(e) => {e.target.src = PLACEHOLDER_IMAGE}}
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-md border border-gray-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'mainImage')}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                          />
                          <p className="mt-1 text-xs text-gray-500">Recommended size: 800x800px, square format</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                      <p className="text-xs text-gray-500 mb-1">Additional product photos (up to 3)</p>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(e, 'galleryImages')}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">Shows different angles or details of the product</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Video (Optional)</label>
                    <p className="text-xs text-gray-500 mb-1">Short video showcasing the product</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'video')}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">Max file size: 10MB, preferred format: MP4</p>
                  </div>
                </div>

                {/* Specifications Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-700">Product Specifications</h3>
                  <p className="text-sm text-gray-500 mb-3">Technical details about the product</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                      <p className="text-xs text-gray-500 mb-1">The primary material(s) used</p>
                      <input
                        type="text"
                        value={editingProduct.specifications?.material || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, material: e.target.value }
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Gold, Silver, Platinum"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diamond Type</label>
                      <p className="text-xs text-gray-500 mb-1">Type of diamond used</p>
                      <input
                        type="text"
                        value={editingProduct.specifications?.diamondType || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, diamondType: e.target.value }
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Natural, Lab-grown"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carat Weight</label>
                      <p className="text-xs text-gray-500 mb-1">Weight of the diamond in carats</p>
                      <input
                        type="text"
                        value={editingProduct.specifications?.caratWeight || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            specifications: { ...editingProduct.specifications, caratWeight: e.target.value }
                          })
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1.5, 2.0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                <Button 
                  onClick={handleCancel} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
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