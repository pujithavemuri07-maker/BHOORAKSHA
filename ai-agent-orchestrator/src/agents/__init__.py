from .quality import QualityAssessmentAgent, DocumentQualityAgent
from .language import LanguageDetectionAgent, LanguageTranslationAgent
from .extraction import DocumentExtractionAgent, IndicOCRAgent, IndicNERAgent
from .validation import RuleValidationAgent, InternalValidationAgent
from .cross_verify import HistoricalCrossRecordValidationAgent, CrossVerifyAgent
from .gis import GISSpatialValidationAgent, GISBoundaryAgent
from .legal import LegalPartyEvidenceReviewAgent, LegalAnalysisAgent
from .consistency import DuplicateConsistencyAgent
from .risk import ReviewPriorityRoutingAgent, RiskScoringAgent
from .old_doc_preprocessor import OldDocPreprocessor
from .htr_recognizer import HTRRecognizer
from .issue_detector import IssueDetector
from .owner_notifier import OwnerNotifier

__all__ = [
    # 9 Logical Verification Agents
    "QualityAssessmentAgent",
    "LanguageDetectionAgent",
    "DocumentExtractionAgent",
    "RuleValidationAgent",
    "HistoricalCrossRecordValidationAgent",
    "GISSpatialValidationAgent",
    "LegalPartyEvidenceReviewAgent",
    "DuplicateConsistencyAgent",
    "ReviewPriorityRoutingAgent",

    # Old Document Digitization Agents
    "OldDocPreprocessor",
    "HTRRecognizer",
    "IssueDetector",
    "OwnerNotifier",

    # Backward-compatibility aliases
    "DocumentQualityAgent",
    "LanguageTranslationAgent",
    "IndicOCRAgent",
    "IndicNERAgent",
    "InternalValidationAgent",
    "CrossVerifyAgent",
    "GISBoundaryAgent",
    "LegalAnalysisAgent",
    "RiskScoringAgent",
]
