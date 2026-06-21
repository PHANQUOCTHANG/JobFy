import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api';
import { toast } from 'sonner';

export const useGenerateSummary = () => {
  return useMutation({
    mutationFn: aiApi.generateCvSummary,
    onSuccess: () => {
      toast.success('AI đã viết xong mục tiêu nghề nghiệp');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
    }
  });
};

export const useReviewCv = () => {
  return useMutation({
    mutationFn: aiApi.reviewCv,
    onSuccess: () => {
      toast.success('AI đã phân tích xong CV');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
    }
  });
};

export const useMatchJob = () => {
  return useMutation({
    mutationFn: aiApi.matchJob,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi so khớp CV');
    }
  });
};

export const useSuggestSkills = () => {
  return useMutation({
    mutationFn: aiApi.suggestSkills,
    onSuccess: () => {
      toast.success('AI đã gợi ý kỹ năng');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
    }
  });
};

export const useGenerateCoverLetter = () => {
  return useMutation({
    mutationFn: aiApi.generateCoverLetter,
    onSuccess: () => {
      toast.success('AI đã tạo xong Cover Letter');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
    }
  });
};
