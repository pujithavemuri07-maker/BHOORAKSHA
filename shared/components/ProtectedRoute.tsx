import React from 'react';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string | string[];
  loginPath?: string;
  portalName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
