import React from 'react';
import { Link } from 'react-router-dom';
import { AuditRecordItem } from './AuditTable';
import {
  X,
  History,
  ShieldCheck,
  FileText,
  User,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  Printer,
  Scale,
  Award,
  Database,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface AuditEventDetailDrawerProps {
  record: AuditRecordItem | null;
  onClose: () => void;
}

export const AuditEventDetailDrawer: React.FC<AuditEventDetailDrawerProps> = ({
  record,
  onClose,
}) => {
  if (!record) return null;

  const handleExport = () => {
    toast.success(`Exporting Audit Record ${record.auditId} as PDF extract...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCleared = record.action === 'CLEARED';
  const isBlocked = record.action === 'BLOCKED';
  const isFlagged = record.action === 'FLAGGED';
  const isEscalated = record.action === 'ESCALATED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-700 h-full overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Audit Event Details
                </h3>
                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                  {record.auditId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Case ID: <span className="font-mono text-white font-semibold">{record.applicationId}</span> • Recorded on {formatDateTime(record.timestamp)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Audit Extract"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Top Quick Actions Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Case Target:</span>
              <span className="font-mono text-xs font-bold text-indigo-300">{record.applicationId} ({record.citizenName})</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/legal/review/${record.applicationId}`}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>View Case File</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleExport}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* 7. AUDIT EVENT SUMMARY & 8. CASE CONTEXT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Audit Event Card */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audit Event Record</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Reference:</span>
                  <span className="font-mono font-bold text-white">{record.auditId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recorded Action:</span>
                  <span className="font-bold text-white uppercase">{record.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className="font-semibold text-rose-300 font-mono">{record.risk} Risk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Performed By:</span>
                  <span className="text-slate-200 font-medium">{record.officerName || 'Adv. Rajeshwari Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Officer Designation:</span>
                  <span className="text-slate-400">Senior Legal Advisor</span>
                </div>
              </div>
            </div>

            {/* Case Context Card */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Case & Land Context</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Party / Citizen:</span>
                  <span className="font-bold text-white">{record.citizenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Survey Number:</span>
                  <span className="font-mono text-slate-200 font-semibold">Sy. {record.surveyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Village / Location:</span>
                  <span className="text-slate-300">{record.location || 'Serilingampally, Ranga Reddy'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ULPIN Parcel Code:</span>
                  <span className="font-mono text-indigo-300 font-semibold text-[10px]">{record.ulpin || 'ULPIN-36-RR-SER-123-01'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instrument Type:</span>
                  <span className="text-slate-300">{record.caseType || 'Partition Deed (Bhaaga Parishkaram)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 9. ACTION DETAILS & TRANSITION */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 pb-1.5 border-b border-slate-800 flex items-center justify-between">
              <span>Action Details & State Transition</span>
              <span className="text-[10px] font-mono text-slate-400">Workflow Transition</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-900/90 rounded-xl border border-slate-800">
              <div className="p-2 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Previous Status</span>
                <span className="text-xs font-bold text-slate-300 block">{record.previousStatus || 'Pending Legal Review'}</span>
              </div>
              <div className="p-2 space-y-0.5 border-x border-slate-800">
                <span className="text-[10px] text-indigo-400 uppercase font-bold block">Action Executed</span>
                <span className="text-xs font-black text-indigo-300 uppercase block">{record.action}</span>
              </div>
              <div className="p-2 space-y-0.5">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Resulting Status</span>
                <span className="text-xs font-bold text-emerald-300 block">{record.newStatus || (isCleared ? 'Cleared for Mutation' : isBlocked ? 'Blocked by Legal Order' : 'Referred to Tehsildar')}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Decision Reason & Legal Opinion:</div>
              <p className="p-3 rounded-lg bg-slate-900 text-slate-200 leading-relaxed font-mono text-[11px] border border-slate-800">
                {record.opinion}
              </p>
            </div>
          </div>

          {/* 10. SUPPORTING EVIDENCE */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 pb-1.5 border-b border-slate-800 flex items-center justify-between">
              <span>Supporting Evidence & Linked Instruments</span>
              <span className="text-[10px] text-slate-500">Verified at time of action</span>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Presented Title Deed Instrument', type: 'Certified Extract', ref: 'BK-1/2104/2025', status: 'Ingested & Verified' },
                { name: 'RoR 1-B Mutation Ledger Extract', type: 'Revenue Register', ref: 'ROR-1B/992/2024', status: 'Synchronized' },
                { name: 'Form-15 Encumbrance Search Certificate', type: 'Statutory Search', ref: 'EC/2026/99014', status: 'Search Complete' },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-white font-semibold">{doc.name}</span>
                      <span className="text-slate-500 ml-1 font-mono">({doc.ref})</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 11. DIGITAL SIGNATURE & 12. AUDIT INTEGRITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Digital Signature */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Digital Signature</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SIGNED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Signed By:</span>
                  <span className="text-white font-medium">{record.officerName || 'Adv. Rajeshwari Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Signed At:</span>
                  <span className="font-mono text-slate-300">{formatDateTime(record.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">eSign Ref:</span>
                  <span className="font-mono text-[10px] text-slate-400">ESIGN-3.0-DEMO-99182</span>
                </div>
                <div className="pt-1 text-[10px] text-slate-500 italic">
                  Demo eSign Status (Simulated in local workflow)
                </div>
              </div>
            </div>

            {/* Audit Integrity */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audit Integrity</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Reference:</span>
                  <span className="font-mono font-bold text-white">{record.auditId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Record Created:</span>
                  <span className="font-mono text-slate-300">{formatDateTime(record.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Integrity Status:</span>
                  <span className="text-emerald-400 font-semibold font-mono">Demo / Simulated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ledger Ref:</span>
                  <span className="font-mono text-[10px] text-slate-400">BK-LEDGER-2026-VOL-1</span>
                </div>
                <div className="pt-1 text-[10px] text-slate-500 italic">
                  Audit record logged in Bhooraksha legal audit history
                </div>
              </div>
            </div>
          </div>

          {/* 13. CASE ACTIVITY TIMELINE & 14. CHANGE HISTORY */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 pb-1.5 border-b border-slate-800 flex items-center justify-between">
              <span>Case Activity Timeline & Change History</span>
              <span className="text-[10px] text-slate-500">Sequential Milestones</span>
            </div>

            <div className="space-y-3 relative pl-5 before:absolute before:left-2 before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-800">
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500" />
                <div className="text-[11px]">
                  <span className="text-slate-400 font-mono">07 Sep 2026 — 09:10 AM</span>
                  <div className="font-bold text-white">Case Submitted for Legal Scrutiny</div>
                  <div className="text-slate-500 text-[10px]">Presented conveyance uploaded by citizen applicant</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500" />
                <div className="text-[11px]">
                  <span className="text-slate-400 font-mono">07 Sep 2026 — 09:18 AM</span>
                  <div className="font-bold text-white">AI Legal Analysis Completed</div>
                  <div className="text-slate-500 text-[10px]">AI screening flagged caveat and coparcenary share discrepancy</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-indigo-400" />
                <div className="text-[11px]">
                  <span className="text-slate-400 font-mono">{formatDateTime(record.timestamp)}</span>
                  <div className="font-bold text-indigo-300">Officer Decision Executed: {record.action}</div>
                  <div className="text-slate-400 text-[10px]">{record.opinion}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-4 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-mono">
            Audit Ledger Record • {record.auditId}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            Close Detail Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
