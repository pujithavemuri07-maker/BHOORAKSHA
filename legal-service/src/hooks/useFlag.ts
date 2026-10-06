import { useMutation, useQueryClient } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import toast from 'react-hot-toast';

export const useFlag = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reason, opinion }: { reason: string; opinion: string }) =>
      legalApi.flagApplication(applicationId, reason, opinion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success('Application Flagged for procedural rectification');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to flag application');
    },
  });
};
