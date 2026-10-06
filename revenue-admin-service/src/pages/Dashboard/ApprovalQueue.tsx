import React from 'react';
import { Link } from 'react-router-dom';
import { RevenueApplication } from '../../api/types';
import { useTranslation } from '../../i18n';
import { formatDate } from '../../utils/formatters';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';

interface ApprovalQueueProps {
  applications: RevenueApplication[];
  onQuickApprove?: (app: RevenueApplication) => void;
  onQuickReject?: (app: RevenueApplication) => void;
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({
  applications,
  onQuickApprove,
  onQuickReject,
}) => {
  const { t } = useTranslation();

  const renderOfficerPill = (
    label: string,
    status?: string
  ) => {
    let colorClass = 'bg-slate-800 text-slate-400 border-slate-700';
    let icon = <Clock className="w-2.5 h-2.5" />;

    if (status === 'completed' || status === 'approved' || status === 'submitted' || status === 'forwarded' || status === 'cleared') {
      colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      icon = <CheckCircle2 className="w-2.5 h-2.5" />;
    } else if (status === 'rejected' || status === 'flagged' || status === 'anomaly') {
      colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      icon = <XCircle className="w-2.5 h-2.5" />;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${colorClass}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            {t('revenue.finalApprovalQueue')}
          </h3>
        </div>
        <Link
          to="/revenue/review"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
        >
          {t('View Full Queue')} ({applications.length})
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          {t('No applications awaiting final approval at this moment.')}
        </div>
      ) : (
        <div className="space-y-3">
          {applications.slice(0, 5).map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Application Details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    {app.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityBadge(
                      app.priority
                    )}`}
                  >
                    {t(app.priority)}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">
                    {formatDate(app.submittedAt || app.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {app.citizenName}
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {t('Sy. No')}: {app.surveyNumber}, {app.village}, {app.tehsil}
                  </span>
                </div>

                {/* 4-Officer Clearance Status Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium mr-1">
                    {t('Clearances')}:
                  </span>
                  {renderOfficerPill(t('DEO'), app.officers?.deo?.status)}
                  {renderOfficerPill(t('Verifier'), app.officers?.verifier?.status)}
                  {renderOfficerPill(t('Legal'), app.officers?.legal?.status)}
                  {renderOfficerPill(t('GIS'), app.officers?.gis?.status)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {app.status === 'pending' && (
                  <>
                    {onQuickApprove && (
                      <button
                        onClick={() => onQuickApprove(app)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                      >
                        {t('Approve')}
                      </button>
                    )}
                    {onQuickReject && (
                      <button
                        onClick={() => onQuickReject(app)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                      >
                        {t('Reject')}
                      </button>
                    )}
                  </>
                )}

                <Link
                  to={`/revenue/review/${app.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition group-hover:bg-indigo-500"
                >
                  {t('Review')}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
