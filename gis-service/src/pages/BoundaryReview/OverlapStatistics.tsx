import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GISApplication } from '../../api/types';
import { getGISClassification } from '../../utils/constants';

interface OverlapStatisticsProps {
  application: GISApplication;
}

export const OverlapStatistics = ({ application }: OverlapStatisticsProps) => {
  const { t } = useTranslation();
  const classification = getGISClassification(application.overlapPercentage);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-teal-400" />
          <span>{t('gis.overlapStatistics')}</span>
        </h3>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          PostGIS ST_Intersection Analysis
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Document Area */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Document Area')}</div>
          <div className="text-lg font-bold font-mono text-red-400 mt-1">
            {application.documentAreaAcres.toFixed(2)} {t('Ac')}
          </div>
          <div className="text-[10px] text-slate-500">{t('Claimed in deed polygon')}</div>
        </div>

        {/* Govt Cadastral Area */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('BhooNaksha Area')}</div>
          <div className="text-lg font-bold font-mono text-blue-400 mt-1">
            {application.govtCadastralAreaAcres.toFixed(2)} {t('Ac')}
          </div>
          <div className="text-[10px] text-slate-500">{t('Official cadastral sheet')}</div>
        </div>

        {/* Overlap Area */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Overlap Area')}</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            {application.overlapAreaAcres.toFixed(2)} {t('Ac')}
          </div>
          <div className="text-[10px] text-slate-500">{t('Intersection boundary zone')}</div>
        </div>

        {/* Overlap % */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">{t('Overlap Extent')}</div>
          <div
            className={`text-lg font-black font-mono mt-1 ${classification.textColor}`}
          >
            {application.overlapPercentage.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500">{t('Discrepancy ratio')}</div>
        </div>
      </div>

      {/* Traffic Light Rule Alert Box */}
      <div
        className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
          classification.trafficLight === 'green'
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : classification.trafficLight === 'yellow'
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {classification.trafficLight === 'green' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : classification.trafficLight === 'yellow' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          )}
        </div>
        <div className="space-y-0.5">
          <div className="font-bold flex items-center gap-2">
            <span>{t('Status')}: {t(classification.label)}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded border bg-slate-900/60">
              {t('Rule')}: {classification.range}
            </span>
          </div>
          <p className="text-[11px] opacity-90">{t(classification.meaning)}</p>
          <div className="text-[10px] font-semibold opacity-75 pt-1">
            {t('Mandated Action')}: {t(classification.action)}
          </div>
        </div>
      </div>
    </div>
  );
};
