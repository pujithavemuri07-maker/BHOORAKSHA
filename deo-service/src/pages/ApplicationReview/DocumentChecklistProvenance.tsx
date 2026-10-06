import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Sparkles,
  FileText,
  ShieldCheck,
  Database,
  Info,
  Send,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { RequestMissingDocModal } from '../../components/RequestMissingDocModal';
import toast from 'react-hot-toast';

interface DocItem {
  id: string;
  name: string;
  status: 'VERIFIED' | 'REVIEW' | 'OPTIONAL_PENDING' | 'MISSING';
  fileType: string;
  fileSize: string;
  pageCount: number;
  provenance: {
    source: string;
    page: string;
    field: string;
    extractionMethod: string;
    confidence: string;
    status: string;
  };
}

const DEFAULT_DOC_LIST: DocItem[] = [
  {
    id: 'doc-1',
    name: 'Registered Sale Deed (Deed #SD-2025-045)',
    status: 'VERIFIED',
    fileType: 'PDF Document',
    fileSize: '4.2 MB',
    pageCount: 6,
    provenance: {
      source: 'Registered Sale Deed (SRO Serilingampally)',
      page: 'Page 3, Schedule A (Property Boundaries)',
      field: 'Survey Number: 123/456, Extent: 2.50 Acres',
      extractionMethod: 'ChitraPathak Multimodal OCR + MuRIL Indic NER',
      confidence: '99%',
      status: 'Extracted & Cross-Checked',
    },
  },
  {
    id: 'doc-2',
    name: 'RoR 1B / Pattadar Passbook Record',
    status: 'VERIFIED',
    fileType: 'State Central Live Stream',
    fileSize: '1.1 MB',
    pageCount: 2,
    provenance: {
      source: 'State Land Records Master API (Khata #KH-88214)',
      page: 'Pahani Sheet 2026, Column 8',
      field: 'Registered Pattadar: Ramesh Kumaran',
      extractionMethod: 'Direct SDC Master API Gateway Protocol',
      confidence: '100%',
      status: 'Live State Master Authenticated',
    },
  },
  {
    id: 'doc-3',
    name: 'Sanctioned Mutation Record (MUT-2017-0234)',
    status: 'VERIFIED',
    fileType: 'Revenue Department Docket',
    fileSize: '2.8 MB',
    pageCount: 4,
    provenance: {
      source: 'Tahsildar Revenue Office Archives',
      page: 'Page 2, Mutation Proceeding Sanction',
      field: 'Lineage: Suresh V. Rao -> Shankar Patel',
      extractionMethod: 'Digital Archive Hash Verification',
      confidence: '100%',
      status: 'Immutable Archive Match',
    },
  },
  {
    id: 'doc-4',
    name: 'Cadastral Vector Map (BhooNaksha Shapefile)',
    status: 'VERIFIED',
    fileType: 'GeoJSON / Spatial Vector',
    fileSize: '890 KB',
    pageCount: 1,
    provenance: {
      source: 'Survey & Land Records Directorate',
      page: 'Village Cadastral Sheet 2026, Parcel #123/456',
      field: 'Centroid: 17.4435° N, 78.3772° E (2.49 Ac)',
      extractionMethod: 'BhooNaksha PostGIS Vector Engine',
      confidence: '99.6%',
      status: 'Georeferenced Polygon Validated',
    },
  },
  {
    id: 'doc-5',
    name: 'Encumbrance Certificate (1996 - 2026)',
    status: 'REVIEW',
    fileType: 'Digital SRO Statement',
    fileSize: '3.4 MB',
    pageCount: 8,
    provenance: {
      source: 'Sub-Registrar Encumbrance Ledger',
      page: 'Page 7, Entry #2023/889',
      field: 'SBI Agricultural Mortgage (Discharge Verified)',
      extractionMethod: 'OCR Preamble & Entry Reconciliation',
      confidence: '95%',
      status: 'Advisory Review Required',
    },
  },
  {
    id: 'doc-6',
    name: 'Supporting Identity Proof (Citizen Aadhaar E-KYC)',
    status: 'VERIFIED',
    fileType: 'Masked Identity Voucher',
    fileSize: '620 KB',
    pageCount: 1,
    provenance: {
      source: 'Citizen KYC Submission',
      page: 'UIDAI Offline E-KYC Portal',
      field: 'Name: Ramesh Kumar, Masked UID: XXXX-XXXX-8821',
      extractionMethod: 'UIDAI Digital Certificate Hash Match',
      confidence: '99%',
      status: 'Statutory E-KYC Authenticated',
    },
  },
];

interface DocumentChecklistProvenanceProps {
  applicationId?: string;
}

export const DocumentChecklistProvenance: React.FC<DocumentChecklistProvenanceProps> = ({
  applicationId = 'DEO-2026-401',
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocItem>(DEFAULT_DOC_LIST[0]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleAction = (action: string, docName: string) => {
    toast.success(`${action} triggered for ${docName}`);
  };

  const getStatusBadge = (status: DocItem['status']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
            <CheckCircle2 className="w-3 h-3" />
            ✓ Verified
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
            <AlertTriangle className="w-3 h-3" />
            ⚠ In Review
          </span>
        );
      case 'OPTIONAL_PENDING':
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full font-mono">
            <AlertTriangle className="w-3 h-3" />
            ✕ Missing Document
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              VERIFICATION COMPLETENESS & DATA PROVENANCE
            </h3>
            <p className="text-xs text-slate-400">
              Audit lineage tracking source document, extraction method, page reference & token confidence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request Missing Document</span>
          </button>

          <span className="bg-slate-800 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-700">
            6 / 6 Complete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Document Checklist (Left) */}
        <div className="lg:col-span-7 space-y-2.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Submitted Statutory Document Dossier
          </span>

          <div className="space-y-2">
            {DEFAULT_DOC_LIST.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={cn(
                    'p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className={cn('w-4 h-4', isSelected ? 'text-amber-400' : 'text-slate-400')} />
                      <span className="text-xs font-bold text-white">
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>{doc.fileType}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>{doc.pageCount} Pages</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    {getStatusBadge(doc.status)}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('Document Preview', doc.name);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('Download', doc.name);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction('AI OCR Re-Extraction', doc.name);
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        title="AI Extract"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Provenance Card (Right) */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Data Provenance Ledger
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                AI Confidence: {selectedDoc.provenance.confidence}
              </span>
            </div>

            <div className="space-y-3 pt-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Source Document</span>
                <p className="text-slate-200 font-medium">{selectedDoc.provenance.source}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Page / Section</span>
                  <p className="text-amber-400 font-mono font-medium text-[11px]">{selectedDoc.provenance.page}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Extraction Method</span>
                  <p className="text-slate-300 font-mono text-[11px]">{selectedDoc.provenance.extractionMethod}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Key Field Extracted</span>
                <p className="text-white font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-bold">
                  {selectedDoc.provenance.field}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Reconciliation Status</span>
                <p className="text-emerald-400 font-medium text-[11px] flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {selectedDoc.provenance.status}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Select any document from the left to trace its extraction chain.</span>
          </div>
        </div>
      </div>

      {/* Request Missing Document Modal */}
      <RequestMissingDocModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        applicationId={applicationId}
      />
    </div>
  );
};
