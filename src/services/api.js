import axios from 'axios';

// Create API instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/';

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
  getJewelry: () => api.get('/products/type/jewelry'),
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
  getProductPanel: (type = 'jewelry', limit = 10) => 
    api.get(`/admin/product-panel?type=${type}&limit=${limit}`),
  searchProducts: (query, type = 'all') => 
    api.get(`/admin/product-panel/search?query=${query}&type=${type}`),
  updateProduct: (id, data) => api.put(`/admin/product-panel/product/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/product-panel/product/${id}`),
  deleteMultipleProducts: (ids) => api.post('/admin/product-panel/products/delete-multiple', { ids }),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getProductStats: () => api.get('/admin/products/stats'),
};

export default {
  productAPI,
  authAPI,
  orderAPI,
  appointmentAPI,
  contactAPI,
  adminAPI
};
