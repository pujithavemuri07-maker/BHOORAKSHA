import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { DocumentType } from '../types/document';

interface DocumentUploaderProps {
  onFileUpload: (file: File, docType: DocumentType) => void;
  className?: string;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileUpload,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('sale_deed');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      onFileUpload(file, selectedType);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      onFileUpload(file, selectedType);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Document Category:
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DocumentType)}
          className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="sale_deed">Registered Sale Deed (विक्रय विलेख)</option>
          <option value="patta">Patta / RoR / 7/12 Extract (पट्टा / खतौनी)</option>
          <option value="encumbrance_certificate">Encumbrance Certificate (EC)</option>
          <option value="boundary_map">Cadastral Boundary Map (नक्शा)</option>
          <option value="tax_receipt">Property Tax Receipt</option>
        </select>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.tiff"
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {uploadedFileName ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> {uploadedFileName}
              </span>
            ) : (
              'Drag & drop document here, or browse from device'
            )}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Supported formats: PDF, JPG, PNG, TIFF (Max 25 MB)
          </span>
        </label>
      </div>
    </div>
  );
};
