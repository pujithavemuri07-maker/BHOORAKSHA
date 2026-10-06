from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from src.schemas.user import UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class RefreshRequest(BaseModel):
    refresh_token: str

class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None

class SendOTPRequest(BaseModel):
    phone_or_email: str
    purpose: str = "LOGIN"  # LOGIN, PASSWORD_RESET, ACCOUNT_VERIFICATION

class VerifyOTPRequest(BaseModel):
    phone_or_email: str
    otp: str
    purpose: str = "LOGIN"

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email_or_phone: str

class ResetPasswordRequest(BaseModel):
    identifier: str
    otp: str
    new_password: str

class OAuthLoginRequest(BaseModel):
    provider: str  # google, microsoft, apple
    id_token: Optional[str] = None
    code: Optional[str] = None

class OAuthLinkRequest(BaseModel):
    provider: str
    id_token: str
