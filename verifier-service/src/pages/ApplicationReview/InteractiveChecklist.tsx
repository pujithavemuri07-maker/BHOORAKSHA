import React from 'react';
import { VerificationChecklistState } from '../../api/types';
import { CheckSquare, Square, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface InteractiveChecklistProps {
  checklist?: VerificationChecklistState;
  onToggleItem: (itemKey: keyof VerificationChecklistState) => void;
}

export const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({
  checklist,
  onToggleItem,
}) => {
  const currentState: VerificationChecklistState = checklist || {
    documentsReviewed: false,
    identityProofChecked: false,
    ownerInfoChecked: false,
    surveyNumberChecked: false,
    areaChecked: false,
    registrationDetailsChecked: false,
    mutationDetailsChecked: false,
    transactionHistoryChecked: false,
    govtRecordCrossChecked: false,
    gisResultReviewed: false,
    conflictsReviewed: false,
    verifierRemarksEntered: false,
  };

  const checklistItems: Array<{ key: keyof VerificationChecklistState; label: string }> = [
    { key: 'documentsReviewed', label: '1. Submitted documents & deed pages reviewed' },
    { key: 'identityProofChecked', label: '2. Applicant identity & Aadhaar/Voter proof checked' },
    { key: 'ownerInfoChecked', label: '3. Owner/Pattadar name & father name verified' },
    { key: 'surveyNumberChecked', label: '4. Survey number & sub-division (Hissa) verified' },
    { key: 'areaChecked', label: '5. Land extent area & schedule boundaries checked' },
    { key: 'registrationDetailsChecked', label: '6. SRO registration number & date cross-checked' },
    { key: 'mutationDetailsChecked', label: '7. Mutation reference & Dharani khata verified' },
    { key: 'transactionHistoryChecked', label: '8. Previous title lineage & chain of custody checked' },
    { key: 'govtRecordCrossChecked', label: '9. Government land record cross-checked' },
    { key: 'gisResultReviewed', label: '10. GIS spatial boundary & area tolerance reviewed' },
    { key: 'conflictsReviewed', label: '11. AI discrepancy warnings & conflicts inspected' },
    { key: 'verifierRemarksEntered', label: '12. Verifier inspection findings & remarks recorded' },
  ];

  const completedCount = checklistItems.filter((item) => currentState[item.key]).length;
  const totalItems = checklistItems.length;
  const isAllComplete = completedCount === totalItems;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  return (
    <div id="section-checklist" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              VERIFICATION CHECKLIST (MANDATORY DECISION GUARD)
            </h3>
            <p className="text-xs text-slate-400">
              Interactive 12-point statutory checklist required before approval or forwarding
            </p>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-400 block">
              {completedCount} / {totalItems} Completed ({progressPercent}%)
            </span>
            <span className="text-[10px] text-slate-500">Auto-persisted to store</span>
          </div>
          <div className="w-24 bg-slate-950 h-2.5 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {!isAllComplete && (
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Please complete all 12 mandatory checklist items before executing final approval. (Return to DEO remains accessible anytime).
          </span>
        </div>
      )}

      {/* 12 Checklist Toggle Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
        {checklistItems.map((item) => {
          const isChecked = Boolean(currentState[item.key]);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onToggleItem(item.key)}
              className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                isChecked
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {isChecked ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              )}
              <span className={`text-xs font-medium leading-tight ${isChecked ? 'line-through opacity-90' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
