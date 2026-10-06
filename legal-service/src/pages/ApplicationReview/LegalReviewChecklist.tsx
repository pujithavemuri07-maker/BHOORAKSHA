import React, { useState } from 'react';
import { CheckSquare, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface LegalReviewChecklistProps {
  onProgressChange?: (completed: number, total: number) => void;
}

export const LegalReviewChecklist: React.FC<LegalReviewChecklistProps> = ({
  onProgressChange,
}) => {
  const initialChecks = [
    { id: 'c1', label: 'Claimant / party details verified', checked: true },
    { id: 'c2', label: 'Survey number verified', checked: true },
    { id: 'c3', label: 'Village and location verified', checked: true },
    { id: 'c4', label: 'Area / extent verified', checked: true },
    { id: 'c5', label: 'Registration details verified', checked: true },
    { id: 'c6', label: 'Revenue record checked', checked: true },
    { id: 'c7', label: 'Ownership information checked', checked: true },
    { id: 'c8', label: 'Court/dispute information checked', checked: false },
    { id: 'c9', label: 'Supporting documents reviewed', checked: false },
    { id: 'c10', label: 'AI findings manually verified', checked: false },
  ];

  const [checklist, setChecklist] = useState(initialChecks);

  const completedCount = checklist.filter((item) => item.checked).length;
  const totalCount = checklist.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const toggleCheck = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    const newCount = updated.filter((item) => item.checked).length;
    onProgressChange?.(newCount, totalCount);
    if (!checklist.find((i) => i.id === id)?.checked) {
      toast.success('Check completed');
    }
  };

  const handleReset = () => {
    setChecklist(initialChecks);
    toast.success('Checklist reset to initial state');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            Legal Review Checklist
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard statutory diligence checklist for land-record scrutiny
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {completedCount} of {totalCount} checks completed
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400 font-medium">Verification Progress</span>
          <span className="font-mono font-bold text-white">{percentage}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full transition-all duration-300 ${
              percentage === 100
                ? 'bg-emerald-500'
                : percentage >= 70
                ? 'bg-indigo-500'
                : 'bg-amber-500'
            }`}
          />
        </div>
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {checklist.map((item) => (
          <label
            key={item.id}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              item.checked
                ? 'bg-indigo-950/20 border-indigo-500/30 text-slate-100 hover:bg-indigo-950/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(item.id)}
              className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
            />
            <span className={`text-xs font-medium ${item.checked ? 'text-white' : 'text-slate-300'}`}>
              {item.label}
            </span>
            {item.checked && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
};
