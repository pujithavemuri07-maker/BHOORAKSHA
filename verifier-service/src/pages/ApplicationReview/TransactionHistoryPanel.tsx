import React from 'react';
import { TransactionRecordItem } from '../../api/types';
import { History, FileText, ArrowRight } from 'lucide-react';

interface TransactionHistoryPanelProps {
  transactions?: TransactionRecordItem[];
}

export const TransactionHistoryPanel: React.FC<TransactionHistoryPanelProps> = ({ transactions }) => {
  const historyList = transactions || [
    {
      id: 'tx-1',
      year: '2019',
      transactionType: 'SALE',
      date: '2019-04-12',
      fromOwner: 'K. Someshwar Rao (Original Pattadar)',
      toOwner: 'Suresh V. Rao',
      documentNumber: 'SD/2019/112',
      registrationNumber: 'BK-1/1042/2019',
      mutationNumber: 'MUT-2019-4410',
      sourceRegister: 'SRO Registration Register',
      remarks: 'Registered sale deed executed for 2.50 Acres at SRO Serilingampally.',
    },
    {
      id: 'tx-2',
      year: '2021',
      transactionType: 'MUTATION',
      date: '2021-08-19',
      fromOwner: 'Suresh V. Rao',
      toOwner: 'Suresh V. Rao',
      documentNumber: 'MUT-2021-9901',
      registrationNumber: 'N/A',
      mutationNumber: 'MUT-2021-9901',
      sourceRegister: 'Revenue Mutation Register',
      remarks: 'Khata title updated in Pahani/Dharani register.',
    },
    {
      id: 'tx-3',
      year: '2025',
      transactionType: 'SALE',
      date: '2025-12-20',
      fromOwner: 'Suresh V. Rao',
      toOwner: 'Ramesh Kumar Patel',
      documentNumber: 'SD/2025/045',
      registrationNumber: 'BK-1/4491/2025',
      mutationNumber: 'MUT-2026-8819',
      sourceRegister: 'Current Application Instrument',
      remarks: 'Subject instrument under verification desk scrutiny.',
    },
  ];

  return (
    <div id="section-history" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Chronological Transaction & Title Lineage History
            </h3>
            <p className="text-xs text-slate-400">
              Unbroken historical chain of custody & revenue mutation records
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
          3 Historical Linkages Verified
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {historyList.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Dot */}
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-sky-400 flex items-center justify-center group-hover:scale-125 transition-transform" />

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-sky-400">{item.year}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {item.transactionType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Date: {item.date}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800">
                  {item.sourceRegister}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-200 pt-1">
                <span className="text-slate-400">From:</span>
                <span className="text-white font-semibold">{item.fromOwner}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">To:</span>
                <span className="text-emerald-400 font-semibold">{item.toOwner}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 text-slate-400 font-mono border-t border-slate-900">
                <div>Doc No: <span className="text-slate-200 font-semibold">{item.documentNumber}</span></div>
                <div>Reg No: <span className="text-slate-200 font-semibold">{item.registrationNumber}</span></div>
                <div>Mutation No: <span className="text-slate-200 font-semibold">{item.mutationNumber || 'N/A'}</span></div>
              </div>

              {item.remarks && (
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900/60">
                  "{item.remarks}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
