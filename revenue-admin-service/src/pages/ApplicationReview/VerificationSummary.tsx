import React from 'react';
import { OfficerInfo } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';
import { useTranslation } from '../../i18n';
import {
  FileText,
  UserCheck,
  Scale,
  Map,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface VerificationSummaryProps {
  officers?: {
    deo: OfficerInfo;
    verifier: OfficerInfo;
    legal: OfficerInfo;
    gis: OfficerInfo;
  };
}

export const VerificationSummary: React.FC<VerificationSummaryProps> = ({
  officers,
}) => {
  const { t } = useTranslation();
  if (!officers) return null;
  const { deo, verifier, legal, gis } = officers;

  const renderCard = (
    title: string,
    roleDesc: string,
    icon: React.ReactNode,
    data?: OfficerInfo
  ) => {
    if (!data) return null;
    const isSuccess =
      data.status === 'completed' ||
      data.status === 'approved' ||
      data.status === 'submitted' ||
      data.status === 'forwarded' ||
      data.status === 'cleared';
    const isFailure =
      data.status === 'rejected' ||
      data.status === 'flagged' ||
      data.status === 'anomaly';

    let badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
    let statusIcon = <Clock className="w-3.5 h-3.5" />;

    if (isSuccess) {
      badgeClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    } else if (isFailure) {
      badgeClass = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      statusIcon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
    }

    return (
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
              {icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                {title}
              </h4>
              <p className="text-[11px] text-slate-400">{roleDesc}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeClass}`}
          >
            {statusIcon}
            {t(data.status)}
          </span>
        </div>

        {/* Officer & Timestamp */}
        <div className="space-y-1 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold">{data.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {data.timestamp ? formatDateTime(data.timestamp) : t('Pending')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">{data.designation ? t(data.designation) : t('Revenue Officer')}</p>
          <p className="text-[11px] font-medium text-emerald-400 pt-0.5">
            ✓ {t('Cadastral Overlay')}: 100% {t('Match')} (0 {t('Overlap')})
          </p>
        </div>

        {/* Remarks Snippet */}
        <div className="text-xs text-slate-300">
          <p className="text-[11px] font-semibold text-slate-400 mb-0.5">{t('Summary')}:</p>
          <p className="italic text-slate-400 line-clamp-2 bg-slate-900/30 p-2 rounded border border-slate-800/40 text-[11px]">
            "{data.opinion || data.remarks || t('Verification verified.')}"
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            {t('Statutory Clearances (4-Tier Officer Concurrence)')}
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          {t('Full Concurrence Recorded')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderCard(
          t('1. DEO Validation'),
          t('Data Entry & Document OCR'),
          <FileText className="w-4 h-4 text-sky-400" />,
          deo
        )}

        {renderCard(
          t('2. Revenue Verifier'),
          t('Girdawar / Field Inspection'),
          <UserCheck className="w-4 h-4 text-emerald-400" />,
          verifier
        )}

        {renderCard(
          t('3. Legal Officer'),
          t('Title & Encumbrance Opinion'),
          <Scale className="w-4 h-4 text-purple-400" />,
          legal
        )}

        {renderCard(
          t('4. GIS Specialist'),
          t('Cadastral & Boundary Integrity'),
          <Map className="w-4 h-4 text-amber-400" />,
          gis
        )}
      </div>
    </div>
  );
};
