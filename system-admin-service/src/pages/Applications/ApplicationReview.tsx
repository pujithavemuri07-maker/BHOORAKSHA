import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileQuestion,
  Share2,
  ShieldCheck,
  FileText,
  User,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Download,
  Eye,
  AlertTriangle,
  Lock,
  Layers,
  Compass,
  History,
  Hash,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Info,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import toast from 'react-hot-toast';

export const ApplicationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentApplication,
    isLoadingApplications,
    fetchApplicationDetails,
    executeAdminAction,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'ai' | 'officers' | 'conflicts' | 'history' | 'audit'>('overview');
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);

  // Modals state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isRequestDocsModalOpen, setIsRequestDocsModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

  // Form inputs
  const [actionRemarks, setActionRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Discrepancy in encumbrance schedule or title lineage.');
  const [returnField, setReturnField] = useState('Schedule B Boundary Dimensions');
  const [returnInstructions, setReturnInstructions] = useState('Please verify northern boundary coordinates with local field inspector.');
  const [requestedDocType, setRequestedDocType] = useState('Non-Agricultural Land Conversion (NALA) Certificate');
  const [requestedDocMessage, setRequestedDocMessage] = useState('Please upload clear scan of the official NALA conversion order issued by the Revenue Divisional Officer.');
  const [escalationRole, setEscalationRole] = useState('Chief Commissioner of Land Administration (CCLA)');
  const [escalationReason, setEscalationReason] = useState('High-value commercial conversion requiring state-level administrative clearance.');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchApplicationDetails(id).catch(() => {
        toast.error(`Could not load application ${id}`);
      });
    }
  }, [id]);

  if (isLoadingApplications && !currentApplication) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading comprehensive verification packet...</p>
      </div>
    );
  }

  if (!currentApplication) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-base font-bold text-white">Application Record Not Found</h2>
        <p className="text-xs text-slate-400">Application ID {id} does not exist in the database.</p>
        <button
          onClick={() => navigate('/admin/applications')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Applications Queue
        </button>
      </div>
    );
  }

  const app = currentApplication;
  const docs = app.documents || [];
  const selectedDoc = docs[selectedDocIndex] || docs[0] || {};
  const summary = app.verification_summary || {};
  const timeline = app.application_timeline || [];
  const audit = app.audit_trail || { entries: [] };

  const handleAction = async (actionType: 'APPROVE' | 'REJECT' | 'RETURN_FOR_CORRECTION' | 'REQUEST_ADDITIONAL_DOCS' | 'ESCALATE') => {
    setIsSubmitting(true);
    const toastId = toast.loading(`Executing System Admin ${actionType}...`);
    try {
      let payload: any = { action_type: actionType, remarks: actionRemarks };
      if (actionType === 'REJECT') {
        payload.reason = rejectionReason;
      } else if (actionType === 'RETURN_FOR_CORRECTION') {
        payload.required_document = returnField;
        payload.remarks = returnInstructions;
      } else if (actionType === 'REQUEST_ADDITIONAL_DOCS') {
        payload.required_document = requestedDocType;
        payload.remarks = requestedDocMessage;
      } else if (actionType === 'ESCALATE') {
        payload.target_role = escalationRole;
        payload.reason = escalationReason;
      }

      await executeAdminAction(app.application_no, payload);
      toast.success(`Action [${actionType}] completed and committed to SHA-256 ledger!`, { id: toastId });

      // Close all modals
      setIsApproveModalOpen(false);
      setIsRejectModalOpen(false);
      setIsReturnModalOpen(false);
      setIsRequestDocsModalOpen(false);
      setIsEscalateModalOpen(false);
      setActionRemarks('');
    } catch (e: any) {
      toast.error(`Action failed: ${e?.message || 'Error'}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLedgerHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast.success('SHA-256 Hash copied to clipboard');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/applications')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-indigo-400 text-base">{app.application_no}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {app.official_ulpin}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {app.applicant_name} • Survey #{app.survey_number}, {app.village}, {app.district}
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsApproveModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Seal</span>
          </button>

          <button
            onClick={() => setIsReturnModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return for Correction</span>
          </button>

          <button
            onClick={() => setIsRequestDocsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
          >
            <FileQuestion className="w-4 h-4" />
            <span>Request Additional Docs</span>
          </button>

          <button
            onClick={() => setIsEscalateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all"
          >
            <Share2 className="w-4 h-4 text-orange-400" />
            <span>Escalate</span>
          </button>

          <button
            onClick={() => setIsRejectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-xs font-medium border border-rose-500/30 transition-all"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Verification Summary Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Statutory Multi-Stage Verification Summary
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Current Status:</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
              {app.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">AI Processing</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.ai_processing || 'COMPLETED'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">DEO Verification</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.deo_verification || 'COMPLETED'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Verifier Review</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.verifier_verification || 'COMPLETED'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">GIS Cadastral</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.gis_verification || 'COMPLETED'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Revenue Scrutiny</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.revenue_verification || 'COMPLETED'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Required Docs</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.required_documents || 'COMPLETE'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Conflicts / Caveats</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {summary.conflicts || 'NONE'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <span className="text-[10px] text-indigo-300 block mb-0.5">Current Stage</span>
            <span className="font-bold text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-indigo-400" /> SYSTEM ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'overview', label: '1. Citizen & Property Info', icon: User },
          { key: 'documents', label: '2. Uploaded Documents Viewer', icon: FileText },
          { key: 'ai', label: '3. AI Extraction & Confidence', icon: Cpu },
          { key: 'officers', label: '4. Officer Findings & Remarks', icon: ShieldCheck },
          { key: 'conflicts', label: '5. Conflicts & Checklists', icon: AlertTriangle },
          { key: 'history', label: '6. Verification Timeline', icon: History },
          { key: 'audit', label: '7. SHA-256 Audit Trail', icon: Lock },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-indigo-500 text-white bg-slate-900/60 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Citizen & Property Info */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Citizen Details */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Citizen / Land Owner Information</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <span className="text-[11px] text-slate-400 block">Full Name</span>
                <span className="font-semibold text-slate-200 text-sm">{app.applicant_name}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Citizen Contact Phone</span>
                <span className="font-mono text-slate-200">{app.applicant_phone}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Citizen Email</span>
                <span className="text-slate-200">{app.applicant_email}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Aadhaar (e-KYC Tokenized)</span>
                <span className="font-mono text-slate-200">XXXX-XXXX-{app.applicant_aadhaar_last4}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Permanent Account Number (PAN)</span>
                <span className="font-mono text-slate-200">{app.applicant_pan}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Submission Date</span>
                <span className="font-mono text-slate-200">{new Date(app.created_at || Date.now()).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Property & Parcel Details */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Cadastral Property & Land Record Details</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <span className="text-[11px] text-slate-400 block">Survey Number</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">Sy. #{app.survey_number}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Subdivision Number</span>
                <span className="font-mono text-slate-200">{app.subdivision_number}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Total Extent</span>
                <span className="font-bold text-emerald-400 text-sm">{app.extent_acres} Acres</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Official ULPIN</span>
                <span className="font-mono text-slate-200">{app.official_ulpin}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Village & Mandal / Taluk</span>
                <span className="text-slate-200">{app.village}, {app.taluk}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">District & State</span>
                <span className="text-slate-200">{app.district}, {app.state}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Uploaded Documents Viewer */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Document Selector Sidebar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Uploaded Document Dossier ({docs.length})
            </h3>
            {docs.map((doc: any, idx: number) => (
              <div
                key={doc.id || idx}
                onClick={() => setSelectedDocIndex(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedDocIndex === idx
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs truncate max-w-[180px]">{doc.type}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{doc.qualityScore}% DPI</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{doc.fileName}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB • {doc.pages || 1} pg
                </div>
              </div>
            ))}
          </div>

          {/* Document Preview & Metadata Panel */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedDoc.title || selectedDoc.type}</h3>
                <p className="text-xs text-slate-400">{selectedDoc.description}</p>
              </div>
              <button
                onClick={() => toast.success(`Downloading official copy of ${selectedDoc.fileName}`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download</span>
              </button>
            </div>

            {/* Document Interactive Preview Mock */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-indigo-400">
                <span>[OFFICIAL GOVERNMENT RECORD DOCUMENT PREVIEW]</span>
                <span>SHA-256 SEALED</span>
              </div>
              <p><strong className="text-slate-200">Document Type:</strong> {selectedDoc.type}</p>
              <p><strong className="text-slate-200">Registered File Name:</strong> {selectedDoc.fileName}</p>
              <p><strong className="text-slate-200">Issuing Authority:</strong> {selectedDoc.issuingAuthority}</p>
              <p><strong className="text-slate-200">Registration Date:</strong> {selectedDoc.registrationDate}</p>
              <p><strong className="text-slate-200">Uploaded By:</strong> {selectedDoc.uploadedBy}</p>
              <p><strong className="text-slate-200">Quality / Clarity Metric:</strong> {selectedDoc.qualityScore}% (Automated OCR Pass)</p>
              <p><strong className="text-slate-200">Integrity Status:</strong> Cryptographically Verified (No tampering or alterations detected)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Extraction & Confidence */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* AI Extracted Data */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>MuRIL NER & Chitrapathak Extracted Entities</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Deed Number & Registration Details</span>
                <span className="text-slate-200 font-mono font-bold">{app.ai_extracted_data?.document_number}</span>
                <span className="text-slate-400 block text-[11px] mt-1">
                  Date: {app.ai_extracted_data?.execution_date} • Stamp Fee: {app.ai_extracted_data?.registration_fee_paid}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Vendor / Seller & Purchaser / Buyer</span>
                <div className="text-slate-200 mt-1">
                  <strong>Seller:</strong> {app.ai_extracted_data?.seller_name} <br />
                  <strong>Buyer:</strong> {app.ai_extracted_data?.buyer_name}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Schedule B Boundaries Extracted</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300 mt-1">
                  <div><strong>North:</strong> {app.ai_extracted_data?.boundaries?.north}</div>
                  <div><strong>South:</strong> {app.ai_extracted_data?.boundaries?.south}</div>
                  <div><strong>East:</strong> {app.ai_extracted_data?.boundaries?.east}</div>
                  <div><strong>West:</strong> {app.ai_extracted_data?.boundaries?.west}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Agent Confidence Breakdown</span>
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Composite Risk & Trust Score', val: app.ai_confidence?.composite_score || 98.4 },
                { label: 'Chitrapathak OCR Clarity Metric', val: app.ai_confidence?.ocr_clarity || 99.1 },
                { label: 'MuRIL Indic NER Entity Match', val: app.ai_confidence?.ner_entity_match || 97.8 },
                { label: 'PostGIS Spatial Overlap Verification', val: app.ai_confidence?.spatial_overlap || 99.5 },
                { label: 'Section 40 Legal Rule Engine Compliance', val: app.ai_confidence?.legal_compliance || 100.0 },
                { label: 'Biometric & Signature Authenticity', val: app.ai_confidence?.signature_authenticity || 96.5 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold text-emerald-400">{item.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Officer Findings & Remarks */}
      {activeTab === 'officers' && (
        <div className="space-y-4 text-xs">
          {[
            {
              role: 'DEO Maker Intake Officer',
              name: app.deo_verification?.officer_name,
              office: app.deo_verification?.office,
              status: app.deo_verification?.status,
              remarks: app.deo_verification?.remarks,
            },
            {
              role: 'Senior Field Verification Officer (Girdawar)',
              name: app.verifier_verification?.officer_name,
              office: app.verifier_verification?.office,
              status: app.verifier_verification?.status,
              remarks: app.verifier_verification?.remarks,
            },
            {
              role: 'Chief Cadastral GIS Specialist',
              name: app.gis_verification?.officer_name,
              office: app.gis_verification?.office,
              status: app.gis_verification?.status,
              remarks: app.gis_verification?.remarks,
            },
          ].map((officer) => (
            <div key={officer.role} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{officer.role}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {officer.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">{officer.name} • {officer.office}</div>
                <p className="text-slate-300 mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {officer.remarks}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Conflicts & Checklists */}
      {activeTab === 'conflicts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Conflict Checks */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Conflict & Litigation Scrutiny</span>
            </div>

            <div className="space-y-3">
              {Object.entries(app.conflict_duplicate_results || {}).map(([key, val]: [string, any]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 uppercase font-semibold text-[11px]">{key.replace(/_/g, ' ')}</span>
                  <span className="text-emerald-400 font-bold font-mono">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Docs Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Required Statutory Documents Checklist</span>
            </div>

            <div className="space-y-2">
              {(app.required_documents_checklist || []).map((item: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Verification Timeline */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Chronological Application Lifecycle Timeline
          </h3>

          <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pl-6">
            {timeline.map((item: any, i: number) => (
              <div key={i} className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-slate-900 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span className="font-mono text-[11px] text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-indigo-400 text-[11px] font-semibold">{item.actor} • {item.role}</div>
                  <p className="text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: SHA-256 Audit Trail */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Tamper-Evident SHA-256 Cryptographic Audit Trail</h3>
                <p className="text-[11px] text-slate-400">Cryptographically verifiable immutable chain of custody</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
              CHAIN INTEGRITY VALID
            </div>
          </div>

          <div className="space-y-3">
            {audit.entries && audit.entries.map((entry: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-400 font-bold">{entry.action}</span>
                  <span className="text-slate-500">{new Date(entry.timestamp || Date.now()).toLocaleString()}</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  Actor: <strong className="text-slate-200">{entry.actor_role} ({entry.actor_id})</strong>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  <span className="truncate">Hash: {entry.current_hash || 'SHA256_HASH_SEALED'}</span>
                  <button
                    onClick={() => copyLedgerHash(entry.current_hash || 'SHA256_HASH_SEALED')}
                    className="p-1 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPROVE MODAL */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm System Admin Approval</h3>
                <p className="text-xs text-slate-400">Final statutory ratification for {app.application_no}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will seal the application status as <strong className="text-emerald-400">APPROVED</strong>, generate the official mutation packet, record a permanent SHA-256 audit entry, and notify the citizen.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Statutory Approval Remarks / Order Notes</label>
              <textarea
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder="Enter final approval remarks (e.g. Scrutinized and ratified under Section 40 Land Revenue Code)..."
                className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('APPROVE')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
              >
                Confirm & Seal Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject Application</h3>
                <p className="text-xs text-slate-400">Permanent rejection for {app.application_no}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Rejection Statutory Reason *</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Detailed Scrutiny Remarks</label>
              <textarea
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder="Enter detailed reasons for rejection..."
                className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('REJECT')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RETURN FOR CORRECTION MODAL */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Return Application for Correction</h3>
                <p className="text-xs text-slate-400">Re-route {app.application_no} to previous verification stage</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Required Field / Document to Correct *</label>
              <input
                type="text"
                value={returnField}
                onChange={(e) => setReturnField(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Instructions for DEO / Verifier *</label>
              <textarea
                value={returnInstructions}
                onChange={(e) => setReturnInstructions(e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('RETURN_FOR_CORRECTION')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                Return to DEO / Verifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST ADDITIONAL DOCS MODAL */}
      {isRequestDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Request Additional Documents</h3>
                <p className="text-xs text-slate-400">Prompt citizen for supplemental records on {app.application_no}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Document Type Requested *</label>
              <select
                value={requestedDocType}
                onChange={(e) => setRequestedDocType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Non-Agricultural Land Conversion (NALA) Certificate">Non-Agricultural Land Conversion (NALA) Certificate</option>
                <option value="Legal Heirship / Succession Certificate">Legal Heirship / Succession Certificate</option>
                <option value="Gram Panchayat Building Sanction Plan">Gram Panchayat Building Sanction Plan</option>
                <option value="Registered Gift / Settlement Deed Extract">Registered Gift / Settlement Deed Extract</option>
                <option value="Supporting Indemnity Bond & Affidavit">Supporting Indemnity Bond & Affidavit</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Message to Citizen *</label>
              <textarea
                value={requestedDocMessage}
                onChange={(e) => setRequestedDocMessage(e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRequestDocsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('REQUEST_ADDITIONAL_DOCS')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Send Request to Citizen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESCALATE MODAL */}
      {isEscalateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Escalate Case</h3>
                <p className="text-xs text-slate-400">Refer {app.application_no} to higher statutory authority</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Escalate To Authority *</label>
              <select
                value={escalationRole}
                onChange={(e) => setEscalationRole(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Chief Commissioner of Land Administration (CCLA)">Chief Commissioner of Land Administration (CCLA)</option>
                <option value="District Collector & Magistrate">District Collector & Magistrate</option>
                <option value="Special Land Tribunal Bench">Special Land Tribunal Bench</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Escalation Reason & Legal Notes *</label>
              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEscalateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('ESCALATE')}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
