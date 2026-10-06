import React from 'react';
import { BookOpen, Scale, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function LegacyRecordsLegal() {
  const { t } = useTranslation();

  const legalLegacyItems = [
    {
      docId: 'OLD-000123',
      type: 'Register (1975)',
      village: 'Yelahanka',
      titleConflict: 'Old Owner "Shankar" vs Modern Registered "Suresh Reddy"',
      severity: 'HIGH',
      status: 'Awaiting Title Succession Review',
    },
    {
      docId: 'OLD-000120',
      type: 'Partition Deed (1984)',
      village: 'Devanahalli',
      titleConflict: 'Undocumented Coparcenary Share Claim',
      severity: 'HIGH',
      status: 'Legal Heirship Scrutiny',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {t('oldDocuments.legacyRecords', 'Legacy Records (Legal Discrepancies)')}
            </h1>
            <p className="text-xs text-slate-400">
              Archival deeds and registers with title gaps, unregistered successions, or chronological anomalies
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Doc ID</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Legal Issue Flagged</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {legalLegacyItems.map((item) => (
                <tr key={item.docId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{item.docId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{item.type}</td>
                  <td className="py-3.5 px-4">{item.village}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-rose-400 font-semibold">{item.titleConflict}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold border border-purple-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition-all inline-flex items-center gap-1"
                    >
                      <span>Legal Scrutiny</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
