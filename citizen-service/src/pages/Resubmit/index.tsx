import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationDetail } from '../../hooks/useApplicationDetail';
import { useResubmit } from '../../hooks/useResubmit';
import { DocumentUploader } from '../../components/DocumentUploader';
import { ArrowLeft, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '../../i18n';

export const ResubmitPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application } = useApplicationDetail(id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState('Re-scanned Schedule B with 300 DPI flatbed scanner');

  const { mutate: resubmit, isPending } = useResubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !id) {
      toast.error(t('Please select the corrected document file.'));
      return;
    }

    resubmit(
      {
        id,
        file: selectedFile,
        remarks,
      },
      {
        onSuccess: () => {
          toast.success(t('Document resubmitted! AI pipeline restarted.'));
          navigate(`/citizen/applications/${id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/citizen/applications/${id}`)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t('Resubmit Corrected Land Document')}
          </h1>
          <p className="text-xs text-slate-400">
            {t('Resolve discrepancy for Application')} <strong className="text-emerald-400 font-mono">{id}</strong>
          </p>
        </div>
      </div>

      {/* Discrepancy reason box */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{t('Officer Discrepancy Note')}</span>
        </div>
        <p className="text-xs text-amber-200">
          {application?.riskFactors[0]
            ? t(application.riskFactors[0])
            : t('Schedule B scan was flagged with low optical contrast (<70%). Please provide a clean, 300 DPI scan.')}
        </p>
      </div>

      {/* Resubmit form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2">
            {t('Upload Corrected High-Resolution Scan')}
          </label>
          <DocumentUploader onFileSelect={setSelectedFile} isLoading={isPending} />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">
            {t('Citizen Explanation / Remarks to Revenue Officer')}
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-emerald-500"
            placeholder={t('Explain the corrections made in this upload...')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/citizen/applications/${id}`)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            {t('Cancel')}
          </button>
          <button
            type="submit"
            disabled={!selectedFile || isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
            <span>{isPending ? t('Uploading...') : t('Resubmit & Restart Verification')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default ResubmitPage;
