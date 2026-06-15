import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authApi from "@/features/auth/api/authApi";
import { extractError } from "@/utils/extractError";

type Step = 1 | 2 | 3;

export const useForgotPassword = () => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────
  // Step 1: Gửi OTP đến email
  // ─────────────────────────────────────────────────────────
  const handleSendOtp = async (data: { email: string }) => {
    try {
      await authApi.sendForgotOtp(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success("Mã OTP đã được gửi!", {
        description: `Kiểm tra hộp thư của ${data.email}`,
      });
    } catch (err: unknown) {
      const parsed = extractError(err);
      if (parsed.isNetworkError) {
        toast.error("Lỗi kết nối", { description: parsed.message });
        return;
      }
      // Email không tồn tại trong hệ thống
      if (parsed.statusCode === 404) {
        toast.error("Email không tồn tại", {
          description: "Địa chỉ email này chưa được đăng ký trong hệ thống.",
        });
        return;
      }
      toast.error("Không thể gửi OTP", { description: parsed.message });
    }
  };

  // ─────────────────────────────────────────────────────────
  // Step 2: Xác thực OTP
  // ─────────────────────────────────────────────────────────
  const handleVerifyOtp = async (otp: string) => {
    try {
      const res = await authApi.verifyForgotOtp(email, otp);
      setVerificationToken(res.data.verificationToken);
      setStep(3);
    } catch (err: unknown) {
      const parsed = extractError(err);
      if (parsed.isNetworkError) {
        toast.error("Lỗi kết nối", { description: parsed.message });
        throw err;
      }
      // Tùy statusCode để hiện đúng thông báo
      if (parsed.statusCode === 400 || parsed.statusCode === 410) {
        toast.error("Mã OTP không hợp lệ hoặc đã hết hạn", {
          description: "Vui lòng nhấn \"Gửi lại\" để nhận mã mới.",
        });
      } else if (parsed.statusCode === 429) {
        toast.error("Quá nhiều lần thử", {
          description: "Bạn đã thử quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.",
        });
      } else {
        toast.error("Xác thực thất bại", { description: parsed.message });
      }
      throw err; // Throw để form biết thất bại (vd: xóa input OTP)
    }
  };

  // ─────────────────────────────────────────────────────────
  // Gửi lại OTP
  // ─────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    try {
      await authApi.sendForgotOtp(email);
      toast.success("Đã gửi lại mã mới!", {
        description: `Kiểm tra hộp thư của ${email}`,
      });
    } catch (err: unknown) {
      const parsed = extractError(err);
      if (parsed.statusCode === 429) {
        toast.error("Gửi quá nhiều lần", {
          description: "Vui lòng đợi vài phút rồi thử lại.",
        });
      } else {
        toast.error("Không thể gửi lại OTP", { description: parsed.message });
      }
    }
  };

  // ─────────────────────────────────────────────────────────
  // Step 3: Đặt lại mật khẩu
  // ─────────────────────────────────────────────────────────
  const handleResetPassword = async (data: { password: string }) => {
    try {
      await authApi.resetPassword(verificationToken, data.password);
      toast.success("Đặt lại mật khẩu thành công!", {
        description: "Bạn có thể đăng nhập bằng mật khẩu mới.",
      });
      navigate("/login");
    } catch (err: unknown) {
      const parsed = extractError(err);
      if (parsed.isNetworkError) {
        toast.error("Lỗi kết nối", { description: parsed.message });
        return;
      }
      if (parsed.statusCode === 400) {
        // Token hết hạn hoặc đã dùng
        toast.error("Phiên đặt lại mật khẩu đã hết hạn", {
          description: "Vui lòng thực hiện lại từ bước đầu.",
          action: { label: "Thử lại", onClick: () => setStep(1) },
        });
        return;
      }
      if (parsed.message.includes("trùng") || parsed.message.includes("cũ")) {
        toast.error("Mật khẩu không hợp lệ", {
          description: "Mật khẩu mới không được trùng với mật khẩu cũ.",
        });
        return;
      }
      toast.error("Không thể đặt lại mật khẩu", { description: parsed.message });
    }
  };

  return {
    step,
    email,
    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,
    handleResetPassword,
  };
};
