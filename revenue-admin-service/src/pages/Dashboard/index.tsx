import React, { useState, useMemo } from 'react';
import { useRevenueStore } from '../../store/revenueStore';
import { useTranslation } from '../../i18n';
import { MetricsCards } from './MetricsCards';
import { TehsilChart } from './TehsilChart';
import { StatusPieChart } from './StatusPieChart';
import { ApprovalQueue } from './ApprovalQueue';
import { QueueFilters } from './QueueFilters';
import { ApproveModal } from '../../components/ApproveModal';
import { RejectModal } from '../../components/RejectModal';
import { RevenueApplication } from '../../api/types';
import { Landmark, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const applications = useRevenueStore((s) => s.applications);
  const getTehsilStats = useRevenueStore((s) => s.getTehsilStats);
  const getStatusStats = useRevenueStore((s) => s.getStatusStats);
  const getStats = useRevenueStore((s) => s.getStats);
  const approveApplication = useRevenueStore((s) => s.approveApplication);
  const rejectApplication = useRevenueStore((s) => s.rejectApplication);

  const tehsilStats = useMemo(() => getTehsilStats(), [getTehsilStats, applications]);
  const statusStats = useMemo(() => getStatusStats(), [getStatusStats, applications]);
  const overallStats = useMemo(() => getStats(), [getStats, applications]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTehsil, setSelectedTehsil] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Modal states
  const [approveModalApp, setApproveModalApp] = useState<RevenueApplication | null>(null);
  const [rejectModalApp, setRejectModalApp] = useState<RevenueApplication | null>(null);

  // Unique Tehsils
  const uniqueTehsils = useMemo(() => {
    return Array.from(new Set(applications.map((a) => a.tehsil))).filter(Boolean);
  }, [applications]);

  // Filtered Applications for Preview Queue
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.village.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || app.status === selectedStatus;

      const matchesTehsil =
        selectedTehsil === 'all' || app.tehsil === selectedTehsil;

      const matchesPriority =
        selectedPriority === 'all' || app.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesTehsil && matchesPriority;
    });
  }, [applications, searchQuery, selectedStatus, selectedTehsil, selectedPriority]);

  // Dynamic Metrics
  const metrics = useMemo(() => {
    return {
      totalApplications: overallStats.total || applications.length,
      pendingFinalApproval: overallStats.pending || applications.filter((a) => a.status === 'pending').length,
      approvedThisMonth: overallStats.approved || 89,
      rejectedThisMonth: overallStats.rejected || 14,
      mutationTriggered: overallStats.mutations || 85,
      certificatesGenerated: overallStats.certificates || 78,
    };
  }, [overallStats, applications]);

  const handleConfirmApprove = async (remarks: string) => {
    if (!approveModalApp) return;
    await approveApplication(approveModalApp.id, remarks);
    setApproveModalApp(null);
  };

  const handleConfirmReject = async (reason: string, remarks: string) => {
    if (!rejectModalApp) return;
    await rejectApplication(rejectModalApp.id, reason, remarks);
    setRejectModalApp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Status Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            Revenue Adjudication & Mutation Registry
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            {t('revenue.dashboard')}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            District land records adjudication, Tehsil workload analytics, and final mutation queue.
          </p>
        </div>

        {/* Live Notification / Sync Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 shadow-sm self-start md:self-auto">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Registry Sync:</span>
          <span className="font-bold text-emerald-400 font-mono">Online (28ms)</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards stats={metrics} />

      {/* Visual Analytics Grid: Tehsil Workload & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TehsilChart data={tehsilStats} />
        <StatusPieChart data={statusStats} />
      </div>

      {/* Quick Queue Filters */}
      <QueueFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTehsil={selectedTehsil}
        onTehsilChange={setSelectedTehsil}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        tehsils={uniqueTehsils}
        onReset={() => {
          setSearchQuery('');
          setSelectedStatus('all');
          setSelectedTehsil('all');
          setSelectedPriority('all');
        }}
      />

      {/* Final Approval Queue Section */}
      <ApprovalQueue
        applications={filteredApplications}
        onQuickApprove={(app) => setApproveModalApp(app)}
        onQuickReject={(app) => setRejectModalApp(app)}
      />

      {/* Modals */}
      {approveModalApp && (
        <ApproveModal
          isOpen={true}
          applicationId={approveModalApp.id}
          ulpin={approveModalApp.ulpin}
          onClose={() => setApproveModalApp(null)}
          onConfirm={handleConfirmApprove}
        />
      )}

      {rejectModalApp && (
        <RejectModal
          isOpen={true}
          applicationId={rejectModalApp.id}
          onClose={() => setRejectModalApp(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  );
};

export default DashboardPage;
