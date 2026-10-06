import React from 'react';
import { AdminLogin } from '../components/Auth/AdminLogin';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  return (
    <div className="w-full h-full">
        <AdminLogin />
    </div>
  );
};

export default LoginPage;
