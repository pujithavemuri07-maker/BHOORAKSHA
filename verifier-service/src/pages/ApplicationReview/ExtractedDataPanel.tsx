import { useTranslation } from '../../i18n';
import { MapPin, User, Layers, FileCheck } from 'lucide-react';
import { ExtractedData } from '../../api/types';

interface ExtractedDataPanelProps {
  data: ExtractedData;
}

export const ExtractedDataPanel = ({ data }: ExtractedDataPanelProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              AI Extracted Record Data (Ingested)
            </h3>
            <p className="text-xs text-slate-400">
              Read-only neural entity extraction from submitted deed document
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-semibold border border-purple-500/30">
          MuRIL NER + PostGIS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Section 1: Property Location */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('fields.propertyDetails')}</span>
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
              <span className="text-slate-500 block">Village / Ward:</span>
              <span className="text-slate-200 font-medium">{data.propertyDetails.village}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Survey Number:</span>
              <span className="text-emerald-400 font-mono font-bold">{data.propertyDetails.surveyNumber}</span>
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
            <span>{t('fields.ownerDetails')}</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 block">Owner / Purchaser Name:</span>
              <span className="text-white font-bold">{data.ownerDetails.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Father / Spouse Name:</span>
              <span className="text-slate-200 font-medium">{data.ownerDetails.fatherName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Share:</span>
                <span className="text-slate-200 font-medium">{data.ownerDetails.share}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Previous Title Holder:</span>
                <span className="text-slate-300 font-medium">{data.ownerDetails.previousOwner}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Land Extent & Boundaries */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('fields.landDetails')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Total Area Extent:</span>
              <span className="text-amber-400 font-bold">{data.landDetails.totalArea} {data.landDetails.areaUnit}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Classification:</span>
              <span className="text-slate-200 font-medium">{data.landDetails.landType}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[10px] space-y-1">
            <span className="text-slate-400 font-semibold block">Cadastral Schedule Boundaries:</span>
            <div className="grid grid-cols-2 gap-1 text-slate-300">
              <div><span className="text-slate-500">N:</span> {data.landDetails.boundaries.north}</div>
              <div><span className="text-slate-500">S:</span> {data.landDetails.boundaries.south}</div>
              <div><span className="text-slate-500">E:</span> {data.landDetails.boundaries.east}</div>
              <div><span className="text-slate-500">W:</span> {data.landDetails.boundaries.west}</div>
            </div>
          </div>
        </div>

        {/* Section 4: Document Registration */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-slate-800/80">
            <FileCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>{t('fields.documentDetails')}</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-500 block">Instrument Type:</span>
              <span className="text-slate-200 font-semibold">{t(data.documentDetails.documentType)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block">Registration No:</span>
                <span className="text-slate-200 font-mono">{data.documentDetails.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date:</span>
                <span className="text-slate-200 font-mono">{data.documentDetails.registrationDate}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 block">Issuing Authority:</span>
              <span className="text-slate-300 font-medium">{data.documentDetails.issuingAuthority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
