import { create } from 'zustand';
import { UserResponse, TokenResponse, LoginRequest, VerifyOtpRequest } from '../types/user';
import {
  authClient,
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredUser,
  saveSession,
  clearSession,
  onAuthEvent,
} from '../api/authClient';

export interface AuthState {
  user: (UserResponse & { token?: string }) | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initializeAuth: () => Promise<void>;
  login: (credentials: LoginRequest) => Promise<TokenResponse>;
  loginWithOtp: (payload: VerifyOtpRequest) => Promise<TokenResponse>;
  setSession: (session: TokenResponse) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserResponse>) => void;
  clearError: () => void;
}

export const DEFAULT_USERS_BY_ROLE: Record<string, UserResponse & { token?: string }> = {
  citizen: {
    id: 'usr-citizen-01',
    email: 'citizen@bhooraksha.gov.in',
    full_name: 'Sri K. Venkata Rao',
    name: 'Sri K. Venkata Rao',
    role: 'CITIZEN',
    designation: 'Citizen / Land Owner',
    department: 'Public',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
  deo: {
    id: 'usr-deo-01',
    email: 'deo@bhooraksha.gov.in',
    full_name: 'Smt. P. Sunitha',
    name: 'Smt. P. Sunitha',
    role: 'DEO',
    designation: 'Data Entry Operator',
    department: 'Registration & Revenue Department',
    office: 'Sub-Registrar Office, Gajuwaka',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
  verifier: {
    id: 'usr-verifier-01',
    email: 'verifier@bhooraksha.gov.in',
    full_name: 'Sri K. Madhava Rao',
    name: 'Sri K. Madhava Rao',
    role: 'VERIFIER',
    designation: 'Senior Field Verification Officer',
    department: 'Revenue & Survey Department',
    office: 'Tahsildar Office, Visakhapatnam Rural',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    assignedMandals: ['Gajuwaka', 'Pedagantyada', 'Anandapuram'],
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
  gis: {
    id: 'usr-gis-01',
    email: 'gis@bhooraksha.gov.in',
    full_name: 'S. Ramakrishna',
    name: 'S. Ramakrishna',
    role: 'GIS',
    designation: 'Chief GIS & Cadastral Analyst',
    department: 'Directorate of Survey & Land Records',
    office: 'AP State Remote Sensing Applications Centre',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    surveyArea: 'Visakhapatnam Urban & Peri-urban',
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
  revenue: {
    id: 'usr-revenue-01',
    email: 'revenue@bhooraksha.gov.in',
    full_name: 'Smt. K. Shailaja, IAS',
    name: 'Smt. K. Shailaja, IAS',
    role: 'REVENUE',
    designation: 'Joint Collector & Additional District Magistrate',
    department: 'Revenue Administration',
    office: 'Collectorate, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    jurisdiction: 'Visakhapatnam District',
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
  admin: {
    id: 'usr-admin-01',
    email: 'admin@bhooraksha.gov.in',
    full_name: 'Sri V. Someshwar Rao',
    name: 'Sri V. Someshwar Rao',
    role: 'ADMIN',
    designation: 'Chief Technology Officer & System Administrator',
    department: 'Information Technology, Electronics & Communications',
    office: 'Bhooraksha State Data Centre, Amaravati',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
  legal: {
    id: 'usr-legal-01',
    email: 'legal@bhooraksha.gov.in',
    full_name: 'Adv. S. Ramanujam',
    name: 'Adv. S. Ramanujam',
    role: 'LEGAL',
    designation: 'Senior Standing Legal Counsel',
    department: 'State Legal Affairs Department',
    office: 'Office of the Advocate General, High Court of AP',
    district: 'Amaravati',
    state: 'Andhra Pradesh',
    barCouncilId: 'AP/1428/2004',
    is_active: true,
    is_verified: true,
    preferred_language: 'en',
    languagePreference: 'en',
    token: 'mock-bhooraksha-token',
  },
};

export function getDefaultUserForPath(): UserResponse & { token?: string } {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/deo')) return DEFAULT_USERS_BY_ROLE.deo;
    if (path.includes('/verifier')) return DEFAULT_USERS_BY_ROLE.verifier;
    if (path.includes('/gis')) return DEFAULT_USERS_BY_ROLE.gis;
    if (path.includes('/revenue')) return DEFAULT_USERS_BY_ROLE.revenue;
    if (path.includes('/admin')) return DEFAULT_USERS_BY_ROLE.admin;
    if (path.includes('/legal')) return DEFAULT_USERS_BY_ROLE.legal;
    if (path.includes('/citizen')) return DEFAULT_USERS_BY_ROLE.citizen;
  }
  return DEFAULT_USERS_BY_ROLE.citizen;
}

export function getActiveMockUser(): UserResponse & { token?: string } {
  const defaultUser = getDefaultUserForPath();
  if (typeof window === 'undefined') return defaultUser;
  try {
    const stored = localStorage.getItem('bhooraksha_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const path = window.location.pathname.toLowerCase();
      const currentPortal = ['deo', 'verifier', 'gis', 'revenue', 'admin', 'legal', 'citizen'].find((p) =>
        path.includes('/' + p)
      );
      if (
        !currentPortal ||
        parsed.role?.toLowerCase() === currentPortal ||
        (currentPortal === 'admin' && (parsed.role?.toLowerCase() === 'admin' || parsed.role?.toLowerCase() === 'system_admin'))
      ) {
        return { ...defaultUser, ...parsed, token: defaultUser.token || 'mock-bhooraksha-token' };
      }
    }
  } catch (e) {
    // fallback
  }
  return defaultUser;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Always active, no authentication block
  const initialUser = getActiveMockUser();

  return {
    user: initialUser,
    token: getStoredAccessToken() || 'mock-bhooraksha-token',
    refreshToken: getStoredRefreshToken() || 'mock-bhooraksha-refresh-token',
    isAuthenticated: true,
    isLoading: false,
    error: null,

    initializeAuth: async () => {
      // In bypass mode, guarantee authentication is always true with the right role user
      const currentUser = getActiveMockUser();
      set({
        user: currentUser,
        token: getStoredAccessToken() || 'mock-bhooraksha-token',
        refreshToken: getStoredRefreshToken() || 'mock-bhooraksha-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },

    login: async (credentials: LoginRequest) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authClient.login(credentials);
        set({
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (err: any) {
        const mockUser = getActiveMockUser();
        set({
          user: mockUser,
          token: 'mock-bhooraksha-token',
          refreshToken: 'mock-bhooraksha-refresh-token',
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return {
          access_token: 'mock-bhooraksha-token',
          refresh_token: 'mock-bhooraksha-refresh-token',
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser,
        };
      }
    },

    loginWithOtp: async (payload: VerifyOtpRequest) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authClient.verifyOtp(payload);
        set({
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response;
      } catch (err: any) {
        const mockUser = getActiveMockUser();
        set({
          user: mockUser,
          token: 'mock-bhooraksha-token',
          refreshToken: 'mock-bhooraksha-refresh-token',
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return {
          access_token: 'mock-bhooraksha-token',
          refresh_token: 'mock-bhooraksha-refresh-token',
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser,
        };
      }
    },

    setSession: (response: TokenResponse) => {
      saveSession(response);
      set({
        user: response.user,
        token: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },

    logout: async () => {
      const mockUser = getActiveMockUser();
      set({
        user: mockUser,
        token: 'mock-bhooraksha-token',
        refreshToken: 'mock-bhooraksha-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },

    updateUser: (data: Partial<UserResponse>) => {
      set((state) => {
        if (!state.user) return state;
        const updated = { ...state.user, ...data };
        if (typeof window !== 'undefined') {
          localStorage.setItem('bhooraksha_user', JSON.stringify(updated));
        }
        return { user: updated };
      });
    },

    clearError: () => set({ error: null }),
  };
});
