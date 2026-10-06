import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { AdminLayout } from './components/Layout/AdminLayout';

import { DashboardPage } from './pages/Dashboard';
import { ApplicationsQueuePage } from './pages/Applications';
import { ApplicationReviewPage } from './pages/Applications/ApplicationReview';
import { SystemMonitorPage } from './pages/SystemMonitor';
import { AIPerformancePage } from './pages/AIPerformance';
import { UserManagementPage } from './pages/UserManagement';
import { AuditLogPage } from './pages/AuditLog';
import { ReportsPage } from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import { ProfilePage } from './pages/Profile';
import { HelpPage } from './pages/Help';
import { LoginPage } from './pages/Login';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Protected CCLA System Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/applications" element={<ApplicationsQueuePage />} />
              <Route path="/admin/applications/:id" element={<ApplicationReviewPage />} />
              <Route path="/admin/system" element={<SystemMonitorPage />} />

              <Route path="/admin/ai" element={<AIPerformancePage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/audit" element={<AuditLogPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
              <Route path="/admin/help" element={<HelpPage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            fontSize: '12px',
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
