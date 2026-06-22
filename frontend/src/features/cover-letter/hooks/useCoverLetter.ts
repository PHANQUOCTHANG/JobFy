import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coverLetterApi } from '../api/coverLetter.api';
import { toast } from 'sonner';

export const useCoverLetters = () => {
  return useQuery({
    queryKey: ['cover-letters'],
    queryFn: () => coverLetterApi.getAll(),
  });
};

export const useCoverLetter = (id?: string) => {
  return useQuery({
    queryKey: ['cover-letters', id],
    queryFn: () => coverLetterApi.getById(id!),
    enabled: !!id,
  });
};

export const useCreateCoverLetter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coverLetterApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      toast.success('Lưu Cover Letter thành công!');
    },
    onError: () => toast.error('Có lỗi xảy ra khi lưu Cover Letter.'),
  });
};

export const useUpdateCoverLetter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof coverLetterApi.update>[1] }) =>
      coverLetterApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      queryClient.invalidateQueries({ queryKey: ['cover-letters', variables.id] });
      toast.success('Cập nhật Cover Letter thành công!');
    },
    onError: () => toast.error('Có lỗi xảy ra khi cập nhật Cover Letter.'),
  });
};

export const useDeleteCoverLetter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coverLetterApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      toast.success('Đã xóa Cover Letter.');
    },
    onError: () => toast.error('Có lỗi xảy ra khi xóa Cover Letter.'),
  });
};
