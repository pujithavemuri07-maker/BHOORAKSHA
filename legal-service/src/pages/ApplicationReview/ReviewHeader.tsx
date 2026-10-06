import React from 'react';
import { Link } from 'react-router-dom';
import { LegalApplication } from '../../api/types';
import { SeverityBadge } from '../../components/SeverityBadge';
import { STATUS_COLORS } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Scale,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useTranslation } from '../../i18n';

interface ReviewHeaderProps {
  application: LegalApplication;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ application }) => {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const statusCfg =
    STATUS_COLORS[application.status] || STATUS_COLORS.pending_legal_review;

  const getPriorityLabel = () => {
    if (application.priority === 'urgent' || application.severity === 'high') {
      return { label: 'High Priority', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    }
    if (application.priority === 'normal') {
      return { label: 'Normal Priority', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { label: 'Standard Priority', color: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  const priorityInfo = getPriorityLabel();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Bar: Case ID, Status Badges, Risk & Stage */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back & Case Identity */}
        <div className="flex items-center gap-3">
          <Link
            to="/legal/review"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Back to Legal Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xl font-black text-white tracking-tight">
                {application.id}
              </span>
              <SeverityBadge severity={application.severity} size="sm" />
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badge}`}
              >
                {statusCfg.label}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityInfo.color}`}
              >
                {priorityInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-slate-200 font-semibold">{t(application.documentType)}</span> • Submitted on{' '}
              <span className="font-mono text-slate-300">{formatDate(application.createdAt)}</span> • Current Stage:{' '}
              <span className="text-indigo-300 font-semibold">Legal Review</span>
            </p>
          </div>
        </div>

        {/* Right: Assigned Officer & AI Risk Score */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Assigned Officer
            </span>
            <span className="text-xs font-semibold text-white">
              {application.decisionBy || user?.name || 'Adv. Rajeshwari Sharma'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Last Updated: {formatDate(application.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                AI Risk Score
              </div>
              <div
                className={`text-lg font-mono font-black ${
                  application.legalRiskScore >= 70
                    ? 'text-rose-400'
                    : application.legalRiskScore >= 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {application.legalRiskScore}/100
              </div>
            </div>
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-[10px] font-mono ${
                application.legalRiskScore >= 70
                  ? 'border-rose-500/40 text-rose-300 bg-rose-950/40'
                  : application.legalRiskScore >= 40
                  ? 'border-amber-500/40 text-amber-300 bg-amber-950/40'
                  : 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
              }`}
            >
              {application.severity.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Important Identifiers Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 block text-[10px]">Claimant / Party Name</span>
            <span className="font-semibold text-white truncate block">{application.citizenName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Phone className="w-4 h-4 text-sky-400 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 block text-[10px]">Contact Phone</span>
            <span className="font-mono text-slate-200">{application.citizenPhone || 'Not available'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 block text-[10px]">Survey & Village</span>
            <span className="font-semibold text-slate-200 truncate block">
              Sy. {application.surveyNumber}, {application.extractedData?.propertyDetails?.village || 'Not available'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Hash className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="truncate">
            <span className="text-slate-500 block text-[10px]">ULPIN Parcel Code</span>
            <span className="font-mono text-indigo-300 font-medium truncate block">
              {application.extractedData?.propertyDetails?.ulpin || 'Not available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
