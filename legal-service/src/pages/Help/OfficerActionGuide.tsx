import React from 'react';
import {
  FileQuestion,
  ShieldAlert,
  MapPin,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

export const OfficerActionGuide: React.FC = () => {
  const guides = [
    {
      condition: 'Missing Supporting / Link Documents',
      action: 'Request Documents',
      actionType: 'FLAG / REQUISITION',
      desc: 'Issue a 15-day rectification notice to applicant demanding certified link deeds, succession certificates, or death extracts.',
      icon: <FileQuestion className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      condition: 'Active Civil Court Injunction / Court Stay',
      action: 'Place Legal Hold',
      actionType: 'STATUTORY BLOCK',
      desc: 'Enforce statutory block under Section 52 Transfer of Property Act (Lis Pendens) until certified vacation decree is produced.',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      condition: 'Cadastral Survey / Area Extent Mismatch',
      action: 'Send for Verification',
      actionType: 'FIELD INSPECTION',
      desc: 'Refer parcel extent variance to Mandal Surveyor & Girdawar for re-measurement and FMB sketch reconciliation.',
      icon: <MapPin className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      condition: 'Conflicting Owner / Name Inconsistency',
      action: 'Flag for Review',
      actionType: 'CLARIFICATION',
      desc: 'Demand official Gazetted name variation affidavit or rectifying endorsement from the executing Sub-Registrar.',
      icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
      color: 'border-orange-500/30 bg-orange-950/20 text-orange-300',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
    {
      condition: 'High-Risk Complex Succession / Multi-Party Dispute',
      action: 'Escalate to Authority',
      actionType: 'REVENUE ESCALATION',
      desc: 'Refer the case with structured legal opinion to the Tehsildar or Revenue Divisional Officer (RDO) for statutory hearing.',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Officer Action Guide</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Decision rulebook: "If this scenario occurs → Officer should record this statutory action"
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
          Decision Rules
        </span>
      </div>

      {/* Structured Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {guides.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${item.color}`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  {item.icon}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${item.badgeColor}`}>
                  {item.actionType}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  If this happens:
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">
                  {item.condition}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider flex items-center gap-1">
                  <span>Officer should do this</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
                <div className="text-xs font-black text-white mt-0.5">
                  {item.action}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
