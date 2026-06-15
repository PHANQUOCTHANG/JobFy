import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/features/auth/slice/authSlice";
import authApi from "@/features/auth/api/authApi";
import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { extractError, parseValidationDetails } from "@/utils/extractError";

// Constants cho Password Strength
const PASSWORD_REQUIREMENTS = [
  { id: 1, label: "8+ chars", regex: /.{8,}/ },
  { id: 2, label: "Number", regex: /\d/ },
  { id: 3, label: "Uppercase", regex: /[A-Z]/ },
  { id: 4, label: "Special char", regex: /[^A-Za-z0-9]/ },
];

export const useRegister = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { watch, setError } = form;
  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  // Tính độ mạnh mật khẩu
  const requirementsStatus = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.regex.test(passwordValue || ""),
    }));
  }, [passwordValue]);

  const strengthScore = requirementsStatus.filter((r) => r.met).length;

  const strengthInfo = useMemo(() => {
    if (strengthScore === 0)
      return { label: "Enter Password", color: "bg-gray-700", textColor: "text-gray-500" };
    if (strengthScore <= 2)
      return { label: "Weak", color: "bg-red-500", textColor: "text-red-400" };
    if (strengthScore === 3)
      return { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-400" };
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-400" };
  }, [strengthScore]);

  const isMatch =
    confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;

  // Handle Submit
  const handleRegister = async (data: RegisterInput) => {
    try {
      const res = await authApi.register(data);

      toast.success("Đăng ký thành công!", {
        description: res.message || "Vui lòng kiểm tra email để nhận mã OTP xác minh tài khoản.",
      });

      navigate("/verify-account", { state: { email: data.email, isVerifyAccount: true } });
    } catch (err: unknown) {
      const parsed = extractError(err);

      // Lỗi mạng
      if (parsed.isNetworkError) {
        toast.error("Lỗi kết nối", { description: parsed.message });
        return;
      }

      // Lỗi validation từ Zod (422) — gán vào từng field
      if (parsed.details && parsed.details.length > 0) {
        const fieldErrors = parseValidationDetails(parsed.details);
        for (const [fieldName, message] of Object.entries(fieldErrors)) {
          if (fieldName in form.getValues()) {
            setError(fieldName as any, { type: "server", message });
          }
        }
        toast.error("Dữ liệu không hợp lệ", {
          description: "Vui lòng kiểm tra lại các trường bên dưới.",
        });
        return;
      }

      // Email đã tồn tại (409 / EMAIL_TAKEN)
      if (parsed.errorCode === "EMAIL_TAKEN" || parsed.statusCode === 409) {
        setError("email", {
          type: "server",
          message: parsed.message || "Email này đã được đăng ký, vui lòng dùng email khác.",
        });
        return;
      }

      // Lỗi tên field cụ thể từ server
      if (parsed.field && parsed.field in form.getValues()) {
        setError(parsed.field as any, { type: "server", message: parsed.message });
        return;
      }

      // Lỗi server 500 hoặc không xác định
      toast.error("Đăng ký thất bại", {
        description: parsed.message,
      });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return {
    form,
    onSubmit: form.handleSubmit(handleRegister),
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    isFocused,
    setIsFocused,
    passwordValue,
    confirmPasswordValue,
    requirementsStatus,
    strengthScore,
    strengthInfo,
    isMatch,
  };
};
