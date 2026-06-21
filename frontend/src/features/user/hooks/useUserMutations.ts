import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import userApi from "../api/userApi";
import { userKeys } from "../utils/userKeys";
import { handleError } from "@/utils/handleError";
import type { CreateUserRequest, UpdateUserRequest, UserStatus } from "../types";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  // Hàm tiện ích để làm mới danh sách sau khi thao tác thành công
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  };

  // ==========================================
  // 1. CREATE USER (Admin)
  // ==========================================
  const createMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => userApi.create(data),
    onSuccess: () => {
      toast.success("Tạo người dùng thành công");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi tạo người dùng"),
  });

  // ==========================================
  // 2. UPDATE USER (Admin)
  // ==========================================
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi cập nhật thông tin"),
  });

  // ==========================================
  // 3. UPDATE STATUS USER
  // ==========================================
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) => 
      userApi.update(id, { status }),
    onSuccess: (response) => {
      const statusStr = response.data?.status === "active" ? "Đã mở khóa" : "Đã cập nhật trạng thái";
      toast.success(`${statusStr} tài khoản thành công`);
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi thay đổi trạng thái"),
  });

  // ==========================================
  // 4. DELETE USER
  // ==========================================
  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      toast.success("Đã xóa người dùng thành công");
      invalidate();
    },
    onError: (err) => handleError(err, "Lỗi xóa người dùng"),
  });

  return {
    // --- Async Methods (Dùng trong Form submit) ---
    createUserAsync: createMutation.mutateAsync,
    updateUserAsync: updateMutation.mutateAsync,

    // --- Standard Methods (Dùng cho Button click trực tiếp) ---
    updateUserStatus: updateStatusMutation.mutate,
    deleteUser: deleteMutation.mutate,

    // --- Loading States ---
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Aggregate Loading State (Disable UI chung)
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      updateStatusMutation.isPending ||
      deleteMutation.isPending,
  };
};
