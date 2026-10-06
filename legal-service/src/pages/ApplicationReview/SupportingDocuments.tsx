import React from 'react';
import { FileText, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface SupportingDocumentsProps {
  applicationId: string;
}

export const SupportingDocuments: React.FC<SupportingDocumentsProps> = ({
  applicationId,
}) => {
  const documents = [
    {
      name: 'Registered Ancestral Partition Deed (1984)',
      type: 'PDF',
      size: '3.4 MB',
      verified: true,
      regNo: 'BK-1/1042/1984',
    },
    {
      name: 'Form-15 Encumbrance Certificate (30-Year Search)',
      type: 'PDF',
      size: '1.8 MB',
      verified: true,
      regNo: 'EC/2026/9901',
    },
    {
      name: 'Pahani Extract (1990 - 2025 Continuous Lineage)',
      type: 'PDF',
      size: '2.1 MB',
      verified: true,
      regNo: 'ROR/1B/SER/442',
    },
    {
      name: 'Aadhaar / KYC Digital Endorsement',
      type: 'PDF',
      size: '640 KB',
      verified: true,
      regNo: 'UID-VERIFIED-eSIGN',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Statutory Supporting Exhibits & Link Documents
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Annexures, chain of title deeds, and certified revenue records
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Digitally Attested
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 bg-slate-800 text-indigo-400 rounded-lg shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">
                  {doc.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {doc.regNo} • {doc.size}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              title="Download Exhibit"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
