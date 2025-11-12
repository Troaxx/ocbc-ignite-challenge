import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader/> 
  }

  // Check both state and localStorage as fallback
  // This handles race conditions where state might not be updated yet after login
  const storedUser = localStorage.getItem('ocbc_auth_user');
  const isAuthenticated = user || storedUser;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
