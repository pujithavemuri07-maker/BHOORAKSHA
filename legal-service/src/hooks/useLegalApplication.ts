import { useQuery } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import { useLegalStore } from '../store/legalStore';

export const useLegalApplication = (id?: string) => {
  const applications = useLegalStore((s) => s.applications);

  return useQuery({
    queryKey: ['legal-application', id, applications],
    queryFn: () => {
      if (!id) throw new Error('Application ID required');
      return legalApi.getApplication(id);
    },
    enabled: !!id,
    initialData: () => {
      if (!id) return undefined;
      return applications.find((a) => a.id === id);
    },
    staleTime: 1000 * 30,
  });
};
