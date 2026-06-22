import React from "react";
import { Link } from "react-router-dom";
import { Disc, ShieldAlert, KeyRound, CheckCircle2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForceChangePassword } from "@/features/auth/hooks/useForceChangePassword";

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
                : "border-[#E2E8F0] focus:border-[#4F46E5] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)]",
          className
        )}
        style={{ height: "52px" }}
        {...props}
      />
    </div>
  )
);
InputField.displayName = "InputField";

export const ForceChangePasswordPage = () => {
  const { register, errors, isPending, onSubmit } = useForceChangePassword();

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
          <div className="inline-flex items-center gap-2 mb-6 bg-[#FEF3C7] border border-[#FDE68A] rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
            <span className="text-[12px] font-bold text-[#D97706] tracking-wide uppercase">Yêu cầu bảo mật</span>
          </div>
          <h1 className="text-[3.5rem] font-black leading-[1.1] mb-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Bảo vệ<br />
            <em className="not-italic text-[#4F46E5]">tài khoản</em><br />
            của bạn.
          </h1>
          <p className="text-slate-500 text-[17px] leading-relaxed max-w-md">
            Mật khẩu mặc định cần được thay đổi trước khi bạn tiếp tục. Vui lòng thiết lập một mật khẩu mới an toàn hơn.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-slate-200 pt-8">
          <div>
            <p className="text-[24px] font-black text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Bảo mật</p>
            <p className="text-[12px] text-slate-500 uppercase tracking-wider font-bold mt-1">Cấp độ cao</p>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <p className="text-[24px] font-black text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>An toàn</p>
            <p className="text-[12px] text-slate-500 uppercase tracking-wider font-bold mt-1">Mã hóa 256-bit</p>
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

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 lg:mt-0">
          <div className="text-center lg:text-left mb-8">
            <div className="w-16 h-16 bg-[#FEF3C7] rounded-2xl flex items-center justify-center mb-6 lg:mx-0 mx-auto border border-[#FDE68A]">
              <ShieldAlert className="w-8 h-8 text-[#D97706]" />
            </div>
            <h2 className="text-[2.2rem] font-black mb-3 text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Cập nhật Mật khẩu
            </h2>
            <p className="text-[#64748B] text-[15px]">
              Tài khoản của bạn đang sử dụng mật khẩu mặc định. Để bảo mật, vui lòng đổi mật khẩu mới.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Mật khẩu hiện tại</p>
              <InputField
                icon={KeyRound}
                type="password"
                placeholder="Nhập mật khẩu do admin cấp"
                error={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-[12px] mt-1.5 font-medium">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Mật khẩu mới</p>
              <InputField
                icon={KeyRound}
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                error={!!errors.newPassword}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-[12px] mt-1.5 font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Xác nhận mật khẩu mới</p>
              <InputField
                icon={CheckCircle2}
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                error={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[12px] mt-1.5 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" isLoading={isPending} disabled={isPending} className="mt-2">
              {isPending ? "Đang cập nhật..." : "Đổi mật khẩu & Truy cập"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForceChangePasswordPage;
