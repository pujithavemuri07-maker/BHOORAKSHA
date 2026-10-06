import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLegalApplication } from '../../hooks/useLegalApplication';
import { useClear } from '../../hooks/useClear';
import { useFlag } from '../../hooks/useFlag';
import { useBlock } from '../../hooks/useBlock';
import { useEscalate } from '../../hooks/useEscalate';

// Subcomponents
import { ReviewHeader } from './ReviewHeader';
import { CaseLandSummary } from './CaseLandSummary';
import { DocumentsEvidenceSection } from './DocumentsEvidenceSection';
import { AILegalAssessment } from './AILegalAssessment';
import { DeedRevenueComparison } from './DeedRevenueComparison';
import { LegalReviewChecklist } from './LegalReviewChecklist';
import { OfficerReviewNotes } from './OfficerReviewNotes';
import { SystemAdvisory } from './SystemAdvisory';
import { RecordLegalDecision } from './RecordLegalDecision';
import { AuditTrail } from './AuditTrail';

// Reusable components
import { DocumentViewer } from '../../components/DocumentViewer';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { ErrorState } from '../../components/ErrorState';

// Icons
import {
  Scale,
  FileCheck,
  FolderOpen,
  CheckSquare,
  History,
  Eye,
  LayoutGrid,
  FileText,
  Sparkles,
} from 'lucide-react';

type TabKey =
  | 'workspace'
  | 'analysis'
  | 'comparison'
  | 'documents'
  | 'checklist'
  | 'decision';

export const ApplicationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: application, isLoading, isError, refetch } = useLegalApplication(id);

  const [activeTab, setActiveTab] = useState<TabKey>('workspace');
  const [selectedDocName, setSelectedDocName] = useState<string>('');

  const clearMutation = useClear(id || '');
  const flagMutation = useFlag(id || '');
  const blockMutation = useBlock(id || '');
  const escalateMutation = useEscalate(id || '');

  const isSubmitting =
    clearMutation.isPending ||
    flagMutation.isPending ||
    blockMutation.isPending ||
    escalateMutation.isPending;

  if (isLoading) {
    return <SkeletonLoader type="detail" />;
  }

  if (isError || !application) {
    return (
      <ErrorState
        title="Legal Case File Not Found"
        message={`Could not retrieve case record for ID: ${id}. It may have been archived or transferred.`}
        onRetry={refetch}
      />
    );
  }

  const handleSelectDocument = (docName: string) => {
    setSelectedDocName(docName);
    setActiveTab('documents');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. CASE HEADER */}
      <ReviewHeader application={application} />

      {/* 13. PAGE NAVIGATION / TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('workspace')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'workspace'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Case Review Workspace</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analysis'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>AI Legal Analysis ({application.legalFlagsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'comparison'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Deed vs Revenue Record</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Documents & Evidence</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'checklist'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Review Checklist & Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('decision')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'decision'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Record Decision & Audit</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FULL CASE REVIEW WORKSPACE (Sequential Complete Flow) */}
      {/* ========================================================================= */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* 2. CASE & LAND SUMMARY */}
          <CaseLandSummary application={application} />

          {/* 4 & 5. TWO-COLUMN WORKSPACE: LEFT (AI Legal Analysis & Advisory) / RIGHT (Deed Viewer) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              {/* 5 & 7. AI LEGAL ANALYSIS & FINDINGS */}
              <AILegalAssessment
                application={application}
                onQuoteCitation={() => setActiveTab('checklist')}
              />

              {/* 10. SYSTEM ADVISORY */}
              <SystemAdvisory application={application} />
            </div>

            <div className="lg:col-span-6 space-y-6">
              {/* 4. PRIMARY DOCUMENT VIEWER */}
              <DocumentViewer application={application} />
            </div>
          </div>

          {/* 3. DOCUMENTS & EVIDENCE REPOSITORY */}
          <DocumentsEvidenceSection
            application={application}
            onSelectDocument={handleSelectDocument}
          />

          {/* 6. DEED VS REVENUE RECORD COMPARISON */}
          <DeedRevenueComparison
            extractedData={application.extractedData}
            govtRecord={application.govtRecord}
          />

          {/* 8 & 9. LEGAL REVIEW CHECKLIST + OFFICER REVIEW NOTES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LegalReviewChecklist />
            <OfficerReviewNotes applicationId={application.id} />
          </div>

          {/* 11. FINAL LEGAL DECISION */}
          <RecordLegalDecision
            application={application}
            onClear={(opinion) => clearMutation.mutate(opinion)}
            onFlag={(data) => flagMutation.mutate(data)}
            onBlock={(data) => blockMutation.mutate(data)}
            onEscalate={(remarks) => escalateMutation.mutate(remarks)}
            isSubmitting={isSubmitting}
          />

          {/* 12. AUDIT TRAIL */}
          <AuditTrail application={application} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI LEGAL ANALYSIS FOCUS */}
      {/* ========================================================================= */}
      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <AILegalAssessment
              application={application}
              onQuoteCitation={() => setActiveTab('checklist')}
            />
            <SystemAdvisory application={application} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <DocumentViewer application={application} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEED VS REVENUE RECORD FOCUS */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <CaseLandSummary application={application} />
          <DeedRevenueComparison
            extractedData={application.extractedData}
            govtRecord={application.govtRecord}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOCUMENTS & EVIDENCE FOCUS */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <DocumentViewer application={application} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <DocumentsEvidenceSection
              application={application}
              onSelectDocument={handleSelectDocument}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REVIEW CHECKLIST & NOTES FOCUS */}
      {/* ========================================================================= */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LegalReviewChecklist />
            <OfficerReviewNotes applicationId={application.id} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: RECORD DECISION & AUDIT FOCUS */}
      {/* ========================================================================= */}
      {activeTab === 'decision' && (
        <div className="space-y-6">
          <RecordLegalDecision
            application={application}
            onClear={(opinion) => clearMutation.mutate(opinion)}
            onFlag={(data) => flagMutation.mutate(data)}
            onBlock={(data) => blockMutation.mutate(data)}
            onEscalate={(remarks) => escalateMutation.mutate(remarks)}
            isSubmitting={isSubmitting}
          />
          <AuditTrail application={application} />
        </div>
      )}
    </div>
  );
};

export default ApplicationReviewPage;
