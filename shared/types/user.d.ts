export type CanonicalUserRole =
  | 'CITIZEN'
  | 'DEO'
  | 'VERIFIER'
  | 'LEGAL'
  | 'GIS'
  | 'REVENUE'
  | 'ADMIN';

export type LowerUserRole =
  | 'citizen'
  | 'deo'
  | 'verifier'
  | 'legal'
  | 'gis'
  | 'revenue'
  | 'admin';

export type UserRole = CanonicalUserRole | LowerUserRole;

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  name?: string; // Client convenience alias for full_name
  phone?: string | null;
  role: CanonicalUserRole | string;
  preferred_language?: string;
  languagePreference?: string; // Client convenience alias
  is_active: boolean;
  isActive?: boolean;
  is_verified: boolean;
  isVerified?: boolean;
  created_at?: string;
  designation?: string;
  department?: string;
  office?: string;
  jurisdiction?: string;
  city?: string;
  pincode?: string;
  district?: string;
  state?: string;
  barCouncilId?: string;
  licenseNumber?: string;
  employeeId?: string;
  assignedMandals?: string[];
  surveyArea?: string;
  officeAddress?: string;
  notificationsEnabled?: {
    email?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };
}

export type User = UserResponse;

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  preferred_language?: string;
}

export interface SendOtpRequest {
  phone_or_email: string;
  purpose?: string;
}

export interface VerifyOtpRequest {
  phone_or_email: string;
  otp: string;
  purpose?: string;
}

export interface ForgotPasswordRequest {
  email_or_phone: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  otp: string;
  new_password: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface StaffProvisionRequest {
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  password: string;
  preferred_language?: string;
}

export interface OAuthAuthorizeResponse {
  auth_url: string;
  provider: string;
  state: string;
}

export interface OAuthLoginRequest {
  provider: string;
  id_token?: string;
  code?: string;
}
