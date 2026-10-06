import React from 'react';
import { LandApplication } from '../types/application';
import { StatusBadge } from './StatusBadge';
import { RiskGauge } from './RiskGauge';
import { formatDate } from '../utils/formatters';
import { ChevronRight, FileText } from 'lucide-react';

interface RecentApplicationsTableProps {
  applications: LandApplication[];
  onSelectApplication?: (app: LandApplication) => void;
  className?: string;
}

export const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({
  applications,
  onSelectApplication,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <th className="py-3 px-4 font-semibold">Application #</th>
            <th className="py-3 px-4 font-semibold">Village / Survey</th>
            <th className="py-3 px-4 font-semibold">Extent</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">AI Risk</th>
            <th className="py-3 px-4 font-semibold">Created</th>
            <th className="py-3 px-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              onClick={() => onSelectApplication?.(app)}
            >
              <td className="py-3.5 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {app.applicationNo}
              </td>
              <td className="py-3.5 px-4">
                <div className="font-medium text-slate-800 dark:text-slate-200">{app.village}</div>
                <div className="text-[11px] text-slate-400">
                  Survey: {app.surveyNumber}{app.subdivisionNumber ? `/${app.subdivisionNumber}` : ''}
                </div>
              </td>
              <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                {app.extentAcres} Ac
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="py-3.5 px-4">
                <RiskGauge score={app.riskScore} level={app.riskLevel} size="sm" />
              </td>
              <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                {formatDate(app.createdAt)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
