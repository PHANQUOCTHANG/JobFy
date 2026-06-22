import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios'; // Đảm bảo import axios hoặc instance axios của dự án
import Swal from 'sweetalert2';

// Cấu hình mặc định cho API (Bạn có thể điều chỉnh base URL tùy theo môi trường)
const API_BASE_URL = 'http://localhost:5000/api/v1';

export const useMyCompany = () => {
  return useQuery({
    queryKey: ['myCompany'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken'); // Hoặc key bạn dùng lưu token
      const { data } = await axios.get(`${API_BASE_URL}/employer/company-info`, { 
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Backend trả về { status: "success", data: { ... } } nên ta lấy data.data
      return data.data;
    },
  });
};

export const useUpdateMyCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: any) => {
      const token = localStorage.getItem('accessToken');
      
      // Payload đầy đủ theo các trường trên ManageCompanyPage
      const payload = {
        name: updateData.name,
        industryId: updateData.industryId ? Number(updateData.industryId) : 0,
        provinceId: updateData.provinceId ? Number(updateData.provinceId) : 0,
        districtId: updateData.districtId ? Number(updateData.districtId) : 0,
        address: updateData.address,
        size: updateData.size,
        website: updateData.website || null,
        description: updateData.description,
        logoUrl: updateData.logoUrl,
        taxCode: updateData.taxCode,
        foundedYear: (updateData.foundedYear === "" || updateData.foundedYear == null) ? null : Number(updateData.foundedYear),
        shortDescription: updateData.shortDescription || null,
        facebookUrl: updateData.facebookUrl || null,
        linkedinUrl: updateData.linkedinUrl || null,
        coverUrl: updateData.coverUrl || null,
      };

      const { data } = await axios.patch(`${API_BASE_URL}/employer/company-info`, payload, { 
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}` // Đảm bảo có token để không bị 401
        }
      });
      return data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Thành công!",
        text: "Cập nhật hồ sơ công ty thành công!",
        icon: "success",
        confirmButtonColor: "#00307c"
      });
      // Làm mới dữ liệu công ty
      queryClient.invalidateQueries({ queryKey: ['myCompany'] });
      // Quan trọng: Làm mới tiến trình xác thực để cập nhật trạng thái Bước 2
      queryClient.invalidateQueries({ queryKey: ['employer-verification-progress'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật công ty.';
      Swal.fire({
        title: "Lỗi!",
        text: message,
        icon: "error",
        confirmButtonColor: "#00307c"
      });
    },
  });
};

// Hook để lấy danh sách các ngành nghề
export const useIndustries = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/industries`);
      return data.data; // Giả sử backend trả về { status: "success", data: [...] }
    },
    staleTime: Infinity, // Dữ liệu ngành nghề ít thay đổi, có thể cache vô hạn
    cacheTime: Infinity,
  });
};

// Hook để lấy danh sách các tỉnh/thành phố
export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/provinces`);
      return data.data;
    },
    staleTime: Infinity, // Dữ liệu tỉnh/thành phố ít thay đổi
    cacheTime: Infinity,
  });
};

// Hook để lấy danh sách các quận/huyện dựa trên provinceId
export const useDistricts = (provinceId?: number) => {
  return useQuery({
    queryKey: ['districts', provinceId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/districts?provinceId=${provinceId}`);
      return data.data;
    },
    enabled: !!provinceId, // Chỉ fetch khi có provinceId
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};

// Hook để lấy danh sách các kỹ năng
export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/skills?limit=500`);
      return data.data || [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};
