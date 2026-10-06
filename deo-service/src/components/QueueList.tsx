import React from 'react';
import { LandApplication } from '@shared/types';
import { StatusBadge } from '@shared/components/StatusBadge';
import { RiskGauge } from '@shared/components/RiskGauge';
import { formatDate } from '@shared/utils/formatters';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n';

interface QueueListProps {
  applications: LandApplication[];
  onSelect: (app: LandApplication) => void;
}

export const QueueList: React.FC<QueueListProps> = ({ applications, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
            <th className="py-3.5 px-4 font-semibold">{t('Application No')}</th>
            <th className="py-3.5 px-4 font-semibold">{t('Village / Survey')}</th>
            <th className="py-3.5 px-4 font-semibold">{t('Extent')}</th>
            <th className="py-3.5 px-4 font-semibold">{t('Stage')}</th>
            <th className="py-3.5 px-4 font-semibold">{t('Review Priority')}</th>
            <th className="py-3.5 px-4 font-semibold">{t('Submission Date')}</th>
            <th className="py-3.5 px-4 font-semibold text-right">{t('Review')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {applications.map((app) => (
            <tr
              key={app.id}
              onClick={() => onSelect(app)}
              className="hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                {app.applicationNo}
              </td>
              <td className="py-3.5 px-4 text-white">
                <div>{app.village}</div>
                <div className="text-[11px] text-slate-400">
                  {t('Survey')}: {app.surveyNumber}{app.subdivisionNumber ? `/${app.subdivisionNumber}` : ''}
                </div>
              </td>
              <td className="py-3.5 px-4 font-mono text-slate-300">
                {app.extentAcres} {t('Ac')}
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="py-3.5 px-4">
                <RiskGauge score={app.riskScore} level={app.riskLevel} size="sm" />
              </td>
              <td className="py-3.5 px-4 text-slate-400">
                {formatDate(app.createdAt)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <button className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold inline-flex items-center gap-1">
                  <span>{t('Verify')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
