import { MapPin, User, Layers, FileCheck } from 'lucide-react';
import { ExtractedData } from '../../api/types';
import { useTranslation } from '../../i18n';

interface ExtractedDataPanelProps {
  data: ExtractedData;
}

export const ExtractedDataPanel = ({ data }: ExtractedDataPanelProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Presented Conveyance Instrument Particulars
            </h3>
            <p className="text-xs text-slate-400">
              Extracted from presented deed submitted for legal clearance
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-semibold border border-indigo-500/30">
          Deed Ingestion
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Section 1: Property Location */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>1. Cadastral Parcel Location</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">State:</span>
              <span className="text-slate-200 font-medium">{data.propertyDetails.state}</span>
            </div>
            <div>
              <span className="text-slate-500 block">District:</span>
              <span className="text-slate-200 font-medium">{data.propertyDetails.district}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Taluk / Mandal:</span>
              <span className="text-slate-200 font-medium">{data.propertyDetails.taluk}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Village:</span>
              <span className="text-slate-200 font-medium">{data.propertyDetails.village}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Survey Number:</span>
              <span className="text-indigo-400 font-mono font-bold">{data.propertyDetails.surveyNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">ULPIN:</span>
              <span className="text-slate-300 font-mono text-[10px]">{data.propertyDetails.ulpin}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Owner Details */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>2. Transferee / Purchaser Details</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 block">Purchaser Full Name:</span>
              <span className="text-white font-bold">{data.ownerDetails.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Father / Spouse:</span>
              <span className="text-slate-200 font-medium">{data.ownerDetails.fatherName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Claimed Share:</span>
                <span className="text-slate-200 font-medium">{data.ownerDetails.share}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Vendor / Transferor:</span>
                <span className="text-slate-300 font-medium">{data.ownerDetails.previousOwner}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Land Extent & Boundaries */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Extent & Schedule Boundaries</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Area Extent:</span>
              <span className="text-white font-mono font-bold">
                {data.landDetails.totalArea} {data.landDetails.areaUnit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Land Classification:</span>
              <span className="text-slate-200">{data.landDetails.landType}</span>
            </div>
            <div className="mt-2 pt-1 border-t border-slate-800 grid grid-cols-2 gap-1 text-[10px] text-slate-400">
              <div>N: {data.landDetails.boundaries.north}</div>
              <div>S: {data.landDetails.boundaries.south}</div>
              <div>E: {data.landDetails.boundaries.east}</div>
              <div>W: {data.landDetails.boundaries.west}</div>
            </div>
          </div>
        </div>

        {/* Section 4: Document Registration Particulars */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4. Registered Deed Particulars</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Instrument Type:</span>
              <span className="text-white font-semibold">{t(data.documentDetails.documentType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Document No.:</span>
              <span className="text-indigo-300 font-mono font-bold">{data.documentDetails.documentNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registration Date:</span>
              <span className="text-slate-200 font-mono">{data.documentDetails.registrationDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SRO Sub-Registrar:</span>
              <span className="text-slate-300">{data.documentDetails.issuingAuthority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
