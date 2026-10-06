import React from 'react';
import { CheckCircle2, Clock, Scale, MapPin, UserCheck, Award, ArrowRight, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VerificationWorkflowProps {
  status: string;
}

export const VerificationWorkflow: React.FC<VerificationWorkflowProps> = ({ status }) => {
  const isRoutedToVerifier = status === 'ROUTED_TO_VERIFIER';
  const isLegal = status === 'LEGAL_REVIEW';
  const isGis = status === 'GIS_REVIEW';
  const isCorrection = status === 'CORRECTION_REQUIRED';
  const isApproved = status === 'APPROVED';

  const stages = [
    {
      role: 'DEO / Patwari',
      action: isRoutedToVerifier || isApproved ? 'Completed' : isCorrection ? 'Correction Flagged' : 'Current Review',
      state: isRoutedToVerifier || isApproved ? 'green' : isCorrection ? 'red' : 'yellow',
      icon: UserCheck,
    },
    {
      role: 'Revenue Verifier',
      action: isRoutedToVerifier ? 'In Queue (Current)' : isApproved ? 'Completed' : 'Pending DEO Forward',
      state: isRoutedToVerifier ? 'yellow' : isApproved ? 'green' : 'grey',
      icon: UserCheck,
    },
    {
      role: 'Legal Review',
      action: isLegal ? 'Active Scrutiny' : 'On Advisory Standby',
      state: isLegal ? 'yellow' : 'grey',
      icon: Scale,
    },
    {
      role: 'GIS Review',
      action: isGis ? 'Active Spatial Audit' : 'On Advisory Standby',
      state: isGis ? 'yellow' : 'grey',
      icon: MapPin,
    },
    {
      role: 'Revenue Admin (Tahsildar)',
      action: isApproved ? 'Sanctioned' : 'Pending Final Sign-off',
      state: isApproved ? 'green' : 'grey',
      icon: Award,
    },
    {
      role: 'Verified Digital RoR',
      action: isApproved ? 'Mutated & Dispatched' : 'Pending Issuance',
      state: isApproved ? 'green' : 'grey',
      icon: CheckCircle2,
    },
  ];

  const getStateStyle = (st: string) => {
    switch (st) {
      case 'green':
        return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
      case 'yellow':
        return 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-md shadow-amber-500/10';
      case 'red':
        return 'bg-rose-500/10 border-rose-500/40 text-rose-400';
      default:
        return 'bg-slate-950/50 border-slate-800 text-slate-500';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Verification Workflow & Hierarchy Progression
            </h3>
            <p className="text-xs text-slate-400">
              Statutory multi-tier revenue officer governance pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
          <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" /> Current / In-Review</span>
          <span className="flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-600" /> Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-2xl border text-xs space-y-1.5 transition-all',
                getStateStyle(st.state)
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold opacity-80">Tier 0{idx + 1}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="font-bold text-white leading-tight">
                {st.role}
              </p>
              <p className="text-[10px] opacity-90 leading-tight">
                {st.action}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
