import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Eye,
  ShieldCheck,
  Building2,
  MapPin,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  XCircle,
  FileQuestion,
  Share2,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

export const ApplicationsQueuePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    dbMetrics,
    applications,
    applicationsTotal,
    isLoadingApplications,
    fetchDbMetrics,
    fetchApplications,
  } = useAdminStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const loadData = async () => {
    await fetchDbMetrics();
    await fetchApplications({
      search: search || undefined,
      status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      stage: selectedStage !== 'ALL' ? selectedStage : undefined,
      priority: selectedPriority !== 'ALL' ? selectedPriority : undefined,
      risk: selectedRisk !== 'ALL' ? selectedRisk : undefined,
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, selectedStage, selectedPriority, selectedRisk]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'APPROVED' || s === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          APPROVED
        </span>
      );
    }
    if (s === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <XCircle className="w-3 h-3" />
          REJECTED
        </span>
      );
    }
    if (s.includes('RETURN') || s.includes('CORRECTION')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <RotateCcw className="w-3 h-3" />
          CORRECTION
        </span>
      );
    }
    if (s.includes('ADDITIONAL') || s.includes('DOCS')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <FileQuestion className="w-3 h-3" />
          DOCS REQUESTED
        </span>
      );
    }
    if (s.includes('ESCALAT')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Share2 className="w-3 h-3" />
          ESCALATED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
        <Clock className="w-3 h-3" />
        READY FOR REVIEW
      </span>
    );
  };

  const getRiskBadge = (score: number) => {
    if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-3 h-3" />
          High ({score})
        </span>
      );
    }
    if (score >= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Med ({score})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Low ({score})
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              CCLA Statutory Final Scrutiny
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono border border-indigo-500/20">
              Live Database Connected
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            System Admin Application Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Centralized queue of land record verification applications progressing through Citizen intake, AI processing, DEO, Verifier, GIS, and Revenue scrutiny.
          </p>
        </div>

        <button
          onClick={() => {
            loadData();
            toast.success('Application queue refreshed from database.');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${isLoadingApplications ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Real Database Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Total Apps</span>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{dbMetrics.total_applications}</div>
          <div className="text-[10px] text-slate-500">All registered records</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 bg-indigo-950/20 space-y-1 shadow-md shadow-indigo-950/40">
          <div className="text-[11px] font-bold text-indigo-300 flex items-center justify-between">
            <span>Ready for Admin</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          </div>
          <div className="text-2xl font-black text-indigo-300">{dbMetrics.ready_for_admin_review}</div>
          <div className="text-[10px] text-indigo-400/80">Pending final sign-off</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Under Verification</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{dbMetrics.under_verification}</div>
          <div className="text-[10px] text-slate-500">In officer pipelines</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Approved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{dbMetrics.approved}</div>
          <div className="text-[10px] text-emerald-500/80">Ratified & sealed</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Returned / Docs</span>
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{dbMetrics.returned}</div>
          <div className="text-[10px] text-slate-500">Requires correction</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>High Risk Flagged</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{dbMetrics.high_risk}</div>
          <div className="text-[10px] text-slate-500">Risk score ≥ 60</div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Application ID (e.g. REQ-2026), Citizen Name, Survey Number, Village, District..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="READY_FOR_ADMIN_REVIEW" className="bg-slate-900">Ready for Admin</option>
              <option value="UNDER_HUMAN_REVIEW" className="bg-slate-900">Under Review</option>
              <option value="APPROVED" className="bg-slate-900">Approved</option>
              <option value="REJECTED" className="bg-slate-900">Rejected</option>
              <option value="RETURNED_FOR_CORRECTION" className="bg-slate-900">Returned</option>
              <option value="ADDITIONAL_DOCS_REQUESTED" className="bg-slate-900">Docs Requested</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Priorities</option>
              <option value="HIGH" className="bg-slate-900">High Priority</option>
              <option value="MEDIUM" className="bg-slate-900">Medium Priority</option>
              <option value="LOW" className="bg-slate-900">Low Priority</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Risks</option>
              <option value="HIGH" className="bg-slate-900">High Risk (≥60)</option>
              <option value="MEDIUM" className="bg-slate-900">Medium (30-59)</option>
              <option value="LOW" className="bg-slate-900">Low (&lt;30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">Review Queue Records</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
              {applications.length} active
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click &quot;Review Application&quot; to open the full 14-section workspace
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Citizen & Property</th>
                <th className="py-3.5 px-4">Survey / Extent</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Risk & Priority</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-slate-300">No applications matched the criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing search filters or refreshing the queue.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.application_no}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/admin/applications/${app.application_no}`)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-indigo-400 text-xs group-hover:text-indigo-300 transition-colors">
                        {app.application_no}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {app.official_ulpin || app.parcel_id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{app.applicant_name}</div>
                      <div className="text-[11px] text-slate-400">Registered Sale Deed</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-200">Sy. #{app.survey_number}</div>
                      <div className="text-[10px] text-indigo-400/90 font-medium">{app.extent_acres} Acres</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{app.village}</div>
                      <div className="text-[11px] text-slate-400">{app.district}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getRiskBadge(app.review_priority_score)}
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {app.review_priority_level}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Today'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/applications/${app.application_no}`);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
