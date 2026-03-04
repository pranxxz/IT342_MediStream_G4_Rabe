import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Allow access only if authenticated
  if (isAuthenticated()) {
    return children;
  }

  // Not authenticated -> redirect to landing page
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
