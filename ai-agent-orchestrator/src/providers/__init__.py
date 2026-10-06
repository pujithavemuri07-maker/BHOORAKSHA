from .document_extraction import (
    DocumentExtractionProvider,
    DemoDocumentExtractionProvider,
    PaddleOCRDocumentExtractionProvider,
    TesseractDocumentExtractionProvider,
    get_extraction_provider,
)
from .quality_assessment import (
    QualityAssessmentProvider,
    RealQualityAssessmentProvider,
    DemoQualityAssessmentProvider,
    get_quality_provider,
)
from .government_record import GovernmentRecordProvider
from .court_record import CourtRecordProvider

__all__ = [
    "DocumentExtractionProvider",
    "DemoDocumentExtractionProvider",
    "PaddleOCRDocumentExtractionProvider",
    "TesseractDocumentExtractionProvider",
    "get_extraction_provider",
    "QualityAssessmentProvider",
    "RealQualityAssessmentProvider",
    "DemoQualityAssessmentProvider",
    "get_quality_provider",
    "GovernmentRecordProvider",
    "CourtRecordProvider",
]
