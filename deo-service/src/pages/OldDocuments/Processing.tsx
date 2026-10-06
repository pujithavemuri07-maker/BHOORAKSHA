import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Cpu,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  Eye,
  FileText,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useOldDocumentsStore } from '../../store/oldDocumentsStore';

export default function OldDocumentProcessing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getDocument } = useOldDocumentsStore();

  const doc = getDocument(id || 'OLD-000123') || {
    id: id || 'OLD-000123',
    documentType: 'Register',
    village: 'Yelahanka',
    yearFrom: 1970,
    yearTo: 1975,
    extractedFields: {
      surveyNumber: '123/456',
      ownerName: 'Shankar (S/o Ramu)',
      extentArea: '2.50 Acres',
    },
  };

  const [progress, setProgress] = useState(65);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || progress >= 100) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 98) {
          clearInterval(interval);
          return 100;
        }
        return p + 4;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, progress]);

  const pipelineSteps = [
    { name: 'Quality Assessment', status: 'done', detail: 'Resolution 300 DPI, contrast 92%' },
    { name: 'Preprocessing (deskew, denoise, Sauvola)', status: 'done', detail: 'Angle: -0.42°, Sauvola binarization complete' },
    { name: 'Layout Analysis (table detection)', status: 'done', detail: '3 table columns, 8 cadastral rows recognized' },
    { name: 'Script Detection', status: 'done', detail: 'Primary: Kannada Old Script (96% purity)' },
    {
      name: 'HTR (Handwritten Text Recognition)',
      status: progress >= 80 ? 'done' : 'running',
      detail: progress >= 80 ? 'Chitrapathak-1 + TrOCR ensemble converged' : `Transcribing cursive strokes (${progress}%)`,
    },
    {
      name: 'Field Extraction & NER',
      status: progress >= 85 ? 'done' : progress >= 75 ? 'running' : 'pending',
      detail: 'Extracting Survey, Owner, Extent, Boundaries',
    },
    {
      name: 'Issue Detection & Modern Cross-Check',
      status: progress >= 95 ? 'done' : progress >= 85 ? 'running' : 'pending',
      detail: 'Comparing with BHOOMI ULPIN registry',
    },
    {
      name: 'Risk Scoring & Routing Heuristics',
      status: progress >= 100 ? 'done' : progress >= 95 ? 'running' : 'pending',
      detail: 'Evaluating historical title chain consistency',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/deo/old-documents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('Back to Old Documents', '← Back to Old Documents')}</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-500">
          Archival Processing Session: #{doc.id}
        </span>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>{doc.id}</span>
                <span className="text-xs font-normal text-slate-400">· {doc.documentType} ({doc.village})</span>
              </h1>
              <p className="text-xs text-amber-400 font-semibold">
                Multilingual AI HTR Pipeline Active · {progress}% Completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <Link
              to={`/deo/old-documents/verify/${doc.id}`}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/30"
            >
              <span>Proceed to Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-amber-500/20"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout: Pipeline Stepper (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stepper */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Agent Execution Sequence</span>
          </h2>

          <div className="space-y-3">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs"
              >
                <div className="mt-0.5">
                  {step.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {step.status === 'running' && <Cpu className="w-4 h-4 text-amber-400 animate-spin" />}
                  {step.status === 'pending' && <Clock className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${step.status === 'running' ? 'text-amber-300 font-mono' : 'text-slate-200'}`}>
                      {step.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      {step.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-amber-400" />
              <span>Live HTR Output Preview</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Original scan preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                  Original Archival Scan
                </span>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 relative group bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80"
                    alt="Original scan"
                    className="w-full h-full object-cover filter sepia brightness-90 contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-amber-300 font-bold">
                      Page 1 / {doc.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                  Extracted Data (Partial)
                </span>
                <div className="aspect-[4/5] rounded-2xl p-4 border border-slate-800 bg-slate-950 text-xs space-y-3 font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase">Survey No</span>
                    <p className="font-bold text-emerald-400 text-sm">
                      {doc.extractedFields?.surveyNumber || '123/456'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase">Owner Name</span>
                    <p className="font-bold text-amber-400 text-xs truncate">
                      {doc.extractedFields?.ownerName || 'Shankar (S/o Ramu)'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase">Area / Extent</span>
                    <p className="font-bold text-slate-200 text-xs">
                      {doc.extractedFields?.extentArea || '2.50 Acres'}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-500 text-center pt-2 animate-pulse">
                    Transcribing subsequent fields...
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Confidence Metric:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">72% (Ready for Review)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
