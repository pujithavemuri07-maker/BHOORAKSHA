import React, { useState } from 'react';
import { LegalApplication } from '../../api/types';
import {
  FileText,
  FileCode,
  ShieldCheck,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Scale,
  Database,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DocumentsEvidenceSectionProps {
  application: LegalApplication;
  onSelectDocument?: (docName: string) => void;
}

export const DocumentsEvidenceSection: React.FC<DocumentsEvidenceSectionProps> = ({
  application,
  onSelectDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const doc = application.extractedData?.documentDetails;

  const categories = [
    {
      id: 'primary',
      title: 'PRIMARY DOCUMENT',
      description: 'Registered title deed presented for statutory clearance',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      icon: <FileText className="w-4 h-4 text-indigo-400" />,
      items: [
        {
          name: `${doc?.documentType || application.documentType} (Original Certified)`,
          type: 'PDF / Instrument',
          source: `SRO ${doc?.issuingAuthority || 'Local Sub-Registrar'}`,
          date: doc?.registrationDate || '2025-10-18',
          regNo: doc?.registrationNumber || 'BK-1/2104/2025',
          size: '4.2 MB',
          verified: true,
          verificationStatus: 'Digitally Registered & SRO Verified',
        },
      ],
    },
    {
      id: 'revenue',
      title: 'REVENUE RECORDS',
      description: 'Authoritative land records from state revenue database',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      items: [
        {
          name: 'Record of Rights (RoR 1-B Digital Ledger)',
          type: 'PDF / Revenue Ledger',
          source: application.govtRecord?.sourceRegister || 'Dharani Land Portal Sync',
          date: '07 Sep 2026',
          regNo: 'ROR-1B/PAT/2026/812',
          size: '1.4 MB',
          verified: true,
          verificationStatus: 'Live Database Synchronized',
        },
        {
          name: 'Pahani / Adangal Annual Cultivation Extract',
          type: 'PDF / Cadastral Lineage',
          source: 'Tahsildar Revenue Office',
          date: '01 Sep 2026',
          regNo: 'PAH/2025-26/4102',
          size: '2.1 MB',
          verified: true,
          verificationStatus: 'Verified by Mandal Revenue Officer',
        },
        {
          name: 'Prior Mutation Register Extract',
          type: 'PDF / Mutation Slip',
          source: 'Revenue Mutation Archives',
          date: '14 Aug 2024',
          regNo: 'MUT/2024/9910',
          size: '880 KB',
          verified: true,
          verificationStatus: 'Archive Sealed',
        },
      ],
    },
    {
      id: 'registration',
      title: 'REGISTRATION RECORDS',
      description: 'Sub-Registrar encumbrance & Book-1 index extracts',
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      icon: <FileCode className="w-4 h-4 text-sky-400" />,
      items: [
        {
          name: 'Form-15 Encumbrance Certificate (30-Year Search)',
          type: 'PDF / Statutory EC',
          source: 'IGRS Registration & Stamps',
          date: '05 Sep 2026',
          regNo: 'EC/2026/99014',
          size: '1.8 MB',
          verified: true,
          verificationStatus: 'Search Completed (1996–2026)',
        },
        {
          name: 'Sub-Registrar Book-1 Registered Index Extract',
          type: 'PDF / Registration Certificate',
          source: doc?.issuingAuthority || 'SRO Patancheru',
          date: doc?.registrationDate || '2025-10-18',
          regNo: doc?.documentNumber || 'PD-2025-104',
          size: '1.1 MB',
          verified: true,
          verificationStatus: 'Certified True Copy',
        },
      ],
    },
    {
      id: 'supporting',
      title: 'SUPPORTING DOCUMENTS',
      description: 'Parties identity, lineage proofs, and title chain links',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: <FolderOpen className="w-4 h-4 text-amber-400" />,
      items: [
        {
          name: 'Aadhaar / KYC Digital Endorsement Certificate',
          type: 'PDF / UIDAI eSign',
          source: 'UIDAI e-KYC Gateway',
          date: '06 Sep 2026',
          regNo: 'eKYC-VERIFIED-eSIGN-3.0',
          size: '640 KB',
          verified: true,
          verificationStatus: 'Biometric / OTP eSign Verified',
        },
        {
          name: 'Family Genealogy Tree & Succession Certificate',
          type: 'PDF / Lineage Proof',
          source: 'Executive Magistrate Office',
          date: '12 Jan 2025',
          regNo: 'FAM-TREE/2025/119',
          size: '1.6 MB',
          verified: false,
          verificationStatus: 'Pending Co-heir Relinquishment',
        },
      ],
    },
    {
      id: 'legal',
      title: 'LEGAL / COURT RECORDS',
      description: 'Civil court orders, caveat listings, and stay injunctions',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      icon: <Scale className="w-4 h-4 text-rose-400" />,
      items: [
        {
          name: 'Civil Court Injunction Order (OS 412/2024)',
          type: 'PDF / Judicial Order',
          source: 'Senior Civil Court Sangareddy',
          date: '14 Feb 2026',
          regNo: 'IA-No-08/2026-OS-412',
          size: '1.9 MB',
          verified: true,
          verificationStatus: 'Interim Injunction Operating (Sec 52 TPA)',
        },
        {
          name: 'Caveat Registry Search & Statutory Notice',
          type: 'PDF / Caveat Search',
          source: 'District Court Judicial System',
          date: '07 Sep 2026',
          regNo: 'CAV-SEARCH/2026/89',
          size: '950 KB',
          verified: true,
          verificationStatus: 'Caveat Active on Land Parcel',
        },
      ],
    },
  ];

  const handleDownload = (docName: string) => {
    toast.success(`Downloading verified copy: ${docName}`);
  };

  const handleView = (docName: string) => {
    onSelectDocument?.(docName);
    toast.success(`Opening ${docName} in Document Viewer`);
  };

  const filteredCategories =
    selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c.id === selectedCategory);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            Documents & Evidence Repository
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Classified statutory instruments, certified revenue extracts, registration certificates, and court records
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            All Documents (10)
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Categorized Document Cards */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="space-y-2.5">
            <div className="flex items-center gap-2 px-1">
              <span className={`p-1 rounded-md border ${category.color}`}>
                {category.icon}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {category.title}
              </span>
              <span className="text-[11px] text-slate-500">
                — {category.description}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-slate-800 text-indigo-400 rounded-xl border border-slate-700 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {item.name}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>Source: {item.source}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: <span className="text-slate-300 font-semibold">{item.regNo}</span> • Date: {item.date}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                        item.verified
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {item.verified ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{item.verificationStatus}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleView(item.name)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold transition-all border border-indigo-500/30 flex items-center gap-1"
                        title="View in Instrument Viewer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(item.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
