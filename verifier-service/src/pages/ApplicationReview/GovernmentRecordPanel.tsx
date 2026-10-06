import { useTranslation } from '../../i18n';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { GovtRecord } from '../../api/types';
import { formatDate } from '../../utils/formatters';

interface GovernmentRecordPanelProps {
  data: GovtRecord;
  appId?: string;
  onToggleFallbackService?: () => void;
  onViewSource?: (docTypeKey: string, pageNumber?: number) => void;
}

export const GovernmentRecordPanel = ({
  data,
  appId,
  onToggleFallbackService,
  onViewSource,
}: GovernmentRecordPanelProps) => {
  const { t } = useTranslation();
  const isUnavailable = data.serviceStatus === 'UNAVAILABLE';

  return (
    <div id="section-govt" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Government Land Record Cross-Check
              <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Prototype / Simulated
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              SOURCE: Demo Government Record (Simulated Pahani / Dharani Registry API)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          {onToggleFallbackService && (
            <button
              onClick={onToggleFallbackService}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-semibold transition-all"
            >
              Simulate API {isUnavailable ? 'Online' : 'Offline'}
            </button>
          )}
          <div>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold block">
              {data.sourceRegister}
            </span>
            <span className="text-[10px] text-slate-500">
              Synced: {formatDate(data.lastUpdated)}
            </span>
          </div>
        </div>
      </div>

      {/* API Fallback Warning Banner if offline */}
      {isUnavailable && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Government Record Service: UNAVAILABLE</strong> • Last sync: {formatDate(data.lastUpdated)}. Verifier can proceed using supporting title deed & mutation records.
            </span>
          </div>
          <span className="text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0">
            FALLBACK ACTIVE
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Cadastral Parcel Data */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Official Cadastral Allocation
            </h4>
            {onViewSource && (
              <button
                onClick={() => onViewSource('RoR Record', 1)}
                className="text-[10px] text-emerald-400 hover:underline font-semibold"
              >
                VIEW SOURCE
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Survey / Hissa:</span>
              <span className="text-slate-200 font-mono font-bold">
                Sy. #{data.propertyDetails.surveyNumber} {data.propertyDetails.hissaNumber ? `/ ${data.propertyDetails.hissaNumber}` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">ULPIN:</span>
              <span className="text-slate-300 font-mono text-[10px]">{data.propertyDetails.ulpin}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Recorded Extent:</span>
              <span className="text-emerald-400 font-bold">{data.landDetails.totalArea} {data.landDetails.areaUnit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Land Classification:</span>
              <span className="text-slate-200 font-medium">{data.landDetails.landType}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Current Usage:</span>
              <span className="text-slate-300">{data.landDetails.currentUsage}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Village & Mandal:</span>
              <span className="text-slate-300">{data.propertyDetails.village}, {data.propertyDetails.taluk}</span>
            </div>
          </div>
        </div>

        {/* Official Pattadar Particulars */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              Registered Title Holder (Pattadar)
            </h4>
            {onViewSource && (
              <button
                onClick={() => onViewSource('RoR Record', 1)}
                className="text-[10px] text-sky-400 hover:underline font-semibold"
              >
                VIEW SOURCE
              </button>
            )}
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 block">Recorded Pattadar Name:</span>
              <span className="text-white font-bold">{data.ownerDetails.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Father/Spouse:</span>
                <span className="text-slate-200">{data.ownerDetails.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Extent Share:</span>
                <span className="text-slate-200">{data.ownerDetails.share}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registration Ref:</span>
                <span className="font-mono text-slate-300">{data.documentDetails.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mutation Ref:</span>
                <span className="font-mono text-slate-300">{data.documentDetails.mutationNumber || 'MUT-2026-8819'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
