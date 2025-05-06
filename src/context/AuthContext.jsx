import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Set up API base URL 
  const API_URL = import.meta.env.VITE_LOCAL_API || 'http://localhost:8081';
  
  // Check if user is logged in on mount
  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  
  // Get saved tokens
  const getUserToken = () => {
    return localStorage.getItem('pdjToken');
  };
  
  const getAdminToken = () => {
    return localStorage.getItem('pdjAdminToken');
  };
  
  // Set axios auth header
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };
  
  // Check if user is already logged in
  const checkUserLoggedIn = async () => {
    // First check for admin token
    const adminToken = getAdminToken();
    if (adminToken) {
      setAuthHeader(adminToken);
      try {
        const response = await axios.get(`${API_URL}/admin/profile`);
        setCurrentUser({...response.data, isAdmin: true});
        setLoading(false);
        return;
      } catch (error) {
        console.error('Admin session expired or invalid', error);
        localStorage.removeItem('pdjAdminToken');
      }
    }
    
    // If no admin token or admin auth failed, check for user token
    const userToken = getUserToken();
    if (userToken) {
      setAuthHeader(userToken);
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error('User session expired or invalid', error);
        localStorage.removeItem('pdjToken');
      }
    }
    
    setLoading(false);
  };
  
  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Registering user at:', `${API_URL}/auth/register`);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration successful:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('pdjToken', token);
      setAuthHeader(token);
      setCurrentUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      console.error('Registration error:', error.response || error);
      setError(error.response?.data?.msg || 'Registration failed');
      setLoading(false);
      throw error;
    }
  };
  
  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      localStorage.setItem('pdjToken', token);
      setAuthHeader(token);
      setCurrentUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      setError(error.response?.data?.msg || 'Login failed');
      setLoading(false);
      throw error;
    }
  };
  
  // Admin login
  const adminLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, credentials);
      const { token, _id, name, email, isAdmin } = response.data;
      
      if (!isAdmin) {
        throw new Error('Not authorized as admin');
      }
      
      localStorage.setItem('pdjAdminToken', token);
      setAuthHeader(token);
      setCurrentUser({ _id, name, email, isAdmin: true });
      setLoading(false);
      return { _id, name, email, isAdmin };
    } catch (error) {
      setError(error.response?.data?.msg || 'Admin login failed');
      setLoading(false);
      throw error;
    }
  };
  
  // Logout
  const logout = () => {
    localStorage.removeItem('pdjToken');
    localStorage.removeItem('pdjAdminToken');
    setAuthHeader(null);
    setCurrentUser(null);
    navigate('/');
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.isAdmin === true;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    adminLogin,
    logout,
    isAdmin,
    checkUserLoggedIn
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 