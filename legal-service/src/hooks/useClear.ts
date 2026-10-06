import { useMutation, useQueryClient } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import toast from 'react-hot-toast';

export const useClear = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opinion: string) => legalApi.clearApplication(applicationId, opinion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success('Title Cleared & Sanctioned successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to clear application');
    },
  });
};
