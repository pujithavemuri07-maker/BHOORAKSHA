import { useQuery } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import { useGISStore } from '../store/gisStore';

interface UseGISQueueParams {
  trafficLight?: string;
  status?: string;
  priority?: string;
  search?: string;
  limit?: number;
}

export const useGISQueue = (params?: UseGISQueueParams) => {
  const applications = useGISStore((s) => s.applications);
  const history = useGISStore((s) => s.history);

  return useQuery({
    queryKey: ['gis-queue', params, applications, history],
    queryFn: () => gisApi.getQueue(params),
    initialData: () => {
      let apps = [...applications];
      if (params?.trafficLight && params.trafficLight !== 'all') {
        apps = apps.filter((a) => a.trafficLight === params.trafficLight);
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
            a.citizenName.toLowerCase().includes(q) ||
            a.surveyNumber.toLowerCase().includes(q) ||
            a.village.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q)
        );
      }
      if (params?.limit) {
        apps = apps.slice(0, params.limit);
      }

      const pending = applications.filter((a) => a.status === 'pending_gis_review').length;
      const overlapsDetected = applications.filter(
        (a) => a.trafficLight === 'red' || a.trafficLight === 'yellow'
      ).length;
      const resolvedToday = history.length;
      const totalVerified = history.filter(
        (h) => h.action === 'CONFIRMED' || h.action === 'ADJUSTED'
      ).length;

      return {
        data: apps,
        total: apps.length,
        pending,
        overlapsDetected,
        resolvedToday,
        totalVerified,
      };
    },
    staleTime: 1000 * 30,
  });
};
