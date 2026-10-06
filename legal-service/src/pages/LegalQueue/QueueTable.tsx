import React from 'react';
import { Link } from 'react-router-dom';
import { LegalApplication } from '../../api/types';
import { SeverityBadge } from '../../components/SeverityBadge';
import { STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { ArrowRight, AlertTriangle, ShieldAlert } from 'lucide-react';

interface QueueTableProps {
  applications: LegalApplication[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  applications,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
}) => {
  const allSelected =
    applications.length > 0 && selectedIds.length === applications.length;

  const handleSelectAllCheckbox = () => {
    if (allSelected) {
      onClearSelection();
    } else {
      onSelectAll(applications.map((a) => a.id));
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAllCheckbox}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Case ID</th>
              <th className="py-3.5 px-3">Citizen / Claimant</th>
              <th className="py-3.5 px-3">Survey & Village</th>
              <th className="py-3.5 px-3">Legal Flags</th>
              <th className="py-3.5 px-3">Severity</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Priority</th>
              <th className="py-3.5 pr-4 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {applications.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              const statusCfg = STATUS_COLORS[app.status] || STATUS_COLORS.pending_legal_review;

              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isSelected ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(app.id)}
                      className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-white tracking-wide">
                      {app.id}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {formatDate(app.createdAt)}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-100">
                      {app.citizenName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {app.citizenPhone}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-slate-200 font-medium">
                      Sy. {app.surveyNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {app.extractedData.propertyDetails.village},{' '}
                      {app.extractedData.propertyDetails.district}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-400 font-mono">
                        {app.legalFlagsCount}
                      </span>
                      <span className="text-[11px] text-slate-400">Caveats</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                      {app.legalFlags[0]?.title}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <SeverityBadge severity={app.severity} size="sm" />
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusCfg.badge}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] font-bold uppercase font-mono ${
                        app.priority === 'urgent'
                          ? 'text-red-400'
                          : app.priority === 'normal'
                          ? 'text-slate-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {app.priority}
                    </span>
                  </td>

                  <td className="py-3.5 pr-4 pl-3 text-right">
                    <Link
                      to={`/legal/review/${app.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-all shadow-sm"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
