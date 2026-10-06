import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Paperclip,
  Plus,
  Trash2,
  BookOpen,
  Award,
  Save,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface LegalOpinionEditorProps {
  applicationId: string;
  initialOpinion?: string;
  onSaveOpinion?: (opinion: string) => void;
}

export const LegalOpinionEditor: React.FC<LegalOpinionEditorProps> = ({
  applicationId,
  initialOpinion = '',
  onSaveOpinion,
}) => {
  const user = useAuthStore((s) => s.user);
  const [opinion, setOpinion] = useState(
    initialOpinion ||
      'I have perused the registered instrument, encumbrance certificate, and related revenue entries in accordance with the provisions of the Transfer of Property Act, 1882 and Registration Act, 1908.\n\nFINDINGS:\n1. The chain of title from the predecessor-in-title has been verified.\n2. Discrepancies identified during AI automated ingestion have been cross-checked.\n\nRECOMMENDATION:\nTitle is fit for mutation sanction subject to verification of KYC.'
  );
  const [attachments, setAttachments] = useState<string[]>([
    'Title_Search_Report_30Yrs.pdf',
    'Encumbrance_Certificate_Form15.pdf',
  ]);
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const insertCitation = (citation: string) => {
    setOpinion((prev) => `${prev}\n\n[STATUTORY CITATION: ${citation}]`);
    toast.success('Inserted statutory citation into legal opinion');
  };

  const handleAddAttachment = () => {
    if (newAttachmentName.trim()) {
      setAttachments([...attachments, newAttachmentName.trim()]);
      setNewAttachmentName('');
      toast.success('Attached legal exhibit');
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onSaveOpinion?.(opinion);
    toast.success('Draft Legal Opinion saved securely');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Statutory Legal Opinion & Scrutiny Note (विधिक परामर्श)
            </h3>
            <p className="text-xs text-slate-400">
              Draft formal advisory opinion under Rule 26 of Revenue Standing Orders
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-semibold transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft Opinion</span>
        </button>
      </div>

      {/* Quick Statutory Citations Pills */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          Insert Statutory Provisions
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => insertCitation('Transfer of Property Act, 1882 - Section 54 (Sale Definition)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
          >
            + Sec 54 TPA (Sale Definition)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Registration Act, 1908 - Section 22-A (Prohibited Land List)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
          >
            + Sec 22-A Reg Act (Prohibited Land)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Transfer of Property Act, 1882 - Section 52 (Doctrine of Lis Pendens)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
          >
            + Sec 52 TPA (Lis Pendens)
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Hindu Succession Act, 1956 - Section 6 (Coparcenary Rights)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
          >
            + Sec 6 Hindu Succession Act
          </button>
          <button
            type="button"
            onClick={() => insertCitation('Indian Stamp Act, 1899 - Section 47-A (Deficit Stamp Duty)')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
          >
            + Sec 47-A Stamp Act
          </button>
        </div>
      </div>

      {/* Opinion Textarea */}
      <div>
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono"
          placeholder="Enter formal statutory opinion..."
        />
      </div>

      {/* Supporting Legal Exhibits / Attachments */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5 text-slate-400" />
            Supporting Legal Exhibits & Title Reports
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {attachments.length} files attached
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-xs text-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>{file}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttachment(idx)}
                className="text-slate-400 hover:text-red-400 ml-1"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newAttachmentName}
            onChange={(e) => setNewAttachmentName(e.target.value)}
            placeholder="Add title search report, legal notice, or court affidavit filename..."
            className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddAttachment}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exhibit</span>
          </button>
        </div>
      </div>

      {/* Digital Signature Endorsement Seal */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{user?.name || 'Adv. Rajeshwari Sharma'}</span>
              <span className="text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Class-3 DSC Verified
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              High Court Bar ID: <span className="font-mono text-slate-300">{user?.barCouncilId || 'TS/BAR/2008/4192'}</span> • {user?.designation || 'Senior Legal Officer'}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Digital Token: E-PASS2003 • Key Alg: RSA-2048
        </div>
      </div>
    </div>
  );
};
