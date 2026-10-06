import React, { useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { ApplicationFilters } from './ApplicationFilters';
import { ApplicationTable } from './ApplicationTable';
import { ApplicationCard } from './ApplicationCard';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Link, useSearchParams } from 'react-router-dom';
import { UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const MyApplicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useApplications({
    status: statusFilter,
    search: searchQuery,
    page,
    limit,
  });

  const applications = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t('My Land Verification Applications')}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('Total')} {total} {t('applications submitted under your citizen profile')}
          </p>
        </div>
        <Link
          to="/citizen/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t('Upload New Deed')}</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <ApplicationFilters
        statusFilter={statusFilter}
        onStatusChange={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
      />

      {/* Table / Cards */}
      {isLoading ? (
        <SkeletonLoader type="table" rows={6} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ApplicationTable applications={applications} />
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {applications.length === 0 ? (
              <ApplicationTable applications={[]} />
            ) : (
              applications.map((app) => <ApplicationCard key={app.id} application={app} />)
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-400">
              <span>
                {t('Showing')} {(page - 1) * limit + 1} {t('to')} {Math.min(page * limit, total)} {t('of')} {total} {t('records')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-white px-2">
                  {t('Page')} {page} {t('of')} {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default MyApplicationsPage;
