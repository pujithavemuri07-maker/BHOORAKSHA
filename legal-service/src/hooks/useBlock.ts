import { useMutation, useQueryClient } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import toast from 'react-hot-toast';

export const useBlock = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reason,
      opinion,
      legalReferences,
    }: {
      reason: string;
      opinion: string;
      legalReferences: string[];
    }) => legalApi.blockApplication(applicationId, reason, opinion, legalReferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success('Statutory Legal Block issued successfully');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to issue legal block');
    },
  });
};
