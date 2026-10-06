import { useMutation, useQueryClient } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import toast from 'react-hot-toast';

export const useEscalate = (applicationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (remarks: string) => legalApi.escalateApplication(applicationId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success('Escalated to District Revenue Tehsildar');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to escalate application');
    },
  });
};
