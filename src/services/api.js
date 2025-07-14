import axios from 'axios';

// Create API instance
const API_URL = import.meta.env.VITE_LOCAL_API || 'http://localhost:8081';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const adminToken = localStorage.getItem('pdjAdminToken');
    const userToken = localStorage.getItem('pdjToken');
    const token = adminToken || userToken;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // For debugging
    console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('pdjToken');
      localStorage.removeItem('pdjAdminToken');
      window.location.href = '/login';
    }
    
    // Handle authorization errors
    if (response && response.status === 403) {
      console.error('Access forbidden');
      // Could redirect to a forbidden page
    }
    
    return Promise.reject(error);
  }
);

// API methods for products
export const productAPI = {
  getAll: (query = '') => api.get(`/products${query}`),
  getById: (id) => api.get(`/products/${id}`),
  addDiamond: (data) => api.post('/products/addDiamonds', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addLabGrown: (data) => api.post('/products/addLabGrown', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addNaturalDiamond: (data) => api.post('/products/addNaturalDiamond', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addJewelry: (data) => api.post('/products/addJewelry', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  addRing: (data) => api.post('/products/addRing', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLabGrown: () => api.get('/products/type/lab-grown'),
  getDiamonds: () => api.get('/products/type/diamonds'),
  getNaturalDiamonds: () => api.get('/products/type/natural-diamonds'),
  getRings: () => api.get('/products/type/rings'),
  getJewelry: (query = '') => api.get(`/products/type/jewelry${query ? `?${query}` : ''}`),
  bulkUpload: (data, config) => api.post('/products/bulk-upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  }),
};

// API methods for authentication
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  adminLogin: (data) => api.post('/admin/login', data),
  adminProfile: () => api.get('/admin/profile'),
  updateAdminProfile: (data) => api.put('/admin/profile', data),
};

// API methods for orders
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (query = '') => api.get(`/orders/admin/orders${query}`),
  getById: (id) => api.get(`/orders/admin/orders/${id}`),
  update: (id, data) => api.put(`/orders/admin/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/admin/orders/${id}`),
  getStats: () => api.get('/orders/admin/orders/stats'),
};

// API methods for appointments
export const appointmentAPI = {
  getAll: (query = '') => api.get(`/appointments${query}`),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getStats: () => api.get('/appointments/stats'),
};

// API methods for contact
export const contactAPI = {
  create: (data) => api.post('/contact', data),
  getAll: (query = '') => api.get(`/contact/admin${query}`),
  getById: (id) => api.get(`/contact/admin/${id}`),
  update: (id, data) => api.put(`/contact/admin/${id}`, data),
  delete: (id) => api.delete(`/contact/admin/${id}`),
  getStats: () => api.get('/contact/admin/stats'),
};

// API methods for admin
export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  register: (data) => api.post('/admin/register', data),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  getProductPanel: (type = 'jewelry', page = 1, limit = 10) => 
    api.get(`/admin/product-panel?type=${type}&page=${page}&limit=${limit}`),
  getProductById: (id) => api.get(`/admin/product/${id}`),
  searchProducts: (query, type = 'all', page = 1, limit = 10) => 
    api.get(`/admin/product-panel/search?query=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`),
  updateProduct: (id, data) => api.put(`/admin/product-panel/product/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/product-panel/product/${id}`),
  deleteMultipleProducts: (ids) => api.post('/admin/product-panel/products/delete-multiple', { ids }),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getProductStats: () => api.get('/admin/products/stats'),
  
  // Featured Images API methods
  getFeaturedImages: (page = 1, limit = 10) => 
    api.get(`/featured-images?page=${page}&limit=${limit}`),
  getFeaturedImageById: (id) => api.get(`/featured-images/${id}`),
  createFeaturedImage: (data) => api.post('/featured-images', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateFeaturedImage: (id, data) => api.put(`/featured-images/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFeaturedImage: (id) => api.delete(`/featured-images/${id}`),
  reorderFeaturedImages: (imageOrders) => api.put('/featured-images/reorder', { imageOrders }),
  toggleFeaturedImageStatus: (id) => api.put(`/featured-images/${id}/toggle`),
  getFeaturedImageStats: () => api.get('/featured-images/stats'),

  // Shop Categories API methods
  getShopCategories: (page = 1, limit = 10) => 
    api.get(`/shop-categories?page=${page}&limit=${limit}`),
  getShopCategoryById: (id) => api.get(`/shop-categories/${id}`),
  createShopCategory: (data) => api.post('/shop-categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateShopCategory: (id, data) => api.put(`/shop-categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteShopCategory: (id) => api.delete(`/shop-categories/${id}`),
  reorderShopCategories: (categoryOrders) => api.put('/shop-categories/reorder', { categoryOrders }),
  toggleShopCategoryStatus: (id) => api.put(`/shop-categories/${id}/toggle`),
  getShopCategoryStats: () => api.get('/shop-categories/stats'),
};

// API methods for featured images (public)
export const featuredImagesAPI = {
  getCurrent: () => api.get('/featured-images/current'),
};

// API methods for shop categories (public)
export const shopCategoriesAPI = {
  getActive: () => api.get('/shop-categories/active'),
};

// API methods for customer reviews (public)
export const customerReviewsAPI = {
  getActive: (limit = 10, featured = false) => 
    api.get(`/customer-reviews/active?limit=${limit}&featured=${featured}`),
};

// API methods for admin - customer reviews
export const customerReviewsAdminAPI = {
  getAll: (query = '') => api.get(`/customer-reviews${query}`),
  getById: (id) => api.get(`/customer-reviews/${id}`),
  create: (data) => api.post('/customer-reviews', data),
  update: (id, data) => api.put(`/customer-reviews/${id}`, data),
  delete: (id) => api.delete(`/customer-reviews/${id}`),
  toggleStatus: (id) => api.patch(`/customer-reviews/${id}/toggle-status`),
  toggleFeatured: (id) => api.patch(`/customer-reviews/${id}/toggle-featured`),
  updateDisplayOrder: (reviews) => api.patch('/customer-reviews/bulk/display-order', { reviews }),
  getStats: () => api.get('/customer-reviews/stats'),
};

export default {
  productAPI,
  authAPI,
  orderAPI,
  appointmentAPI,
  contactAPI,
  adminAPI,
  featuredImagesAPI,
  shopCategoriesAPI,
  customerReviewsAPI,
  customerReviewsAdminAPI
};
