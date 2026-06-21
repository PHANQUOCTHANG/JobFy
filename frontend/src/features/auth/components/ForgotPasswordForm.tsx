import React, { useState, useRef, useEffect } from "react";
import { Mail, Disc, ChevronLeft, AlertCircle, Briefcase, KeyRound, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordInput, type ResetPasswordInput } from "../schemas/auth.schema";

const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }} />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button = ({ children, className, isLoading, variant = "primary", ...props }: any) => {
  const base = "relative group w-full h-12 rounded-xl font-bold text-[14.5px] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    primary: "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/20",
    outline: "bg-white border border-[#E2E8F0] hover:border-[#0F172A] text-[#0F172A]",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {isLoading && <Disc className="animate-spin h-4 w-4" />}
      {children}
    </button>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputField = React.forwardRef<HTMLInputElement, any>(
  ({ icon: Icon, className, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative group w-full">
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300",
          error ? "text-red-500" : "text-[#94A3B8] group-focus-within:text-[#4F46E5]"
        )}>
          <Icon size={18} />
        </div>
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full h-13 bg-white hover:bg-gray-50 focus:bg-white rounded-xl border pl-11 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-300",
            error ? "border-red-500 focus:border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" 
                  : "border-[#E2E8F0] focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)]",
            isPassword ? (error ? "pr-[4.5rem]" : "pr-12") : (error ? "pr-12" : "pr-4"),
            className
          )}
          style={{ height: "52px" }}
          {...props}
        />
        {isPassword ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {error && (
              <div className="text-red-500">
                <AlertCircle size={16} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#94A3B8] hover:text-[#4F46E5] transition-colors focus:outline-none flex items-center justify-center"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        ) : error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

const OtpInput: React.FC<{
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ length = 6, value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    if (val.length <= length) {
      onChange(val);
    }
  };

  return (
    <div className="relative w-full max-w-[340px] mx-auto" onClick={() => !disabled && inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-default caret-transparent disabled:cursor-not-allowed"
        value={value}
        onChange={handleChange}
      />
      <div className="flex gap-2 justify-between w-full pointer-events-none">
        {Array.from({ length }).map((_, index) => {
          const digit = value[index] || "";
          const isActive = value.length < length ? index === value.length : index === length - 1 && document.activeElement === inputRef.current;
          const isFilled = index < value.length;

          return (
            <div key={index} className="relative flex-1 min-w-0 aspect-[3/4]">
              <div
                className={cn(
                  "relative w-full h-full rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 bg-white",
                  isFilled ? "border-[#4F46E5] text-[#4F46E5] shadow-[0_0_0_4px_rgba(79,70,229,0.1)]" : "border-[#E2E8F0] text-slate-300",
                  isActive && "border-[#4F46E5] shadow-[0_0_0_4px_rgba(79,70,229,0.1)]"
                )}
              >
                {digit}
                {isActive && !isFilled && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-0.5 h-1/2 bg-[#4F46E5] animate-pulse rounded-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResendTimer = ({ onResend, isLoading }: { onResend: () => Promise<void>; isLoading: boolean }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    await onResend();
    setTimeLeft(30);
  };

  return (
    <div className="mt-6 text-center text-[14px]">
      {timeLeft > 0 ? (
        <p className="text-[#64748B]">
          Gửi lại mã sau <span className="font-bold text-[#0F172A]">{timeLeft}s</span>
        </p>
      ) : (
        <p className="text-[#64748B]">
          Chưa nhận được mã?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Đang gửi..." : "Gửi lại"}
          </button>
        </p>
      )}
    </div>
  );
};

const ForgotPasswordForm = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const navigate = useNavigate();
  const { step, email, handleSendOtp, handleVerifyOtp, handleResendOtp, handleResetPassword } = useForgotPassword();
  
  // Forms
  const { register: registerEmail, handleSubmit: submitEmail, formState: { errors: emailErrors, isSubmitting: isSendingOtp } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { register: registerPassword, handleSubmit: submitPassword, formState: { errors: passwordErrors, isSubmitting: isResetting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsVerifying(true);
    try {
      await handleVerifyOtp(otp);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      setIsVerifying(true);
      handleVerifyOtp(otp).finally(() => setIsVerifying(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 bg-slate-50 border-r border-slate-200 text-slate-900 overflow-hidden">
        <BackgroundPattern />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
              <Briefcase size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[26px] font-black tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Job<span className="text-[#F59E0B]">Fy</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 mb-20">
          <div className="inline-flex items-center gap-2 mb-6 bg-[#EEF2FF] border border-[#C7D2FE] rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[12px] font-bold text-[#F59E0B] tracking-wide uppercase">Bảo mật tài khoản</span>
          </div>
          <h1 className="text-[3.5rem] font-black leading-[1.1] mb-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Khôi phục<br />
            <em className="not-italic text-[#4F46E5]">mật khẩu</em><br />
            dễ dàng.
          </h1>
          <p className="text-slate-500 text-[17px] leading-relaxed max-w-md">
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản để tiếp tục hành trình tìm kiếm việc làm.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-slate-200 pt-8">
          <div>
            <p className="text-[24px] font-black text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Bảo mật</p>
            <p className="text-[12px] text-slate-500 uppercase tracking-wider font-bold mt-1">Chuẩn quốc tế</p>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <p className="text-[24px] font-black text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Nhanh chóng</p>
            <p className="text-[12px] text-slate-500 uppercase tracking-wider font-bold mt-1">3 bước khôi phục</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-900">
          <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </div>
          <span className="text-xl font-black" style={{ fontFamily: "'Manrope', sans-serif" }}>JobFy</span>
        </Link>
        <Link to="/login" className="absolute top-8 right-8 flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#4F46E5] transition-colors">
          <ChevronLeft size={16} /> Quay lại đăng nhập
        </Link>

        <div className="w-full max-w-[440px] mb-8 flex items-center gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex-1 flex flex-col gap-2">
              <div className={cn(
                "h-1.5 w-full rounded-full transition-all duration-500",
                step >= item ? "bg-[#4F46E5]" : "bg-slate-100"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                step >= item ? "text-[#4F46E5]" : "text-slate-400"
              )}>Bước {item}</span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center lg:text-left mb-8">
                <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-6 lg:mx-0 mx-auto border border-[#C7D2FE]">
                  <Mail className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <h2 className="text-[2.2rem] font-black mb-3 text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Quên mật khẩu?
                </h2>
                <p className="text-[#64748B] text-[15px]">
                  Vui lòng nhập địa chỉ email của bạn để nhận mã xác thực OTP.
                </p>
              </div>

              <form onSubmit={submitEmail(handleSendOtp)} className="space-y-5">
                <div>
                  <p className="text-[13px] font-bold text-[#0F172A] mb-2">Email đăng ký</p>
                  <InputField
                    icon={Mail}
                    type="email"
                    placeholder="name@example.com"
                    error={!!emailErrors.email}
                    {...registerEmail("email")}
                  />
                  {emailErrors.email && (
                    <p className="text-red-500 text-[12px] mt-1.5 font-medium">
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" isLoading={isSendingOtp} disabled={isSendingOtp}>
                  {isSendingOtp ? "Đang gửi..." : "Gửi mã xác nhận"}
                </Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center lg:text-left">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#C7D2FE]">
                  <KeyRound className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <h2 className="text-[2.2rem] font-black mb-3 text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Nhập mã OTP
                </h2>
                <p className="text-[#64748B] text-[15px] max-w-[320px] mx-auto">
                  Chúng tôi đã gửi mã 6 số đến email <span className="font-bold text-[#0F172A]">{email}</span>
                </p>
              </div>

              <form onSubmit={onVerifySubmit} className="space-y-5">
                <div className="flex justify-center">
                  <OtpInput length={6} value={otp} onChange={setOtp} disabled={isVerifying} />
                </div>

                <Button type="submit" isLoading={isVerifying} disabled={isVerifying || otp.length < 6} className="mt-4">
                  {isVerifying ? "Đang xác thực..." : "Xác thực mã OTP"}
                </Button>
              </form>

              <ResendTimer onResend={handleResendOtp} isLoading={false} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center lg:text-left mb-8">
                <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-6 lg:mx-0 mx-auto border border-[#C7D2FE]">
                  <Lock className="w-8 h-8 text-[#4F46E5]" />
                </div>
                <h2 className="text-[2.2rem] font-black mb-3 text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Tạo mật khẩu mới
                </h2>
                <p className="text-[#64748B] text-[15px]">
                  Mật khẩu mới của bạn phải có ít nhất 8 ký tự để đảm bảo bảo mật.
                </p>
              </div>

              <form onSubmit={submitPassword(handleResetPassword)} className="space-y-5">
                <div>
                  <p className="text-[13px] font-bold text-[#0F172A] mb-2">Mật khẩu mới</p>
                  <InputField
                    icon={Lock}
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    error={!!passwordErrors.password}
                    {...registerPassword("password")}
                  />
                  {passwordErrors.password && (
                    <p className="text-red-500 text-[12px] mt-1.5 font-medium">
                      {passwordErrors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[13px] font-bold text-[#0F172A] mb-2">Xác nhận mật khẩu mới</p>
                  <InputField
                    icon={CheckCircle2}
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    error={!!passwordErrors.confirmPassword}
                    {...registerPassword("confirmPassword")}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-[12px] mt-1.5 font-medium">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" isLoading={isResetting} disabled={isResetting} className="mt-2">
                  {isResetting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
