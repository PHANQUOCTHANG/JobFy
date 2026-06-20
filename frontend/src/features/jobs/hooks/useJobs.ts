import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getJobs, 
  getFeaturedJobs,
  getJobBySlug, 
  getJobCategories,
  saveJob,
  unsaveJob,
  getProvinces,
  getIndustries
} from '../api/jobs.api';
import { JobFilterParams } from '../types';

export const useJobs = (params?: JobFilterParams) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => getJobs(params),
  });
};

export const useFeaturedJobs = () => {
  return useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: getFeaturedJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.data,
  });
};

export const useJob = (slug: string) => {
  return useQuery({
    queryKey: ['job', slug],
    queryFn: () => getJobBySlug(slug),
    enabled: !!slug,
  });
};

export const useJobCategories = () => {
  return useQuery({
    queryKey: ['jobCategories'],
    queryFn: getJobCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => saveJob(jobId),
    onSuccess: () => {
      // Invalidate queries if needed
    },
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: getIndustries,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
