import { api } from './client';
import {
  DEOApplication,
  DEOStats,
  Verifier,
  HistoryRecord,
  ManualEntryPayload,
} from './types';
import { useDEOStore } from '../store/deoStore';
import { useAuthStore } from '../store/authStore';

import { sanitizeApplication } from '../utils/riskClassification';

const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === 'true';

export const deoApi = {
  getStats: async (): Promise<DEOStats> => {
    if (USE_LIVE_API) {
      try {
        const res = await api.get('/deo/stats');
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    return useDEOStore.getState().getStats();
  },

  getQueue: async (params?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: DEOApplication[]; total: number; page: number; totalPages: number }> => {
    if (USE_LIVE_API) {
      try {
        const res = await api.get('/deo/queue', { params });
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    let list = useDEOStore.getState().applications.map(sanitizeApplication);

    if (params?.status && params.status !== 'all') {
      const s = params.status.toUpperCase();
      if (s === 'READY_TO_FORWARD') {
        list = list.filter((a) => a.status === 'READY_TO_FORWARD' || a.riskScore >= 75);
      } else if (s === 'NEEDS_ATTENTION') {
        list = list.filter((a) => a.status === 'NEEDS_ATTENTION' || (a.riskScore >= 50 && a.riskScore < 75));
      } else if (s === 'MISSING_DOCUMENTS') {
        list = list.filter((a) => a.status === 'MISSING_DOCUMENTS' || a.riskScore < 50);
      } else if (s === 'API_FAILURE' || s === 'API_FAILURE_MANUAL_ENTRY') {
        list = list.filter((a) => a.status === 'API_FAILURE_MANUAL_ENTRY' || a.govtApiStatus === 'failed');
      } else if (s === 'ROUTED_TO_VERIFIER') {
        list = list.filter((a) => a.status === 'ROUTED_TO_VERIFIER');
      } else if (s === 'PENDING' || s === 'PENDING_DEO_REVIEW') {
        list = list.filter((a) => a.status === 'PENDING_DEO_REVIEW' || a.status === 'NEEDS_ATTENTION');
      } else {
        list = list.filter((a) => a.status.toLowerCase() === params.status?.toLowerCase());
      }
    }

    if (params?.priority && params.priority !== 'all') {
      const p = params.priority.toUpperCase();
      if (p === 'HIGH' || p === 'CRITICAL') {
        list = list.filter((a) => a.priority === 'HIGH' || a.priority === 'CRITICAL' || a.riskScore < 50);
      } else if (p === 'MEDIUM') {
        list = list.filter((a) => a.priority === 'MEDIUM' || (a.riskScore >= 50 && a.riskScore < 75));
      } else if (p === 'LOW') {
        list = list.filter((a) => a.priority === 'LOW' || a.riskScore >= 75);
      } else {
        list = list.filter((a) => a.priority.toLowerCase() === params.priority?.toLowerCase());
      }
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.citizenName.toLowerCase().includes(q) ||
          a.extractedData.propertyDetails.surveyNumber.toLowerCase().includes(q) ||
          a.extractedData.propertyDetails.village.toLowerCase().includes(q)
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const data = list.slice((page - 1) * limit, page * limit);

    return { data, total, page, totalPages };
  },

  getApplicationById: async (id: string): Promise<DEOApplication | null> => {
    if (USE_LIVE_API) {
      try {
        const res = await api.get(`/deo/application/${id}`);
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    const app = useDEOStore.getState().applications.find((a) => a.id === id);
    return app ? sanitizeApplication(app) : null;
  },

  saveCorrections: async (
    applicationId: string,
    remarks?: string
  ): Promise<{ success: boolean; message: string }> => {
    useDEOStore.getState().saveCorrections(applicationId, remarks);
    if (USE_LIVE_API) {
      try {
        await api.post(`/deo/save-corrections/${applicationId}`, { remarks });
      } catch {
        // Local store updated
      }
    }
    return { success: true, message: 'Corrections saved successfully.' };
  },

  submitManualEntry: async (
    id: string,
    payload: ManualEntryPayload
  ): Promise<{ success: boolean; message: string }> => {
    useDEOStore.getState().saveManualEntry(id, payload);
    if (USE_LIVE_API) {
      try {
        await api.post(`/deo/manual-entry/${id}`, payload);
      } catch {
        // Local store updated
      }
    }
    return { success: true, message: 'Manual record saved and cross-verified successfully.' };
  },

  forwardToVerifier: async (payload: {
    applicationId: string;
    verifierId: string;
    remarks?: string;
  }): Promise<{ success: boolean; message: string }> => {
    useDEOStore.getState().forwardApplication(payload.applicationId, payload.verifierId, payload.remarks);
    if (USE_LIVE_API) {
      try {
        await api.post(`/deo/forward/${payload.applicationId}`, payload);
      } catch {
        // Local store updated
      }
    }
    return { success: true, message: 'Application approved and forwarded to designated Verifier.' };
  },

  requestCorrection: async (payload: {
    applicationId: string;
    reason: string;
    remarks?: string;
  }): Promise<{ success: boolean; message: string }> => {
    useDEOStore.getState().flagCorrection(payload.applicationId, payload.reason, payload.remarks);
    if (USE_LIVE_API) {
      try {
        await api.post(`/deo/correction/${payload.applicationId}`, payload);
      } catch {
        // Local store updated
      }
    }
    return { success: true, message: 'Correction request dispatched to citizen.' };
  },

  getVerifiers: async (): Promise<Verifier[]> => {
    if (USE_LIVE_API) {
      try {
        const res = await api.get('/deo/verifiers');
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    return useDEOStore.getState().verifiers;
  },

  batchApprove: async (payload: {
    ids: string[];
    remarks?: string;
  }): Promise<{ count: number; success: boolean }> => {
    useDEOStore.getState().batchApprove(payload.ids, payload.remarks);
    if (USE_LIVE_API) {
      try {
        await api.post('/deo/batch/approve', payload);
      } catch {
        // Local store updated
      }
    }
    return { count: payload.ids.length, success: true };
  },

  batchCorrection: async (payload: {
    ids: string[];
    reason: string;
    remarks?: string;
  }): Promise<{ count: number; success: boolean }> => {
    useDEOStore.getState().batchCorrection(payload.ids, payload.reason, payload.remarks);
    if (USE_LIVE_API) {
      try {
        await api.post('/deo/batch/correction', payload);
      } catch {
        // Local store updated
      }
    }
    return { count: payload.ids.length, success: true };
  },

  getHistory: async (): Promise<HistoryRecord[]> => {
    if (USE_LIVE_API) {
      try {
        const res = await api.get('/deo/history');
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    return useDEOStore.getState().history;
  },

  updateProfile: async (data: any) => {
    useAuthStore.getState().updateProfile(data);
    return useAuthStore.getState().user;
  },
};
