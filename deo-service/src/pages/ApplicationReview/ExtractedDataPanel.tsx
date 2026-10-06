import React, { useState } from 'react';
import { ExtractedData } from '../../api/types';
import {
  MapPin,
  UserCheck,
  Compass,
  FileCheck,
  Info,
  X,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Check,
  Save,
  Send,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FieldEditModal } from '../../components/FieldEditModal';
import { useDEOStore } from '../../store/deoStore';
import toast from 'react-hot-toast';

interface ExtractedDataPanelProps {
  data: ExtractedData;
  applicationId?: string;
  onForward?: () => void;
  onSaveCorrections?: () => void;
  onViewSource?: (docType: string, page: number, fieldKey?: string) => void;
}

interface FieldProvenanceModalData {
  field: string;
  value: string;
  source: string;
  page: string;
  confidence: number;
  status: string;
  rawOcrSnippet: string;
}

export const ExtractedDataPanel: React.FC<ExtractedDataPanelProps> = ({
  data,
  applicationId = 'DEO-2026-401',
  onForward,
  onSaveCorrections,
  onViewSource,
}) => {
  const [provenanceModal, setProvenanceModal] = useState<FieldProvenanceModalData | null>(null);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const correctField = useDEOStore((state) => state.correctField);
  const saveCorrections = useDEOStore((state) => state.saveCorrections);

  // Field Edit Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    section: 'propertyDetails' | 'ownerDetails' | 'landDetails' | 'documentDetails';
    fieldKey: string;
    fieldLabel: string;
    currentValue: any;
    sourceDoc: string;
  } | null>(null);

  const getConfidenceBadge = (confidence: number = 95, isAutoVerified: boolean = false, isCorrected: boolean = false) => {
    if (isCorrected) {
      return (
        <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Edit3 className="w-3 h-3" />
          <span>DEO Corrected</span>
        </span>
      );
    }
    if (isAutoVerified || confidence >= 90) {
      return (
        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>{confidence}% Match</span>
        </span>
      );
    } else if (confidence >= 70) {
      return (
        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{confidence}% Needs Review</span>
        </span>
      );
    } else {
      return (
        <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{confidence}% Low Confidence</span>
        </span>
      );
    }
  };

  const handleTriggerViewSource = (docType: string, page: number, fieldKey?: string) => {
    if (onViewSource) {
      onViewSource(docType, page, fieldKey);
    } else {
      toast.success(`Source: ${docType} (Page ${page})`, { icon: '📄' });
    }
  };

  const openEdit = (
    section: 'propertyDetails' | 'ownerDetails' | 'landDetails' | 'documentDetails',
    fieldKey: string,
    fieldLabel: string,
    currentValue: any,
    sourceDoc: string = 'Registered Sale Deed #SD-2025-045, Page 1'
  ) => {
    setEditModal({
      isOpen: true,
      section,
      fieldKey,
      fieldLabel,
      currentValue,
      sourceDoc,
    });
  };

  const handleQuickAcceptOwnerName = (verifiedName: string) => {
    correctField(
      applicationId,
      'ownerDetails',
      'name',
      verifiedName,
      'Corrected according to registered deed & identity proof',
      'Registered Sale Deed #SD-2025-045 & UIDAI E-KYC'
    );
    toast.success(`Owner Name updated to "${verifiedName}". Audit logged.`);
  };

  const handleSaveAll = () => {
    if (onSaveCorrections) {
      onSaveCorrections();
    } else {
      saveCorrections(applicationId, 'DEO saved verified field changes.');
      toast.success('Changes saved successfully to application database.');
    }
  };

  const openProvenance = (field: string, value: string, page: string, confidence: number, raw: string) => {
    setProvenanceModal({
      field,
      value: String(value),
      source: 'Registered Sale Deed #SD-2025-045',
      page,
      confidence,
      status: confidence >= 90 ? 'High Confidence (AI Verified)' : 'Medium Confidence (Requires Review)',
      rawOcrSnippet: raw,
    });
  };

  const propertyMeta = data.propertyDetails?.meta || {};
  const ownerMeta = data.ownerDetails?.meta || {};
  const landMeta = data.landDetails?.meta || {};
  const docMeta = data.documentDetails?.meta || {};

  // Check if owner name has a document-proof mismatch
  const currentOwnerName = data.ownerDetails?.name || '';
  const isOwnerMismatch = currentOwnerName === 'Ramesh Kumar' && !ownerMeta.name?.isCorrected;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              EDITABLE DEO DATA ENTRY FORM (AI PRE-FILLED)
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              Auto-Populated by AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            All fields are pre-filled by AI. Compare with source documents on the left. Edit only exceptions before saving & forwarding.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">OCR Engine:</span>
          <span className="bg-slate-800 text-amber-400 font-mono text-[11px] px-2.5 py-1 rounded-lg border border-slate-700">
            ChitraPathak Indic OCR + MuRIL-v2.1
          </span>
        </div>
      </div>

      {/* DOCUMENT-PROOF VERIFICATION / DISCREPANCY RESOLUTION CARD */}
      {isOwnerMismatch && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Document-Proof Verification (AI Detected Discrepancy)</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
              STATUS: MISMATCH
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">AI Extracted Value</span>
              <p className="text-rose-400 font-mono font-bold">{currentOwnerName}</p>
              <span className="text-[10px] text-slate-400">Confidence: 88%</span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Registered Deed</span>
              <p className="text-white font-mono font-bold">Ramesh Kumar Patel</p>
              <span className="text-[10px] text-emerald-400">Deed Header & Schedule</span>
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Identity Proof (Aadhaar)</span>
              <p className="text-white font-mono font-bold">Ramesh Kumar Patel</p>
              <span className="text-[10px] text-emerald-400">UIDAI Verified</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-300">
              DEO Action: Confirm authorized deed value or edit manually:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickAcceptOwnerName('Ramesh Kumar Patel')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm "Ramesh Kumar Patel"</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  openEdit(
                    'ownerDetails',
                    'name',
                    'Owner Legal Name',
                    currentOwnerName,
                    'Registered Sale Deed #SD-2025-045, Page 1'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit / Custom</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sensitive Data Privacy Notice */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Privacy Protection Active:</strong> Citizen identity numbers are masked according to statutory data standards.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          UIDAI E-KYC Token: 36-UID-***-8821
        </span>
      </div>

      {/* Extracted Fields 4 Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Cadastral & Property Location */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <MapPin className="w-4 h-4" />
              <span>1. Cadastral & Property Location</span>
            </div>
            {getConfidenceBadge(99, true, propertyMeta.surveyNumber?.isCorrected)}
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* Survey Number */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60 group">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Survey / Hissa No *</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 3, 'surveyNumber')}
                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded font-bold border border-amber-500/20"
                    title="View Source in Document Viewer (Sale Deed Page 3)"
                  >
                    <span>View Source</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openProvenance(
                        'Survey Number',
                        data.propertyDetails.surveyNumber,
                        'Page 3, Line 14',
                        99,
                        'SURVEY NO. 123/456 (SUB-DIVISION P-1)'
                      )
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                    title="Provenance"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(
                        'propertyDetails',
                        'surveyNumber',
                        'Survey / Hissa Number',
                        data.propertyDetails.surveyNumber,
                        'Registered Sale Deed #SD-2025-045, Page 3'
                      )
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                    title="Correct Survey Number"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {data.propertyDetails.surveyNumber}
                </span>
                {getConfidenceBadge(
                  propertyMeta.surveyNumber?.confidence || 99,
                  propertyMeta.surveyNumber?.isAutoVerified,
                  propertyMeta.surveyNumber?.isCorrected
                )}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed, Page 3
              </span>
            </div>

            {/* ULPIN */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">ULPIN Code:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 3, 'surveyNumber')}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit('propertyDetails', 'ulpin', 'ULPIN Code', data.propertyDetails.ulpin || '36-RR-SER-123-01', 'Sale Deed & Dharani Spatial Link')
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="text-slate-200 font-mono text-[11px] block truncate font-bold">
                {data.propertyDetails.ulpin || '36-RR-SER-123-01'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Spatial Link, Page 1
              </span>
            </div>

            {/* State & District */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">State & District:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 1)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit('propertyDetails', 'district', 'District', data.propertyDetails.district, 'Registered Sale Deed #SD-2025-045, Page 1')
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="text-slate-200 font-medium block">
                {data.propertyDetails.district}, {data.propertyDetails.state}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed, Page 1
              </span>
            </div>

            {/* Mandal & Village */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Mandal & Village:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 1)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit('propertyDetails', 'village', 'Village', data.propertyDetails.village, 'Registered Sale Deed #SD-2025-045, Page 1')
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="text-slate-200 font-medium block">
                {data.propertyDetails.village}, {data.propertyDetails.taluk}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed, Page 1
              </span>
            </div>
          </div>
        </div>

        {/* 2. Ownership & Pattadar Particulars */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <UserCheck className="w-4 h-4" />
              <span>2. Ownership & Pattadar Particulars</span>
            </div>
            {getConfidenceBadge(ownerMeta.name?.confidence || 88, false, ownerMeta.name?.isCorrected)}
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* Owner Name */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Owner / Claimant Name *</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 1, 'ownerName')}
                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded font-bold border border-amber-500/20"
                    title="View Source in Sale Deed Page 1"
                  >
                    <span>View Source</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Identity Proof (Masked)', 1, 'ownerName')}
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20"
                    title="View Aadhaar Proof (UIDAI)"
                  >
                    <span>Aadhaar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(
                        'ownerDetails',
                        'name',
                        'Owner Legal Name',
                        data.ownerDetails.name,
                        'Registered Sale Deed #SD-2025-045 & UIDAI E-KYC'
                      )
                    }
                    className="text-amber-400 hover:text-amber-300 p-0.5"
                    title="Correct Owner Name"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xs">{data.ownerDetails.name}</span>
                {getConfidenceBadge(
                  ownerMeta.name?.confidence || 88,
                  false,
                  ownerMeta.name?.isCorrected
                )}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed, Page 1 • Aadhaar Proof, Page 1
              </span>
            </div>

            {/* Father / Spouse */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Father / Spouse:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 1, 'ownerName')}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(
                        'ownerDetails',
                        'fatherOrSpouse',
                        'Father / Spouse Name',
                        data.ownerDetails.fatherOrSpouse || 'Late Shankar Patel',
                        'Registered Sale Deed #SD-2025-045, Page 1'
                      )
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="text-slate-200 block truncate font-medium">
                {data.ownerDetails.fatherOrSpouse || 'Late Shankar Patel'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed, Page 1
              </span>
            </div>

            {/* Ownership Share */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Ownership Share:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 2)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit('ownerDetails', 'share', 'Ownership Share', data.ownerDetails.share || '100% Sole Ownership', 'Registered Sale Deed #SD-2025-045, Page 2')
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="text-slate-200 font-medium block">
                {data.ownerDetails.share || '100% Sole Ownership'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed Schedule, Page 2
              </span>
            </div>

            {/* Previous Owner / Vendor */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Previous Title Holder:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 1, 'ownerName')}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit('ownerDetails', 'previousOwner', 'Previous Title Holder', data.ownerDetails.previousOwner || 'Suresh V. Rao', 'Registered Sale Deed Vendor Clause, Page 1')
                    }
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span className="text-slate-200 font-medium block truncate">
                {data.ownerDetails.previousOwner || 'Suresh V. Rao'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed Header, Page 1
              </span>
            </div>
          </div>
        </div>

        {/* 3. Land Extent & Schedule Boundaries */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Compass className="w-4 h-4" />
              <span>3. Land Extent & Schedule Boundaries</span>
            </div>
            {getConfidenceBadge(98, true, landMeta.area?.isCorrected)}
          </div>

          <div className="text-xs space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Total Area Extent *</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTriggerViewSource('Registered Sale Deed', 3, 'surveyNumber')}
                      className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                    >
                      View Source
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openEdit('landDetails', 'area', 'Land Area Extent', data.landDetails.area, 'Sale Deed Schedule, Page 3')
                      }
                      className="text-slate-400 hover:text-amber-400 p-0.5"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className="font-mono font-bold text-white text-sm block">
                  {data.landDetails.area} {data.landDetails.unit}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Source: Sale Deed Page 3 • RoR 1-B Page 1
                </span>
              </div>

              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Classification & Usage:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTriggerViewSource('RoR / Pattadar Record (1-B)', 1)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                    >
                      View Source
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openEdit('landDetails', 'landType', 'Land Type', data.landDetails.landType, 'RoR 1-B Record Extract, Page 1')
                      }
                      className="text-slate-400 hover:text-amber-400 p-0.5"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <span className="text-slate-200 font-medium block truncate">
                  {data.landDetails.landType} ({data.landDetails.usage || 'Development'})
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Source: Form 1-B Extract, Page 1
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Schedule Boundaries (N/S/E/W):</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Cadastral Map (FMB)', 1, 'boundaries')}
                    className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded font-bold border border-amber-500/20"
                  >
                    <span>View FMB Map</span>
                  </button>
                  {getConfidenceBadge(91, true)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 font-mono bg-slate-900/40 p-2 rounded-xl border border-slate-800/60">
                <p>N: {data.landDetails.boundaries?.north || 'Survey 122 Road'}</p>
                <p>S: {data.landDetails.boundaries?.south || 'Survey 124 Canal'}</p>
                <p>E: {data.landDetails.boundaries?.east || 'Minor Irrigation Nala'}</p>
                <p>W: {data.landDetails.boundaries?.west || 'Survey 121 Private Farm'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Registered Instrument & Stamp Particulars */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <FileCheck className="w-4 h-4" />
              <span>4. Registered Instrument & Stamp Particulars</span>
            </div>
            {getConfidenceBadge(docMeta.registrationDate?.confidence || 68, false, docMeta.registrationDate?.isCorrected)}
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {/* Deed Number */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Deed / Document No *</span>
                <button
                  type="button"
                  onClick={() => handleTriggerViewSource('Registered Sale Deed', 1)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                >
                  View Source
                </button>
              </div>
              <span className="text-slate-200 font-mono font-bold block">{data.documentDetails.number}</span>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed Stamp, Page 1
              </span>
            </div>

            {/* Registration Number */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">SRO Registration Number:</span>
                <button
                  type="button"
                  onClick={() => handleTriggerViewSource('Registered Sale Deed', 4, 'registrationNumber')}
                  className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                >
                  View Source
                </button>
              </div>
              <span className="text-slate-200 font-mono font-bold block">{data.documentDetails.registrationNumber || 'REG-2025-789'}</span>
              <span className="text-[10px] text-slate-400 block">
                Source: SRO Book 1 Seal, Page 4
              </span>
            </div>

            {/* Registration Date */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Registration Date:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTriggerViewSource('Registered Sale Deed', 1, 'registrationDate')}
                    className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                  >
                    View Source
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openProvenance(
                        'Registration Date',
                        data.documentDetails.registrationDate || '20 Dec 2025',
                        'Page 1 Header',
                        docMeta.registrationDate?.confidence || 68,
                        'EXECUTED AND SIGNED THIS 20TH DAY OF DECEMBER 2025'
                      )
                    }
                    className="text-slate-400 hover:text-amber-400"
                    title="Provenance"
                  >
                    <Info className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(
                        'documentDetails',
                        'registrationDate',
                        'Registration Date',
                        data.documentDetails.registrationDate || '2025-12-20',
                        'Registered Sale Deed #SD-2025-045, Page 1'
                      )
                    }
                    className="text-amber-400 hover:text-amber-300 p-0.5"
                    title="Correct Date"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white font-mono font-bold">
                  {data.documentDetails.registrationDate || '20 Dec 2025'}
                </span>
                {getConfidenceBadge(
                  docMeta.registrationDate?.confidence || 68,
                  false,
                  docMeta.registrationDate?.isCorrected
                )}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Source: Sale Deed Header, Page 1
              </span>
            </div>

            {/* Issuing Authority / SRO */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
              <span className="text-slate-500 text-[11px] block">Sub-Registrar Office:</span>
              <span className="text-slate-200 text-[11px] truncate block font-medium">
                {data.documentDetails.issuingAuthority || 'Sub-Registrar Office, Serilingampally'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: SRO Rubber Stamp, Page 1
              </span>
            </div>

            {/* Mutation Reference */}
            <div className="space-y-1.5 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60 col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Previous Mutation Proceeding Number:</span>
                <button
                  type="button"
                  onClick={() => handleTriggerViewSource('Prior Mutation Order', 1, 'mutationNumber')}
                  className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold"
                >
                  View Source (Mutation Order)
                </button>
              </div>
              <span className="text-amber-400 font-mono text-[11px] block font-bold">
                {data.documentDetails.mutationNumber || 'MUT-2026-0091'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Source: Tahsildar Mutation Proceedings MUT-2022-8110, Page 1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct In-Panel Action Bar: [Save Changes]  [Save & Proceed to Review / Forward to Verifier] */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>DEO edits update the active verified dossier and log to immutable audit ledger.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Changes</span>
          </button>

          {onForward && (
            <button
              type="button"
              onClick={onForward}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Forward to Verifier</span>
            </button>
          )}
        </div>
      </div>

      {/* Field Provenance Modal */}
      {provenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Field Provenance Dossier</h3>
              </div>
              <button
                type="button"
                onClick={() => setProvenanceModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Field & Extracted Value</span>
                <p className="text-white font-mono font-bold text-sm">
                  {provenanceModal.field}: {provenanceModal.value}
                </p>
                <span className="text-[11px] text-emerald-400 font-medium block pt-0.5">
                  {provenanceModal.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Source Document</span>
                  <span className="text-slate-200 text-[11px]">{provenanceModal.source}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Page / Line</span>
                  <span className="text-amber-400 font-mono text-[11px]">{provenanceModal.page}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Raw OCR Bounding Box String</span>
                <p className="font-mono text-slate-300 text-[11px] bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  "{provenanceModal.rawOcrSnippet}"
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setProvenanceModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Provenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Edit Modal */}
      {editModal && (
        <FieldEditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal(null)}
          applicationId={applicationId}
          section={editModal.section}
          fieldKey={editModal.fieldKey}
          fieldLabel={editModal.fieldLabel}
          currentValue={editModal.currentValue}
          sourceDoc={editModal.sourceDoc}
        />
      )}
    </div>
  );
};
