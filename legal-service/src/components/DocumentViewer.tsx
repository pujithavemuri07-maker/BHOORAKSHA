import { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { LegalApplication } from '../api/types';
import { useTranslation } from '../i18n';

interface DocumentViewerProps {
  application: LegalApplication;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ application }) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 180));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 70));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const doc = application.extractedData.documentDetails;
  const prop = application.extractedData.propertyDetails;
  const owner = application.extractedData.ownerDetails;
  const land = application.extractedData.landDetails;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-xl">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span>{t(doc.documentType)} ({doc.documentNumber})</span>
              <span className="text-[10px] font-mono bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300">
                {application.id}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Registration No: {doc.registrationNumber} • SRO: {doc.issuingAuthority} • Date: {doc.registrationDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Page Pagination */}
          <div className="flex items-center gap-1 bg-slate-900/90 rounded-lg px-2 py-1 border border-slate-700 text-xs text-slate-300">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 hover:text-white disabled:opacity-40"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-semibold px-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 hover:text-white disabled:opacity-40"
              aria-label="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom & Rotate Controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 rounded-lg px-1.5 py-1 border border-slate-700 text-xs text-slate-300">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-400">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-slate-700 mx-0.5" />
            <button
              onClick={handleRotate}
              className="p-1 hover:text-white transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={application.documentUrl || '#'}
            download={`document_${application.id}.pdf`}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Document View Canvas */}
      <div className="h-[480px] overflow-auto bg-slate-950 p-6 flex justify-center items-start scrollbar-thin">
        <div
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-[580px] min-h-[720px] bg-white text-slate-900 rounded shadow-2xl p-8 border border-slate-300 select-none relative"
        >
          {/* Simulated Stamp Paper Header */}
          <div className="border-4 border-amber-900/30 p-4 rounded-lg bg-amber-50/50 mb-6 text-center relative overflow-hidden">
            <div className="text-[10px] tracking-widest text-amber-900 font-serif uppercase font-bold">
              GOVERNMENT OF INDIA • REGISTRATION & STAMPS DEPARTMENT
            </div>
            <div className="text-sm font-serif font-black tracking-wider text-amber-950 mt-1">
              NON-JUDICIAL STAMP CERTIFICATE • ₹ 1,00,000/-
            </div>
            <div className="flex justify-between text-[10px] text-amber-900/80 font-mono mt-2 pt-2 border-t border-amber-900/20">
              <span>CERT: IN-TS782910384102N</span>
              <span>DATE: {doc.registrationDate}</span>
              <span>SRO: {doc.issuingAuthority}</span>
            </div>
          </div>

          {/* Document Content Simulation based on page */}
          {currentPage === 1 && (
            <div className="space-y-4 text-xs leading-relaxed font-serif text-slate-800">
              <div className="text-center font-bold text-sm tracking-wide uppercase underline decoration-2 decoration-amber-700 mb-3">
                {doc.documentType} (DEED OF CONVEYANCE)
              </div>

              <p>
                THIS REGISTERED INSTRUMENT is executed on this <strong>{doc.registrationDate}</strong> at{' '}
                <strong>{doc.issuingAuthority}</strong>, by and between:
              </p>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-xs space-y-1">
                <div className="font-bold text-slate-900">VENDOR / TRANSFEROR:</div>
                <div>{owner.previousOwner}, S/o Late Narayan Rao, Indian Inhabitant.</div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-xs space-y-1 relative">
                <div className="font-bold text-slate-900">PURCHASER / TRANSFEREE:</div>
                <div className="text-slate-900 font-semibold">{owner.name}</div>
                <div>Father: {owner.fatherName} | Share: {owner.share}</div>

                {application.legalFlags.some((f) => f.type === 'ownership_inconsistency') && (
                  <div className="absolute top-2 right-2 bg-red-100 border border-red-400 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-sans font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Flagged: Name Mismatch
                  </div>
                )}
              </div>

              <p className="text-[11px] text-justify text-slate-700 leading-relaxed">
                WHEREAS the Vendor is the absolute owner in peaceful possession of all that piece and parcel of land bearing
                Survey Number <strong>{prop.surveyNumber}</strong> situated at Village {prop.village}, Taluk {prop.taluk},
                District {prop.district}, {prop.state}, having ULPIN <strong>{prop.ulpin}</strong>...
              </p>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-4 text-xs leading-relaxed font-serif text-slate-800">
              <div className="font-bold text-xs uppercase tracking-wide border-b pb-1 text-slate-900">
                SCHEDULE OF PROPERTY & BOUNDARIES
              </div>

              <p>
                All that freehold agricultural / non-agricultural land measuring <strong>{land.totalArea} {land.areaUnit}</strong>,
                classified as {land.landType}, bounded and described as:
              </p>

              <table className="w-full text-[11px] border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-100 w-32">North Boundary:</td>
                    <td className="p-2">{land.boundaries.north}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-100">South Boundary:</td>
                    <td className="p-2">{land.boundaries.south}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-bold bg-slate-100">East Boundary:</td>
                    <td className="p-2">{land.boundaries.east}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold bg-slate-100">West Boundary:</td>
                    <td className="p-2">{land.boundaries.west}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 p-3 border border-slate-300 rounded bg-slate-50 text-[11px]">
                <div className="font-bold text-slate-900 mb-1">COVENANT OF TITLE:</div>
                <p className="text-slate-700">
                  The Vendor covenants that the said property is free from all encumbrances, liens, court attachments,
                  lis pendens, maintenance claims, and statutory prohibitions under Land Ceiling Acts.
                </p>
              </div>
            </div>
          )}

          {currentPage === 3 && (
            <div className="space-y-4 text-xs leading-relaxed font-serif text-slate-800">
              <div className="font-bold text-xs uppercase tracking-wide border-b pb-1 text-slate-900">
                PRIOR CHAIN OF TITLE RECITAL
              </div>

              <div className="space-y-2 text-[11px] text-justify text-slate-700 leading-relaxed">
                <p>
                  1. The property was originally held by ancestral pattadar vide Revenue Patta No 182 in 1984.
                </p>
                <p>
                  2. By a Registered Deed of Partition dated 12/04/2012 registered as BK-1/1042/2012, the property was allotted
                  exclusively to the Vendor.
                </p>
                <p>
                  3. Encumbrance Certificate for period 01/01/1990 to date was verified vide Form 15 No EC-2026-9901.
                </p>
              </div>

              {application.legalFlags.some((f) => f.type === 'under_litigation') && (
                <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    COURT INJUNCTION NOTICE DETECTED:
                  </div>
                  <p className="mt-1 text-[11px]">
                    Civil Court Caveat / O.S. No. 412/2024 listed before Junior Civil Judge for injunction restraining alienation.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentPage === 4 && (
            <div className="space-y-4 text-xs leading-relaxed font-serif text-slate-800">
              <div className="font-bold text-xs uppercase tracking-wide border-b pb-1 text-slate-900">
                EXECUTION, ATTESTATION & SUB-REGISTRAR ENDORSEMENT
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="border border-slate-300 p-3 rounded text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Vendor Signature & Thumb Impression</div>
                  <div className="font-script text-lg my-3 text-indigo-900 italic font-bold">
                    {owner.previousOwner}
                  </div>
                  <div className="text-[10px] text-slate-600">Left Thumb Impression Affixed</div>
                </div>

                <div className="border border-slate-300 p-3 rounded text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Purchaser Signature</div>
                  <div className="font-script text-lg my-3 text-indigo-900 italic font-bold">
                    {owner.name}
                  </div>
                  <div className="text-[10px] text-slate-600">eSign 3.0 Verified</div>
                </div>
              </div>

              {/* Sub-Registrar Seal */}
              <div className="mt-6 border-2 border-dashed border-emerald-700/60 p-4 rounded-xl bg-emerald-50/40 text-center relative">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-800 mx-auto flex items-center justify-center text-[9px] font-mono text-emerald-900 font-bold uppercase rotate-12">
                  SEAL OF SRO
                </div>
                <div className="text-xs font-bold text-emerald-900 mt-2">
                  OFFICE OF THE SUB-REGISTRAR: {doc.issuingAuthority}
                </div>
                <div className="text-[10px] text-emerald-800 font-mono">
                  Registered as Document No. {doc.documentNumber} in Book 1 • Volume 412 • Pages 101 to 118
                </div>
                <div className="text-[9px] text-emerald-700 mt-1">
                  Presented on {doc.registrationDate} between the hours of 11:00 AM and 12:00 PM
                </div>
              </div>
            </div>
          )}

          {/* Footer Watermark */}
          <div className="absolute bottom-3 left-8 right-8 flex justify-between items-center text-[9px] text-slate-400 font-mono border-t pt-2">
            <span>BHOORAKSHA AI SECURED ARCHIVE</span>
            <span>PAGE {currentPage} OF {totalPages}</span>
            <span>SHA256: 9e24b...a810f</span>
          </div>
        </div>
      </div>
    </div>
  );
};
