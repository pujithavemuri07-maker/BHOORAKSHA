import React, { useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getDocumentContent, DossierDocumentContent } from '../utils/documentRegistry';

interface DocumentViewerProps {
  documentType?: string;
  fileName?: string;
  documentUrl?: string;
  className?: string;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  highlightFieldKey?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentType = 'Registered Sale Deed',
  fileName,
  documentUrl,
  className = '',
  currentPage: externalPage,
  onPageChange,
  highlightFieldKey,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [internalPage, setInternalPage] = useState(1);

  const docContent: DossierDocumentContent = getDocumentContent(documentType);
  const totalPages = docContent.pagesCount || 1;

  const currentPage = externalPage !== undefined ? externalPage : internalPage;

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    if (onPageChange) {
      onPageChange(clamped);
    } else {
      setInternalPage(clamped);
    }
  };

  // Reset or adjust page if switching documents
  useEffect(() => {
    if (currentPage > totalPages) {
      handlePageChange(1);
    }
  }, [documentType, totalPages]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 70));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Active page content
  const pageData =
    docContent.pages.find((p) => p.pageNumber === currentPage) || docContent.pages[0];

  const displayName = fileName || docContent.name;

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* 1. Document Source & Metadata Header */}
      <div className="px-5 py-3 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-xs">
                {docContent.type}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
              {displayName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase text-[9px]">Source:</span>
            <span className="text-amber-300 font-semibold">{docContent.source}</span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-center gap-1 font-mono font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{docContent.ocrConfidence}% OCR Match</span>
          </div>
        </div>
      </div>

      {/* 2. Viewer Toolbar (Page Navigation & Zoom Controls) */}
      <div className="flex flex-wrap items-center justify-between px-5 py-2.5 bg-slate-950 border-b border-slate-800 gap-3">
        {/* Pagination */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-2xl p-1 text-slate-300">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-all flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="px-3 text-xs font-mono font-bold text-amber-400 min-w-[70px] text-center">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 hover:bg-slate-800 rounded-xl disabled:opacity-30 transition-all flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white"
            title="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Rotate Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 min-w-[42px] text-center font-bold">
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRotate}
            className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Document View Canvas */}
      <div className="relative flex-1 bg-slate-950/90 min-h-[460px] max-h-[620px] overflow-auto flex items-center justify-center p-6 select-text">
        <div
          className="transition-transform duration-200 bg-white text-slate-900 rounded-2xl shadow-2xl p-8 max-w-xl w-full border border-slate-200 relative"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Government Stamp / SRO Seal Overlay */}
          {pageData.headerStamp && (
            <div className="absolute top-6 right-6 border-2 border-emerald-800/70 rounded-xl p-2 text-center rotate-[-4deg] bg-emerald-50/80 pointer-events-none shadow-sm">
              <p className="text-[9px] font-black tracking-widest text-emerald-900 uppercase">
                GOVERNMENT SEAL
              </p>
              <p className="text-[8px] font-mono font-bold text-emerald-800">
                {pageData.headerStamp}
              </p>
            </div>
          )}

          {/* Document Header */}
          <div className="text-center border-b-2 border-amber-600/40 pb-4 mb-4">
            <p className="text-[10px] tracking-widest text-amber-900 font-black uppercase">
              {pageData.title}
            </p>
            <div className="mt-1 inline-block border border-slate-300 px-3 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-slate-800">
              ORIGINAL STATUTORY DOSSIER • PAGE {currentPage} OF {totalPages}
            </div>
          </div>

          {/* Document Body Sections */}
          <div className="space-y-3.5 text-xs leading-relaxed font-serif text-slate-800">
            {pageData.sections.map((sec, idx) => {
              const isFieldMatch =
                highlightFieldKey && sec.highlightFieldKey === highlightFieldKey;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isFieldMatch || sec.isHighlighted
                      ? 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-400 shadow-md animate-pulse'
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  {sec.title && (
                    <h5 className="font-sans font-bold text-[11px] text-slate-900 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>{sec.title}</span>
                      {isFieldMatch && (
                        <span className="text-[9px] font-mono bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                          Target Field Highlighted
                        </span>
                      )}
                    </h5>
                  )}
                  <div className="text-[11px] text-slate-800 whitespace-pre-line font-serif leading-relaxed">
                    {sec.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Endorsement */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-sans">
            <span>{pageData.footerNote || 'Statutory Land Record Document'}</span>
            <span className="font-mono text-emerald-700 font-bold">
              ✓ Tamper-Evident OCR Digitized
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
