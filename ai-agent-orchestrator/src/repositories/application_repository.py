import uuid
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, and_
from src.models.entities import Application, Document

class ApplicationRepository:
    """Repository for Application lifecycle management with real database persistence."""

    @staticmethod
    def create_application(db: Session, app_data: Dict[str, Any]) -> Application:
        """Persists a new application."""
        app = Application(
            id=app_data.get("id") or uuid.uuid4(),
            application_no=app_data["application_no"],
            applicant_id=app_data.get("applicant_id") or uuid.uuid4(),
            parcel_id=app_data["parcel_id"],
            official_ulpin=app_data.get("official_ulpin"),
            ulpin_source=app_data.get("ulpin_source"),
            ulpin_status=app_data.get("ulpin_status", "UNASSIGNED"),
            ulpin_verified_at=app_data.get("ulpin_verified_at"),
            state=app_data["state"],
            district=app_data["district"],
            taluk=app_data["taluk"],
            village=app_data["village"],
            survey_number=app_data["survey_number"],
            subdivision_number=app_data.get("subdivision_number"),
            extent_acres=app_data["extent_acres"],
            status=app_data.get("status", "SUBMITTED"),
            current_stage=app_data.get("current_stage", "QUALITY_CHECK"),
            review_priority_score=app_data.get("review_priority_score", 10),
            review_priority_level=app_data.get("review_priority_level", "low"),
            recommended_route=app_data.get("recommended_route", "STANDARD_VERIFICATION"),
            contributing_findings=app_data.get("contributing_findings", []),
            sla_deadline=app_data.get("sla_deadline"),
            metadata_json=app_data.get("metadata", {}),
        )
        db.add(app)
        db.commit()
        db.refresh(app)
        return app

    @staticmethod
    def get_application(db: Session, application_no: str) -> Optional[Application]:
        """Retrieves application by server-authoritative application_no."""
        return db.query(Application).filter(Application.application_no == application_no).first()

    @staticmethod
    def list_applications(
        db: Session,
        status: Optional[str] = None,
        stage: Optional[str] = None,
        priority: Optional[str] = None,
        risk: Optional[str] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 50
    ) -> Tuple[List[Application], int]:
        """Lists applications with comprehensive filtering, search, and pagination."""
        query = db.query(Application)

        if status and status.upper() != "ALL":
            query = query.filter(func.upper(Application.status) == status.upper())

        if stage and stage.upper() != "ALL":
            query = query.filter(func.upper(Application.current_stage) == stage.upper())

        if priority and priority.upper() != "ALL":
            query = query.filter(func.upper(Application.review_priority_level) == priority.upper())

        if risk and risk.upper() != "ALL":
            if risk.upper() == "HIGH":
                query = query.filter(Application.review_priority_score >= 60)
            elif risk.upper() == "MEDIUM":
                query = query.filter(and_(Application.review_priority_score >= 30, Application.review_priority_score < 60))
            elif risk.upper() == "LOW":
                query = query.filter(Application.review_priority_score < 30)

        if search:
            q = f"%{search.lower().strip()}%"
            query = query.filter(
                or_(
                    func.lower(Application.application_no).like(q),
                    func.lower(Application.survey_number).like(q),
                    func.lower(Application.village).like(q),
                    func.lower(Application.district).like(q),
                    func.lower(Application.parcel_id).like(q),
                )
            )

        total = query.count()
        items = query.order_by(Application.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        return items, total

    @staticmethod
    def get_metrics(db: Session) -> Dict[str, Any]:
        """Calculates real dynamic dashboard statistics from database records."""
        all_apps = db.query(Application).all()
        total = len(all_apps)

        pending_statuses = {"SUBMITTED", "QUALITY_CHECK", "PROCESSING", "AI_PROCESSING", "UNDER_HUMAN_REVIEW", "READY_FOR_ADMIN_REVIEW"}
        under_verification_statuses = {"UNDER_HUMAN_REVIEW", "PROCESSING", "QUALITY_CHECK", "AI_PROCESSING"}
        
        pending_count = sum(1 for a in all_apps if a.status.upper() in pending_statuses)
        under_verification = sum(1 for a in all_apps if a.status.upper() in under_verification_statuses and a.current_stage.upper() not in {"ADMIN_STAGE", "READY_FOR_ADMIN_REVIEW", "ADMIN_REVIEW"})
        
        # Ready for Admin Review
        ready_for_admin = sum(
            1 for a in all_apps
            if a.status.upper() in {"READY_FOR_ADMIN_REVIEW"} 
            or (a.current_stage and a.current_stage.upper() in {"ADMIN_STAGE", "READY_FOR_ADMIN_REVIEW", "ADMIN_REVIEW", "SYSTEM_ADMIN"} and a.status.upper() not in {"APPROVED", "VERIFIED", "REJECTED"})
        )
        
        approved = sum(1 for a in all_apps if a.status.upper() in {"APPROVED", "VERIFIED"})
        rejected = sum(1 for a in all_apps if a.status.upper() in {"REJECTED"})
        returned = sum(1 for a in all_apps if a.status.upper() in {"RETURNED_FOR_CORRECTION", "CORRECTION_REQUIRED", "RESUBMISSION_REQUIRED", "ADDITIONAL_DOCS_REQUESTED"})
        high_risk = sum(1 for a in all_apps if (a.review_priority_score or 0) >= 60)
        completed_verification = approved + rejected

        recent = []
        for a in sorted(all_apps, key=lambda x: x.created_at or func.now(), reverse=True)[:5]:
            meta = a.metadata_json if isinstance(a.metadata_json, dict) else {}
            recent.append({
                "application_no": a.application_no,
                "applicant_name": meta.get("applicant_name", "Citizen"),
                "village": a.village,
                "survey_number": a.survey_number,
                "status": a.status,
                "stage": a.current_stage,
                "priority": a.review_priority_level,
                "risk_score": a.review_priority_score,
                "created_at": a.created_at.isoformat() if a.created_at else "",
            })

        return {
            "total_applications": total,
            "pending_applications": pending_count,
            "under_verification": under_verification,
            "completed_verification": completed_verification,
            "ready_for_admin_review": ready_for_admin,
            "approved": approved,
            "rejected": rejected,
            "returned": returned,
            "high_risk": high_risk,
            "recent_applications": recent,
        }

    @staticmethod
    def update_application(db: Session, application_no: str, update_data: Dict[str, Any]) -> Optional[Application]:
        """Updates application fields with proper transaction handling."""
        app = db.query(Application).filter(Application.application_no == application_no).first()
        if not app:
            return None

        for key, val in update_data.items():
            if hasattr(app, key):
                setattr(app, key, val)

        db.commit()
        db.refresh(app)
        return app

    @staticmethod
    def update_status(
        db: Session,
        application_no: str,
        status: str,
        current_stage: Optional[str] = None
    ) -> Optional[Application]:
        """Updates application status and stage."""
        app = db.query(Application).filter(Application.application_no == application_no).first()
        if not app:
            return None

        app.status = status
        if current_stage:
            app.current_stage = current_stage

        db.commit()
        db.refresh(app)
        return app

application_repo = ApplicationRepository()

