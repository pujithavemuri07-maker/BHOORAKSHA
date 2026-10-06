import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revenueApi } from '../api/revenueApi';
import toast from 'react-hot-toast';

export const useGenerateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      return await revenueApi.generateCertificate(applicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueQueue'] });
      queryClient.invalidateQueries({ queryKey: ['revenueApplication'] });
      toast.success('Bhooraksha Verification Report generated!');
    },
    onError: () => {
      toast.error('Failed to generate certificate');
    },
  });
};
