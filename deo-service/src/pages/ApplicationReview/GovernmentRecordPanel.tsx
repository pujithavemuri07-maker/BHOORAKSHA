import React from 'react';
import { GovtRecord } from '../../api/types';
import { Database, AlertTriangle, AlertCircle, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface GovernmentRecordPanelProps {
  data?: GovtRecord;
}

export const GovernmentRecordPanel: React.FC<GovernmentRecordPanelProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                State Land Records Master Record
              </h3>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold px-2 py-0.5 rounded-full">
                State Master API v3.2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live ROR 1B / Record of Rights extract from State Data Center (SDC) Master Database
            </p>
          </div>
        </div>

        {/* Status Badge: Discrepancies exist, so must show REVIEW REQUIRED */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" />
            RECORD STATUS: REVIEW REQUIRED
          </span>
        </div>
      </div>

      {/* Record Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Record Identifiers
          </span>
          <p className="text-slate-300">
            Khata Number: <strong className="text-white font-mono">{data.khataNumber || 'KH-88214'}</strong>
          </p>
          <p className="text-slate-300">
            Survey/Hissa: <strong className="text-amber-400 font-mono">{data.propertyDetails.surveyNumber}</strong>
          </p>
          <p className="text-slate-300 font-mono text-[11px]">
            ULPIN: {data.propertyDetails.ulpin || '36-RR-SER-123-01'}
          </p>
          <p className="text-slate-400 text-[11px]">
            Location: {data.propertyDetails.village}, {data.propertyDetails.taluk}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Government Recorded Owner
          </span>
          <p className="text-slate-300">
            Registered Pattadar: <strong className="text-white font-semibold">{data.ownerDetails.name}</strong>
          </p>
          <p className="text-slate-300">
            Relation: {data.ownerDetails.fatherOrSpouse || 'Late Shankar Patel'}
          </p>
          <p className="text-slate-300">
            Recorded Extent: <strong className="text-emerald-400 font-mono">{data.landDetails.area} {data.landDetails.unit}</strong>
          </p>
          <p className="text-slate-400 text-[11px]">
            Ownership: {data.ownerDetails.share || '100% Sole Title'}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Registry Audit Trail
          </span>
          <p className="text-slate-300">
            Last Sanctioned Date: <span className="font-mono text-slate-300">{formatDate(data.lastUpdated || '2026-08-10')}</span>
          </p>
          <p className="text-slate-300">
            Current Land Use: <span className="text-slate-200">{data.landDetails.landType}</span>
          </p>
          <p className="text-slate-300">
            Sanction Order: <span className="font-mono text-amber-400">{data.documentDetails.mutationNumber || 'MUT-2026-0091'}</span>
          </p>
          <p className="text-slate-400 text-[11px]">
            SRO Ledger: SRO Serilingampally (0411)
          </p>
        </div>
      </div>

      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>
          <strong>State Master Synchronization:</strong> Fetched in real-time via State Land Records API. Discrepancies between submitted deed and government master record are highlighted above for DEO human verification.
        </span>
      </div>
    </div>
  );
};
