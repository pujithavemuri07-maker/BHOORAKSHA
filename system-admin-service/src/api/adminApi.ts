import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:8080';
};

export const adminClient = axios.create({
  baseURL: `${getBaseUrl()}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem('bhooraksha_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AdminQueueParams {
  status?: string;
  stage?: string;
  priority?: string;
  risk?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminMetrics {
  total_applications: number;
  pending_applications: number;
  under_verification: number;
  completed_verification: number;
  ready_for_admin_review: number;
  approved: number;
  rejected: number;
  returned: number;
  high_risk: number;
  recent_applications: any[];
}

export interface AdminApplicationSummary {
  application_id: string;
  application_no: string;
  applicant_id: string;
  applicant_name: string;
  parcel_id: string;
  official_ulpin?: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  survey_number: string;
  subdivision_number?: string;
  extent_acres: number;
  status: string;
  current_stage: string;
  review_priority_score: number;
  review_priority_level: string;
  recommended_route: string;
  contributing_findings: string[];
  documents: any[];
  current_document?: any;
  created_at: string;
  updated_at: string;
}

export interface AdminActionPayload {
  action_type: 'APPROVE' | 'REJECT' | 'RETURN_FOR_CORRECTION' | 'REQUEST_ADDITIONAL_DOCS' | 'ESCALATE';
  reason?: string;
  remarks?: string;
  required_document?: string;
  target_role?: string;
}

export const adminApi = {
  getMetrics: async (): Promise<AdminMetrics> => {
    try {
      const res = await adminClient.get('/applications/admin/metrics');
      return res.data?.data || res.data;
    } catch {
      return {
        total_applications: 3,
        pending_applications: 1,
        under_verification: 1,
        completed_verification: 0,
        ready_for_admin_review: 1,
        approved: 0,
        rejected: 0,
        returned: 0,
        high_risk: 1,
        recent_applications: [],
      };
    }
  },

  getQueue: async (params?: AdminQueueParams): Promise<{ items: AdminApplicationSummary[]; total: number; page: number; total_pages: number }> => {
    try {
      const res = await adminClient.get('/applications/admin/queue', { params });
      return res.data?.data || res.data;
    } catch {
      return { items: [], total: 0, page: 1, total_pages: 1 };
    }
  },

  getApplicationDetails: async (applicationNo: string): Promise<any> => {
    try {
      const res = await adminClient.get(`/applications/${applicationNo}/admin/details`);
      return res.data?.data || res.data;
    } catch (e) {
      console.error('Failed to fetch admin application details:', e);
      throw e;
    }
  },

  executeAction: async (applicationNo: string, payload: AdminActionPayload): Promise<any> => {
    const formData = new FormData();
    if (payload.reason) formData.append('reason', payload.reason);
    if (payload.remarks) formData.append('remarks', payload.remarks);
    if (payload.required_document) formData.append('required_document', payload.required_document);
    if (payload.target_role) formData.append('target_role', payload.target_role);

    const res = await adminClient.post(
      `/applications/${applicationNo}/admin/action?action_type=${payload.action_type}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data?.data || res.data;
  },

  getAuditTrail: async (applicationNo: string): Promise<any> => {
    try {
      const res = await adminClient.get(`/applications/${applicationNo}/audit`);
      return res.data?.data || res.data;
    } catch (e) {
      console.error('Failed to fetch audit trail:', e);
      return null;
    }
  },
};
