import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getJobs, 
  getFeaturedJobs,
  getJobBySlug, 
  getJobCategories,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getSavedJobIds,
  getProvinces,
  getDistricts,
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

export const useDistricts = (provinceId?: number) => {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: () => getDistricts(provinceId!),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSavedJobs = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['saved-jobs', params],
    queryFn: () => getSavedJobs(params),
  });
};

export const useSavedJobIds = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['saved-job-ids'],
    queryFn: getSavedJobIds,
    enabled,
  });
};

export const useSaveJob = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => saveJob(jobId),
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ['saved-job-ids'] });
      const previousIds = queryClient.getQueryData<string[]>(['saved-job-ids']);
      if (previousIds) {
        queryClient.setQueryData<string[]>(['saved-job-ids'], [...previousIds, jobId]);
      }
      return { previousIds };
    },
    onError: (err, jobId, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(['saved-job-ids'], context.previousIds);
      }
      toast.error('Có lỗi xảy ra khi lưu việc làm');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-job-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
    },
    onSuccess: () => {
      toast.success('Đã lưu việc làm thành công');
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => unsaveJob(jobId),
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ['saved-job-ids'] });
      const previousIds = queryClient.getQueryData<string[]>(['saved-job-ids']);
      if (previousIds) {
        queryClient.setQueryData<string[]>(['saved-job-ids'], previousIds.filter(id => id !== jobId));
      }
      return { previousIds };
    },
    onError: (err, jobId, context) => {
      if (context?.previousIds) {
        queryClient.setQueryData(['saved-job-ids'], context.previousIds);
      }
      toast.error('Có lỗi xảy ra khi bỏ lưu việc làm');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-job-ids'] });
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
    },
    onSuccess: () => {
      toast.success('Đã bỏ lưu việc làm');
    },
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: ['job-industries'],
    queryFn: getIndustries,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
