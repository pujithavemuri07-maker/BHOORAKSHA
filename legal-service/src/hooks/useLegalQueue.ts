import { useQuery } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import { useLegalStore } from '../store/legalStore';

interface UseLegalQueueParams {
  severity?: string;
  status?: string;
  priority?: string;
  search?: string;
}

export const useLegalQueue = (params?: UseLegalQueueParams) => {
  const applications = useLegalStore((s) => s.applications);
  const history = useLegalStore((s) => s.history);

  return useQuery({
    queryKey: ['legal-queue', params, applications, history],
    queryFn: () => legalApi.getQueue(params),
    initialData: () => {
      let apps = [...applications];
      if (params?.severity && params.severity !== 'all') {
        apps = apps.filter((a) => a.severity === params.severity);
      }
      if (params?.status && params.status !== 'all') {
        apps = apps.filter((a) => a.status === params.status);
      }
      if (params?.priority && params.priority !== 'all') {
        apps = apps.filter((a) => a.priority === params.priority);
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
      return apps;
    },
    staleTime: 1000 * 30,
  });
};
