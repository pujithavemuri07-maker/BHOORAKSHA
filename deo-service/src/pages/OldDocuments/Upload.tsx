import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  ChevronLeft,
  FileText,
  X,
  Eye,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useOldDocumentsStore } from '../../store/oldDocumentsStore';
import toast from 'react-hot-toast';

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: 'ready' | 'uploading';
  previewUrl: string;
}

export default function OldDocumentUpload() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addDocument } = useOldDocumentsStore();

  // Form State
  const [docType, setDocType] = useState('Register');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [taluk, setTaluk] = useState('Bengaluru North');
  const [village, setVillage] = useState('Yelahanka');
  const [yearFrom, setYearFrom] = useState(1970);
  const [yearTo, setYearTo] = useState(1975);

  // Options State
  const [autoDetectScript, setAutoDetectScript] = useState(true);
  const [autoRunAi, setAutoRunAi] = useState(true);
  const [notifyOwner, setNotifyOwner] = useState(true);

  // Files State
  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      id: 'f1',
      name: 'page_001.jpg',
      size: '4.2 MB',
      progress: 100,
      status: 'ready',
      previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'f2',
      name: 'page_002.jpg',
      size: '3.8 MB',
      progress: 100,
      status: 'ready',
      previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'f3',
      name: 'page_003.jpg',
      size: '4.5 MB',
      progress: 65,
      status: 'uploading',
      previewUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(Array.from(e.target.files));
    }
  };

  const handleFilesAdded = (rawFiles: File[]) => {
    const newItems: UploadedFileItem[] = rawFiles.map((f, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 100,
      status: 'ready',
      previewUrl: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...newItems]);
    toast.success(`${rawFiles.length} pages queued for scanning`);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please upload at least one scanned page.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const docId = addDocument({
        documentType: docType,
        state,
        district,
        taluk,
        village,
        yearFrom,
        yearTo,
        totalPages: files.length,
      });

      setIsSubmitting(false);
      toast.success(`Archival dossier ${docId} created! Starting HTR pipeline.`);
      navigate(`/deo/old-documents/processing/${docId}`);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back Link */}
      <Link
        to="/deo/old-documents"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{t('Back to Old Documents', '← Back to Old Documents')}</span>
      </Link>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {t('oldDocuments.uploadTitle', 'Upload Old Archival Document')}
            </h1>
            <p className="text-xs text-slate-400">
              Digitize handwritten cadastral volumes, registers, pattadar passbooks, and legacy deeds
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Layers className="w-4 h-4" />
            <span>Document Details & Provenance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doc Type */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Register">Register (Khasra / Pahani / Chitta)</option>
                <option value="Old Sale Deed">Old Sale Deed (Kraya Patram)</option>
                <option value="Pattadar Book">Pattadar Passbook / Rythu Seva</option>
                <option value="Jamabandi">Jamabandi Settlement Record</option>
                <option value="Mutation Register">Mutation Register (Fard / Dakhil Kharij)</option>
                <option value="Encumbrance Book">Encumbrance Book (Nilve / Villangam)</option>
                <option value="Settlement Record">Inam / Settlement Cadastre Record</option>
                <option value="Other">Other Archival Manuscript</option>
              </select>
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">State Revenue Jurisdiction</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Karnataka">Karnataka (Bhoomi Integration)</option>
                <option value="Telangana">Telangana (Dharani Integration)</option>
                <option value="Andhra Pradesh">Andhra Pradesh (Meebhoomi)</option>
                <option value="Maharashtra">Maharashtra (Mahabhulekh)</option>
                <option value="Tamil Nadu">Tamil Nadu (Patta / Chitta)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (Bhulekh)</option>
              </select>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Taluk */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Taluk / Tehsil</label>
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Village */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Village / Hobli</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Year Range */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Archival Year Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(parseInt(e.target.value) || 1970)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-mono"
                  placeholder="From"
                />
                <span className="text-slate-500 font-bold">to</span>
                <input
                  type="number"
                  value={yearTo}
                  onChange={(e) => setYearTo(parseInt(e.target.value) || 1975)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none font-mono"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Drop Zone Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Archival Scanned Images</span>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl p-8 text-center bg-slate-950/60 transition-all cursor-pointer group"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              multiple
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">
              {t('oldDocuments.dropzoneTitle', 'Drop scanned images here, or click to browse')}
            </p>
            <p className="text-slate-400 mt-1">
              Supported: JPG, PNG, PDF (scanned pages) · Max 50MB per file · Max 100 files per upload
            </p>
            <span className="inline-block mt-2 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              Recommended: 300 DPI · Color or grayscale
            </span>
          </div>

          {/* Uploaded files list */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Uploaded Pages ({files.length}):
            </span>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold text-white block">{file.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {file.size} {file.progress < 100 ? `· ${file.progress}%` : '· Ready'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.progress === 100 ? (
                      <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${file.progress}%` }} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Options Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-4 h-4" />
            <span>AI Processing & Notification Options</span>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDetectScript}
                onChange={(e) => setAutoDetectScript(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20"
              />
              <span className="text-slate-200">
                {t('oldDocuments.autoDetectScript', 'Auto-detect script and language (all 18 Indic languages supported)')}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRunAi}
                onChange={(e) => setAutoRunAi(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20"
              />
              <span className="text-slate-200">
                {t('oldDocuments.runAIAgents', 'Run AI agents automatically after upload (Sauvola preprocessor + HTR)')}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOwner}
                onChange={(e) => setNotifyOwner(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500/20"
              />
              <span className="text-slate-200">
                {t('oldDocuments.notifyOwnerMismatch', 'Notify current land owner if ownership chain changes')}
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/deo/old-documents"
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || files.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSubmitting ? 'Uploading...' : t('oldDocuments.uploadAndProcess', 'Upload & Start Processing')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
