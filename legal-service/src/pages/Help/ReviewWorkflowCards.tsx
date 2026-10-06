import React from 'react';
import { CheckSquare, ArrowRight, Layers, FileCheck, ShieldAlert, Users, Landmark } from 'lucide-react';

export const ReviewWorkflowCards: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Chain of Title Verification',
      desc: 'Verify unbroken 30-year lineage from root title to vendor via registered link deeds.',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/30 text-indigo-300',
    },
    {
      step: '02',
      title: 'Encumbrance Certificate Check',
      desc: 'Inspect SRO Book-1 Form 15/16 records to verify zero active mortgage, lien, or court attachment.',
      icon: <FileCheck className="w-4 h-4 text-blue-400" />,
      color: 'border-blue-500/30 text-blue-300',
    },
    {
      step: '03',
      title: 'Prohibited Land Check',
      desc: 'Cross-verify parcel against Section 22-A prohibited database (Govt, Waqf, Inam, Tank-bed buffer).',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/30 text-rose-300',
    },
    {
      step: '04',
      title: 'Legal Heir Verification',
      desc: 'Verify equal coparcenary share under Hindu Succession Act and registered co-heir relinquishment.',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/30 text-amber-300',
    },
    {
      step: '05',
      title: 'Stamp Duty Validation',
      desc: 'Audit market value guidelines under Sec 47-A to identify deficit stamp duty or undervaluation.',
      icon: <Landmark className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/30 text-emerald-300',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Standard Legal Review Workflow</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              5-step statutory diligence scrutiny workflow to be followed for every land record case
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-semibold">
          Sequential SOP
        </span>
      </div>

      {/* Horizontal Workflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
        {steps.map((item, idx) => (
          <div
            key={item.step}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-slate-500 group-hover:text-indigo-400 transition-colors">
                Step {item.step}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                {item.icon}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <span>Mandatory Check</span>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-600 ml-auto hidden lg:block" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
