import React from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  XCircle,
  Disc,
  AlertCircle,
  Briefcase,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }} />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
    }} />
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button = ({ children, className, isLoading, variant = "primary", ...props }: any) => {
  const base = "relative group w-full h-12 rounded-xl font-bold text-[14.5px] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    primary: "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/20",
    outline: "bg-white border-2 border-[#E2E8F0] hover:border-[#0F172A] text-[#0F172A]",
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
  ({ icon: Icon, className, error, ...props }, ref) => (
    <div className="relative group w-full">
      <div className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300",
        error ? "text-red-500" : "text-[#94A3B8] group-focus-within:text-[#4F46E5]"
      )}>
        <Icon size={18} />
      </div>
      <input
        ref={ref}
        className={cn(
          "w-full h-13 bg-white hover:bg-gray-50 focus:bg-white rounded-xl border pl-11 pr-4 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-300",
          error ? "border-red-500 focus:border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" 
                : "border-[#E2E8F0] focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(212,78,43,0.1)]",
          className
        )}
        style={{ height: "52px" }}
        {...props}
      />
      {error && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in duration-300">
          <AlertCircle size={16} />
        </div>
      )}
    </div>
  )
);
InputField.displayName = "InputField";

export default function RegisterForm() {
  const {
    form: { register, formState: { errors, isSubmitting } },
    onSubmit,
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
  } = useRegister();

  return (
    <div className="min-h-screen w-full flex flex-row-reverse bg-white text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 bg-slate-50 border-l border-slate-200 text-slate-900 overflow-hidden">
        <BackgroundPattern />
        
        <div className="relative z-10 flex justify-end">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-[26px] font-black tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Job<span className="text-[#F59E0B]">Fy</span>
            </span>
            <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center shadow-lg shadow-[#4F46E5]/20">
              <Briefcase size={20} className="text-white" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-[3.5rem] font-black leading-[1.1] mb-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Khám phá<br />
            <em className="not-italic text-[#F59E0B]">hàng nghìn</em><br />
            cơ hội mới.
          </h1>
          <p className="text-slate-500 text-[17px] leading-relaxed max-w-md">
            Tạo tài khoản miễn phí để sử dụng bộ công cụ tạo CV AI, nhận gợi ý việc làm chính xác và theo dõi quá trình ứng tuyển dễ dàng.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-slate-200 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4F46E5]/20 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-[#4F46E5]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-900">Miễn phí 100%</p>
              <p className="text-[12px] text-slate-500">Dành cho ứng viên</p>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-900">Bảo mật tuyệt đối</p>
              <p className="text-[12px] text-slate-500">Thông tin cá nhân</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-900">
          <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </div>
          <span className="text-xl font-black" style={{ fontFamily: "'Manrope', sans-serif" }}>JobFy</span>
        </Link>
        <Link to="/" className="absolute top-8 left-8 hidden lg:flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#4F46E5] transition-colors">
          <ChevronLeft size={16} /> Quay lại trang chủ
        </Link>

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[2.2rem] font-black mb-3 text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Tạo tài khoản
            </h2>
            <p className="text-[#64748B] text-[15px]">
              Chỉ mất 1 phút để bắt đầu hành trình của bạn.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Họ và tên</p>
              <InputField icon={User} placeholder="Nguyễn Văn A" error={!!errors.fullName} {...register("fullName")} />
              {errors.fullName && <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.fullName.message}</p>}
            </div>

            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Email của bạn</p>
              <InputField icon={Mail} type="email" placeholder="name@example.com" error={!!errors.email} {...register("email")} />
              {errors.email && <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[13px] font-bold text-[#0F172A] mb-2">Mật khẩu</p>
                <div className="relative">
                  <InputField 
                    icon={Lock} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    error={!!errors.password} 
                    {...register("password")} 
                    onFocus={() => setIsFocused(true)}
                  />
                  <button type="button" onClick={toggleShowPassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors z-20">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.password.message}</p>}
              </div>

              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out bg-white border border-[#E2E8F0] rounded-xl shadow-sm",
                (isFocused || passwordValue) ? "max-h-[300px] opacity-100 p-4 mt-2" : "max-h-0 opacity-0 p-0 border-transparent mt-0"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Độ mạnh mật khẩu</span>
                  <span className={cn("text-[11px] font-bold uppercase transition-colors duration-300", strengthInfo.textColor)}>
                    {passwordValue ? strengthInfo.label : ""}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 mb-4 w-full bg-[#F4F6FA] rounded-full overflow-hidden">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={cn("flex-1 transition-all duration-500 ease-out", strengthScore >= step ? strengthInfo.color : "bg-transparent")} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  {requirementsStatus.map((req: any) => (
                    <div key={req.id} className="flex items-center gap-2 text-[12.5px] transition-colors duration-300">
                      {req.met ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#E2E8F0] shrink-0" />
                      )}
                      <span className={req.met ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#0F172A] mb-2 mt-4">Xác nhận mật khẩu</p>
                <div className="relative">
                  <InputField 
                    icon={Lock} 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    error={!!errors.confirmPassword} 
                    {...register("confirmPassword")} 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button type="button" onClick={toggleShowConfirmPassword} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors z-20">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {confirmPasswordValue.length > 0 && !errors.confirmPassword && (
                      isMatch ? <CheckCircle2 size={18} className="text-[#10B981]" /> : <XCircle size={18} className="text-red-500" />
                    )}
                  </div>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="mt-6">
              {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký miễn phí"}
            </Button>
          </form>

          <p className="text-center text-[14px] text-[#64748B] mt-10">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline underline-offset-4 transition-all">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
