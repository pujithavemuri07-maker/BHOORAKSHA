import React, { useState } from 'react';
import { FileEdit, BookOpen, Save, Paperclip, Plus, Trash2, Award, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface OfficerReviewNotesProps {
  applicationId: string;
  initialNotes?: string;
  onSave?: (notes: string, additionalDocs: string[]) => void;
}

export const OfficerReviewNotes: React.FC<OfficerReviewNotesProps> = ({
  applicationId,
  initialNotes = '',
  onSave,
}) => {
  const user = useAuthStore((s) => s.user);

  const [notes, setNotes] = useState(
    initialNotes ||
      'I have perused the presented conveyance deed, RoR 1-B extract, and court caveat registry.\n\nOBSERVATIONS:\n1. Scrutiny reveals co-heir undivided interests requiring registered relinquishment.\n2. Civil court stay records must be formally disposed prior to mutation approval.'
  );

  const [missingDocs, setMissingDocs] = useState<string[]>([
    'Registered Relinquishment Deed from surviving coparcenary co-heirs',
    'Certified Copy of Final Decree / Injunction Vacation Order (OS 412/2024)',
  ]);
  const [newDocText, setNewDocText] = useState('');

  const insertCitation = (citation: string) => {
    setNotes((prev) => `${prev}\n\n[STATUTORY REFERENCE: ${citation}]`);
    toast.success('Inserted statutory citation into notes');
  };

  const handleAddDoc = () => {
    if (newDocText.trim()) {
      setMissingDocs([...missingDocs, newDocText.trim()]);
      setNewDocText('');
      toast.success('Added required document requisition');
    }
  };

  const handleRemoveDoc = (idx: number) => {
    setMissingDocs(missingDocs.filter((_, i) => i !== idx));
  };

  const handleSaveNotes = () => {
    onSave?.(notes, missingDocs);
    toast.success('Officer review notes & document requisitions saved');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <FileEdit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Officer Review Notes</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                OFFICER INPUT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter official observations, clarifications, legal reasoning, and missing document requisitions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveNotes}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-950/60 self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Review Notes</span>
        </button>
      </div>

      {/* Quick Statutory Citations */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Insert Relevant Statutory Citations
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => insertCitation('Transfer of Property Act 1882 — Section 52 (Doctrine of Lis Pendens)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            + Sec 52 TPA (Lis Pendens)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Registration Act 1908 — Section 22-A (Prohibited Land Notification)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            + Sec 22-A Reg Act (Prohibited Property)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Hindu Succession Act 1956 — Section 6 (Coparcenary Undivided Rights)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            + Sec 6 HSA (Coparcenary Share)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Transfer of Property Act 1882 — Section 54 (Sale & Valid Conveyance)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            + Sec 54 TPA (Valid Conveyance)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Indian Stamp Act 1899 — Section 47-A (Deficit Stamp Duty Assessment)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            + Sec 47-A Stamp Act (Duty Assessment)
          </button>
        </div>
      </div>

      {/* Main Review Notes Textarea */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300">
          Case Observations & Reasoning Notes:
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
          placeholder="Enter observations, clarifications, or reasoning for this case..."
        />
      </div>

      {/* Additional Documents Required Field */}
      <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-amber-400" />
            Additional Documents Required from Applicant / Revenue Office
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {missingDocs.length} requisitions listed
          </span>
        </div>

        <div className="space-y-2">
          {missingDocs.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{item}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDoc(idx)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Remove requisition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newDocText}
            onChange={(e) => setNewDocText(e.target.value)}
            placeholder="Specify missing document (e.g. Registered Relinquishment Deed, Encumbrance Form 16, Tahsildar NOC)..."
            className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDoc())}
          />
          <button
            type="button"
            onClick={handleAddDoc}
            className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center gap-1 transition-colors border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Requisition</span>
          </button>
        </div>
      </div>

      {/* Officer DSC Endorsement Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{user?.name || 'Adv. Rajeshwari Sharma'}</span>
              <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Digital DSC Authenticated
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Bar Council ID: <span className="font-mono text-slate-300">{user?.barCouncilId || 'TS/BAR/2008/4192'}</span> • {user?.designation || 'Senior Legal Advisor'}
            </div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Case Ref: {applicationId}
        </div>
      </div>
    </div>
  );
};
