import React, { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";

const ProductAdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);
  const fetchProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_LOCAL_API}/products`);
    setProducts(res.data);
  };

  const handleEdit = (product) => { setEditingProduct(product); };
  const handleSave = async () => {
    await axios.put(`${import.meta.env.VITE_LOCAL_API}/products/${editingProduct._id}`, editingProduct);
    setEditingProduct(null);
    fetchProducts();
  };
  const handleCancel = () => { setEditingProduct(null); };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{editingProduct?._id === product._id ? <Input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} /> : product.name}</td>
              <td>{editingProduct?._id === product._id ? <Input value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} /> : `$${product.price}`}</td>
              <td>
                {editingProduct?._id === product._id ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel} className="ml-2">Cancel</Button>
                  </>
                ) : (
                  <Button onClick={() => handleEdit(product)}>Edit</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductAdminPanel;