import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRevenueStore } from '../../store/revenueStore';
import { ReviewHeader } from './ReviewHeader';
import { VerificationSummary } from './VerificationSummary';
import { CompleteData } from './CompleteData';
import { OfficerRemarks } from './OfficerRemarks';
import { RemarksInput } from './RemarksInput';
import { DecisionActions } from './DecisionActions';
import { ApproveModal } from '../../components/ApproveModal';
import { RejectModal } from '../../components/RejectModal';
import { CertificateModal } from '../../components/CertificateModal';
import toast from 'react-hot-toast';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../i18n';

export const ApplicationReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const application = useRevenueStore((s) =>
    s.applications.find((app) => app.id === id)
  );
  const approveApplication = useRevenueStore((s) => s.approveApplication);
  const rejectApplication = useRevenueStore((s) => s.rejectApplication);
  const generateCertificate = useRevenueStore((s) => s.generateCertificate);

  const [remarks, setRemarks] = useState(
    application?.tehsildarRemarks ||
      'Approved. All 4-tier officer verifications validated with zero boundary anomalies. Mutation packet prepared for statutory review.'
  );

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!application) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">{t('Application Not Found')}</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {t('The requested revenue application could not be located in this Tehsildar jurisdiction.')}
        </p>
        <button
          onClick={() => navigate('/revenue/review')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Queue')}
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmApprove = async (finalRemarks: string) => {
    setIsProcessing(true);
    try {
      await approveApplication(application.id, finalRemarks || remarks);
      setShowApproveModal(false);
      toast.success('Executive approval granted and mutation packet prepared!');
    } catch {
      toast.error('Failed to approve application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async (reason: string, finalRemarks: string) => {
    setIsProcessing(true);
    try {
      await rejectApplication(application.id, reason, finalRemarks);
      setShowRejectModal(false);
      toast.success('Application rejected by Executive Order.');
    } catch {
      toast.error('Failed to reject application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmCertificate = async () => {
    setIsProcessing(true);
    try {
      await generateCertificate(application.id);
      toast.success('Bhooraksha Verification Report generated!');
    } catch {
      toast.error('Failed to generate certificate');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header */}
      <ReviewHeader application={application} />

      {/* 2. 4-Tier Verification Summary */}
      <VerificationSummary officers={application.officers} />

      {/* 3. Complete Extracted Application Data */}
      <CompleteData data={application.data} />

      {/* 4. Complete Officer Remarks Transcripts */}
      <OfficerRemarks officers={application.officers} />

      {/* 5. Tehsildar Remarks Input */}
      {application.status === 'pending' && (
        <RemarksInput remarks={remarks} onChange={setRemarks} />
      )}

      {/* 6. Statutory Adjudication Actions */}
      <DecisionActions
        application={application}
        remarks={remarks}
        onApprove={handleApprove}
        onReject={handleReject}
        onGenerateCertificate={() => setShowCertificateModal(true)}
        isProcessing={isProcessing}
      />

      {/* Approve Modal */}
      {showApproveModal && (
        <ApproveModal
          isOpen={true}
          applicationId={application.id}
          ulpin={application.ulpin}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleConfirmApprove}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          isOpen={true}
          applicationId={application.id}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleConfirmReject}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          isOpen={true}
          applicationId={application.id}
          certificateUrl={application.certificateUrl}
          onClose={() => setShowCertificateModal(false)}
          onConfirm={handleConfirmCertificate}
        />
      )}
    </div>
  );
};

export default ApplicationReviewPage;
