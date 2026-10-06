import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from src.models.entities import Document, Application

class DocumentRepository:
    """PostgreSQL repository for Document versioning and metadata management."""

    @staticmethod
    def deprecate_previous_versions(db: Session, application_id: uuid.UUID) -> None:
        """Marks all existing document versions for the application as not current."""
        db.query(Document).filter(
            Document.application_id == application_id,
            Document.is_current_version == True
        ).update({"is_current_version": False})
        db.commit()

    @staticmethod
    def create_document(db: Session, doc_data: Dict[str, Any]) -> Document:
        """Persists a new document version to PostgreSQL."""
        doc = Document(
            id=doc_data.get("id") or (uuid.UUID(doc_data["document_id"]) if "document_id" in doc_data else uuid.uuid4()),
            application_id=doc_data["application_id"],
            document_version=doc_data.get("document_version", 1),
            is_current_version=doc_data.get("is_current_version", True),
            resubmission_reason=doc_data.get("resubmission_reason"),
            document_type=doc_data.get("document_type", "sale_deed"),
            file_name=doc_data["file_name"],
            file_size=doc_data.get("file_size", 0),
            mime_type=doc_data.get("mime_type", "application/pdf"),
            storage_path=doc_data["storage_path"],
            quality_score=doc_data.get("quality_score", 0.0),
            blur_metric=doc_data.get("blur_metric"),
            brightness_metric=doc_data.get("brightness_metric"),
            contrast_metric=doc_data.get("contrast_metric"),
            resolution=doc_data.get("resolution"),
            orientation=doc_data.get("orientation", 0),
            quality_status=doc_data.get("quality_status", "PASSED"),
            quality_findings=doc_data.get("quality_findings", []),
            extracted_text=doc_data.get("extracted_text"),
            confidence_score=doc_data.get("confidence_score", 0.0),
            entities=doc_data.get("entities", {}),
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def get_documents(db: Session, application_id: uuid.UUID) -> List[Document]:
        """Retrieves all document versions for an application, ordered by version."""
        return db.query(Document).filter(
            Document.application_id == application_id
        ).order_by(Document.document_version.asc()).all()

    @staticmethod
    def get_current_document(db: Session, application_id: uuid.UUID) -> Optional[Document]:
        """Retrieves the active current document version for an application."""
        return db.query(Document).filter(
            Document.application_id == application_id,
            Document.is_current_version == True
        ).first()

document_repo = DocumentRepository()
