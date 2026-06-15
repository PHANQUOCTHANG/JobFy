import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { extractError } from "@/utils/extractError";
import authApi from "../api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { login } from "../slice/authSlice";

export const useVerifyAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const email = location.state?.email as string | undefined;
  const isVerifyAccount = location.state?.isVerifyAccount as boolean | undefined;

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await authApi.resendVerifyAccountOtp(email);
      toast.success("Đã gửi lại mã OTP", {
        description: "Vui lòng kiểm tra email của bạn.",
      });
    } catch (err: unknown) {
      const parsed = extractError(err);
      toast.error("Không thể gửi lại mã OTP", {
        description: parsed.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  // Xác thực mã OTP
  const handleVerifyOtp = async (code: string) => {
    if (!email) {
      toast.error("Thiếu thông tin email", {
        description: "Vui lòng đăng ký lại.",
      });
      navigate("/register");
      return;
    }
    
    setIsVerifying(true);
    try {
      const res = await authApi.verifyAccount(email, code);
      
      // Thành công, thực hiện đăng nhập và lưu token
      dispatch(login({ accessToken: res.data.accessToken, user: res.data.user }));
      
      toast.success("Xác thực tài khoản thành công!", {
        description: "Chào mừng bạn đến với JobFy.",
      });
      
      navigate("/");
    } catch (err: unknown) {
      const parsed = extractError(err);
      toast.error("Xác thực thất bại", {
        description: parsed.message || "Mã OTP không chính xác hoặc đã hết hạn.",
      });
      setOtp(""); // Xóa OTP để nhập lại
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    email,
    isVerifyAccount,
    otp,
    setOtp,
    isVerifying,
    isResending,
    handleVerifyOtp,
    handleResendOtp
  };
};
