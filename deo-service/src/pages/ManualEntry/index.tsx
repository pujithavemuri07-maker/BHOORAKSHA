import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useDEOStore } from '../../store/deoStore';
import { ManualEntryForm } from '../../components/ManualEntryForm';
import { DocumentPreview } from '../ApplicationReview/DocumentPreview';
import { BulkUploadModal } from '../../components/BulkUploadModal';
import {
  FileSpreadsheet,
  UploadCloud,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Info,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ManualEntryProps {
  view?: 'hub' | 'bulk' | 'manual';
}

export default function ManualEntry({ view }: ManualEntryProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const applications = useDEOStore((state) => state.applications);

  // Determine active view mode based on route or prop
  const isBulkRoute = location.pathname.endsWith('/bulk-upload') || view === 'bulk';
  const isManualRoute = location.pathname.endsWith('/manual') || location.pathname.includes('/manual-entry/') || !!id || view === 'manual';

  const [internalView, setInternalView] = useState<'hub' | 'bulk' | 'manual'>(
    isBulkRoute ? 'bulk' : isManualRoute ? 'manual' : (view || 'hub')
  );

  const activeView = isBulkRoute ? 'bulk' : isManualRoute ? 'manual' : internalView;

  // Filter fallback candidates or match route param
  const fallbackApps = applications.filter(
    (a) => a.status === 'API_FAILURE_MANUAL_ENTRY' || a.govtApiStatus === 'failed'
  );

  const [selectedAppId, setSelectedAppId] = useState<string>(
    id || fallbackApps[0]?.id || applications[0]?.id || ''
  );

  const selectedApp =
    applications.find((a) => a.id === (id || selectedAppId)) ||
    fallbackApps[0] ||
    applications[0];

  const [activeDocType, setActiveDocType] = useState<string | undefined>(undefined);
  const [activePage, setActivePage] = useState<number | undefined>(undefined);
  const [highlightFieldKey, setHighlightFieldKey] = useState<string | undefined>(undefined);

  const handleViewSource = (docType: string, page: number, fieldKey?: string) => {
    setActiveDocType(docType);
    setActivePage(page);
    setHighlightFieldKey(fieldKey);
    toast.success(`Navigated to ${docType} (Page ${page})`, { id: 'manual-view-source', duration: 2500 });
  };

  const handleSaved = () => {
    toast.success('Manual government record saved & proceeding to review.');
    navigate(`/deo/review/${selectedApp?.id}`);
  };

  // 1. HUB LANDING SELECTION PAGE
  if (activeView === 'hub') {
    return (
      <div className="space-y-6 pb-12 animate-fade-in">
        {/* Hub Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">
                MANUAL DATA ENTRY
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose how you want to create or process a land-record dossier.
              </p>
            </div>
          </div>
        </div>

        {/* 2 Primary Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OPTION 1: BULK UPLOAD */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600/30 to-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
                  AI Automated Pipeline
                </span>
              </div>

              <div>
                <h2 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  Bulk Upload
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Upload multiple land-record document bundles and let AI classify, extract, and build dossiers automatically.
                </p>
              </div>

              {/* Small Feature Labels */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> AI Document Classification
                </span>
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> OCR & Field Extraction
                </span>
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> Confidence Scoring
                </span>
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">✓</span> Exception Review
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setInternalView('bulk');
                navigate('/deo/manual-entry/bulk-upload');
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-2xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 group-hover:shadow-amber-500/30"
            >
              <span>Open Bulk Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* OPTION 2: MANUAL ENTRY */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
                  API Fallback Engine
                </span>
              </div>

              <div>
                <h2 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  Manual Entry
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Review AI-extracted information or enter government record details manually when digital records or APIs are unavailable.
                </p>
              </div>

              {/* Small Feature Labels */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> AI Pre-filled Data
                </span>
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Government Record Fallback
                </span>
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Proof-based Correction
                </span>
                <span className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> DEO Verification
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setInternalView('manual');
                navigate('/deo/manual-entry/manual');
              }}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Open Manual Entry</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. BULK UPLOAD WORKSPACE VIEW
  if (activeView === 'bulk') {
    return (
      <div className="space-y-6 pb-12 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setInternalView('hub');
              navigate('/deo/manual-entry');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Manual Data Entry Hub</span>
          </button>
        </div>

        <BulkUploadModal isInline={true} />
      </div>
    );
  }

  // 3. MANUAL ENTRY WORKSPACE VIEW (FORM)
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Page Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setInternalView('hub');
                navigate('/deo/manual-entry');
              }}
              className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Back to Entry Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-white tracking-tight">
                  MANUAL GOVERNMENT RECORD ENTRY (API FALLBACK ENGINE)
                </h1>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  API Fallback
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory manual entry engine for offline land records and master API outages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold border ${
                fallbackApps.length > 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {fallbackApps.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{fallbackApps.length} Cases Requiring Manual Fallback</span>
            </span>
          </div>
        </div>

        {/* Clear Mandatory Explanation */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Operating Notice:</strong> This fallback page is active only because the State Land Records API is unavailable, required records are unavailable digitally, or the application requires manual verification. Available AI-extracted data has been pre-filled.
          </p>
        </div>

        {/* Application Selector Tabs */}
        {applications.length > 0 && (
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1">Select Application:</span>
            {applications.map((app) => {
              const isSelected = (selectedApp?.id) === app.id;
              const isFallback = app.status === 'API_FAILURE_MANUAL_ENTRY' || app.govtApiStatus === 'failed';

              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className="font-mono font-bold">{app.id}</span>
                  {isFallback && (
                    <span className="w-2 h-2 rounded-full bg-rose-500" title="API Gateway Failed" />
                  )}
                  <span className="text-[10px] text-slate-500">({app.extractedData.propertyDetails.village})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Main Workspace */}
      {selectedApp && (
        <div className="space-y-6">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-300">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Active Dossier:</span>
              <span className="font-mono font-bold text-white text-sm">{selectedApp.id}</span>
              <span>•</span>
              <span className="font-bold text-slate-200">{selectedApp.citizenName}</span>
              <span>•</span>
              <span className="text-amber-400 font-mono font-bold">
                Sy. #{selectedApp.extractedData.propertyDetails.surveyNumber}
              </span>
              <span>•</span>
              <span className="text-slate-400">{selectedApp.extractedData.propertyDetails.village}, {selectedApp.extractedData.propertyDetails.district}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-xl text-emerald-400 border border-emerald-500/20 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                AI OCR Data Pre-filled
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div>
              <DocumentPreview
                documentUrl={selectedApp.documentUrl}
                fileName={selectedApp.fileName}
                dossier={selectedApp.documentsDossier}
                activeDocType={activeDocType}
                activePage={activePage}
                highlightFieldKey={highlightFieldKey}
              />
            </div>

            <div>
              <ManualEntryForm
                key={selectedApp.id}
                applicationId={selectedApp.id}
                onSave={handleSaved}
                onCancel={() => {
                  setInternalView('hub');
                  navigate('/deo/manual-entry');
                }}
                onViewSource={handleViewSource}
                defaultValues={{
                  state: selectedApp.extractedData.propertyDetails.state,
                  district: selectedApp.extractedData.propertyDetails.district,
                  taluk: selectedApp.extractedData.propertyDetails.taluk,
                  village: selectedApp.extractedData.propertyDetails.village,
                  surveyNumber: selectedApp.extractedData.propertyDetails.surveyNumber,
                  ulpin: selectedApp.extractedData.propertyDetails.ulpin,
                  ownerName: selectedApp.extractedData.ownerDetails.name,
                  fatherName: selectedApp.extractedData.ownerDetails.fatherOrSpouse,
                  share: selectedApp.extractedData.ownerDetails.share,
                  previousOwner: selectedApp.extractedData.ownerDetails.previousOwner,
                  area: selectedApp.extractedData.landDetails.area,
                  areaUnit: selectedApp.extractedData.landDetails.unit,
                  landType: selectedApp.extractedData.landDetails.landType,
                  currentUsage: selectedApp.extractedData.landDetails.usage,
                  boundaryNorth: selectedApp.extractedData.landDetails.boundaries.north,
                  boundarySouth: selectedApp.extractedData.landDetails.boundaries.south,
                  boundaryEast: selectedApp.extractedData.landDetails.boundaries.east,
                  boundaryWest: selectedApp.extractedData.landDetails.boundaries.west,
                  documentType: selectedApp.extractedData.documentDetails.type,
                  documentNumber: selectedApp.extractedData.documentDetails.number,
                  registrationNumber: selectedApp.extractedData.documentDetails.registrationNumber,
                  registrationDate: selectedApp.extractedData.documentDetails.registrationDate,
                  issuingAuthority: selectedApp.extractedData.documentDetails.issuingAuthority,
                  mutationNumber: selectedApp.extractedData.documentDetails.mutationNumber,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
