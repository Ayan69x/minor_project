import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken'); // Get token from localStorage

  if (authToken) {
    return children; // If token exists, allow access
  }

  // If no token, redirect to the login page
  return <Navigate to="/login" />;
};

export default PrivateRoute;
