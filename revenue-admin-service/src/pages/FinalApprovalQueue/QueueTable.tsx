import React from 'react';
import { Link } from 'react-router-dom';
import { RevenueApplication } from '../../api/types';
import { useTranslation } from '../../i18n';
import { formatDate, formatArea } from '../../utils/formatters';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface QueueTableProps {
  applications: RevenueApplication[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onQuickApprove: (app: RevenueApplication) => void;
  onQuickReject: (app: RevenueApplication) => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  applications,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onQuickApprove,
  onQuickReject,
}) => {
  const { t } = useTranslation();

  const isAllSelected =
    applications.length > 0 && selectedIds.length === applications.length;

  const renderOfficerStatusPill = (label: string, status?: string) => {
    let colorClass = 'bg-slate-800 text-slate-400 border-slate-700';
    let icon = <Clock className="w-2.5 h-2.5" />;

    if (
      status === 'completed' ||
      status === 'approved' ||
      status === 'submitted' ||
      status === 'forwarded' ||
      status === 'cleared'
    ) {
      colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      icon = <CheckCircle2 className="w-2.5 h-2.5" />;
    } else if (status === 'rejected' || status === 'flagged' || status === 'anomaly') {
      colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      icon = <XCircle className="w-2.5 h-2.5" />;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colorClass}`}
        title={`${label}: ${status || 'pending'}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'mutation_completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved &amp; Mutated
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Final Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
    }
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
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Application ID
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Citizen &amp; Property
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Tehsil / Mandal
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Officer Clearances (DEO / Verifier / Legal / GIS)
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {applications.map((app) => {
              const isSelected = selectedIds.includes(app.id);

              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isSelected ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(app.id)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>

                  {/* ID & Priority */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {app.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full border ${getPriorityBadge(
                            app.priority
                          )}`}
                        >
                          {app.priority}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(app.submittedAt || app.createdAt)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Citizen & Property Details */}
                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white leading-tight">
                        {app.citizenName}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        Sy: {app.surveyNumber} • Ext: {formatArea(app.extentAcres, app.extentGuntas)}
                      </p>
                      <p className="text-xs text-slate-400">{app.data?.property?.landClassification || 'Patta Land'}</p>
                    </div>
                  </td>

                  {/* Tehsil */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="font-medium text-slate-200 text-xs">
                        {app.tehsil}
                      </span>
                      <p className="text-[11px] text-slate-400">{app.village}</p>
                    </div>
                  </td>

                  {/* 4 Officer Status Chips */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {renderOfficerStatusPill('DEO', app.officers?.deo?.status)}
                      {renderOfficerStatusPill('Verifier', app.officers?.verifier?.status)}
                      {renderOfficerStatusPill('Legal', app.officers?.legal?.status)}
                      {renderOfficerStatusPill('GIS', app.officers?.gis?.status)}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onQuickApprove(app)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                            title="Approve & Prepare Mutation"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onQuickReject(app)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                            title="Final Rejection"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <Link
                        to={`/revenue/review/${app.id}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition"
                      >
                        Review
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
