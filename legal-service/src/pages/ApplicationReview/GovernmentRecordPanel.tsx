import { MapPin, User, Layers, Database, AlertTriangle } from 'lucide-react';
import { GovtRecord, ExtractedData } from '../../api/types';

interface GovernmentRecordPanelProps {
  govtRecord: GovtRecord;
  extractedData: ExtractedData;
}

export const GovernmentRecordPanel = ({
  govtRecord,
  extractedData,
}: GovernmentRecordPanelProps) => {
  const isNameMismatch =
    govtRecord.ownerDetails.name.toLowerCase() !==
    extractedData.ownerDetails.name.toLowerCase();

  const isAreaMismatch =
    govtRecord.landDetails.totalArea !== extractedData.landDetails.totalArea;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              State Revenue Record (Pahani & RoR 1-B)
            </h3>
            <p className="text-xs text-slate-400">
              Authoritative revenue ledger extract from {govtRecord.sourceRegister}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
          Sync: {govtRecord.lastUpdated}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Section 1: Property Details */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. Revenue Cadastral Record</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">State:</span>
              <span className="text-slate-200 font-medium">{govtRecord.propertyDetails.state}</span>
            </div>
            <div>
              <span className="text-slate-500 block">District:</span>
              <span className="text-slate-200 font-medium">{govtRecord.propertyDetails.district}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Taluk:</span>
              <span className="text-slate-200 font-medium">{govtRecord.propertyDetails.taluk}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Village:</span>
              <span className="text-slate-200 font-medium">{govtRecord.propertyDetails.village}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Survey Number:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {govtRecord.propertyDetails.surveyNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">ULPIN:</span>
              <span className="text-slate-300 font-mono text-[10px]">
                {govtRecord.propertyDetails.ulpin}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Owner Details with discrepancy highlight */}
        <div
          className={`p-4 rounded-xl bg-slate-950/60 border space-y-2 ${
            isNameMismatch ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>2. Recorded Pattadar</span>
            </div>
            {isNameMismatch && (
              <span className="text-[10px] text-amber-400 flex items-center gap-1 font-sans font-semibold">
                <AlertTriangle className="w-3 h-3" /> Name Discrepancy
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 block">Recorded Title Holder:</span>
              <span className={`font-bold ${isNameMismatch ? 'text-amber-300' : 'text-white'}`}>
                {govtRecord.ownerDetails.name}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Father / Spouse:</span>
              <span className="text-slate-200 font-medium">
                {govtRecord.ownerDetails.fatherName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Share:</span>
                <span className="text-slate-200 font-medium">{govtRecord.ownerDetails.share}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Predecessor Title:</span>
                <span className="text-slate-300 font-medium">
                  {govtRecord.ownerDetails.previousOwner}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Land Details with discrepancy check */}
        <div
          className={`p-4 rounded-xl bg-slate-950/60 border space-y-2 ${
            isAreaMismatch ? 'border-red-500/50 bg-red-950/10' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>3. RoR Land Extent</span>
            </div>
            {isAreaMismatch && (
              <span className="text-[10px] text-red-400 flex items-center gap-1 font-sans font-semibold">
                <AlertTriangle className="w-3 h-3" /> Extent Variance
              </span>
            )}
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Government Recorded Area:</span>
              <span className="text-white font-mono font-bold">
                {govtRecord.landDetails.totalArea} {govtRecord.landDetails.areaUnit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Revenue Land Type:</span>
              <span className="text-slate-200">{govtRecord.landDetails.landType}</span>
            </div>
            <div className="mt-2 pt-1 border-t border-slate-800 grid grid-cols-2 gap-1 text-[10px] text-slate-400">
              <div>N: {govtRecord.landDetails.boundaries.north}</div>
              <div>S: {govtRecord.landDetails.boundaries.south}</div>
              <div>E: {govtRecord.landDetails.boundaries.east}</div>
              <div>W: {govtRecord.landDetails.boundaries.west}</div>
            </div>
          </div>
        </div>

        {/* Section 4: Revenue Mutation & SRO Link */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Prior Mutation Register</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Last Mutation No.:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {govtRecord.documentDetails.mutationNumber || 'MUT/2012/8821'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered In:</span>
              <span className="text-slate-200">{govtRecord.sourceRegister}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Prior Registration:</span>
              <span className="text-slate-300 font-mono">
                {govtRecord.documentDetails.registrationNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
