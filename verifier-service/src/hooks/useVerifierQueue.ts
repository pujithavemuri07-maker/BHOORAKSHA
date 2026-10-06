import { useQuery } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import { useVerifierStore } from '../store/verifierStore';
import { classifyRisk } from '../utils/riskClassification';

interface UseVerifierQueueParams {
  status?: string;
  priority?: string;
  filter?: string;
  search?: string;
  source?: string;
  reviewCycle?: string;
  missingDocs?: string;
  gisConflict?: string;
  page?: number;
  limit?: number;
}

export const useVerifierQueue = (params?: UseVerifierQueueParams) => {
  const applications = useVerifierStore((s) => s.applications);
  const history = useVerifierStore((s) => s.history);

  return useQuery({
    queryKey: ['verifier-queue', params, applications, history],
    queryFn: () => verifierApi.getQueue(params),
    initialData: () => {
      let apps = [...applications];
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
        apps = apps.filter(
          (a) =>
            a.id.toLowerCase().includes(q) ||
            a.citizenName.toLowerCase().includes(q) ||
            a.surveyNumber.toLowerCase().includes(q)
        );
      }

      const stats = useVerifierStore.getState().getStats();

      return {
        data: apps,
        total: apps.length,
        ...stats,
      };
    },
    staleTime: 1000 * 30,
  });
};
