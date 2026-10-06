import React from 'react';
import { LegalApplication } from '../../api/types';
import { History, ShieldCheck, CheckCircle2, Clock, User, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface AuditTrailProps {
  application: LegalApplication;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ application }) => {
  const events = [
    {
      action: 'Case Submitted for Legal Scrutiny',
      actor: application.citizenName,
      role: 'Citizen / Applicant',
      date: '07 Sep 2026',
      time: '09:20 AM',
      status: 'Completed',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      detail: `Presented Deed (${application.documentType}) uploaded and submitted for mutation sanction.`,
    },
    {
      action: 'Document Processing & Ingestion Completed',
      actor: 'Bhooraksha OCR Engine',
      role: 'Automated Ingestion Subsystem',
      date: '07 Sep 2026',
      time: '09:22 AM',
      status: 'Completed',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      detail: 'Optical character recognition, stamp paper verification, and schedule extraction finalized.',
    },
    {
      action: 'AI Legal Due Diligence Analysis Completed',
      actor: 'Bhooraksha Title AI',
      role: 'Legal Risk Screener',
      date: '07 Sep 2026',
      time: '09:24 AM',
      status: 'Flags Detected',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      detail: `${application.legalFlagsCount} legal findings identified (Civil court caveat & coparcenary share discrepancy).`,
    },
    {
      action: 'Case Assigned to Legal Officer',
      actor: 'Revenue Allocation System',
      role: 'Workflow Manager',
      date: '07 Sep 2026',
      time: '09:30 AM',
      status: 'Assigned',
      statusColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      detail: 'Assigned to Adv. Rajeshwari Sharma (Senior Legal Advisor, Revenue Legal Wing).',
    },
    {
      action: 'Legal Officer Opened Case File',
      actor: application.decisionBy || 'Adv. Rajeshwari Sharma',
      role: 'Senior Legal Advisor',
      date: '07 Sep 2026',
      time: '10:05 AM',
      status: 'Active Review',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      detail: 'Initiated deed perusal, RoR 1-B reconciliation, and statutory verification checklist.',
    },
    ...(application.decisionDate
      ? [
          {
            action: `Legal Decision Recorded: ${application.status.toUpperCase()}`,
            actor: application.decisionBy || 'Adv. Rajeshwari Sharma',
            role: 'Legal Officer',
            date: formatDate(application.decisionDate),
            time: '11:45 AM',
            status: 'Recorded & Sealed',
            statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            detail: application.legalOpinion || 'Statutory order recorded with Class-3 DSC signature.',
          },
        ]
      : []),
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Case Activity & Audit Trail
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically sealed chronological audit log of all case actions, actors, and determinations
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Immutable Audit Ledger
        </span>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((ev, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:border-indigo-400 transition-colors" />

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {ev.action}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${ev.statusColor}`}>
                    {ev.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {ev.date} at {ev.time}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-200">{ev.actor}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 text-[11px]">{ev.role}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-900">
                {ev.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
