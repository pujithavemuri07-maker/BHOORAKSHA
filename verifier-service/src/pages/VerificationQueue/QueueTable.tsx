import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';
import { Eye, User, Cpu } from 'lucide-react';
import { VerifierApplication } from '../../api/types';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { RiskScoreGauge } from '../../components/RiskScoreGauge';
import { formatDate } from '../../utils/formatters';

interface QueueTableProps {
  applications: VerifierApplication[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export const QueueTable = ({
  applications,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: QueueTableProps) => {
  const { t } = useTranslation();

  const allSelected =
    applications.length > 0 &&
    applications.every((a) => selectedIds.includes(a.id));

  const handleSelectAllToggle = () => {
    if (allSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(applications.map((a) => a.id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAllToggle}
                aria-label="Select all applications"
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4">{t('common.applicationId')}</th>
            <th className="py-3 px-4">{t('Citizen & Document')}</th>
            <th className="py-3 px-4">{t('Survey Number & Mandal')}</th>
            <th className="py-3 px-4">{t('verifier.riskScore')}</th>
            <th className="py-3 px-4">{t('Priority')}</th>
            <th className="py-3 px-4">{t('common.status')}</th>
            <th className="py-3 px-4">
              <span title="Shows how this application entered the verifier workflow." className="cursor-help underline decoration-dotted decoration-slate-600 underline-offset-4">
                {t('INGESTION SOURCE')}
              </span>
            </th>
            <th className="py-3 px-4 text-right">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {applications.map((app) => {
            const isSelected = selectedIds.includes(app.id);
            return (
              <tr
                key={app.id}
                className={`hover:bg-slate-800/40 transition-colors group ${
                  isSelected ? 'bg-emerald-950/20' : ''
                }`}
              >
                <td className="py-3.5 px-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(app.id)}
                    aria-label={`Select ${app.id}`}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                  <Link
                    to={`/verifier/review/${app.id}`}
                    className="text-emerald-400 hover:underline"
                  >
                    {app.id}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                      {t('Cycle')} {app.reviewCycleNumber || 1}
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans font-normal">
                      {formatDate(app.forwardedDate || app.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100">{app.citizenName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{t(app.documentType)}</div>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    {app.documentsList && app.documentsList.some((d) => d.required && !d.available) && (
                      <span className="text-[10px] bg-rose-500/15 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                        {t('Doc Missing')}
                      </span>
                    )}
                    {app.validationResults && app.validationResults.some((v) => v.status === 'MISMATCH' || v.status === 'PARTIAL') && (
                      <span className="text-[10px] bg-amber-500/15 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                        {t('Discrepancy')}
                      </span>
                    )}
                    {app.gisData && app.gisData.result === 'POTENTIAL_AREA_MISMATCH' && (
                      <span className="text-[10px] bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                        {t('GIS Mismatch')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-200">
                    Sy. #{app.surveyNumber} {app.hissaNumber ? `/ ${app.hissaNumber}` : ''}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {app.extractedData.propertyDetails.village}, {app.extractedData.propertyDetails.taluk}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <RiskScoreGauge score={app.riskScore} size="sm" />
                </td>
                <td className="py-3.5 px-4">
                  <PriorityBadge priority={app.priority} riskScore={app.riskScore} />
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={app.currentStatus || app.status} />
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    {app.source === 'deo_forwarded' ? (
                      <>
                        <User className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t('DEO FORWARDED')}</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span>{t('AI-ROUTED')}</span>
                      </>
                    )}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/verifier/review/${app.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t('verifier.review')}</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
