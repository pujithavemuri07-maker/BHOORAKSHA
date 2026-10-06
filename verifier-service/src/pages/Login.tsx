import React from 'react';
import { RoleLoginForm } from '@shared/components/auth';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        <RoleLoginForm
          roleCode="verifier"
          onBackToRoles={() => {
            window.location.href = 'http://localhost:8080/?login=true';
          }}
          onSuccessRedirect={() => {
            navigate('/verifier/dashboard');
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
