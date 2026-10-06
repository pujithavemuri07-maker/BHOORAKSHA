import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Check,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  FileCheck,
  Send,
  Save,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useOldDocumentsStore } from '../../store/oldDocumentsStore';
import toast from 'react-hot-toast';

export default function OldDocumentVerify() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getDocument, updateField, verifyDocument } = useOldDocumentsStore();

  const doc = getDocument(id || 'OLD-000123') || {
    id: id || 'OLD-000123',
    documentType: 'Register',
    village: 'Yelahanka',
    overallConfidence: 72,
    extractedFields: {
      surveyNumber: '123/456',
      ownerName: 'Shankar (S/o Ramu)',
      extentArea: '2.50 Acres',
      registrationDate: '1975-01-15',
      village: 'Yelahanka',
      landType: 'Dry Agricultural (Khushki)',
    },
    fieldConfidences: {
      surveyNumber: 88,
      ownerName: 72,
      extentArea: 94,
      registrationDate: 85,
      village: 96,
      landType: 91,
    },
    deoNotes: '',
  };

  // Viewer controls state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Field edit states
  const [fields, setFields] = useState<Record<string, string>>({
    surveyNumber: doc.extractedFields?.surveyNumber || '123/456',
    ownerName: doc.extractedFields?.ownerName || 'Shankar (S/o Ramu)',
    extentArea: doc.extractedFields?.extentArea || '2.50 Acres',
    registrationDate: doc.extractedFields?.registrationDate || '1975-01-15',
    landType: doc.extractedFields?.landType || 'Dry Agricultural (Khushki)',
    village: doc.extractedFields?.village || 'Yelahanka',
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [notes, setNotes] = useState(doc.deoNotes || '');

  const handleFieldChange = (key: string, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    updateField(doc.id, key, val);
  };

  const handleSaveAndNext = () => {
    verifyDocument(doc.id, notes);
    toast.success('Fields saved! Redirecting to Issue Detection & Risk Scoring.');
    navigate(`/deo/old-documents/issues/${doc.id}`);
  };

  const handleAcceptAll = () => {
    verifyDocument(doc.id, notes);
    toast.success('All archival fields accepted! Proceeding to AI Issue Analysis.');
    navigate(`/deo/old-documents/issues/${doc.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/deo/old-documents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('Back to Old Documents', '← Back to Old Documents')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            HTR Confidence: <strong className="text-amber-400 font-mono text-sm">{doc.overallConfidence}%</strong>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Script: Kannada Old Hand
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🔍 Verify {doc.id}</span>
            <span className="text-xs font-normal text-slate-400">({doc.documentType} - {doc.village})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Examine scanned register page against AI transcription. Click fields with low confidence to manually correct.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/deo/old-documents/issues/${doc.id}`}
            className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5"
          >
            <span>View Issues ({doc.issues?.length || 3})</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>

      {/* Side by Side Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Original Scan Viewer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {t('oldDocuments.originalScan', 'ORIGINAL SCAN')}
            </span>
            {/* Viewer Controls */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-mono font-bold"
                title="Reset"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Scanned Image Canvas with Simulated Low-Confidence Bounding Boxes */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative flex items-center justify-center">
            <div
              className="w-full h-full transition-transform duration-200 flex items-center justify-center relative select-none"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80"
                alt="Original archival manuscript"
                className="w-full h-full object-cover filter sepia brightness-90 contrast-125"
              />

              {/* Bounding Box 1: Owner Name (Low Confidence Alert) */}
              <div
                className="absolute border-2 border-amber-400/80 bg-amber-500/20 rounded cursor-pointer animate-pulse"
                style={{ top: '38%', left: '26%', width: '38%', height: '12%' }}
                title="Low Confidence: Owner Name (72%)"
                onClick={() => setEditingField('ownerName')}
              >
                <span className="absolute -top-5 left-0 bg-amber-500 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                  ⚠️ Owner: 72%
                </span>
              </div>

              {/* Bounding Box 2: Survey Number */}
              <div
                className="absolute border-2 border-blue-400/80 bg-blue-500/20 rounded cursor-pointer"
                style={{ top: '22%', left: '15%', width: '22%', height: '10%' }}
                title="Survey Number: 88%"
                onClick={() => setEditingField('surveyNumber')}
              >
                <span className="absolute -top-5 left-0 bg-blue-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  Sy. No: 88%
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2">
            <span>Register Volume 4 · Folio Page 12 · 1975 Record Room</span>
            <span className="font-mono text-slate-500">Scale: {Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Right: Extracted Fields & Verification Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t('oldDocuments.extractedData', 'EXTRACTED DATA')}
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                3 fields need attention
              </span>
            </div>

            {/* Editable Fields */}
            <div className="space-y-3 text-xs">
              {/* Survey No */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Survey Number</span>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">88% HTR</span>
                </div>
                {editingField === 'surveyNumber' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fields.surveyNumber}
                      onChange={(e) => handleFieldChange('surveyNumber', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-amber-500 rounded-xl text-white font-mono font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingField(null)}
                      className="p-1.5 bg-emerald-500 text-white rounded-xl"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-white text-sm">{fields.surveyNumber}</span>
                    <button
                      type="button"
                      onClick={() => setEditingField('surveyNumber')}
                      className="text-[11px] text-amber-400 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Owner Name */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Owner Name (Flagged)</span>
                  <span className="font-mono text-[10px] text-rose-400 font-bold">72% HTR (Low)</span>
                </div>
                {editingField === 'ownerName' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fields.ownerName}
                      onChange={(e) => handleFieldChange('ownerName', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-amber-500 rounded-xl text-white font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingField(null)}
                      className="p-1.5 bg-emerald-500 text-white rounded-xl"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{fields.ownerName}</span>
                    <button
                      type="button"
                      onClick={() => setEditingField('ownerName')}
                      className="text-[11px] text-amber-400 font-bold flex items-center gap-1 hover:underline"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Extent / Area */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Extent / Area</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">94% HTR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{fields.extentArea}</span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Registration Date */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Registration Date</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">85% HTR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-sm">{fields.registrationDate}</span>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>

            {/* DEO Officer Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                DEO Officer Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter field notes, ink legibility observations, or reason for correction..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <Link
              to="/deo/old-documents"
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              Cancel
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>Save & Next</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-lg shadow-amber-600/30 hover:scale-105"
              >
                <span>Accept All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
