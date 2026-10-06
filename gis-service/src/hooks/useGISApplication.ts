import { useQuery } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import { useGISStore } from '../store/gisStore';

export const useGISApplication = (id?: string) => {
  const applications = useGISStore((s) => s.applications);

  return useQuery({
    queryKey: ['gis-application', id, applications],
    queryFn: () => {
      if (!id) throw new Error('Application ID required');
      return gisApi.getApplication(id);
    },
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      return applications.find((a) => a.id === id);
    },
    staleTime: 1000 * 30,
  });
};
