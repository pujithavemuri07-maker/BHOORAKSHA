import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { GISLayout } from './components/Layout/GISLayout';
import { Dashboard } from './pages/Dashboard';
import { GISQueuePage } from './pages/GISQueue';
import { BoundaryReview } from './pages/BoundaryReview';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';
import { HelpPage } from './pages/Help';
import LegacyRecordsGIS from './pages/LegacyRecords';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/gis/dashboard" replace />} />
          <Route path="/gis" element={<Navigate to="/gis/dashboard" replace />} />

          {/* Protected GIS Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['gis']} />}>
            <Route element={<GISLayout />}>
              <Route path="/gis/dashboard" element={<Dashboard />} />
              <Route path="/gis/review" element={<GISQueuePage />} />
              <Route path="/gis/review/:id" element={<BoundaryReview />} />
              <Route path="/gis/legacy-records" element={<LegacyRecordsGIS />} />
              <Route path="/gis/history" element={<HistoryPage />} />
              <Route path="/gis/profile" element={<ProfilePage />} />
              <Route path="/gis/help" element={<HelpPage />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/gis/dashboard" replace />} />
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
