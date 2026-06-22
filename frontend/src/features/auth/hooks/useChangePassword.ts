import { useMutation } from "@tanstack/react-query";
import authApi from "../api/authApi";
import { toast } from "sonner";
import { handleError } from "@/utils/handleError";
import { ChangePasswordRequest } from "../types";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
    },
    onError: (err) => handleError(err, "Đổi mật khẩu thất bại"),
  });
};
