import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route component that checks if user is authenticated
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading or redirect if not authenticated
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component that checks if user is an admin
export const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If no user is logged in, redirect to admin login
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // If user exists but is not admin, redirect to admin login
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default { ProtectedRoute, AdminRoute }; 