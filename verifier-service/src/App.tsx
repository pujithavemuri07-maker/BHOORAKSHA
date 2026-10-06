import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useTranslation } from './i18n';

// Layout
import { VerifierLayout } from './components/Layout/VerifierLayout';

// Pages
import Dashboard from './pages/Dashboard';
import VerificationQueue from './pages/VerificationQueue';
import ApplicationReview from './pages/ApplicationReview';
import History from './pages/History';
import Profile from './pages/Profile';
import Help from './pages/Help';
import LegacyRecordsVerifier from './pages/LegacyRecords';

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
          <Route path="/verifier/login" element={<Navigate to="/verifier/dashboard" replace />} />

          {/* Protected Verifier Routes */}
          <Route element={<ProtectedRoute allowedRoles={['verifier']} />}>
            <Route element={<VerifierLayout />}>
              <Route path="/verifier/dashboard" element={<Dashboard />} />
              <Route path="/verifier/review" element={<VerificationQueue />} />
              <Route path="/verifier/review/:id" element={<ApplicationReview />} />
              <Route path="/verifier/legacy-records" element={<LegacyRecordsVerifier />} />
              <Route path="/verifier/history" element={<History />} />
              <Route path="/verifier/profile" element={<Profile />} />
              <Route path="/verifier/help" element={<Help />} />
              <Route path="/verifier" element={<Navigate to="/verifier/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/verifier/dashboard" replace />} />
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
