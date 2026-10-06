import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useVerifierApplication } from '../../hooks/useVerifierApplication';
import { useVerifierStore } from '../../store/verifierStore';
import { ReviewHeader } from './ReviewHeader';
import { AttentionSummary } from './AttentionSummary';
import { VerificationCompleteness } from './VerificationCompleteness';
import { DocumentViewer } from '../../components/DocumentViewer';
import { ExtractedDataPanel } from './ExtractedDataPanel';
import { ValidationResults } from './ValidationResults';
import { GovernmentRecordPanel } from './GovernmentRecordPanel';
import { TransactionHistoryPanel } from './TransactionHistoryPanel';
import { GISValidationPanel } from './GISValidationPanel';
import { DEOCorrectionsPanel } from './DEOCorrectionsPanel';
import { ReviewCycleTimeline } from './ReviewCycleTimeline';
import { InteractiveChecklist } from './InteractiveChecklist';
import { RemarksInput } from './RemarksInput';
import { DecisionActions } from './DecisionActions';
import { ApproveModal } from '../../components/ApproveModal';
import { RejectModal } from '../../components/RejectModal';
import { ReturnToDEOModal } from '../../components/ReturnToDEOModal';
import { EscalateModal } from '../../components/EscalateModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/ErrorState';
import { VerificationChecklistState } from '../../api/types';
import toast from 'react-hot-toast';

export default function ApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: application, isLoading, error } = useVerifierApplication(id);

  const approveAndForward = useVerifierStore((s) => s.approveAndForward);
  const returnToDEO = useVerifierStore((s) => s.returnToDEO);
  const rejectApplication = useVerifierStore((s) => s.rejectApplication);
  const escalateToRevenue = useVerifierStore((s) => s.escalateToRevenue);
  const reopenApplication = useVerifierStore((s) => s.reopenApplication);
  const saveInspectionNotes = useVerifierStore((s) => s.saveInspectionNotes);
  const toggleChecklistItem = useVerifierStore((s) => s.toggleChecklistItem);
  const toggleGovtServiceStatus = useVerifierStore((s) => s.toggleGovtServiceStatus);

  const [remarks, setRemarks] = useState('');
  const [activeViewerDocType, setActiveViewerDocType] = useState<string>('Registered Sale Deed');
  const [activeViewerPage, setActiveViewerPage] = useState<number>(1);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (application?.verificationNotes) {
      setRemarks(application.verificationNotes);
    }
  }, [application]);

  if (isLoading) return <SkeletonLoader type="detail" />;
  if (error || !application) {
    return <ErrorState message={`Application with ID "${id}" could not be retrieved from the verifier registry.`} />;
  }

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewSource = (docTypeKey: string, pageNumber: number = 1) => {
    setActiveViewerDocType(docTypeKey);
    setActiveViewerPage(pageNumber);
    if (viewerRef.current) {
      viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRemarksChange = (val: string) => {
    setRemarks(val);
    saveInspectionNotes(application.id, val);
  };

  const handleSaveNotesClick = () => {
    saveInspectionNotes(application.id, remarks);
    toast.success('Inspection notes saved and persisted to database!');
  };

  const handleChecklistToggle = (key: keyof VerificationChecklistState) => {
    toggleChecklistItem(application.id, key);
  };

  const handleToggleGovtService = () => {
    toggleGovtServiceStatus(application.id);
    const curr = application.govtRecord?.serviceStatus || 'ONLINE';
    const nextState = curr === 'ONLINE' ? 'UNAVAILABLE' : 'ONLINE';
    toast(
      nextState === 'UNAVAILABLE'
        ? 'Government Record API status simulated as UNAVAILABLE. Fallback mode active.'
        : 'Government Record API status restored to ONLINE.',
      { icon: nextState === 'UNAVAILABLE' ? '⚠️' : '✅' }
    );
  };

  // Checklist completion guard validation
  const checklist = application.checklist || {
    documentsReviewed: false,
    identityProofChecked: false,
    ownerInfoChecked: false,
    surveyNumberChecked: false,
    areaChecked: false,
    registrationDetailsChecked: false,
    mutationDetailsChecked: false,
    transactionHistoryChecked: false,
    govtRecordCrossChecked: false,
    gisResultReviewed: false,
    conflictsReviewed: false,
    verifierRemarksEntered: false,
  };

  const completedChecklistCount = Object.values(checklist).filter(Boolean).length;
  const isChecklistComplete = completedChecklistCount === 12;

  const handleApproveAttempt = () => {
    if (!isChecklistComplete) {
      toast.error(`Verification checklist incomplete (${completedChecklistCount}/12 completed). Please review all 12 statutory items.`);
      handleScrollToSection('section-checklist');
      return;
    }
    setShowApproveModal(true);
  };

  const handleApproveConfirm = (customRemarks: string) => {
    setIsSubmitting(true);
    approveAndForward(application.id, customRemarks || remarks);
    setIsSubmitting(false);
    toast.success(`Application ${application.id} approved & forwarded to Revenue Admin!`);
    navigate('/verifier/review');
  };

  const handleReturnConfirm = (
    reason: string,
    customRemarks: string,
    requiredCorrection?: string,
    requestedDoc?: string
  ) => {
    setIsSubmitting(true);
    returnToDEO(application.id, reason, customRemarks || remarks, requiredCorrection, requestedDoc);
    setIsSubmitting(false);
    toast.success(`Application ${application.id} returned to DEO for correction.`);
    navigate('/verifier/review');
  };

  const handleRejectConfirm = (reason: string, customRemarks: string) => {
    setIsSubmitting(true);
    rejectApplication(application.id, reason, customRemarks || remarks);
    setIsSubmitting(false);
    toast.error(`Application ${application.id} rejected by Verifier.`);
    navigate('/verifier/review');
  };

  const handleEscalateConfirm = (category: string, reason: string, customRemarks: string) => {
    setIsSubmitting(true);
    escalateToRevenue(application.id, category, reason, customRemarks || remarks);
    setIsSubmitting(false);
    toast.success(`Application ${application.id} escalated to Tahsildar Executive Magistrate.`);
    navigate('/verifier/review');
  };

  const handleReopen = () => {
    reopenApplication(application.id, 'Reopened for second-tier review cycle.');
    toast.success(`Review cycle re-initialized for ${application.id}`);
  };

  const currentStatus = application.currentStatus || application.status;

  const dossierList = (
    application.documentsList || [
      { id: `${application.id}-SALE-DEED`, name: 'Registered Sale Deed', type: 'Registered Sale Deed', docTypeKey: 'sale_deed', available: true, pageCount: 4 },
      { id: `${application.id}-ROR`, name: 'RoR / Pattadar Record', type: 'RoR / Pattadar Record', docTypeKey: 'ror_record', available: true, pageCount: 2 },
      { id: `${application.id}-IDENTITY`, name: 'Identity Proof (Masked)', type: 'Identity Proof (Masked)', docTypeKey: 'id_proof', available: true, pageCount: 1 },
      { id: `${application.id}-MUTATION`, name: 'Mutation Record Order', type: 'Mutation Record Order', docTypeKey: 'mutation_record', available: false, pageCount: 2 },
      { id: `${application.id}-PRIOR-TITLE`, name: 'Prior Link Deed', type: 'Prior Link Deed', docTypeKey: 'link_doc', available: true, pageCount: 2 },
      { id: `${application.id}-CADASTRAL`, name: 'Cadastral Map', type: 'Cadastral Map', docTypeKey: 'cadastral_map', available: true, pageCount: 1 },
    ]
  ).map((doc) => ({
    ...doc,
    docTypeKey: doc.docTypeKey || doc.id || doc.type,
  }));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Review Header (Top Application Summary) */}
      <ReviewHeader application={application} />

      {/* 2. Verification Attention Summary (Clickable scroll links) */}
      <AttentionSummary
        application={application}
        onScrollToSection={handleScrollToSection}
      />

      {/* 3. Document Completeness Panel */}
      <VerificationCompleteness
        application={application}
        onViewDocument={(docKey) => handleViewSource(docKey, 1)}
      />

      {/* 4. Tabbed Document Viewer */}
      <div ref={viewerRef} id="section-viewer">
        <DocumentViewer
          documentUrl={application.documentUrl}
          applicationId={application.id}
          dossier={dossierList}
          activeDocType={activeViewerDocType}
          activePage={activeViewerPage}
        />
      </div>

      {/* 5. AI Extracted Record Data Panel (4 Structured Sections) */}
      <div id="section-extracted">
        <ExtractedDataPanel data={application.extractedData} />
      </div>

      {/* 6. Cross-Document Validation & Discrepancy Matrix */}
      <ValidationResults
        results={application.validationResults}
        onViewSource={handleViewSource}
      />

      {/* 7. Government Land Record Cross-Check (Demo label, API Fallback toggle) */}
      <GovernmentRecordPanel
        data={application.govtRecord}
        appId={application.id}
        onToggleFallbackService={handleToggleGovtService}
        onViewSource={handleViewSource}
      />

      {/* 8. Chronological Transaction Timeline */}
      <TransactionHistoryPanel transactions={application.transactionHistory} />

      {/* 9. GIS Spatial Boundary & Area Validation */}
      <GISValidationPanel gisData={application.gisData} />

      {/* 10. DEO Endorsement & Before/After Corrections Comparison */}
      <DEOCorrectionsPanel
        deoName={application.deoName}
        deoRemarks={application.deoRemarks}
        forwardedAt={application.deoForwardedAt}
        corrections={application.deoCorrections}
        onViewSource={handleViewSource}
      />

      {/* 11. Review Cycle Timeline & Multi-Cycle History */}
      <ReviewCycleTimeline
        currentCycle={application.reviewCycleNumber || 1}
        actionHistory={application.actionHistory}
      />

      {/* 12. Interactive 12-point Verification Checklist */}
      <InteractiveChecklist
        checklist={application.checklist}
        onToggleItem={handleChecklistToggle}
      />

      {/* 13. Verifier Inspection Notes & SAVE NOTES */}
      <RemarksInput
        value={remarks}
        onChange={handleRemarksChange}
        onSaveNotes={handleSaveNotesClick}
      />

      {/* 14. Decision Action Bar & Confirmation Modals */}
      <DecisionActions
        currentStatus={currentStatus}
        onApprove={handleApproveAttempt}
        onReject={() => setShowRejectModal(true)}
        onReturn={() => setShowReturnModal(true)}
        onEscalate={() => setShowEscalateModal(true)}
        onReopen={handleReopen}
        isChecklistIncomplete={!isChecklistComplete}
        isApproving={isSubmitting}
        isRejecting={isSubmitting}
        isReturning={isSubmitting}
        isEscalating={isSubmitting}
      />

      {/* Decision Modals */}
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        applicationId={application.id}
        citizenName={application.citizenName}
        surveyNumber={application.surveyNumber}
        riskScore={application.riskScore}
        currentStatus={currentStatus}
        defaultRemarks={remarks}
        isSubmitting={isSubmitting}
      />

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        applicationId={application.id}
        defaultRemarks={remarks}
        isSubmitting={isSubmitting}
      />

      <ReturnToDEOModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleReturnConfirm}
        applicationId={application.id}
        defaultRemarks={remarks}
        isSubmitting={isSubmitting}
      />

      <EscalateModal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        onConfirm={handleEscalateConfirm}
        applicationId={application.id}
        defaultRemarks={remarks}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
