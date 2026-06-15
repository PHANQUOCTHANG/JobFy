import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/features/auth/api/authApi";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/features/auth/schemas/auth.schema";
import { extractError } from "@/utils/extractError";

export const useForceChangePassword = () => {
  const navigate = useNavigate();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const { setError } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!", {
        description: "Tài khoản của bạn đã được bảo mật.",
      });
      navigate("/");
    },
    onError: (err: unknown) => {
      const parsed = extractError(err);

      if (parsed.isNetworkError) {
        toast.error("Lỗi kết nối", { description: parsed.message });
        return;
      }

      // Mật khẩu hiện tại sai
      if (parsed.statusCode === 401 || parsed.message.includes("hiện tại")) {
        setError("currentPassword", {
          type: "server",
          message: "Mật khẩu hiện tại không chính xác",
        });
        return;
      }

      // Mật khẩu mới trùng mật khẩu cũ
      if (parsed.message.includes("trùng") || parsed.message.includes("cũ")) {
        setError("newPassword", {
          type: "server",
          message: "Mật khẩu mới không được trùng với mật khẩu cũ",
        });
        return;
      }

      toast.error("Đổi mật khẩu thất bại", { description: parsed.message });
    },
  });

  const onSubmit = (data: ChangePasswordInput) => {
    mutate(data);
  };

  return {
    form,
    register: form.register,
    errors: form.formState.errors,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
