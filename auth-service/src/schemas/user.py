from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

CANONICAL_ROLES = ["CITIZEN", "DEO", "VERIFIER", "LEGAL", "GIS", "REVENUE", "ADMIN"]
STAFF_ROLES = ["DEO", "VERIFIER", "LEGAL", "GIS", "REVENUE", "ADMIN"]

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = None
    preferred_language: str = "en"

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    # If client passes role in request, it will be strictly ignored or overridden by backend to CITIZEN
    role: Optional[str] = None

class StaffProvisionRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = None
    role: str = Field(..., description="Staff role: DEO, VERIFIER, LEGAL, GIS, REVENUE, ADMIN")
    password: str = Field(..., min_length=8)
    preferred_language: str = "en"

    @field_validator("role")
    @classmethod
    def validate_staff_role(cls, v: str) -> str:
        norm = v.strip().upper()
        if norm not in STAFF_ROLES:
            raise ValueError(f"Role must be one of authorized staff roles: {STAFF_ROLES}")
        return norm

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None

class UserStatusUpdate(BaseModel):
    is_active: bool

class UserRoleUpdate(BaseModel):
    role: str = Field(..., description="Target role: CITIZEN, DEO, VERIFIER, LEGAL, GIS, REVENUE, ADMIN")

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        norm = v.strip().upper()
        if norm not in CANONICAL_ROLES:
            raise ValueError(f"Role must be one of {CANONICAL_ROLES}")
        return norm


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str
    preferred_language: str = "en"
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime
