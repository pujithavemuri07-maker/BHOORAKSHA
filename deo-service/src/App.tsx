import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useTranslation } from './i18n';

// Layout
import { DEOLayout } from './components/Layout/DEOLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ReviewQueue from './pages/ReviewQueue';
import ApplicationReview from './pages/ApplicationReview';
import ManualEntry from './pages/ManualEntry';
import History from './pages/History';
import Profile from './pages/Profile';
import Help from './pages/Help';
import OldDocumentsHub from './pages/OldDocuments';
import OldDocumentUpload from './pages/OldDocuments/Upload';
import OldDocumentProcessing from './pages/OldDocuments/Processing';
import OldDocumentVerify from './pages/OldDocuments/Verify';
import OldDocumentIssuesView from './pages/OldDocuments/IssuesView';

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

function App() {
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public redirect */}
          <Route path="/deo/login" element={<Navigate to="/deo/dashboard" replace />} />

          {/* Protected DEO Routes */}
          <Route element={<ProtectedRoute allowedRoles={['deo']} />}>
            <Route element={<DEOLayout />}>
              <Route path="/deo/dashboard" element={<Dashboard />} />
              <Route path="/deo/review" element={<ReviewQueue />} />
              <Route path="/deo/review/:id" element={<ApplicationReview />} />
              <Route path="/deo/manual-entry" element={<ManualEntry view="hub" />} />
              <Route path="/deo/manual-entry/bulk-upload" element={<ManualEntry view="bulk" />} />
              <Route path="/deo/manual-entry/manual" element={<ManualEntry view="manual" />} />
              <Route path="/deo/manual-entry/:id" element={<ManualEntry view="manual" />} />
              <Route path="/deo/old-documents" element={<OldDocumentsHub />} />
              <Route path="/deo/old-documents/upload" element={<OldDocumentUpload />} />
              <Route path="/deo/old-documents/processing/:id" element={<OldDocumentProcessing />} />
              <Route path="/deo/old-documents/verify/:id" element={<OldDocumentVerify />} />
              <Route path="/deo/old-documents/issues/:id" element={<OldDocumentIssuesView />} />
              <Route path="/deo/history" element={<History />} />
              <Route path="/deo/profile" element={<Profile />} />
              <Route path="/deo/help" element={<Help />} />
              <Route path="/deo" element={<Navigate to="/deo/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/deo/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #334155',
            padding: '14px 18px',
            fontSize: '12px',
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export { App };
export default App;
