import React from 'react';
import { Link } from 'react-router-dom';
import { DEOApplication } from '../../api/types';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import {
  classifyRisk,
  getApplicationEffectiveStatus,
  getApplicationEffectivePriority,
} from '../../utils/riskClassification';
import { ArrowRight, FileSpreadsheet, MapPin, User, FileText, CheckSquare, Square } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QueueTableProps {
  applications: DEOApplication[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  applications,
  selectedIds,
  onSelectToggle,
  onSelectAll,
}) => {
  const isAllSelected = applications.length > 0 && selectedIds.length === applications.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">
                <button
                  type="button"
                  onClick={onSelectAll}
                  className="p-1 hover:text-white transition-colors"
                  title={isAllSelected ? 'Deselect All' : 'Select All'}
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </th>
              <th className="py-3.5 px-4">Application ID</th>
              <th className="py-3.5 px-4">Citizen & Document</th>
              <th className="py-3.5 px-4">Survey & Mandal</th>
              <th className="py-3.5 px-4 text-center">AI Risk</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {applications.map((app) => {
              const isSelected = selectedIds.includes(app.id);
              const isApiFailure = app.status === 'API_FAILURE_MANUAL_ENTRY' || app.govtApiStatus === 'failed';

              return (
                <tr
                  key={app.id}
                  className={cn(
                    'transition-colors group',
                    isSelected ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-slate-800/40'
                  )}
                >
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectToggle(app.id)}
                      className="p-1 hover:text-white transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                      )}
                    </button>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-white group-hover:text-amber-400 transition-colors">
                      {app.id}
                    </span>
                    <p className="text-[11px] text-slate-500">{formatDate(app.submissionDate)}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-200">{app.citizenName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-500" />
                      {app.documentType}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-200 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>Sy. #{app.extractedData.propertyDetails.surveyNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {app.extractedData.propertyDetails.village}, {app.extractedData.propertyDetails.taluk}
                    </p>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {(() => {
                      const risk = classifyRisk(app.riskScore);
                      return (
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border',
                              risk.badgeClass
                            )}
                          >
                            {risk.riskScore}/100
                          </span>
                          <span className={cn('text-[9px] font-bold tracking-tight mt-0.5', risk.textClass)}>
                            {risk.riskLabel}
                          </span>
                        </div>
                      );
                    })()}
                  </td>

                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={getApplicationEffectivePriority(app)} />
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={getApplicationEffectiveStatus(app)} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {isApiFailure ? (
                      <Link
                        to={`/deo/manual-entry/${app.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Manual Entry</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/deo/review/${app.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
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
