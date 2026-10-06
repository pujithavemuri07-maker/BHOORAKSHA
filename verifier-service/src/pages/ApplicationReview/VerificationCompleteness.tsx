import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck, FileCheck } from 'lucide-react';
import { VerifierApplication } from '../../api/types';
import { cn } from '../../lib/utils';

interface VerificationCompletenessProps {
  application: VerifierApplication;
  onViewDocument?: (docTypeKey: string) => void;
}

export const VerificationCompleteness: React.FC<VerificationCompletenessProps> = ({
  application,
  onViewDocument,
}) => {
  const docsList = application.documentsList || [
    { id: 'd1', name: 'Registered Sale Deed', type: 'Sale Deed', required: true, available: true, docTypeKey: 'sale_deed' },
    { id: 'd2', name: 'RoR / Pattadar Record', type: 'RoR Record', required: true, available: true, docTypeKey: 'ror_record' },
    { id: 'd3', name: 'Identity Proof', type: 'Identity Proof', required: true, available: true, docTypeKey: 'id_proof' },
    { id: 'd4', name: 'Mutation Record', type: 'Mutation Record', required: true, available: false, docTypeKey: 'mutation_record' },
    { id: 'd5', name: 'Previous Title Document', type: 'Title Deed', required: true, available: true, docTypeKey: 'link_doc' },
    { id: 'd6', name: 'Cadastral Map', type: 'Cadastral Map', required: true, available: true, docTypeKey: 'cadastral_map' },
  ];

  const totalRequired = docsList.filter((d) => d.required).length;
  const totalAvailable = docsList.filter((d) => d.required && d.available).length;
  const totalMissing = totalRequired - totalAvailable;

  return (
    <div id="section-documents" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              DOCUMENT COMPLETENESS
            </h3>
            <p className="text-xs text-slate-400">
              Required evidence checklist for land mutation & verification
            </p>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
            Required: <strong className="text-slate-100">{totalRequired}</strong>
          </span>
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
            Available: <strong className="text-emerald-400">{totalAvailable}</strong>
          </span>
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
            Missing: <strong className={totalMissing > 0 ? 'text-amber-400' : 'text-emerald-400'}>{totalMissing}</strong>
          </span>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {docsList.map((doc) => {
          return (
            <div
              key={doc.id}
              className={cn(
                'p-3.5 rounded-2xl border flex items-center justify-between gap-2 transition-all',
                doc.available
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-amber-950/20 border-amber-500/40'
              )}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {doc.available ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-bold text-slate-200 truncate">{doc.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>{doc.available ? 'AVAILABLE ✓' : 'MISSING ⚠'}</span>
                  {doc.pageCount && doc.pageCount > 0 ? <span>• {doc.pageCount} Pages</span> : null}
                </div>
              </div>

              {onViewDocument && (
                doc.available ? (
                  <button
                    type="button"
                    onClick={() => onViewDocument(doc.docTypeKey || doc.id || doc.type || 'sale_deed')}
                    className="px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all shadow-sm"
                  >
                    VIEW DOCUMENT
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onViewDocument(doc.docTypeKey || doc.id || doc.type || 'mutation_record')}
                    className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all"
                  >
                    VIEW MISSING
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
