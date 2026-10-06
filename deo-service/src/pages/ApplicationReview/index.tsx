import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useDEOApplicationDetail } from '../../hooks/useDEOApplicationDetail';
import { useForwardToVerifier } from '../../hooks/useForwardToVerifier';
import { useCorrectionRequest } from '../../hooks/useCorrectionRequest';
import { useDEOStore } from '../../store/deoStore';
import { ReviewHeader } from './ReviewHeader';
import { AIAttentionSummary } from './AIAttentionSummary';
import { AIRiskBreakdown } from './AIRiskBreakdown';
import { DocumentPreview } from './DocumentPreview';
import { ExtractedDataPanel } from './ExtractedDataPanel';
import { CrossDocumentValidation } from './CrossDocumentValidation';
import { ConflictDuplicateDetection } from './ConflictDuplicateDetection';
import { PreviousTransactionHistory } from './PreviousTransactionHistory';
import { GISSpatialValidation } from './GISSpatialValidation';
import { GovernmentRecordPanel } from './GovernmentRecordPanel';
import { LegalEncumbranceStatus } from './LegalEncumbranceStatus';
import { DocumentChecklistProvenance } from './DocumentChecklistProvenance';
import { MutationStatusWorkflow } from './MutationStatusWorkflow';
import { RemarksInput } from './RemarksInput';
import { VerificationWorkflow } from './VerificationWorkflow';
import { TamperEvidentHistory } from './TamperEvidentHistory';
import { AppendOnlyAuditTrail } from './AppendOnlyAuditTrail';
import { ActionButtons } from './ActionButtons';
import { ManualEntryForm } from '../../components/ManualEntryForm';
import { ForwardModal } from '../../components/ForwardModal';
import { CorrectionModal } from '../../components/CorrectionModal';
import { RequestMissingDocModal } from '../../components/RequestMissingDocModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/ErrorState';
import toast from 'react-hot-toast';

export default function ApplicationReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: application, isLoading, error } = useDEOApplicationDetail(id);

  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showMissingDocModal, setShowMissingDocModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  const { mutate: forward, isPending: isForwarding } = useForwardToVerifier();
  const { mutate: requestCorrection, isPending: isRequestingCorrection } = useCorrectionRequest();
  const saveCorrections = useDEOStore((state) => state.saveCorrections);
  const requestLegalReview = useDEOStore((state) => state.requestLegalReview);
  const requestGisReview = useDEOStore((state) => state.requestGisReview);

  if (isLoading) {
    return <SkeletonLoader type="detail" />;
  }

  if (error || !application) {
    return (
      <ErrorState
        title="Application Not Found"
        message={`No land record application found matching reference "${id}".`}
        onRetry={() => navigate('/deo/review')}
      />
    );
  }

  // Pre-forward validation for mandatory statutory fields
  const handleForwardClick = () => {
    const missing: string[] = [];
    const prop = application.extractedData?.propertyDetails;
    const owner = application.extractedData?.ownerDetails;
    const land = application.extractedData?.landDetails;
    const doc = application.extractedData?.documentDetails;

    if (!owner?.name || !owner.name.trim()) {
      missing.push('Applicant / Owner Name');
    }
    if (!prop?.surveyNumber || !prop.surveyNumber.trim()) {
      missing.push('Survey / Hissa Number');
    }
    if (land?.area === undefined || land?.area === null || land?.area <= 0) {
      missing.push('Land Extent Area');
    }
    if (!doc?.registrationNumber && !doc?.number) {
      missing.push('Registration / Deed Number');
    }

    if (missing.length > 0) {
      toast.error(
        (t) => (
          <div className="space-y-1 text-xs">
            <p className="font-bold text-rose-400">Missing required information before forwarding:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
              {missing.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 pt-1">
              Please correct the missing fields in the extracted panel and save before forwarding.
            </p>
          </div>
        ),
        { duration: 5000 }
      );
      return;
    }

    setShowForwardModal(true);
  };

  const handleForwardConfirm = (verifierId: string, customRemarks: string) => {
    if (!id) return;
    forward(
      { applicationId: id, verifierId, remarks: customRemarks || remarks },
      {
        onSuccess: () => {
          toast.success('Application saved and forwarded to Verifier successfully.');
          navigate('/deo/review');
        },
      }
    );
  };

  const handleCorrectionConfirm = (reason: string, customRemarks: string) => {
    if (!id) return;
    requestCorrection(
      { applicationId: id, reason, remarks: customRemarks || remarks },
      {
        onSuccess: () => {
          toast.success('Correction request sent to citizen applicant.');
          navigate('/deo/review');
        },
      }
    );
  };

  const handleRequestLegal = () => {
    if (!id) return;
    requestLegalReview(id, remarks || 'DEO requested legal officer scrutiny for title continuity.');
    toast.success('Application escalated to Legal Review queue.');
  };

  const handleRequestGis = () => {
    if (!id) return;
    requestGisReview(id, remarks || 'DEO requested spatial GIS boundary inspection.');
    toast.success('Application escalated to GIS Specialist queue.');
  };

  const handleSaveCorrections = () => {
    if (!id) return;
    saveCorrections(id, remarks || 'DEO corrections saved to database.');
    toast.success('Corrections saved successfully.');
  };

  const [activeDocType, setActiveDocType] = useState<string | undefined>(undefined);
  const [activePage, setActivePage] = useState<number | undefined>(undefined);
  const [highlightFieldKey, setHighlightFieldKey] = useState<string | undefined>(undefined);

  const handleViewSource = (docType: string, page: number, fieldKey?: string) => {
    setActiveDocType(docType);
    setActivePage(page);
    setHighlightFieldKey(fieldKey);
    toast.success(`Navigated to ${docType} (Page ${page})`, { id: 'view-source-toast', duration: 2500 });
  };

  const isApiAvailable = application.govtApiStatus === 'available' && application.govtRecord;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Application Header with Configurable State Profile & Metadata */}
      <ReviewHeader application={application} />

      {/* 2. Exception-First AI Attention & Validation Summary (Green/Yellow/Red) */}
      <AIAttentionSummary application={application} />

      {/* 3. AI Risk Score + Risk Breakdown + Explainable AI Reasoning */}
      <AIRiskBreakdown score={application.riskScore} />

      {/* 4. Side-by-Side Review Workspace: Original Document (Left) + AI Extracted Data (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Left: Original Document (Scanned PDF / Aadhaar / Passbook / Cadastral Map) */}
        <div>
          <DocumentPreview
            documentUrl={application.documentUrl}
            fileName={application.fileName}
            dossier={application.documentsDossier}
            activeDocType={activeDocType}
            activePage={activePage}
            highlightFieldKey={highlightFieldKey}
          />
        </div>

        {/* Right: AI Extracted Data (Owner, Survey No, Area, Date + Inline Edit Controls + In-panel Save & Forward) */}
        <div>
          <ExtractedDataPanel
            data={application.extractedData}
            applicationId={application.id}
            onForward={handleForwardClick}
            onSaveCorrections={handleSaveCorrections}
            onViewSource={handleViewSource}
          />
        </div>
      </div>

      {/* 6. Cross-Document Validation (5-Source Stream Comparison Table with Reasons) */}
      <CrossDocumentValidation />

      {/* 7. Conflict & Duplicate Detection */}
      <ConflictDuplicateDetection />

      {/* 8. Previous Transaction History Timeline (30-Year Chain) */}
      <PreviousTransactionHistory />

      {/* 9. GIS Spatial Validation + Interactive Vector Parcel Map */}
      <GISSpatialValidation surveyNumber={application.extractedData.propertyDetails.surveyNumber} />

      {/* 10. State Land Records Master Record */}
      {isApiAvailable ? (
        <GovernmentRecordPanel data={application.govtRecord} />
      ) : (
        <div className="space-y-2">
          <ManualEntryForm
            applicationId={application.id}
            onSave={() => {
              toast.success('Manual record saved. Proceeding with review.');
            }}
          />
        </div>
      )}

      {/* 11. Legal & Encumbrance Status */}
      <LegalEncumbranceStatus onRequestLegal={handleRequestLegal} />

      {/* 12. Document Checklist & Data Provenance Explorer with Missing Doc Action */}
      <DocumentChecklistProvenance applicationId={application.id} />

      {/* 13. Mutation Status & Statutory Lifecycle */}
      <MutationStatusWorkflow />

      {/* 14. Officer Notes / Internal Remarks */}
      <RemarksInput value={remarks} onChange={setRemarks} />

      {/* 15. Verification Workflow Hierarchy Progression */}
      <VerificationWorkflow status={application.status} />

      {/* 16. Record Version History (Tamper-Evident SHA-256 Ledger) */}
      <TamperEvidentHistory application={application} />

      {/* 17. Append-Only Audit Trail (WHO, WHAT, WHEN, WHY) */}
      <AppendOnlyAuditTrail application={application} />

      {/* 18. Clean Action Decision Buttons at Bottom */}
      <ActionButtons
        onForward={handleForwardClick}
        onCorrection={() => setShowCorrectionModal(true)}
        onRequestLegal={handleRequestLegal}
        onRequestGis={handleRequestGis}
        onRequestMissingDoc={() => setShowMissingDocModal(true)}
        onSaveCorrections={handleSaveCorrections}
        isForwarding={isForwarding}
        isRequestingCorrection={isRequestingCorrection}
      />

      {/* Forward Confirmation Modal */}
      <ForwardModal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        onConfirm={handleForwardConfirm}
        applicationId={application.id}
        riskScore={application.riskScore}
        defaultRemarks={remarks}
      />

      {/* Structured Correction Modal */}
      <CorrectionModal
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
        onConfirm={handleCorrectionConfirm}
        applicationId={application.id}
        defaultRemarks={remarks}
      />

      {/* Request Missing Document Modal */}
      <RequestMissingDocModal
        isOpen={showMissingDocModal}
        onClose={() => setShowMissingDocModal(false)}
        applicationId={application.id}
      />
    </div>
  );
}
