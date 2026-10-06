import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationDetail } from '../../hooks/useApplicationDetail';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationTimeline } from '../../components/ApplicationTimeline';
import { ExtractedDataCards } from './ExtractedDataCards';
import { VerificationResults } from './VerificationResults';
import { ActionButtons } from './ActionButtons';
import { AuditHistory } from './AuditHistory';
import { ShareWithBankModal } from './ShareWithBankModal';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/ErrorState';
import { HistoricalRecordsCard } from '../../components/HistoricalRecordsCard';
import { useTranslation } from '../../i18n';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data: application, isLoading, error } = useApplicationDetail(id);

  if (isLoading) {
    return <SkeletonLoader type="detail" />;
  }

  if (error || !application) {
    return (
      <ErrorState
        title={t('Application Not Found')}
        message={`No application found matching reference "${id}". Please verify the application reference number.`}
        onRetry={() => navigate('/citizen/applications')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <ApplicationHeader
        application={application}
        onShare={() => setIsShareModalOpen(true)}
      />

      {/* 7-Step Verification Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('Verification Pipeline Stage')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('Real-time progression through AI quality checks, GIS analysis, and revenue sanction')}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {application.status}
          </span>
        </div>

        <ApplicationTimeline status={application.status} />
      </div>

      {/* Extracted Data (2x2 Grid) */}
      <ExtractedDataCards data={application.extractedData} />

      {/* Historical Ownership Chain from Old Registers */}
      <HistoricalRecordsCard ulpin={application.extractedData?.propertyDetails?.ulpin || 'KA-1234-5678-9012'} />

      {/* AI Verification Results (Risk Gauge + Map) */}
      <VerificationResults
        riskScore={application.riskScore}
        confidenceCategory={application.confidenceCategory}
        riskFactors={application.riskFactors}
        legalFlags={application.legalFlags}
        gisData={application.gisData}
        surveyNumber={application.extractedData.propertyDetails.surveyNumber}
        village={application.extractedData.propertyDetails.village}
      />

      {/* Action Buttons */}
      <ActionButtons
        status={application.status}
        applicationId={application.id}
        onShare={() => setIsShareModalOpen(true)}
      />

      {/* Audit History */}
      <AuditHistory auditLog={application.auditLog} />

      {/* Share With Bank Modal */}
      <ShareWithBankModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        applicationId={application.id}
        ulpin={application.extractedData.propertyDetails.ulpin}
      />
    </div>
  );
};
export default ApplicationDetailPage;
