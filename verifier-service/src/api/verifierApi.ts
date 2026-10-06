import { apiClient } from './client';
import { useVerifierStore } from '../store/verifierStore';
import { VerifierApplication, HistoryRecord, StatsResponse } from './types';
import { classifyRisk } from '../utils/riskClassification';

const USE_LIVE_API = import.meta.env.VITE_USE_LIVE_API === 'true';

export const verifierApi = {
  getStats: async (): Promise<StatsResponse> => {
    if (USE_LIVE_API) {
      try {
        const res = await apiClient.get<StatsResponse>('/verifier/stats');
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    return useVerifierStore.getState().getStats();
  },

  getQueue: async (params?: {
    status?: string;
    priority?: string;
    source?: string;
    filter?: string;
    search?: string;
    reviewCycle?: string;
    missingDocs?: string;
    gisConflict?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: VerifierApplication[];
    total: number;
    pending: number;
    verifiedToday: number;
    approvalRate: number;
    highRisk: number;
  }> => {
    if (USE_LIVE_API) {
      try {
        const res = await apiClient.get('/verifier/queue', { params });
        return res.data;
      } catch {
        // Fallback to store
      }
    }

    const store = useVerifierStore.getState();
    let apps = [...store.applications];

    if (params?.status && params.status !== 'all') {
      apps = apps.filter((a) => {
        const s = a.currentStatus || a.status;
        if (params.status === 'approved') {
          return s === 'approved' || s === 'approved_and_forwarded' || s === 'verified_by_verifier';
        }
        if (params.status === 'rejected') {
          return s === 'rejected' || s === 'rejected_by_verifier';
        }
        return s === params.status;
      });
    }
    if (params?.priority && params.priority !== 'all') {
      apps = apps.filter((a) => {
        const p = typeof a.riskScore === 'number' ? classifyRisk(a.riskScore).priority : a.priority;
        return p === params.priority;
      });
    }
    if (params?.source && params.source !== 'all') {
      if (params.source === 'deo') {
        apps = apps.filter((a) => a.source === 'deo_forwarded');
      } else if (params.source === 'ai') {
        apps = apps.filter((a) => a.source === 'ai_direct');
      }
    }
    if (params?.reviewCycle && params.reviewCycle !== 'all') {
      const cycleNum = parseInt(params.reviewCycle, 10);
      apps = apps.filter((a) => (a.reviewCycleNumber || 1) === cycleNum);
    }
    if (params?.missingDocs && params.missingDocs !== 'all') {
      if (params.missingDocs === 'missing') {
        apps = apps.filter((a) => a.documentsList?.some((d) => d.required && !d.available));
      } else if (params.missingDocs === 'complete') {
        apps = apps.filter((a) => !a.documentsList?.some((d) => d.required && !d.available));
      }
    }
    if (params?.gisConflict && params.gisConflict !== 'all') {
      if (params.gisConflict === 'mismatch') {
        apps = apps.filter((a) => a.gisData?.result === 'POTENTIAL_AREA_MISMATCH');
      } else if (params.gisConflict === 'tolerance') {
        apps = apps.filter((a) => a.gisData?.result === 'WITHIN_TOLERANCE');
      }
    }

    if (params?.filter === 'pending') {
      apps = apps.filter((a) => (a.currentStatus || a.status) === 'pending_verification' || (a.currentStatus || a.status) === 'under_verifier_review' || (a.currentStatus || a.status) === 'returned_to_verifier');
    } else if (params?.filter === 'high') {
      apps = apps.filter((a) => (typeof a.riskScore === 'number' ? a.riskScore < 50 : a.priority === 'high'));
    } else if (params?.filter === 'medium') {
      apps = apps.filter((a) => (typeof a.riskScore === 'number' ? a.riskScore >= 50 && a.riskScore < 75 : a.priority === 'medium'));
    } else if (params?.filter === 'low') {
      apps = apps.filter((a) => (typeof a.riskScore === 'number' ? a.riskScore >= 75 : a.priority === 'low'));
    } else if (params?.filter === 'deo') {
      apps = apps.filter((a) => a.source === 'deo_forwarded');
    } else if (params?.filter === 'ai') {
      apps = apps.filter((a) => a.source === 'ai_direct');
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      apps = apps.filter((a) => {
        const idMatch = a.id.toLowerCase().includes(q);
        const nameMatch = a.citizenName.toLowerCase().includes(q);
        const surveyMatch = a.surveyNumber.toLowerCase().includes(q);
        const hissaMatch = (a.hissaNumber || a.extractedData?.propertyDetails?.hissaNumber || '').toLowerCase().includes(q);
        const villageMatch = (a.village || a.extractedData?.propertyDetails?.village || '').toLowerCase().includes(q);
        const docNoMatch = (a.documentNumber || a.extractedData?.documentDetails?.documentNumber || '').toLowerCase().includes(q);
        const regNoMatch = (a.registrationNumber || a.extractedData?.documentDetails?.registrationNumber || '').toLowerCase().includes(q);
        return idMatch || nameMatch || surveyMatch || hissaMatch || villageMatch || docNoMatch || regNoMatch;
      });
    }

    const stats = store.getStats();

    return {
      data: apps,
      total: apps.length,
      ...stats,
    };
  },

  getApplicationById: async (id?: string): Promise<VerifierApplication> => {
    if (!id) throw new Error('Application ID is required');
    if (USE_LIVE_API) {
      try {
        const res = await apiClient.get<VerifierApplication>(`/verifier/application/${id}`);
        return res.data;
      } catch {
        // Fallback to store
      }
    }

    const app = useVerifierStore.getState().applications.find((a) => a.id === id);
    if (app) return app;
    throw new Error(`Application ${id} not found`);
  },

  approve: async (applicationId: string, remarks: string): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/verifier/approve/${applicationId}`, { remarks });
      } catch {
        // Fallback to store
      }
    }
    useVerifierStore.getState().approveApplication(applicationId, remarks);
  },

  reject: async (applicationId: string, reason: string, remarks: string): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/verifier/reject/${applicationId}`, { reason, remarks });
      } catch {
        // Fallback to store
      }
    }
    useVerifierStore.getState().rejectApplication(applicationId, reason, remarks);
  },

  returnToDEO: async (
    applicationId: string,
    reason: string,
    remarks: string,
    requiredCorrection?: string,
    requestedDoc?: string
  ): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/verifier/return/${applicationId}`, {
          reason,
          remarks,
          requiredCorrection,
          requestedDoc,
        });
      } catch {
        // Fallback to store
      }
    }
    useVerifierStore
      .getState()
      .returnToDEO(applicationId, reason, remarks, requiredCorrection, requestedDoc);
  },

  escalateToRevenue: async (
    applicationId: string,
    category: string,
    reason: string,
    remarks: string
  ): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post(`/verifier/escalate/${applicationId}`, {
          category,
          reason,
          remarks,
        });
      } catch {
        // Fallback to store
      }
    }
    useVerifierStore.getState().escalateToRevenue(applicationId, category, reason, remarks);
  },

  getHistory: async (): Promise<HistoryRecord[]> => {
    if (USE_LIVE_API) {
      try {
        const res = await apiClient.get<HistoryRecord[]>('/verifier/history');
        return res.data;
      } catch {
        // Fallback to store
      }
    }
    return useVerifierStore.getState().history;
  },

  batchApprove: async (ids: string[], remarks: string): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/verifier/batch/approve', { ids, remarks });
      } catch {
        // Fallback to store
      }
    }
    useVerifierStore.getState().batchApprove(ids, remarks);
  },

  batchReject: async (ids: string[], reason: string, remarks: string): Promise<void> => {
    if (USE_LIVE_API) {
      try {
        await apiClient.post('/verifier/batch/reject', { ids, reason, remarks });
      } catch {
        // Fallback to store
      }
    }
    useVerifierStore.getState().batchReject(ids, reason, remarks);
  },
};
