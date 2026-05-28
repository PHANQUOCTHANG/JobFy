import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  applyForJob, 
  getMyApplications, 
  checkApplicationStatus 
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

export const useMyApplications = () => {
  return useQuery({
    queryKey: ['myApplications'],
    queryFn: getMyApplications,
  });
};

export const useApplicationStatus = (jobId: string) => {
  return useQuery({
    queryKey: ['applicationStatus', jobId],
    queryFn: () => checkApplicationStatus(jobId),
    enabled: !!jobId,
    retry: false, // Don't retry on 404
  });
};
