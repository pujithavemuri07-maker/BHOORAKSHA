import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  TokenResponse,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordChangeRequest,
  StaffProvisionRequest,
  OAuthAuthorizeResponse,
  OAuthLoginRequest,
} from '../types/user';

export const ACCESS_TOKEN_KEY = 'bhooraksha_access_token';
export const REFRESH_TOKEN_KEY = 'bhooraksha_refresh_token';
export const USER_KEY = 'bhooraksha_user';
export const LEGACY_TOKEN_KEY = 'bhooraksha_auth_token';

// Helper storage functions
export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): UserResponse | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(tokens: TokenResponse): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(LEGACY_TOKEN_KEY, tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  }
  if (tokens.user) {
    // Normalise name alias for frontend convenience
    const userWithAliases: UserResponse = {
      ...tokens.user,
      name: tokens.user.full_name || tokens.user.name || '',
      role: tokens.user.role.toUpperCase() as any,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userWithAliases));
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Clear any legacy logged-out markers
  const legacyKeys = [
    'bhooraksha_citizen_logged_out',
    'bhooraksha_verifier_logged_out',
    'bhooraksha_gis_logged_out',
    'bhooraksha_revenue_logged_out',
    'bhooraksha_admin_logged_out',
  ];
  legacyKeys.forEach((k) => localStorage.removeItem(k));
}

// Event system for session expiry notifications
type AuthEventListener = (event: 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN', data?: any) => void;
const listeners: Set<AuthEventListener> = new Set();

export function onAuthEvent(listener: AuthEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emitAuthEvent(event: 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN', data?: any) {
  listeners.forEach((fn) => {
    try {
      fn(event, data);
    } catch (e) {
      console.error('Error in auth event listener:', e);
    }
  });
}

// Create centralized Axios instance targeting the Unified Gateway
export const authApi: AxiosInstance = axios.create({
  baseURL: '/api/v1/auth',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token
authApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh & Global 401/403 Handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

authApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If the 401 comes from login, refresh itself, or register, do not attempt refresh loop
      if (
        originalRequest.url?.includes('/login') ||
        originalRequest.url?.includes('/refresh') ||
        originalRequest.url?.includes('/register')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        clearSession();
        emitAuthEvent('SESSION_EXPIRED', { reason: 'No refresh token available' });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return authApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post<TokenResponse>(
          '/api/v1/auth/refresh',
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newTokens = response.data;
        saveSession(newTokens);
        processQueue(null, newTokens.access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
        }
        return authApi(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearSession();
        emitAuthEvent('SESSION_EXPIRED', { reason: 'Refresh token expired or invalid' });
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden without logging out
    if (error.response?.status === 403) {
      emitAuthEvent('FORBIDDEN', error.response.data);
    }

    return Promise.reject(error);
  }
);

// High-level Auth API client methods
export const authClient = {
  async register(payload: RegisterRequest): Promise<UserResponse> {
    const res = await authApi.post<UserResponse>('/register', payload);
    return res.data;
  },

  async login(payload: LoginRequest): Promise<TokenResponse> {
    const res = await authApi.post<TokenResponse>('/login', payload);
    saveSession(res.data);
    return res.data;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const res = await authApi.get<UserResponse>('/me');
    const userWithAliases: UserResponse = {
      ...res.data,
      name: res.data.full_name || res.data.name || '',
      role: res.data.role.toUpperCase() as any,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(userWithAliases));
    }
    return userWithAliases;
  },

  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const res = await authApi.post<TokenResponse>('/refresh', { refresh_token: refreshToken });
    saveSession(res.data);
    return res.data;
  },

  async logout(): Promise<void> {
    const refreshToken = getStoredRefreshToken();
    try {
      await authApi.post('/logout', { refresh_token: refreshToken || undefined });
    } catch {
      // Session revoked or offline, proceed with local cleanup
    } finally {
      clearSession();
    }
  },

  async sendOtp(payload: SendOtpRequest): Promise<{ status: string; message: string; debug_otp?: string }> {
    const res = await authApi.post('/otp/send', payload);
    return res.data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<TokenResponse> {
    const res = await authApi.post<TokenResponse>('/otp/verify', payload);
    saveSession(res.data);
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<{ message: string; debug_otp?: string }> {
    const res = await authApi.post('/password/forgot', payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<{ message: string }> {
    const res = await authApi.post('/password/reset', payload);
    return res.data;
  },

  async changePassword(payload: PasswordChangeRequest): Promise<{ message: string }> {
    const res = await authApi.post('/password/change', payload);
    return res.data;
  },

  async getOAuthAuthorizeUrl(provider: string): Promise<OAuthAuthorizeResponse> {
    try {
      const res = await authApi.get<OAuthAuthorizeResponse>(`/oauth/${provider}/authorize`);
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 501) {
        throw new Error(`CONFIGURATION_REQUIRED: ${err.response.data?.detail || 'OAuth provider not configured on server'}`);
      }
      throw err;
    }
  },

  async handleOAuthCallback(provider: string, payload: OAuthLoginRequest): Promise<TokenResponse> {
    const res = await authApi.post<TokenResponse>(`/oauth/${provider}/callback`, payload);
    saveSession(res.data);
    return res.data;
  },

  async provisionStaff(payload: StaffProvisionRequest): Promise<UserResponse> {
    const res = await authApi.post<UserResponse>('/staff/provision', payload);
    return res.data;
  },
};
