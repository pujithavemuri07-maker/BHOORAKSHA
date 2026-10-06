import React from 'react';
import { CheckCircle2, ListChecks } from 'lucide-react';

export const RoleResponsibilitiesSection: React.FC = () => {
  const responsibilities = [
    'Review AI-flagged land-record cases submitted for title diligence',
    'Examine title, deed recitals, and ownership-related discrepancies across parties',
    'Reconcile presented conveyance deeds with state revenue records (Pahani & RoR 1-B)',
    'Examine supporting legal link documents, prior partition deeds, and genealogical trees',
    'Review civil court caveats, pending suits, and interim injunction orders (Sec 52 TPA)',
    'Record formal legal observations, statutory opinions, and reasoning notes',
    'Issue notices requesting document correction or additional evidence from applicants',
    'Place statutory legal hold / block orders on prohibited lands (Sec 22-A Registration Act)',
    'Escalate complex succession or jurisdictional disputes to higher revenue authorities',
    'Record final quasi-judicial determinations under digital signature seal',
    'Maintain an immutable, legally traceable audit history of all scrutiny findings',
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Role & Responsibilities</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official statutory duties and title scrutiny functions mandated for the Legal Officer
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-semibold">
          Statutory Duties
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
        {responsibilities.map((resp, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 hover:border-slate-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-200 leading-relaxed font-medium">{resp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
