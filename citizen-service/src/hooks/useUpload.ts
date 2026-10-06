import { useMutation, useQueryClient } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      propertyMeta,
    }: {
      file: File;
      propertyMeta?: { surveyNumber?: string; district?: string; village?: string };
    }) => {
      return citizenApi.uploadDocument(file, propertyMeta);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizen-applications'] });
      queryClient.invalidateQueries({ queryKey: ['citizen-stats'] });
    },
  });
};
