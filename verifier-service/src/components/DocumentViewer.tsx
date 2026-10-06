import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, FileText, ChevronLeft, ChevronRight, Maximize2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getDocumentRegistryEntry, createDocumentRegistry, DocumentRecord } from '../utils/documentRegistry';

export interface DocumentItem {
  id?: string;
  name: string;
  type: string;
  required?: boolean;
  available?: boolean;
  url?: string;
  docTypeKey?: string;
  pageCount?: number;
}

interface DocumentViewerProps {
  documentUrl?: string;
  fileName?: string;
  dossier?: DocumentItem[];
  activeDocType?: string;
  activePage?: number;
  applicationId?: string;
  highlightFieldKey?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fileName,
  dossier,
  activeDocType = 'sale_deed',
  activePage = 1,
  applicationId = 'VRF-2026-501',
  highlightFieldKey,
}) => {
  const [selectedDocKey, setSelectedDocKey] = useState<string>(activeDocType || 'sale_deed');
  
  // Track page numbers per document key
  const [docPageMap, setDocPageMap] = useState<Record<string, number>>({
    'sale_deed': 1,
    'ror_record': 1,
    'id_proof': 1,
    'mutation_record': 1,
    'link_doc': 1,
    'cadastral_map': 1,
  });

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Sync activeDocType and activePage when props change
  useEffect(() => {
    if (activeDocType) {
      setSelectedDocKey(activeDocType);
      if (activePage !== undefined) {
        setDocPageMap((prev) => ({
          ...prev,
          [activeDocType]: activePage,
        }));
      }
    }
  }, [activeDocType, activePage]);

  // Retrieve exact DocumentRecord from registry
  const currentRegistry: DocumentRecord = getDocumentRegistryEntry(selectedDocKey, applicationId);
  const currentPageNumber = docPageMap[selectedDocKey] || 1;
  const pageData =
    currentRegistry.pages && currentRegistry.pages.length > 0
      ? currentRegistry.pages.find((p) => p.pageNumber === currentPageNumber) || currentRegistry.pages[0]
      : null;

  const handleSelectTab = (docKey: string) => {
    setSelectedDocKey(docKey);
    // Reset zoom and rotation when switching documents
    setZoom(100);
    setRotation(0);
    // Default page to 1 if not set
    setDocPageMap((prev) => ({
      ...prev,
      [docKey]: prev[docKey] || 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= currentRegistry.totalPages) {
      setDocPageMap((prev) => ({
        ...prev,
        [selectedDocKey]: newPage,
      }));
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 180));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 70));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  // Build dossier tabs list from registry or passed dossier
  const fullRegistry = createDocumentRegistry(applicationId);
  const dossierTabs = dossier && dossier.length > 0
    ? dossier.map((item) => {
        const key = item.docTypeKey || item.id || item.type || item.name;
        const reg = getDocumentRegistryEntry(key, applicationId);
        return {
          id: reg.id,
          docTypeKey: reg.docTypeKey,
          name: item.name || reg.displayName,
          available: item.available !== undefined ? item.available : reg.available,
          totalPages: reg.totalPages,
        };
      })
    : Object.values(fullRegistry).map((reg) => ({
        id: reg.id,
        docTypeKey: reg.docTypeKey,
        name: reg.displayName,
        available: reg.available,
        totalPages: reg.totalPages,
      }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
      {/* Dossier Document Tabs */}
      <div className="bg-slate-950 px-4 pt-3 pb-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0 mr-1">DOSSIER TABS:</span>
        {dossierTabs.map((doc) => {
          const isSelected =
            selectedDocKey.toLowerCase() === doc.docTypeKey.toLowerCase() ||
            selectedDocKey.toLowerCase() === doc.id.toLowerCase();
          const pNo = docPageMap[doc.docTypeKey] || 1;

          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => handleSelectTab(doc.docTypeKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{doc.name}</span>
              {!doc.available ? (
                <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">
                  MISSING
                </span>
              ) : (
                <span className="text-[10px] font-mono font-normal opacity-80 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {pNo}/{doc.totalPages}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Metadata Banner Header */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-xs tracking-tight">{currentRegistry.docType}</span>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              currentRegistry.available
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {currentRegistry.available ? currentRegistry.ocrStatus : 'DOCUMENT MISSING FROM DOSSIER'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            File: <span className="text-slate-200 font-semibold">{fileName || currentRegistry.fileName}</span> • Source:{' '}
            <span className="text-amber-300 font-medium">{currentRegistry.sourceLabel}</span>
          </p>
        </div>

        {/* Navigation & Zoom Bar */}
        <div className="flex items-center gap-2">
          {currentRegistry.available && (
            <div className="flex items-center gap-1 bg-slate-950 rounded-xl px-2.5 py-1 border border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => handlePageChange(currentPageNumber - 1)}
                disabled={currentPageNumber === 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-white font-bold px-1.5">
                {currentPageNumber} / {currentRegistry.totalPages} Pages
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPageNumber + 1)}
                disabled={currentPageNumber === currentRegistry.totalPages}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-slate-950 rounded-xl px-2 py-1 border border-slate-800 text-xs text-slate-300">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-400">{zoom}%</span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-slate-800 mx-0.5" />
            <button
              type="button"
              onClick={handleRotate}
              className="p-1 hover:text-white transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewer Workspace Paper */}
      <div className="h-[480px] bg-slate-950 p-6 overflow-auto scrollbar-thin relative flex justify-center items-start">
        {!currentRegistry.available ? (
          /* MISSING DOCUMENT WARNING BANNER */
          <div className="my-auto w-full max-w-xl bg-amber-950/20 border-2 border-amber-500/40 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-amber-300 uppercase tracking-wide">
                DOCUMENT MISSING FROM APPLICATION DOSSIER
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {currentRegistry.missingMessage ||
                  `${currentRegistry.displayName} is currently marked as MISSING for application ${applicationId}. No scanned copy has been uploaded by the citizen or DEO.`}
              </p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left text-xs space-y-1 font-mono">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">RECOMMENDED VERIFIER ACTION:</span>
              <p className="text-slate-300">• Return application to DEO requesting compulsory upload of <strong className="text-white">{currentRegistry.displayName}</strong>.</p>
              <p className="text-slate-300">• Or request physical document verification during field inspection.</p>
            </div>
          </div>
        ) : pageData ? (
          /* ACTIVE DOCUMENT PAPER DISPLAY */
          <div
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative min-h-[540px]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{pageData.title}</span>
                <p className="text-[11px] text-slate-400">{pageData.subtitle}</p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                WATERMARK: {pageData.watermark}
              </span>
            </div>

            {/* Render Page HTML Content */}
            <div
              className="prose prose-invert max-w-none text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.htmlContent }}
            />

            {/* Highlight indicator if requested */}
            {highlightFieldKey && pageData.fieldKeys.includes(highlightFieldKey) && (
              <div className="mt-4 p-3 bg-amber-500/10 border-2 border-amber-500 rounded-xl flex items-center justify-between animate-pulse">
                <span className="text-xs font-bold text-amber-300">
                  ★ Highlighted Source Field: <code className="font-mono text-white">{highlightFieldKey}</code>
                </span>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                  VERIFIER PROOF TARGET
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
