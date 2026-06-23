import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleError } from "@/utils/handleError";
import userApi from "../api/userApi";

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { phone?: string; avatarUrl?: string }) => userApi.updateMe(data),
    onSuccess: (response) => {
      // Update the me cache or user profile cache if needed
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      // Invalidate candidate profile as well if it affects it
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Cập nhật thông tin thành công");
    },
    onError: (err) => handleError(err, "Cập nhật thông tin thất bại"),
  });
};
