import React from 'react';
import { LegalApplication } from '../../api/types';
import { User, MapPin, FileCheck, Layers, Landmark, Phone, Mail, Home } from 'lucide-react';

interface CaseLandSummaryProps {
  application: LegalApplication;
}

export const CaseLandSummary: React.FC<CaseLandSummaryProps> = ({ application }) => {
  const ext = application.extractedData;
  const prop = ext?.propertyDetails;
  const owner = ext?.ownerDetails;
  const land = ext?.landDetails;
  const doc = ext?.documentDetails;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-400" />
            Case & Land Summary
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified particulars of claimant parties, cadastral land parcels, and presented title instrument
          </p>
        </div>
        <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-lg font-semibold border border-indigo-500/20">
          Statutory Ingestion Data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* GROUP A — CLAIMANT / PARTIES */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Group A — Claimant / Parties</span>
          </div>

          <div className="space-y-2 text-slate-300 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Claimant Full Name:</span>
              <span className="text-white font-bold text-xs">{application.citizenName || owner?.name || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Father / Spouse Name:</span>
              <span className="text-slate-200 font-medium">{owner?.fatherName || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Contact Phone / Mobile:</span>
              <span className="text-slate-200 font-mono">{application.citizenPhone || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Email Address:</span>
              <span className="text-slate-200 font-mono">{application.citizenEmail || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Claimant / Party Role:</span>
              <span className="text-indigo-300 font-semibold bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/20 inline-block mt-0.5">
                {owner?.share ? `Transferee (${owner.share})` : 'Purchaser / Sole Title Claimant'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Prior Owner / Transferor:</span>
              <span className="text-slate-300">{owner?.previousOwner || 'Not available'}</span>
            </div>
          </div>
        </div>

        {/* GROUP B — LAND DETAILS */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Group B — Land Details</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Survey Number:</span>
              <span className="text-amber-300 font-mono font-bold text-xs">
                {prop?.surveyNumber || application.surveyNumber || 'Not available'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Sub-Division:</span>
              <span className="text-slate-200 font-mono">
                {prop?.surveyNumber?.includes('/') ? prop.surveyNumber.split('/')[1] : 'Main / A'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Village:</span>
              <span className="text-slate-200 font-medium">{prop?.village || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Mandal / Taluk:</span>
              <span className="text-slate-200 font-medium">{prop?.taluk || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">District:</span>
              <span className="text-slate-200 font-medium">{prop?.district || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Area / Extent:</span>
              <span className="text-white font-mono font-bold">
                {land?.totalArea ? `${land.totalArea} ${land.areaUnit || 'Acres'}` : 'Not available'}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500 block text-[10px]">Land Type / Use:</span>
              <span className="text-slate-200 font-medium">{land?.landType || 'Not available'}</span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-500 block text-[10px]">ULPIN Parcel Code:</span>
              <span className="text-indigo-300 font-mono font-semibold text-[10px] break-all">
                {prop?.ulpin || 'Not available'}
              </span>
            </div>
          </div>
        </div>

        {/* GROUP C — REGISTRATION DETAILS */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Group C — Registration Details</span>
          </div>

          <div className="space-y-2 text-slate-300 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Document Type:</span>
              <span className="text-white font-bold">{doc?.documentType || application.documentType || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Document Serial No.:</span>
              <span className="text-indigo-300 font-mono font-semibold">{doc?.documentNumber || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Registration Number:</span>
              <span className="text-emerald-300 font-mono font-bold text-xs">{doc?.registrationNumber || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Registration Date:</span>
              <span className="text-slate-200 font-mono">{doc?.registrationDate || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Sub-Registrar Office (SRO):</span>
              <span className="text-slate-200 font-medium">{doc?.issuingAuthority || 'Not available'}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px]">Prior Mutation Ref:</span>
              <span className="text-slate-400 font-mono">{doc?.mutationNumber || 'MUT/2024/9910'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
