import axios from 'axios';

// Create API instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

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
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  addDiamond: (data) => api.post('/products/addDiamonds', data, {
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
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
};

// API methods for appointments
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
};

export default {
  productAPI,
  authAPI,
  orderAPI,
  appointmentAPI,
};
