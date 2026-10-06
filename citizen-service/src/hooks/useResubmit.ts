import { useMutation, useQueryClient } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';

export const useResubmit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      file,
      remarks,
    }: {
      id: string;
      file: File;
      remarks: string;
    }) => {
      return citizenApi.resubmitDocument(id, file, remarks);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['citizen-applications'] });
      queryClient.invalidateQueries({ queryKey: ['citizen-application-detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['citizen-stats'] });
    },
  });
};
