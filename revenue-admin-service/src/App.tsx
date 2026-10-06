import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { RevenueLayout } from './components/Layout/RevenueLayout';
import { DashboardPage } from './pages/Dashboard';
import { FinalApprovalQueuePage } from './pages/FinalApprovalQueue';
import { ApplicationReviewPage } from './pages/ApplicationReview';
import { ReportsPage } from './pages/Reports';
import { TehsilsPage } from './pages/Tehsils';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';
import { HelpPage } from './pages/Help';
import { LoginPage } from './pages/Login';
import LegacyRecordsRevenue from './pages/LegacyRecords';

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
          <Route path="/revenue/login" element={<LoginPage />} />

          <Route path="/" element={<Navigate to="/revenue/dashboard" replace />} />
          <Route path="/revenue" element={<Navigate to="/revenue/dashboard" replace />} />

          {/* Protected Revenue Admin Portal Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RevenueLayout />}>
              <Route path="/revenue/dashboard" element={<DashboardPage />} />
              <Route path="/revenue/review" element={<FinalApprovalQueuePage />} />
              <Route path="/revenue/review/:id" element={<ApplicationReviewPage />} />
              <Route path="/revenue/legacy-records" element={<LegacyRecordsRevenue />} />
              <Route path="/revenue/reports" element={<ReportsPage />} />
              <Route path="/revenue/tehsils" element={<TehsilsPage />} />
              <Route path="/revenue/history" element={<HistoryPage />} />
              <Route path="/revenue/profile" element={<ProfilePage />} />
              <Route path="/revenue/help" element={<HelpPage />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/revenue/dashboard" replace />} />
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
