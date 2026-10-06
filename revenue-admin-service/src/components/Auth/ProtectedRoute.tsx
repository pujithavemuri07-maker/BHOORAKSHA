import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RevenueLogin } from './RevenueLogin';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium tracking-wide">Authenticating Tehsildar credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <RevenueLogin />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
