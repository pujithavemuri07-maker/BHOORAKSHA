import React, { useState } from 'react';
import { DocumentUploader } from '../../components/DocumentUploader';
import { QualityCheckStatus } from './QualityCheckStatus';
import { ProcessingComplete } from './ProcessingComplete';
import { useUploadDocument } from '../../hooks/useUpload';
import { MapPin, FileCheck, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../../i18n';

export const UploadWizard: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'upload' | 'quality_check' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [surveyNo, setSurveyNo] = useState('142/P');
  const [district, setDistrict] = useState('Ranga Reddy');
  const [village, setVillage] = useState('Gachibowli');
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const { mutate: upload, isPending } = useUploadDocument();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleStartQualityCheck = () => {
    if (!selectedFile) {
      toast.error(t('Please select a land document file first.'));
      return;
    }
    setStep('quality_check');
  };

  const handleQualityPassed = () => {
    if (!selectedFile) return;

    upload(
      {
        file: selectedFile,
        propertyMeta: {
          surveyNumber: surveyNo,
          district: district,
          village: village,
        },
      },
      {
        onSuccess: (res) => {
          setApplicationId(res.applicationId);
          setStep('complete');
          toast.success(t('Document passed AI checks & application created!'));
        },
        onError: () => {
          toast.error(t('Failed to submit application. Please try again.'));
          setStep('upload');
        },
      }
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* 3 Step Wizard Progress Bar */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 'upload'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                : 'bg-emerald-500 text-white'
            }`}
          >
            1
          </div>
          <span className="text-[11px] font-semibold text-slate-300">{t('1. Select Document')}</span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 'quality_check'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 animate-pulse'
                : step === 'complete'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            2
          </div>
          <span className="text-[11px] font-semibold text-slate-300">{t('2. Quality Check')}</span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 'complete'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
          >
            3
          </div>
          <span className="text-[11px] font-semibold text-slate-300">{t('3. Verification ID')}</span>
        </div>
      </div>

      {/* Step 1: Upload & Property Details */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('Survey / Hissa Number')}</span>
              </label>
              <input
                type="text"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder="e.g. 118/A"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('District')}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ranga Reddy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Village / Locality')}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Gachibowli"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <DocumentUploader onFileSelect={handleFileSelect} isLoading={isPending} />

          {selectedFile && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleStartQualityCheck}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
              >
                {t('Proceed to AI Quality Validation →')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: AI Quality Check */}
      {step === 'quality_check' && (
        <QualityCheckStatus
          file={selectedFile}
          onPassed={handleQualityPassed}
          onRetry={() => setStep('upload')}
        />
      )}

      {/* Step 3: Complete */}
      {step === 'complete' && applicationId && (
        <ProcessingComplete applicationId={applicationId} />
      )}
    </div>
  );
};
