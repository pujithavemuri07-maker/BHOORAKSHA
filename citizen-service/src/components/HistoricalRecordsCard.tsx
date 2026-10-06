import React from 'react';
import { BookOpen, CheckCircle2, Clock, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { useTranslation } from '../i18n';

interface HistoricalRecordsCardProps {
  ulpin?: string;
}

export const HistoricalRecordsCard: React.FC<HistoricalRecordsCardProps> = ({
  ulpin = 'KA-1234-5678-9012',
}) => {
  const { t } = useTranslation();

  const ownershipChain = [
    {
      year: '1975',
      owner: 'Shankar (S/o Ramu)',
      source: 'Yelahanka Archival Register 1975 (Vol 4)',
      confidence: 72,
      status: 'Historical Record',
    },
    {
      year: '1990',
      owner: 'Suresh Reddy',
      source: 'Bengaluru North Sub-Registrar Volume 1990',
      confidence: 88,
      status: 'Predecessor Title',
    },
    {
      year: '2025',
      owner: 'Ramesh Kumar Patel (Current Registered Owner)',
      source: 'Modern Registered Sale Deed SD-2025-045',
      confidence: 98,
      status: 'Current Title',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('oldDocuments.historicalRecords', 'Historical Records (Digitized from Old Registers)')}
            </h3>
            <p className="text-xs text-slate-400">
              Complete historical succession provenance for modern ULPIN:{' '}
              <strong className="font-mono text-emerald-400">{ulpin}</strong>
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Ownership chain complete</span>
        </span>
      </div>

      {/* Chain Progression */}
      <div className="space-y-3">
        {ownershipChain.map((entry, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-xs flex-shrink-0">
              {entry.year}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">
                  {entry.owner}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {entry.confidence}% Confidence
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-500" />
                  Source: {entry.source}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {entry.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
