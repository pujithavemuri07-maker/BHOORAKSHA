from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ApplicationCreate(BaseModel):
    state: str = Field("Karnataka", description="State name")
    district: str = Field("Bengaluru Urban", description="District name")
    taluk: str = Field("Anekal", description="Taluk / Tehsil name")
    village: str = Field("Sarjapura", description="Village / Revenue ward name")
    survey_number: str = Field("142", description="Survey or CTS number")
    subdivision_number: Optional[str] = Field("2A", description="Subdivision or Hissa number")
    extent_acres: float = Field(2.45, description="Claimed extent in acres", gt=0)
    document_type: str = Field("sale_deed", description="Document type")
    applicant_id: Optional[str] = Field(None, description="Citizen/Applicant ID UUID")
    applicant_name: Optional[str] = Field("Rajesh Sharma", description="Citizen name")

class ResubmitRequest(BaseModel):
    resubmission_reason: str = Field(..., description="Explanation of changes or corrections in resubmitted document")

class ReviewDecisionRequest(BaseModel):
    action: str = Field(..., description="Action taken: FLAG, EXPLAIN, ROUTE, REVIEW, DECIDE")
    stage: str = Field(..., description="Current verification stage")
    decision: Optional[str] = Field(None, description="DECISION: APPROVE, REJECT, REQUEST_CHANGES, FORWARD")
    reason: str = Field(..., description="Human officer reason and remarks")
    old_value: Optional[Dict[str, Any]] = None
    new_value: Optional[Dict[str, Any]] = None
    evidence_ids: Optional[List[str]] = Field(default_factory=list, description="IDs of evidence evaluated")

class MutationPrepareRequest(BaseModel):
    officer_approval_notes: str = Field(..., description="Officer sign-off and approval rationale for mutation packet preparation")
