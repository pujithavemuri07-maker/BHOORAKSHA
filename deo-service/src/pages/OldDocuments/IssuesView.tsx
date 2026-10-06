import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Bell,
  Link2,
  FileDown,
  CheckCircle2,
  Layers,
  Scale,
  MapPin,
  Landmark,
  Save,
  Send,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useOldDocumentsStore } from '../../store/oldDocumentsStore';
import { NotifyOwnerModal } from '../../components/OldDocuments/NotifyOwnerModal';
import { LinkUlpinModal } from '../../components/OldDocuments/LinkUlpinModal';
import toast from 'react-hot-toast';

export default function OldDocumentIssuesView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getDocument, routeToOfficer, linkUlpin, notifyOwner } = useOldDocumentsStore();

  const doc = getDocument(id || 'OLD-000123') || {
    id: id || 'OLD-000123',
    documentType: 'Register',
    village: 'Yelahanka',
    yearFrom: 1970,
    yearTo: 1975,
    riskScore: 68,
    riskCategory: 'MEDIUM',
    overallConfidence: 72,
    linkedUlpin: 'KA-1234-5678-9012',
    notifiedOwner: false,
    routedTo: null,
    extractedFields: {
      ownerName: 'Shankar (S/o Ramu)',
      surveyNumber: '123/456',
      extentArea: '2.50 Acres',
    },
    issues: [
      {
        id: 'ISSUE-01',
        type: 'ownership_mismatch',
        severity: 'HIGH',
        oldValue: 'Shankar (S/o Ramu)',
        modernValue: 'Suresh Reddy',
        description: 'Possible unregistered historical transfer between 1975-1990.',
        recommendation: 'Notify current owner + request clarification.',
      },
      {
        id: 'ISSUE-02',
        type: 'survey_number_change',
        severity: 'MEDIUM',
        oldValue: 'Sy. No. 123/2',
        modernValue: '123/456',
        description: 'Likely same parcel (sub-division renumbering during 1982 survey).',
        recommendation: 'Link with note, verify with GIS.',
      },
      {
        id: 'ISSUE-03',
        type: 'area_variation',
        severity: 'LOW',
        oldValue: '2.50 acres',
        modernValue: '2.48 acres',
        description: 'Within acceptable range (0.8% variation).',
        recommendation: 'No action needed.',
      },
    ],
  };

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRoute = (role: 'verifier' | 'legal' | 'gis' | 'revenue') => {
    routeToOfficer(doc.id, role, `Discrepancies identified during archival digitization of ${doc.id}`);
    toast.success(`Dossier ${doc.id} successfully routed to ${role.toUpperCase()} desk!`);
  };

  const handleExport = (format: 'csv' | 'json') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const filename = `${doc.id}_digitized.${format}`;
      const element = document.createElement('a');
      const content =
        format === 'csv'
          ? `DocID,Type,Village,Year,SurveyNo,OwnerName,ModernOwner,ULPIN\n${doc.id},${doc.documentType},${doc.village},${doc.yearFrom}-${doc.yearTo},${doc.extractedFields.surveyNumber},"${doc.extractedFields.ownerName}","Suresh Reddy",${doc.linkedUlpin || 'KA-1234-5678-9012'}`
          : JSON.stringify(doc, null, 2);

      const file = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success(`Exported ${filename}`);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={`/deo/old-documents/verify/${doc.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('Back to Verification', '← Back to Verification')}</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-500">
          Statutory Risk Assessment · Dossier {doc.id}
        </span>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🎯 AI Issue Detection & Risk Score</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Document: <strong className="text-white font-mono">{doc.id}</strong> ({doc.village} {doc.documentType} {doc.yearFrom}-{doc.yearTo})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Risk Score</span>
              <span className="text-lg font-black text-amber-400">{doc.riskScore}/100</span>
              <span className="text-[10px] text-amber-400 block font-bold">({doc.riskCategory})</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">HTR Confidence</span>
              <span className="text-lg font-black text-emerald-400">{doc.overallConfidence}%</span>
              <span className="text-[10px] text-emerald-400 block font-bold">(High)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Issues Detected ({doc.issues?.length || 3})</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Cross-referenced with BHOOMI Modern Registry
          </span>
        </div>

        {/* Issue 1: Ownership Mismatch (HIGH) */}
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                🔴 HIGH · Ownership mismatch
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
              Escalation Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Old Record Shows:</span>
              <p className="font-bold text-white text-sm">"Shankar (S/o Ramu)"</p>
              <span className="text-[10px] text-slate-400 block">Yelahanka 1975 Register</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Modern Record Shows:</span>
              <p className="font-bold text-emerald-400 text-sm">"Suresh Reddy"</p>
              <span className="text-[10px] text-slate-400 block">ULPIN: KA-1234-5678-9012 (2025 Deed)</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
            <p className="text-slate-300">
              → <strong>AI Diagnosis:</strong> Possible unregistered historical transfer between 1975–1990 without mutation entry.
            </p>
            <p className="text-amber-400 font-medium">
              → <strong>Recommended Action:</strong> Notify current land owner + request clarification on title succession.
            </p>
          </div>
        </div>

        {/* Issue 2: Survey Number Format Changed (MEDIUM) */}
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                🟡 MEDIUM · Survey number format changed
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
              Spatial Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Old Survey Notation:</span>
              <p className="font-bold text-white text-sm">"Sy. No. 123/2"</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Modern Survey Number:</span>
              <p className="font-bold text-amber-400 text-sm">"123/456"</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
            <p className="text-slate-300">
              → <strong>AI Diagnosis:</strong> Likely identical land parcel (cadastral sub-division renumbering during 1982 survey).
            </p>
            <p className="text-amber-400 font-medium">
              → <strong>Recommended Action:</strong> Link with archival notation and verify spatial boundary polygon with GIS officer.
            </p>
          </div>
        </div>

        {/* Issue 3: Area Variation (LOW) */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                🟢 LOW · Area variation within statutory tolerance
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Approved
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Old Extent:</span>
              <p className="font-bold text-white text-sm">2.50 acres</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Modern Extent:</span>
              <p className="font-bold text-emerald-400 text-sm">2.48 acres</p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            → <strong>Result:</strong> 0.8% variation is well within permissible survey limits. No manual action needed.
          </p>
        </div>
      </div>

      {/* Recommended Actions Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Recommended Statutory Actions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Send to Verifier */}
          <button
            type="button"
            onClick={() => handleRoute('verifier')}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold transition-all text-left space-y-1 group"
          >
            <div className="flex items-center justify-between text-amber-400">
              <Send className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Desk 3002</span>
            </div>
            <p className="text-white text-sm">Send to Verifier</p>
            <p className="text-[11px] text-slate-400">Girdawar field inspection</p>
          </button>

          {/* Send to Legal */}
          <button
            type="button"
            onClick={() => handleRoute('legal')}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold transition-all text-left space-y-1 group"
          >
            <div className="flex items-center justify-between text-purple-400">
              <Scale className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Desk 3003</span>
            </div>
            <p className="text-white text-sm">Send to Legal</p>
            <p className="text-[11px] text-slate-400">Ownership discrepancy review</p>
          </button>

          {/* Send to GIS */}
          <button
            type="button"
            onClick={() => handleRoute('gis')}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold transition-all text-left space-y-1 group"
          >
            <div className="flex items-center justify-between text-blue-400">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Desk 3004</span>
            </div>
            <p className="text-white text-sm">Send to GIS</p>
            <p className="text-[11px] text-slate-400">Boundary & survey validation</p>
          </button>

          {/* Send to Revenue Admin */}
          <button
            type="button"
            onClick={() => handleRoute('revenue')}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold transition-all text-left space-y-1 group"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <Landmark className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase">Desk 3005</span>
            </div>
            <p className="text-white text-sm">Send to Revenue Admin</p>
            <p className="text-[11px] text-slate-400">Tehsildar final sanction</p>
          </button>
        </div>

        {/* Second row: Notify Owner, Link ULPIN, Export */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          {/* Notify Owner */}
          <button
            type="button"
            onClick={() => setIsNotifyModalOpen(true)}
            className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold transition-all text-left space-y-1"
          >
            <div className="flex items-center justify-between text-amber-400">
              <Bell className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase">Important</span>
            </div>
            <p className="text-white text-sm">Notify Current Owner</p>
            <p className="text-[11px] text-amber-200/80">Dispatches SMS, Email & In-App Notice</p>
          </button>

          {/* Link ULPIN */}
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold transition-all text-left space-y-1"
          >
            <div className="flex items-center justify-between text-emerald-400">
              <Link2 className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase">Cadastre</span>
            </div>
            <p className="text-white text-sm">Link to Modern ULPIN</p>
            <p className="text-[11px] text-emerald-200/80">Bind to BHOOMI parcel coordinate</p>
          </button>

          {/* Export Record */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-bold space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <FileDown className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono uppercase">Export</span>
            </div>
            <p className="text-white text-sm">Export Digitized Record</p>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleExport('csv')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-amber-400 border border-slate-800"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => handleExport('json')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-emerald-400 border border-slate-800"
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Footer save only */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            {doc.notifiedOwner ? '✓ Owner Notified' : '• Owner Notice Pending'} · {doc.routedTo ? `Routed to ${doc.routedTo.toUpperCase()}` : 'Unrouted'}
          </span>
          <button
            type="button"
            onClick={() => {
              toast.success(`Dossier ${doc.id} saved in local register without routing.`);
              navigate('/deo/old-documents');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Only (No Routing)</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <NotifyOwnerModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        documentId={doc.id}
        ulpin={doc.linkedUlpin || 'KA-1234-5678-9012'}
        oldOwnerName={doc.extractedFields?.ownerName || 'Shankar (S/o Ramu)'}
        onSuccess={(channels) => notifyOwner(doc.id, channels)}
      />

      <LinkUlpinModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        documentId={doc.id}
        currentUlpin={doc.linkedUlpin}
        onSuccess={(ulpin) => linkUlpin(doc.id, ulpin)}
      />
    </div>
  );
}
