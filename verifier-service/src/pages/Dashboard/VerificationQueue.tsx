import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';
import { Eye, User, Cpu } from 'lucide-react';
import { VerifierApplication } from '../../api/types';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { RiskScoreGauge } from '../../components/RiskScoreGauge';
import { formatDate } from '../../utils/formatters';

interface VerificationQueueProps {
  applications: VerifierApplication[];
}

export const VerificationQueue = ({ applications }: VerificationQueueProps) => {
  const { t } = useTranslation();

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-sm font-semibold text-slate-300">{t('verifier.noApplications')}</p>
        <p className="text-xs text-slate-500 mt-1">{t('verifier.queueEmpty')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">{t('common.applicationId')}</th>
            <th className="py-3 px-4">{t('Citizen & Document')}</th>
            <th className="py-3 px-4">{t('Survey Number & Location')}</th>
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
          {applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-slate-800/40 transition-colors group"
            >
              <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                <span className="text-emerald-400 group-hover:underline">{app.id}</span>
                <div className="text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                  {formatDate(app.createdAt)}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-100">{app.citizenName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t(app.documentType)}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-medium text-slate-200">Sy. #{app.surveyNumber}</div>
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
                      <span>{t('AI DIRECT')}</span>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
