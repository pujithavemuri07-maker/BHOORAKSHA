import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useTranslation } from './i18n';

// Layout
import { LegalLayout } from './components/Layout/LegalLayout';

// Pages
import Dashboard from './pages/Dashboard';
import LegalQueuePage from './pages/LegalQueue';
import ApplicationReviewPage from './pages/ApplicationReview';
import HistoryPage from './pages/History';
import ProfilePage from './pages/Profile';
import HelpPage from './pages/Help';
import LegacyRecordsLegal from './pages/LegacyRecords';

// Auth Guard
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public / Redirect routes */}
          <Route path="/legal/login" element={<Navigate to="/legal/dashboard" replace />} />

          {/* Protected Legal Officer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['legal']} />}>
            <Route element={<LegalLayout />}>
              <Route path="/legal/dashboard" element={<Dashboard />} />
              <Route path="/legal/review" element={<LegalQueuePage />} />
              <Route path="/legal/review/:id" element={<ApplicationReviewPage />} />
              <Route path="/legal/legacy-records" element={<LegacyRecordsLegal />} />
              <Route path="/legal/history" element={<HistoryPage />} />
              <Route path="/legal/profile" element={<ProfilePage />} />
              <Route path="/legal/help" element={<HelpPage />} />
              <Route path="/legal" element={<Navigate to="/legal/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback to Legal Dashboard */}
          <Route path="*" element={<Navigate to="/legal/dashboard" replace />} />
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
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '13px',
          },
          success: {
            style: {
              background: '#064e3b',
              border: '1px solid #059669',
              color: '#ecfdf5',
            },
          },
          error: {
            style: {
              background: '#4c0519',
              border: '1px solid #e11d48',
              color: '#fff1f2',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
