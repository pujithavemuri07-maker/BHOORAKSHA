import React, { useState } from 'react';
import { BookOpen, Landmark, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

export default function LegacyRecordsRevenue() {
  const { t } = useTranslation();

  const [sanctionedList, setSanctionedList] = useState<string[]>([]);

  const legacyItems = [
    {
      docId: 'OLD-000123',
      type: '1975 Register (Khasra Pahani)',
      village: 'Yelahanka',
      chainEntry: '1975 Title: Shankar S/o Ramu (Predecessor-in-title to Suresh Reddy)',
      ulpin: 'KA-1234-5678-9012',
      status: 'Awaiting Final Mutation Chain Inclusion',
    },
    {
      docId: 'OLD-000121',
      type: '1980 Pattadar Passbook',
      village: 'Chamundi Foothills',
      chainEntry: 'Historical Rythu Seva Entry for Survey #88/3',
      ulpin: 'KA-9988-7766-5544',
      status: 'Ready for Sanction',
    },
  ];

  const handleSanction = (id: string) => {
    setSanctionedList((prev) => [...prev, id]);
    toast.success(`Dossier ${id} ratified! Historical ownership chain updated.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {t('oldDocuments.legacyRecords', 'Legacy Records (Ownership Chain Sanction)')}
            </h1>
            <p className="text-xs text-slate-400">
              Tehsildar final executive review to bind digitized archival documents into the official State land title succession ledger
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
                <th className="py-3 px-4">Archival Record</th>
                <th className="py-3 px-4">Village / ULPIN</th>
                <th className="py-3 px-4">Ownership Chain Progression</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Executive Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {legacyItems.map((item) => {
                const isSanctioned = sanctionedList.includes(item.docId);
                return (
                  <tr key={item.docId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{item.docId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{item.type}</td>
                    <td className="py-3.5 px-4">
                      <span>{item.village}</span>
                      <span className="text-[10px] font-mono text-emerald-400 block">{item.ulpin}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.chainEntry}
                    </td>
                    <td className="py-3.5 px-4">
                      {isSanctioned ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                          ✓ Chain Ratified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isSanctioned ? (
                        <span className="text-emerald-400 text-xs font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Sanctioned</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSanction(item.docId)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all inline-flex items-center gap-1 hover:scale-105"
                        >
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Sanction & Link</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
