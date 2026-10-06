import React, { useState } from 'react';
import { History, Calendar, FileText, UserCheck, ShieldCheck, ArrowRight, ExternalLink, X, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TransactionNode {
  year: string;
  date: string;
  type: string;
  previousOwner: string;
  newOwner: string;
  docRef: string;
  mutationRef: string;
  status: 'COMPLETED' | 'DISCHARGED' | 'ACTIVE_SCRUTINY';
  sroAuthority: string;
  areaExtent: string;
  notes: string;
}

const HISTORICAL_TRANSACTIONS: TransactionNode[] = [
  {
    year: '1998',
    date: '14 May 1998',
    type: 'Original Government Allotment',
    previousOwner: 'State Revenue Department (Ceiling Surplus)',
    newOwner: 'Suresh V. Rao',
    docRef: 'GO-MS-1998-41',
    mutationRef: 'MUT-1998-0045',
    status: 'COMPLETED',
    sroAuthority: 'Revenue Directorate, Hyderabad Urban',
    areaExtent: '2.50 Acres',
    notes: 'Granted under Agricultural Pattadar Upliftment Scheme with hereditary ownership rights.',
  },
  {
    year: '2008',
    date: '03 Aug 2008',
    type: 'Inheritance & Succession Transfer',
    previousOwner: 'Suresh V. Rao',
    newOwner: 'Late Shankar Patel',
    docRef: 'SUC-2008-0112',
    mutationRef: 'MUT-2008-0891',
    status: 'COMPLETED',
    sroAuthority: 'Tahsildar Serilingampally (Sub-division P-1)',
    areaExtent: '2.50 Acres',
    notes: 'Succession certificate sanctioned by Revenue Divisional Officer (RDO) following testamentary declaration.',
  },
  {
    year: '2017',
    date: '19 Nov 2017',
    type: 'Sanctioned Mutation Order',
    previousOwner: 'Late Shankar Patel (Estate)',
    newOwner: 'Ramesh Kumaran (Sole Legal Heir)',
    docRef: 'ORD-2017-5501',
    mutationRef: 'MUT-2017-0234',
    status: 'COMPLETED',
    sroAuthority: 'Tahsildar Revenue Office',
    areaExtent: '2.50 Acres',
    notes: 'Title mutated into RoR 1B Khata #KH-88214 after publication of 15-day public objection notice.',
  },
  {
    year: '2023',
    date: '12 Feb 2023',
    type: 'Agricultural Mortgage Charge (Discharged)',
    previousOwner: 'Ramesh Kumaran',
    newOwner: 'State Bank of India (Charge Holder)',
    docRef: 'MORT-2023-889',
    mutationRef: 'MOD-2023-014',
    status: 'DISCHARGED',
    sroAuthority: 'SRO Serilingampally',
    areaExtent: '2.50 Acres',
    notes: 'Crop loan mortgage created and subsequently discharged on 14-Nov-2025 with formal SRO No-Objection Certificate.',
  },
  {
    year: '2026',
    date: '20 Dec 2025 (Reg: 15 Jan 2026)',
    type: 'Current Registered Sale Deed',
    previousOwner: 'Ramesh Kumaran (Vendor)',
    newOwner: 'Ramesh Kumar Patel (Purchaser/Claimant)',
    docRef: 'SD-2025-045 / REG-2025-789',
    mutationRef: 'MUT-2026-0091 (Current Application)',
    status: 'ACTIVE_SCRUTINY',
    sroAuthority: 'Sub-Registrar Office, Serilingampally',
    areaExtent: '2.50 Acres',
    notes: 'Under current DEO/Patwari scrutiny for statutory mutation and digital title passbook issuance.',
  },
];

export const PreviousTransactionHistory: React.FC = () => {
  const [selectedTx, setSelectedTx] = useState<TransactionNode | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Previous Transaction History (30-Year Title Chain)
            </h3>
            <p className="text-xs text-slate-400">
              Historical transactions are used for conflict, lineage, and duplicate detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400">
            5 Historical Deeds Verified
          </span>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {HISTORICAL_TRANSACTIONS.map((tx, idx) => {
          const isCurrent = tx.status === 'ACTIVE_SCRUTINY';
          const isDischarged = tx.status === 'DISCHARGED';

          return (
            <div key={idx} className="relative group">
              {/* Timeline Dot */}
              <div
                className={cn(
                  'absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold font-mono transition-transform group-hover:scale-110',
                  isCurrent
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                    : isDischarged
                    ? 'bg-slate-800 border-slate-600 text-slate-300'
                    : 'bg-emerald-950 border-emerald-500 text-emerald-400'
                )}
              >
                {tx.year.slice(-2)}
              </div>

              {/* Transaction Card */}
              <div
                onClick={() => setSelectedTx(tx)}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer space-y-2',
                  isCurrent
                    ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs text-white">
                      {tx.type}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border',
                        isCurrent
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : isDischarged
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {tx.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500 text-[11px]">Grantor:</span>
                    <strong className="text-slate-200">{tx.previousOwner}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500 text-[11px]">Grantee:</span>
                    <strong className="text-amber-400">{tx.newOwner}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                  <div className="flex items-center gap-3 text-slate-400 font-mono">
                    <span>Doc: <strong className="text-slate-300">{tx.docRef}</strong></span>
                    <span>•</span>
                    <span>Mutation: <strong className="text-slate-300">{tx.mutationRef}</strong></span>
                  </div>
                  <span className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 text-[11px]">
                    Inspect Full Details <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>
          <strong>Title Continuity Verification:</strong> All previous owners in the 30-year succession chain are reconciled against SRO registration books and mutation sanctions without any missing links or encumbrance gaps.
        </span>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Historical Transaction Dossier</h3>
                <p className="text-xs text-amber-400 font-mono">{selectedTx.year} • {selectedTx.type}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Execution Date</span>
                  <span className="text-slate-200 font-mono font-medium">{selectedTx.date}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Extent / Area</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedTx.areaExtent}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Doc Reference</span>
                  <span className="text-slate-200 font-mono">{selectedTx.docRef}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Mutation Order</span>
                  <span className="text-slate-200 font-mono">{selectedTx.mutationRef}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Ownership Lineage</span>
                <p className="text-slate-300">
                  Transferred From: <strong className="text-white">{selectedTx.previousOwner}</strong>
                </p>
                <p className="text-slate-300">
                  Transferred To: <strong className="text-amber-400">{selectedTx.newOwner}</strong>
                </p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Sanctioning Authority: {selectedTx.sroAuthority}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Officer Audit Notes</span>
                <p className="text-slate-300 text-[11px] leading-relaxed italic">{selectedTx.notes}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
