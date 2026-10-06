import React from 'react';
import { User as UserType } from '../../api/types';
import { MapPin, Landmark, Layers, FileCheck, CheckCircle2 } from 'lucide-react';

interface JurisdictionSectionProps {
  user: UserType | null;
}

export const JurisdictionSection: React.FC<JurisdictionSectionProps> = ({ user }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Official Jurisdiction</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Assigned territorial boundary, revenue divisions, registration sub-districts, and subject matter
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-semibold">
          Territorial Competence
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">State & District:</span>
          <span className="font-semibold text-white">Telangana • Ranga Reddy District</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Revenue Division:</span>
          <span className="font-semibold text-slate-200">Rajendranagar & Chevella Division</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandal / Taluk Jurisdiction:</span>
          <span className="font-semibold text-slate-200">Serilingampally, Rajendranagar & Gandipet</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 sm:col-span-2 lg:col-span-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Sub-Registrar Offices (SROs):</span>
          <span className="font-medium text-indigo-300">
            SRO Serilingampally (0411), SRO Patancheru, SRO Shamshabad, SRO Gandipet
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 sm:col-span-2 lg:col-span-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Subject-Matter Jurisdiction:</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Land title diligence, pre-mutation conveyance review, Section 22-A prohibited land classification, civil caveat & Lis Pendens screening, coparcenary share verification, and statutory advice under Revenue Standing Orders.
          </p>
        </div>
      </div>
    </div>
  );
};
