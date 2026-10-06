import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { useDEOStore } from '../store/deoStore';
import { DEOApplication } from '../api/types';
import toast from 'react-hot-toast';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SAMPLE_BATCH_PACKETS: DEOApplication[] = [
  {
    id: 'DEO-2026-406',
    citizenName: 'B. Someshwar Rao',
    citizenPhone: '+91 98480 11992',
    citizenEmail: 'somesh.b@gov.in',
    documentType: 'Registered Sale Deed',
    submissionDate: new Date().toISOString(),
    status: 'READY_TO_FORWARD',
    priority: 'LOW',
    riskScore: 88,
    confidenceCategory: 'HIGH',
    fileName: 'Sale_Deed_Kondapur_118.pdf',
    fileSize: 4120000,
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-406-1',
        name: 'Sale_Deed_Kondapur_118.pdf',
        type: 'Registered Sale Deed',
        status: 'PROCESSED',
        pagesCount: 4,
        size: '4.1 MB',
        confidence: 99,
        uploadTimestamp: new Date().toISOString(),
      },
      {
        id: 'DOC-406-2',
        name: 'Pattadar_Passbook_1B.pdf',
        type: 'RoR / Pattadar Record (1-B)',
        status: 'PROCESSED',
        pagesCount: 2,
        size: '1.5 MB',
        confidence: 98,
        uploadTimestamp: new Date().toISOString(),
      },
      {
        id: 'DOC-406-3',
        name: 'Masked_Aadhaar_Somesh.pdf',
        type: 'Identity Proof (Masked)',
        status: 'PROCESSED',
        pagesCount: 1,
        size: '480 KB',
        confidence: 99,
        uploadTimestamp: new Date().toISOString(),
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Registered Sale Deed', status: 'COMPLETE', docType: 'SD-2026-1184' },
      { key: 'ror', label: 'RoR / 1-B Record Extract', status: 'COMPLETE', docType: 'KH-11840' },
      { key: 'identity', label: 'Identity Proof (Masked Aadhaar)', status: 'COMPLETE', docType: 'UIDAI E-KYC' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Kondapur',
        surveyNumber: '118/2',
        ulpin: 'ULPIN-36-RR-SER-118-02',
        meta: {
          surveyNumber: { value: '118/2', confidence: 99, sourceDoc: 'Sale Deed', isAutoVerified: true },
          village: { value: 'Kondapur', confidence: 99, sourceDoc: 'Sale Deed', isAutoVerified: true },
        },
      },
      ownerDetails: {
        name: 'B. Someshwar Rao',
        fatherOrSpouse: 'B. Narayan Rao',
        share: '100% Sole Ownership',
        panOrAadhaarLast4: '1192',
        maskedAadhaar: 'XXXX XXXX 1192',
        meta: {
          name: { value: 'B. Someshwar Rao', confidence: 99, sourceDoc: 'Sale Deed', isAutoVerified: true },
        },
      },
      landDetails: {
        area: 1.5,
        unit: 'Acres',
        landType: 'Residential Conversion',
        boundaries: {
          north: '60ft Master Plan Road',
          south: 'Survey 119 Commercial',
          east: 'Survey 118/1',
          west: 'Kondapur Nala Buffer',
        },
        meta: {
          area: { value: 1.5, confidence: 98, sourceDoc: 'Sale Deed', isAutoVerified: true },
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2026-1184',
        registrationNumber: 'REG-2026-1184',
        registrationDate: '2026-03-12',
        issuingAuthority: 'SRO Serilingampally',
        meta: {
          number: { value: 'SD-2026-1184', confidence: 99, sourceDoc: 'Sale Deed', isAutoVerified: true },
        },
      },
    },
    govtRecord: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Kondapur',
        surveyNumber: '118/2',
        ulpin: 'ULPIN-36-RR-SER-118-02',
      },
      ownerDetails: {
        name: 'B. Someshwar Rao',
        fatherOrSpouse: 'B. Narayan Rao',
        share: '100% Sole Ownership',
        panOrAadhaarLast4: '1192',
        maskedAadhaar: 'XXXX XXXX 1192',
      },
      landDetails: {
        area: 1.5,
        unit: 'Acres',
        landType: 'Residential Conversion',
        boundaries: {
          north: '60ft Master Plan Road',
          south: 'Survey 119 Commercial',
          east: 'Survey 118/1',
          west: 'Kondapur Nala Buffer',
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2026-1184',
        registrationNumber: 'REG-2026-1184',
        registrationDate: '2026-03-12',
        issuingAuthority: 'SRO Serilingampally',
      },
      khataNumber: 'KH-11840',
    },
    validationResults: [
      {
        field: 'Survey & Extent Cross-Verification',
        documentValue: 'Survey 118/2 (1.50 Acres)',
        govtValue: 'Survey 118/2 (1.50 Acres)',
        status: 'MATCH',
        category: 'SURVEY',
        explanation: 'AI extraction 99% confidence match against State Land Records master polygon.',
      },
    ],
  },
  {
    id: 'DEO-2026-407',
    citizenName: 'Deepa V. Krishnan',
    citizenPhone: '+91 97011 22334',
    documentType: 'Inheritance / Succession Document',
    submissionDate: new Date().toISOString(),
    status: 'NEEDS_ATTENTION',
    priority: 'MEDIUM',
    riskScore: 64,
    confidenceCategory: 'MEDIUM',
    fileName: 'Succession_Certificate_Hafeezpet.pdf',
    fileSize: 3800000,
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-407-1',
        name: 'Succession_Certificate_Hafeezpet.pdf',
        type: 'Inheritance / Succession',
        status: 'PROCESSED',
        pagesCount: 3,
        size: '3.8 MB',
        confidence: 93,
        uploadTimestamp: new Date().toISOString(),
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Succession Certificate', status: 'COMPLETE', docType: 'Tahsildar Order 2026' },
      { key: 'ror', label: 'Prior Pattadar Record', status: 'COMPLETE', docType: 'Late V. Krishnan Record' },
      { key: 'heir_tree', label: 'Family Tree Certificate', status: 'PARTIAL', details: 'Awaiting signature verification' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Ranga Reddy',
        taluk: 'Serilingampally',
        village: 'Hafeezpet',
        surveyNumber: '72/1',
        ulpin: 'ULPIN-36-RR-SER-072-01',
      },
      ownerDetails: {
        name: 'Deepa V. Krishnan',
        fatherOrSpouse: 'Late V. Krishnan',
        share: 'Legal Heir 50%',
        panOrAadhaarLast4: '2234',
        maskedAadhaar: 'XXXX XXXX 2234',
      },
      landDetails: {
        area: 0.9,
        unit: 'Acres',
        landType: 'Agricultural Dry',
        boundaries: {
          north: 'Survey 71 Boundary',
          south: 'Hafeezpet Village Road',
          east: 'Survey 72/2 Co-heir',
          west: 'Survey 70 Farm',
        },
      },
      documentDetails: {
        type: 'Inheritance Succession',
        number: 'SUCC-2026-092',
        registrationNumber: 'REV/SUCC/092/2026',
        registrationDate: '2026-04-18',
        issuingAuthority: 'Tahsildar Serilingampally',
      },
    },
    validationResults: [
      {
        field: 'Co-heir Relinquishment Deed',
        documentValue: 'Claiming 50% Share',
        govtValue: '3 Registered Legal Heirs',
        status: 'PARTIAL',
        category: 'OWNER',
        explanation: 'AI flagged 3 registered legal heirs on file; verification of third heir consent required.',
      },
    ],
  },
  {
    id: 'DEO-2026-408',
    citizenName: 'M. Harishchandra Prasad',
    citizenPhone: '+91 94400 77881',
    documentType: 'Registered Sale Deed',
    submissionDate: new Date().toISOString(),
    status: 'READY_TO_FORWARD',
    priority: 'LOW',
    riskScore: 92,
    confidenceCategory: 'HIGH',
    fileName: 'Sale_Deed_Miyapur_54.pdf',
    fileSize: 4500000,
    govtApiStatus: 'available',
    documentsDossier: [
      {
        id: 'DOC-408-1',
        name: 'Sale_Deed_Miyapur_54.pdf',
        type: 'Registered Sale Deed',
        status: 'PROCESSED',
        pagesCount: 5,
        size: '4.5 MB',
        confidence: 99,
        uploadTimestamp: new Date().toISOString(),
      },
    ],
    completenessCheck: [
      { key: 'deed', label: 'Registered Sale Deed', status: 'COMPLETE', docType: 'SD-2026-5410' },
      { key: 'ror', label: 'Pattadar Passbook', status: 'COMPLETE', docType: 'KH-5410' },
      { key: 'identity', label: 'Masked Identity E-KYC', status: 'COMPLETE', docType: 'UIDAI Verified' },
    ],
    fieldCorrections: [],
    extractedData: {
      propertyDetails: {
        state: 'Telangana',
        district: 'Medchal-Malkajgiri',
        taluk: 'Kukatpally',
        village: 'Miyapur',
        surveyNumber: '54/A',
        ulpin: 'ULPIN-36-MM-KUK-054-01',
      },
      ownerDetails: {
        name: 'M. Harishchandra Prasad',
        fatherOrSpouse: 'M. Satyanarayana',
        share: '100% Absolute Title',
        panOrAadhaarLast4: '7781',
        maskedAadhaar: 'XXXX XXXX 7781',
      },
      landDetails: {
        area: 0.65,
        unit: 'Acres',
        landType: 'Commercial Buffer',
        boundaries: {
          north: 'Metro Corridor',
          south: 'Survey 55 Layout',
          east: 'Survey 54/B',
          west: 'Miyapur Lake Buffer 30m',
        },
      },
      documentDetails: {
        type: 'Registered Sale Deed',
        number: 'SD-2026-5410',
        registrationNumber: 'REG-2026-5410',
        registrationDate: '2026-05-10',
        issuingAuthority: 'SRO Kukatpally',
      },
    },
    validationResults: [
      {
        field: 'Master Registry Validation',
        documentValue: 'Survey 54/A (0.65 Ac)',
        govtValue: 'Survey 54/A (0.65 Ac)',
        status: 'MATCH',
        category: 'SURVEY',
        explanation: 'All cadastral coordinates and title deeds match with 99% AI confidence.',
      },
    ],
  },
];

interface BulkUploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  isInline?: boolean;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen = true, onClose, onSuccess, isInline = false }) => {
  const bulkIngestApplications = useDEOStore((state) => state.bulkIngestApplications);

  const [step, setStep] = useState<'IDLE' | 'PROCESSING' | 'COMPLETE'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [currentActionText, setCurrentActionText] = useState('Initializing AI ingestion pipeline...');
  const [uploadedFilesCount, setUploadedFilesCount] = useState(25);
  const [stats, setStats] = useState({
    uploaded: 25,
    processing: 25,
    successfullyExtracted: 23,
    needsAttention: 2,
    failed: 0,
    readyForConfirmation: 20,
    missingDoc: 1,
  });

  if (!isInline && !isOpen) return null;

  const handleStartProcessing = () => {
    setStep('PROCESSING');
    setProgress(15);
    setCurrentActionText('Step 1/5: Ingesting 25 scanned PDFs & document bundles...');

    setTimeout(() => {
      setProgress(40);
      setCurrentActionText('Step 2/5: AI Document Classification (Sale Deeds, RoRs, FMB Maps, Identity)...');
    }, 1200);

    setTimeout(() => {
      setProgress(70);
      setCurrentActionText('Step 3/5: ChitraPathak OCR & Indic NER extracting 24 structured fields per packet...');
    }, 2400);

    setTimeout(() => {
      setProgress(90);
      setCurrentActionText('Step 4/5: Cross-checking extracted entities with State Land Records API & GIS...');
    }, 3600);

    setTimeout(() => {
      setProgress(100);
      setCurrentActionText('Step 5/5: Generating immutable Application Dossiers with field confidence scores.');
      bulkIngestApplications(SAMPLE_BATCH_PACKETS);
      setStep('COMPLETE');
      toast.success('AI Bulk Ingestion complete! Applications added to queue.');
    }, 4800);
  };

  const modalContent = (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                AI BULK DOCUMENT INGESTION
              </h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                Zero Manual Typing
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload batch deed bundles. AI automatically classifies, extracts structured data & builds dossiers.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* State 1: IDLE / Upload Area */}
        {step === 'IDLE' && (
          <div className="space-y-4">
            {/* Drag & Drop Canvas */}
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-3xl p-8 bg-slate-950/60 text-center space-y-3 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Drag & drop batch mutation dossiers or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF (multi-page), TIFF, JPEG, PNG • Up to 50 documents per batch
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                  ✓ Sale Deeds
                </span>
                <span className="text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                  ✓ RoR / 1-B Extracts
                </span>
                <span className="text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                  ✓ Cadastral Maps
                </span>
                <span className="text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                  ✓ Masked Aadhaar E-KYC
                </span>
              </div>
            </div>

            {/* Pipeline Preview Banner */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Automated Exception-Review Pipeline:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800/80">
                  <span className="text-amber-400 font-bold block">1. Auto-Classify</span>
                  Deeds, passbooks, and identity types recognized automatically.
                </div>
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800/80">
                  <span className="text-emerald-400 font-bold block">2. Field Extraction</span>
                  Names, survey numbers, extents extracted with confidence scores.
                </div>
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800/80">
                  <span className="text-blue-400 font-bold block">3. Exception Flagging</span>
                  DEO only reviews mismatches and clicks forward.
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Loaded standard demo batch: <strong className="text-white">25 Land Mutation Files</strong>
              </span>
              <button
                type="button"
                onClick={handleStartProcessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-amber-600/25 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process Batch with AI</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: PROCESSING / Animated Pipeline */}
        {step === 'PROCESSING' && (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">AI Engine Processing Document Stream</h4>
              <p className="text-xs text-amber-400 font-mono font-medium">{currentActionText}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Progress: {progress}%</span>
                <span>25 / 25 Documents</span>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Uploaded</span>
                <span className="text-lg font-mono font-bold text-white">25</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Classified</span>
                <span className="text-lg font-mono font-bold text-blue-400">25</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Extracted</span>
                <span className="text-lg font-mono font-bold text-emerald-400">23</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Attention</span>
                <span className="text-lg font-mono font-bold text-amber-400">2</span>
              </div>
            </div>
          </div>
        )}

        {/* State 3: COMPLETE / Summary Results */}
        {step === 'COMPLETE' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-400">
                  BULK PROCESSING COMPLETE — 25 Applications Processed
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  All structured fields extracted, validated against state registers, and application dossiers created.
                </p>
              </div>
            </div>

            {/* Result Cards Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">15 Ready to Forward</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-white">15</p>
                <p className="text-[11px] text-slate-400">Low Risk (75–100) • 0 Mismatches</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">7 Need Attention</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-white">7</p>
                <p className="text-[11px] text-slate-400">Medium Risk (50–74) • Name/Date Variances</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400">3 Missing Documents</span>
                  <FileText className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-white">3</p>
                <p className="text-[11px] text-slate-400">High Risk (&lt;50) • Missing Proofs</p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition-all"
              >
                View Ready to Forward
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition-all"
              >
                View Missing Documents
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-amber-600/25 transition-all hover:scale-105"
              >
                <span>Review Attention Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );

  if (isInline) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {modalContent}
    </div>
  );
};
