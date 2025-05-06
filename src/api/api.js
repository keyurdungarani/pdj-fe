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
    
    return Promise.reject(error);
  }
);

export default api; 