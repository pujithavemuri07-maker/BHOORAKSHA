import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import toast from 'react-hot-toast';

interface EscalateParams {
  applicationId: string;
  category?: string;
  reason?: string;
  remarks: string;
}

export const useEscalate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, category = 'General', reason = 'Escalation required', remarks }: EscalateParams) =>
      verifierApi.escalateToRevenue(applicationId, category, reason, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifier-queue'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-application'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-stats'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-history'] });
      toast.success('Application escalated to Revenue Admin / Tehsildar for executive inquiry.');
    },
    onError: () => {
      toast.error('Failed to escalate application.');
    },
  });
};
