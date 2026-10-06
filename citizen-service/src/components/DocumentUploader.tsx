import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';

interface DocumentUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileSelect,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
  const MAX_SIZE_MB = 15;

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.jpg') && !file.name.endsWith('.png')) {
      setErrorMsg('Invalid file format. Please upload PDF, JPG, PNG, or DOC documents.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File size exceeds maximum limit of ${MAX_SIZE_MB}MB.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & drop dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3',
          dragActive
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <div>
          <p className="text-base font-bold text-slate-800 dark:text-white">
            {t('citizen.upload.dropHere', 'Drop your Registered Sale Deed here, or')}
            <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 underline">
              {t('citizen.upload.browse', 'browse files')}
            </span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('Supports Registered Sale Deeds, Pattadar Passbooks, Encumbrance Certificates (PDF, JPG, PNG up to 15MB)')}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium">
          <span>🔒 {t('256-bit AES Tamper-Proof Encryption')}</span>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{t(errorMsg)}</span>
        </div>
      )}

      {/* Selected file preview pill */}
      {selectedFile && !errorMsg && (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {t('Ready for AI Quality Validation')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
