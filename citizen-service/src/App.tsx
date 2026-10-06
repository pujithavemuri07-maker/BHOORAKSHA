import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import { CitizenLayout } from './components/layout/CitizenLayout';

// Pages
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/Upload';
import MyApplications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Resubmit from './pages/Resubmit';

// Auth Guard
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useTranslation } from './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Protected Citizen Routes */}
          <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
            <Route element={<CitizenLayout />}>
              {/* Canonical /citizen/ routes */}
              <Route path="/citizen/dashboard" element={<Dashboard />} />
              <Route path="/citizen/upload" element={<UploadDocument />} />
              <Route path="/citizen/applications" element={<MyApplications />} />
              <Route path="/citizen/applications/:id" element={<ApplicationDetail />} />
              <Route path="/citizen/resubmit/:id" element={<Resubmit />} />
              <Route path="/citizen/profile" element={<Profile />} />
              <Route path="/citizen/notifications" element={<Notifications />} />
              <Route path="/citizen/help" element={<Help />} />

              {/* Standalone port 3000 routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadDocument />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/applications/:id" element={<ApplicationDetail />} />
              <Route path="/resubmit/:id" element={<Resubmit />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/help" element={<Help />} />

              {/* Trailing-slash and root navigation */}
              <Route path="/citizen" element={<Navigate to="/citizen/dashboard" replace />} />
              <Route path="/citizen/" element={<Navigate to="/citizen/dashboard" replace />} />
              <Route path="/" element={<Navigate to="/citizen/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #334155',
            borderRadius: '16px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
};
export default App;
