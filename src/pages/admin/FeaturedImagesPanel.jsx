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
  BarChart3
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { adminAPI } from '../../services/api';
import ImagePreview from '../../components/ImagePreview';

const FeaturedImagesPanel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    linkText: 'Learn More',
    category: 'General',
    order: 0,
    isActive: true,
    image: null
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch featured images
  const fetchImages = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminAPI.getFeaturedImages(page, 10);
      setImages(response.data.images || []);
      setPagination({
        page: response.data.page || 1,
        pages: response.data.pages || 1,
        total: response.data.total || 0
      });
    } catch (error) {
      console.error('Error fetching featured images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await adminAPI.getFeaturedImageStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchStats();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
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
      submitData.append('subtitle', formData.subtitle);
      submitData.append('linkUrl', formData.linkUrl);
      submitData.append('linkText', formData.linkText);
      submitData.append('category', formData.category);
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      if (showEditModal && editingImage) {
        await adminAPI.updateFeaturedImage(editingImage._id, submitData);
      } else {
        await adminAPI.createFeaturedImage(submitData);
      }
      
      await fetchImages();
      await fetchStats();
      handleCloseModal();
      
    } catch (error) {
      console.error('Error saving featured image:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Error saving image' });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      subtitle: image.subtitle || '',
      linkUrl: image.linkUrl || '',
      linkText: image.linkText || 'Learn More',
      category: image.category || 'General',
      order: image.order || 0,
      isActive: image.isActive,
      image: null
    });
    setPreviewImage(image.imageUrl);
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this featured image?')) {
      return;
    }
    
    setLoading(true);
    try {
      await adminAPI.deleteFeaturedImage(imageId);
      await fetchImages();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting featured image:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (imageId) => {
    setLoading(true);
    try {
      await adminAPI.toggleFeaturedImageStatus(imageId);
      await fetchImages();
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
    
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state immediately for better UX
    setImages(items);
    
    // Prepare reorder data
    const imageOrders = items.map((item, index) => ({
      id: item._id,
      order: index
    }));
    
    try {
      await adminAPI.reorderFeaturedImages(imageOrders);
      await fetchStats();
    } catch (error) {
      console.error('Error reordering images:', error);
      // Revert on error
      fetchImages();
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingImage(null);
    setFormData({
      title: '',
      subtitle: '',
      linkUrl: '',
      linkText: 'Learn More',
      category: 'General',
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
          <h1 className="text-2xl font-semibold text-gray-900">Featured Images</h1>
          <p className="text-gray-600">Manage homepage slider images with automatic rotation</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Image</span>
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Images</p>
                <p className="text-2xl font-semibold">{stats.total}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Images</p>
                <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Images</p>
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

      {/* Images List */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Manage Images</h2>
          <p className="text-sm text-gray-600">Drag and drop to reorder. The system will automatically rotate 4 images every 24 hours.</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No featured images yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Add your first image
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {images.map((image, index) => (
                    <Draggable key={image._id} draggableId={image._id} index={index}>
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
                              src={image.imageUrl}
                              alt={image.title}
                              thumbnailHeight="60px"
                              className="w-20 h-15 object-cover rounded"
                            />
                          </div>
                          
                          {/* Image Info */}
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900">{image.title}</h3>
                            {image.subtitle && (
                              <p className="text-sm text-gray-600">{image.subtitle}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">Order: {image.order}</span>
                              <span className="text-xs text-gray-500">Category: {image.category}</span>
                              <span className="text-xs text-gray-500">Displays: {image.displayCount || 0}</span>
                              {image.lastDisplayed && (
                                <span className="text-xs text-gray-500">
                                  Last shown: {new Date(image.lastDisplayed).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex-shrink-0">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              image.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {image.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleStatus(image._id)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title={image.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {image.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            
                            <button
                              onClick={() => handleEdit(image)}
                              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDelete(image._id)}
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
              onClick={() => fetchImages(page)}
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {showEditModal ? 'Edit Featured Image' : 'Add Featured Image'}
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
                    Image {!showEditModal && <span className="text-red-500">*</span>}
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

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter image title"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subtitle (optional)"
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL
                  </label>
                  <input
                    type="url"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Link Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Text
                  </label>
                  <input
                    type="text"
                    name="linkText"
                    value={formData.linkText}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Learn More"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="General">General</option>
                      <option value="Diamonds">Diamonds</option>
                      <option value="Jewelry">Jewelry</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
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

                  {/* Active Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{formErrors.submit}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
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

export default FeaturedImagesPanel; 