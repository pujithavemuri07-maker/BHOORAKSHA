import React from 'react';
import { RevenueLogin } from '../components/Auth/RevenueLogin';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  return (
    <div className="w-full h-full">
        <RevenueLogin />
    </div>
  );
};

export default LoginPage;
