// src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin') return <Navigate to="/unauthorized" replace />;

  return children;
};

export default AdminRoute;
