import React from 'react';
import { OfficerInfo } from '../../api/types';
import { formatDateTime } from '../../utils/formatters';
import {
  FileText,
  UserCheck,
  Scale,
  Map,
  MessageSquare,
} from 'lucide-react';

interface OfficerRemarksProps {
  officers?: {
    deo: OfficerInfo;
    verifier: OfficerInfo;
    legal: OfficerInfo;
    gis: OfficerInfo;
  };
}

export const OfficerRemarks: React.FC<OfficerRemarksProps> = ({
  officers,
}) => {
  if (!officers) return null;
  const { deo, verifier, legal, gis } = officers;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <MessageSquare className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white tracking-wide">
          Official Review Transcripts &amp; Statutory Endorsements
        </h3>
      </div>

      <div className="space-y-4">
        {/* DEO Remarks */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-slate-200">
                Data Entry Operator (DEO): {deo?.name}
              </span>
              <span className="text-slate-400 font-mono">({deo?.designation})</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {deo?.timestamp ? formatDateTime(deo.timestamp) : 'N/A'}
            </span>
          </div>
          <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
            {deo?.remarks}
          </p>
        </div>

        {/* Verifier Remarks */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">
                Revenue Verifier (Girdawar): {verifier?.name}
              </span>
              <span className="text-slate-400 font-mono">({verifier?.designation})</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {verifier?.timestamp ? formatDateTime(verifier.timestamp) : 'N/A'}
            </span>
          </div>
          <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
            {verifier?.remarks}
          </p>
        </div>

        {/* Legal Opinion */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-slate-200">
                Legal Officer Opinion: {legal?.name}
              </span>
              <span className="text-slate-400 font-mono">({legal?.designation})</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {legal?.timestamp ? formatDateTime(legal.timestamp) : 'N/A'}
            </span>
          </div>
          <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
            {legal?.opinion || legal?.remarks}
          </p>
        </div>

        {/* GIS Specialist Remarks */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">
                GIS Specialist Findings: {gis?.name}
              </span>
              <span className="text-slate-400 font-mono">({gis?.designation})</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {gis?.timestamp ? formatDateTime(gis.timestamp) : 'N/A'}
            </span>
          </div>
          <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
            {gis?.remarks}
          </p>
        </div>
      </div>
    </div>
  );
};
