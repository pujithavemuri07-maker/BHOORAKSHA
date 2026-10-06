import { Users, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { AdjoiningParcel } from '../../api/types';

interface AdjoiningParcelsProps {
  parcels: AdjoiningParcel[];
}

export const AdjoiningParcels = ({ parcels }: AdjoiningParcelsProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-400" />
          <span>{t('gis.adjoiningParcels')}</span>
        </h3>
        <span className="text-xs text-slate-400">{t('Adjacent Survey Boundaries')}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {parcels.map((parcel, idx) => {
          const hasConflict = parcel.overlapPercentage > 0;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                hasConflict
                  ? 'bg-rose-950/15 border-rose-500/30'
                  : 'bg-slate-950/50 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-mono font-bold text-slate-200">
                    {t('Sy. No')}: <span className="text-teal-400">{parcel.surveyNumber}</span>
                  </div>
                  {hasConflict ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {parcel.overlapPercentage.toFixed(1)}% {t('OVERLAP')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle className="w-2.5 h-2.5" />
                      {t('CLEAR')}
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-white">{parcel.ownerName}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {t('Area')}: <span className="font-mono text-slate-300">{parcel.extentAcres.toFixed(2)} {t('Ac')}</span>
                </div>
              </div>

              {hasConflict && (
                <div className="mt-2 pt-2 border-t border-rose-500/20 text-[10px] text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>{t('Encroachment or buffer collision detected with this parcel.')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
