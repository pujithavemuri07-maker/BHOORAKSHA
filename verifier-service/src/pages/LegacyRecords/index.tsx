import React, { useState } from 'react';
import { BookOpen, AlertTriangle, CheckCircle2, ArrowRight, Layers, FileText, Search, X, ShieldCheck, Eye } from 'lucide-react';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

interface LegacyItem {
  docId: string;
  type: string;
  village: string;
  issue: string;
  severity: string;
  status: string;
  date: string;
  surveyNo?: string;
  oldOwner?: string;
  currentOwner?: string;
}

export default function LegacyRecordsVerifier() {
  const { t } = useTranslation();

  const [items, setItems] = useState<LegacyItem[]>([
    {
      docId: 'OLD-000123',
      type: 'Register (Pahani)',
      village: 'Yelahanka',
      surveyNo: '123/456',
      oldOwner: 'Shankar (1975 Cadastre)',
      currentOwner: 'Suresh Reddy (Modern RoR)',
      issue: 'Ownership Mismatch (1975: Shankar vs Modern: Suresh Reddy)',
      severity: 'HIGH',
      status: 'Awaiting Girdawar Field Inspection',
      date: '2026-09-20',
    },
    {
      docId: 'OLD-000122',
      type: 'Old Sale Deed',
      village: 'Bengaluru South (Begur)',
      surveyNo: '42/A',
      oldOwner: 'Venkataiah Goud',
      currentOwner: 'Ramesh Patel',
      issue: 'Survey Notation Shift (Sy. 42 to Sy. 42/A)',
      severity: 'MEDIUM',
      status: 'Awaiting Boundary Verification',
      date: '2026-09-21',
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<LegacyItem | null>(null);
  const [remarks, setRemarks] = useState('');

  const handleVerify = (item: LegacyItem, pass: boolean) => {
    const newStatus = pass ? '✓ Field Inspection Verified' : '⚠ Flagged for Legal Scrutiny';
    setItems((prev) =>
      prev.map((i) => (i.docId === item.docId ? { ...i, status: newStatus } : i))
    );
    setSelectedItem(null);
    setRemarks('');
    if (pass) {
      toast.success(`Field inspection verified and signed for ${item.docId}`);
    } else {
      toast.error(`Discrepancy flagged on ${item.docId} for Legal Officer review`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {t('oldDocuments.legacyRecords', 'Legacy Records (from DEO Desk)')}
            </h1>
            <p className="text-xs text-slate-400">
              Historical handwritten cadastre documents routed by Patwari/DEO for field verification
            </p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Doc ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Detected Discrepancy</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {items.map((item) => (
                <tr key={item.docId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {item.docId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {item.type}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.village}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-amber-400 font-semibold">{item.issue}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        item.status.includes('✓')
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.status.includes('⚠')
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(item);
                        setRemarks(`Field inspection conducted for ${item.docId}. Physical Pahani boundaries checked against modern survey records.`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Field Verification &amp; Inspection Desk
                  </h3>
                  <p className="text-xs text-slate-400">
                    Record ID: <span className="font-mono text-amber-400 font-bold">{selectedItem.docId}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Document Type:</span>
                  <strong className="text-white">{selectedItem.type}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Village / Survey No:</span>
                  <strong className="text-white">{selectedItem.village} (Sy. {selectedItem.surveyNo})</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Historical Owner:</span>
                  <strong className="text-amber-300">{selectedItem.oldOwner}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Modern RoR Owner:</span>
                  <strong className="text-emerald-300">{selectedItem.currentOwner}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <strong>Discrepancy Summary:</strong> {selectedItem.issue}
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold block text-[11px]">
                  Girdawar Field Remarks &amp; Ground Inspection Notes:
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                  placeholder="Enter physical verification notes, boundary markers confirmed, or field Pahani findings..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleVerify(selectedItem, true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify &amp; Clear Inspection</span>
              </button>
              <button
                type="button"
                onClick={() => handleVerify(selectedItem, false)}
                className="py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Flag Anomaly</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
