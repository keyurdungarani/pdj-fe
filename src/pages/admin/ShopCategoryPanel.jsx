import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Save, 
  X, 
  GripVertical,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  BarChart3,
  Grid,
  Tag
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { adminAPI } from '../../services/api';
import ImagePreview from '../../components/ImagePreview';

const ShopCategoryPanel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    linkUrl: '',
    categoryType: 'jewelry',
    productFilters: {
      category: '',
      productType: '',
      specifications: {
        category: '',
        material: '',
        diamondType: ''
      }
    },
    order: 0,
    isActive: true,
    image: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Category types options (standardized)
  const categoryTypes = [
    { value: 'Jewelry', label: 'Jewelry' },
    { value: 'Diamonds', label: 'Diamonds' },
    { value: 'Rings', label: 'Rings' },
    { value: 'Bands', label: 'Bands' },
    { value: 'Necklaces', label: 'Necklaces' },
    { value: 'Earrings', label: 'Earrings' },
    { value: 'Bracelets', label: 'Bracelets' },
    { value: 'Pendants', label: 'Pendants' },
    { value: 'Custom', label: 'Custom' }
  ];

  // Predefined link options (standardized URLs)
  const linkOptions = [
    { value: '/jewelry', label: 'All Jewelry' },
    { value: '/diamonds', label: 'All Diamonds' },
    { value: '/jewelry?category=ring', label: 'Rings' },
    { value: '/jewelry?category=band', label: 'Bands' },
    { value: '/jewelry?category=necklace', label: 'Necklaces' },
    { value: '/jewelry?category=earrings', label: 'Earrings' },
    { value: '/jewelry?category=bracelet', label: 'Bracelets' },
    { value: '/jewelry?category=pendant', label: 'Pendants' },
    { value: '/diamonds?shape=round', label: 'Round Diamonds' },
    { value: '/diamonds?shape=oval', label: 'Oval Diamonds' },
    { value: '/diamonds?shape=princess', label: 'Princess Diamonds' },
    { value: '/diamonds?shape=emerald', label: 'Emerald Diamonds' },
    { value: '/diamonds?shape=cushion', label: 'Cushion Diamonds' },
    { value: '/custom-jewelry', label: 'Custom Jewelry' }
  ];

  // Fetch shop categories
  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminAPI.getShopCategories(page, 10);
      setCategories(response.data.categories || []);
      setPagination({
        page: response.data.page || 1,
        pages: response.data.pages || 1,
        total: response.data.total || 0
      });
    } catch (error) {
      console.error('Error fetching shop categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await adminAPI.getShopCategoryStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('productFilters.')) {
      const filterPath = name.split('.');
      setFormData(prev => ({
        ...prev,
        productFilters: {
          ...prev.productFilters,
          [filterPath[1]]: value
        }
      }));
    } else if (name.startsWith('productFilters.specifications.')) {
      const filterPath = name.split('.');
      setFormData(prev => ({
        ...prev,
        productFilters: {
          ...prev.productFilters,
          specifications: {
            ...prev.productFilters.specifications,
            [filterPath[2]]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setFormErrors(prev => ({ ...prev, image: 'Image size should be less than 10MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setFormErrors(prev => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.linkUrl.trim()) {
      errors.linkUrl = 'Link URL is required';
    }
    
    if (!showEditModal && !formData.image) {
      errors.image = 'Image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('linkUrl', formData.linkUrl);
      submitData.append('categoryType', formData.categoryType);
      submitData.append('productFilters', JSON.stringify(formData.productFilters));
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      if (showEditModal && editingCategory) {
        await adminAPI.updateShopCategory(editingCategory._id, submitData);
      } else {
        await adminAPI.createShopCategory(submitData);
      }
      
      await fetchCategories();
      await fetchStats();
      handleCloseModal();
      
    } catch (error) {
      console.error('Error saving shop category:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Error saving category' });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      description: category.description || '',
      linkUrl: category.linkUrl || '',
      categoryType: category.categoryType || 'jewelry',
      productFilters: category.productFilters || {
        category: '',
        productType: '',
        specifications: { category: '', material: '', diamondType: '' }
      },
      order: category.order || 0,
      isActive: category.isActive,
      image: null
    });
    setPreviewImage(category.imageUrl);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this shop category?')) {
      return;
    }
    
    setLoading(true);
    try {
      await adminAPI.deleteShopCategory(categoryId);
      await fetchCategories();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting shop category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (categoryId) => {
    setLoading(true);
    try {
      await adminAPI.toggleShopCategoryStatus(categoryId);
      await fetchCategories();
      await fetchStats();
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop reorder
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state immediately for better UX
    setCategories(items);
    
    // Prepare reorder data
    const categoryOrders = items.map((item, index) => ({
      id: item._id,
      order: index
    }));
    
    try {
      await adminAPI.reorderShopCategories(categoryOrders);
      await fetchStats();
    } catch (error) {
      console.error('Error reordering categories:', error);
      // Revert on error
      fetchCategories();
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCategory(null);
    setFormData({
      title: '',
      description: '',
      linkUrl: '',
      categoryType: 'jewelry',
      productFilters: {
        category: '',
        productType: '',
        specifications: { category: '', material: '', diamondType: '' }
      },
      order: 0,
      isActive: true,
      image: null
    });
    setFormErrors({});
    setPreviewImage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Shop Categories</h1>
          <p className="text-gray-600">Manage homepage shop by category section</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <Grid className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Categories</p>
                <p className="text-2xl font-semibold text-red-600">{stats.inactive}</p>
              </div>
              <EyeOff className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Uploads</p>
                <p className="text-2xl font-semibold">{stats.recentUploads}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Manage Categories</h2>
          <p className="text-sm text-gray-600">Drag and drop to reorder. Active categories will appear on the homepage.</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <Grid className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No shop categories yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Add your first category
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categories.map((category, index) => (
                    <Draggable key={category._id} draggableId={category._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border-b flex items-center space-x-4 ${
                            snapshot.isDragging ? 'bg-blue-50' : 'hover:bg-gray-50'
                          } transition-colors`}
                        >
                          {/* Drag Handle */}
                          <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                            <GripVertical size={20} />
                          </div>
                          
                          {/* Image Preview */}
                          <div className="flex-shrink-0">
                            <ImagePreview
                              src={category.imageUrl}
                              alt={category.title}
                              thumbnailHeight="60px"
                              className="w-20 h-15 object-cover rounded"
                            />
                          </div>
                          
                          {/* Category Info */}
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900">{category.title}</h3>
                            {category.description && (
                              <p className="text-sm text-gray-600">{category.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">Order: {category.order}</span>
                              <span className="text-xs text-gray-500">Type: {category.categoryType}</span>
                              <span className="text-xs text-gray-500">
                                Link: {category.linkUrl}
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              category.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleStatus(category._id)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title={category.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {category.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-2 text-red-500 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => fetchCategories(page)}
              className={`px-3 py-2 rounded ${
                page === pagination.page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {showEditModal ? 'Edit Shop Category' : 'Add Shop Category'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image {!showEditModal && <span className="text-red-500">*</span>}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {previewImage ? (
                      <div className="text-center">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          className="mt-2 text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-sm text-gray-600">
                          <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                            Click to upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                          <p className="mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {formErrors.image && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                  )}
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter category title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Category Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryType"
                      value={formData.categoryType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categoryTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter category description"
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a link</option>
                    {linkOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.linkUrl && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.linkUrl}</p>
                  )}
                </div>

                {/* Order and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {formErrors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{formErrors.submit}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : showEditModal ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCategoryPanel; 