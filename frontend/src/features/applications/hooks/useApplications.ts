import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
    onMutate: () => {
      toast.loading('Đang xử lý hồ sơ ứng tuyển...', { id: 'apply-job' });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationStatus', variables.jobId] });
      toast.success('Ứng tuyển thành công!', { id: 'apply-job' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi ứng tuyển';
      toast.error(message, { id: 'apply-job' });
    }
  });
};

export const useApplyWithCv = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applyWithUploadCv,
    onMutate: () => {
      toast.loading('Đang tải lên CV và nộp hồ sơ...', { id: 'apply-cv-upload' });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applicationStatus', variables.jobId] });
      toast.success('Ứng tuyển thành công!', { id: 'apply-cv-upload' });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi ứng tuyển';
      toast.error(message, { id: 'apply-cv-upload' });
    }
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
