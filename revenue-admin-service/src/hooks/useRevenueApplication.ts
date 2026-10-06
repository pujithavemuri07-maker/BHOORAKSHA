import { useQuery } from '@tanstack/react-query';
import { revenueApi } from '../api/revenueApi';
import { useRevenueStore } from '../store/revenueStore';

export const useRevenueApplication = (id?: string) => {
  const storeApplications = useRevenueStore((s) => s.applications);

  return useQuery({
    queryKey: ['revenueApplication', id, storeApplications],
    queryFn: () => {
      if (!id) return undefined;
      return revenueApi.getApplication(id);
    },
    enabled: !!id,
  });
};
