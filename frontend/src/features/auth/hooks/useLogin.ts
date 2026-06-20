import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "../slice/authSlice";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { extractError } from "@/utils/extractError";

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema) as any,
    mode: "onBlur",
    defaultValues: { email: "", password: "", rememberMe: false, role: "candidate" },
  });

  const { setError } = form;

  const onSubmit = async (data: LoginInput) => {
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      const { user } = resultAction.payload;

      if (user.mustChangePassword) {
        toast.warning("Yêu cầu bảo mật", {
          description: "Vui lòng đổi mật khẩu mới trước khi tiếp tục.",
        });
        return navigate("/force-change-password");
      }

      toast.success("Đăng nhập thành công!", {
        description: `Chào mừng trở lại, ${user.fullName || user.email}!`,
      });
      navigate("/");
    } else {
      // loginUser.rejected — errorPayload là server response data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorPayload = resultAction.payload as any;
      handleLoginError(errorPayload, setError, navigate);
    }
  };

  return {
    form,
    showPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    onSubmit: form.handleSubmit(onSubmit),
  };
};

/**
 * Xử lý lỗi đăng nhập tập trung.
 * errorPayload có thể là:
 *   - object từ server: { status, message, errorCode, data, ... }
 *   - hoặc axios error wrapped: { message }
 */
function handleLoginError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorPayload: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError: (field: any, error: any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: (path: string, opts?: any) => void
) {
  // Nếu là Axios error (network error không có response)
  if (errorPayload?.message && !errorPayload?.status) {
    const parsed = extractError({ message: errorPayload.message });
    if (parsed.isNetworkError) {
      toast.error("Lỗi kết nối", { description: parsed.message });
      return;
    }
  }

  const message = errorPayload?.message || "Đăng nhập thất bại";
  const errorCode = errorPayload?.errorCode;

  switch (errorCode) {
    case "ACCOUNT_LOCKED":
      toast.error("Tài khoản đã bị khóa", {
        description: message,
        action: {
          label: "Liên hệ hỗ trợ",
          onClick: () => (window.location.href = "mailto:support@jobfy.com"),
        },
      });
      break;

    case "UNVERIFIED_ACCOUNT": {
      const emailFromServer = errorPayload?.data?.email;
      toast.warning("Tài khoản chưa được xác thực", {
        description: "Vui lòng xác thực email của bạn để tiếp tục.",
      });
      navigate("/verify-otp", {
        state: { email: emailFromServer, isResend: true },
      });
      break;
    }

    default: {
      // Email hoặc mật khẩu sai → đỏ cả 2 ô
      const isCredentialError =
        message.includes("Email") ||
        message.includes("mật khẩu") ||
        errorPayload?.statusCode === 401;

      if (isCredentialError) {
        setError("email", { type: "server", message: " " }); // message rỗng để không hiện text dưới email
        setError("password", { type: "server", message });   // message hiện dưới ô password
      } else {
        toast.error("Đăng nhập thất bại", { description: message });
      }
    }
  }
}
