import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AdminLogin } from './AdminLogin';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <AdminLogin />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
