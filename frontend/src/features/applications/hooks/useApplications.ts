import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  applyForJob, 
  getMyApplications, 
  checkApplied,
  applyWithUploadCv
} from '../api/applications.api';
import { ApplyPayload } from '../types';

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ApplyPayload) => applyForJob(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationStatus', variables.jobId] });
    },
  });
};

export const useApplyWithCv = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applyWithUploadCv,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationStatus', variables.jobId] });
    },
  });
};

export const useMyApplications = () => {
  return useQuery({
    queryKey: ['myApplications'],
    queryFn: getMyApplications,
  });
};

export const useCheckApplied = (jobId: string, candidateId?: string) => {
  return useQuery({
    queryKey: ['applicationStatus', jobId, candidateId],
    queryFn: () => checkApplied(jobId, candidateId!),
    enabled: !!jobId && !!candidateId,
    retry: false,
  });
};
