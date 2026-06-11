import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyCompany, updateMyCompany } from '../api/companies.api';
import { toast } from 'sonner';

export const useMyCompany = () => {
  return useQuery({
    queryKey: ['myCompany'],
    queryFn: getMyCompany,
  });
};

export const useUpdateMyCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyCompany,
    onSuccess: () => {
      toast.success('Cập nhật hồ sơ công ty thành công!');
      // Invalidate the cache to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật công ty.';
      toast.error(message);
    },
  });
};
