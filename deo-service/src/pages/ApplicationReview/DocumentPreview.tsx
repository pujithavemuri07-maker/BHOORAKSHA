import React, { useState, useEffect } from 'react';
import { DocumentViewer } from '../../components/DocumentViewer';
import { DocumentDossierItem } from '../../api/types';
import { FileText, Layers, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { getDocumentContent } from '../../utils/documentRegistry';

interface DocumentPreviewProps {
  documentUrl?: string;
  fileName?: string;
  dossier?: DocumentDossierItem[];
  activeDocType?: string;
  activePage?: number;
  highlightFieldKey?: string;
  onDocChange?: (doc: DocumentDossierItem) => void;
  onPageChange?: (page: number) => void;
}

const DEFAULT_DOSSIER: DocumentDossierItem[] = [
  {
    id: 'DOC-1',
    name: 'Registered_Sale_Deed_SD_2025_045.pdf',
    type: 'Registered Sale Deed',
    status: 'PROCESSED',
    pagesCount: 4,
    size: '4.2 MB',
    confidence: 98,
    uploadTimestamp: '2026-09-06T11:15:00Z',
  },
  {
    id: 'DOC-2',
    name: 'Pattadar_Passbook_1B_Extract.pdf',
    type: 'RoR / Pattadar Record (1-B)',
    status: 'PROCESSED',
    pagesCount: 2,
    size: '1.8 MB',
    confidence: 96,
    uploadTimestamp: '2026-09-06T11:16:00Z',
  },
  {
    id: 'DOC-3',
    name: 'Aadhaar_Masked_EKYC.pdf',
    type: 'Identity Proof (Masked)',
    status: 'PROCESSED',
    pagesCount: 1,
    size: '620 KB',
    confidence: 99,
    uploadTimestamp: '2026-09-06T11:17:00Z',
  },
  {
    id: 'DOC-4',
    name: 'Cadastral_FMB_Tippan_123.pdf',
    type: 'Cadastral Map (FMB)',
    status: 'PROCESSED',
    pagesCount: 1,
    size: '2.4 MB',
    confidence: 94,
    uploadTimestamp: '2026-09-06T11:18:00Z',
  },
  {
    id: 'DOC-5',
    name: 'Prior_Mutation_Order_2022.pdf',
    type: 'Mutation Record',
    status: 'PROCESSED',
    pagesCount: 2,
    size: '1.2 MB',
    confidence: 92,
    uploadTimestamp: '2026-09-06T11:19:00Z',
  },
];

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentUrl,
  fileName,
  dossier = DEFAULT_DOSSIER,
  activeDocType,
  activePage,
  highlightFieldKey,
  onDocChange,
  onPageChange,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentDossierItem>(
    dossier[0] || DEFAULT_DOSSIER[0]
  );

  // Independent per-document page tracking
  const [docPageMap, setDocPageMap] = useState<Record<string, number>>({});

  // Sync when activeDocType or activePage is passed from "View Source" triggers
  useEffect(() => {
    if (activeDocType) {
      const match = dossier.find(
        (d) =>
          d.type.toLowerCase().includes(activeDocType.toLowerCase()) ||
          activeDocType.toLowerCase().includes(d.type.toLowerCase())
      );
      if (match) {
        setSelectedDoc(match);
        if (activePage) {
          setDocPageMap((prev) => ({ ...prev, [match.id]: activePage }));
        }
      }
    }
  }, [activeDocType, activePage, dossier]);

  const currentPage =
    docPageMap[selectedDoc.id] || (selectedDoc.id === 'DOC-1' && activePage ? activePage : 1);

  const handleSelectDoc = (doc: DocumentDossierItem) => {
    setSelectedDoc(doc);
    onDocChange?.(doc);
  };

  const handlePageChange = (newPage: number) => {
    setDocPageMap((prev) => ({ ...prev, [selectedDoc.id]: newPage }));
    onPageChange?.(newPage);
  };

  const contentInfo = getDocumentContent(selectedDoc.type);

  return (
    <div className="space-y-3">
      {/* Dossier Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            CITIZEN UPLOADED DOSSIER ({dossier.length} Classified Proofs)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AES-256 Vault Verified</span>
        </div>
      </div>

      {/* Document Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        {dossier.map((doc) => {
          const isSelected = selectedDoc.id === doc.id;
          const pageForDoc = docPageMap[doc.id] || 1;

          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => handleSelectDoc(doc)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 border border-amber-500/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
              <span>{doc.type}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-amber-700/80 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {pageForDoc}/{doc.pagesCount}p
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Document Viewer Canvas */}
      <DocumentViewer
        documentType={selectedDoc.type}
        fileName={selectedDoc.name}
        documentUrl={documentUrl}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        highlightFieldKey={highlightFieldKey}
      />
    </div>
  );
};
