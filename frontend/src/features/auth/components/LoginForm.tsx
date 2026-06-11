import React from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Disc,
  AlertCircle,
  Briefcase,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { env } from "@/config/env";

const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }} />
    {/* Glows */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1A56DB]/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
    {/* Noise */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
    }} />
  </div>
);

const Button = ({ children, className, isLoading, variant = "primary", ...props }: any) => {
  const base = "relative group w-full h-12 rounded-xl font-bold text-[14.5px] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-[#1A56DB] hover:bg-[#1447C0] text-white shadow-lg shadow-[#1A56DB]/20",
    outline: "bg-white border-2 border-[#E2E8F0] hover:border-[#0F172A] text-[#0F172A]",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {isLoading && <Disc className="animate-spin h-4 w-4" />}
      {children}
    </button>
  );
};

const InputField = React.forwardRef<HTMLInputElement, any>(
  ({ icon: Icon, className, error, ...props }, ref) => (
    <div className="relative group w-full">
      <div className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300",
        error ? "text-red-500" : "text-[#94A3B8] group-focus-within:text-[#1A56DB]"
      )}>
        <Icon size={18} />
      </div>
      <input
        ref={ref}
        className={cn(
          "w-full h-13 bg-white hover:bg-gray-50 focus:bg-white rounded-xl border pl-11 pr-4 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-300",
          error ? "border-red-500 focus:border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" 
                : "border-[#E2E8F0] focus:border-[#1A56DB] focus:shadow-[0_0_0_4px_rgba(212,78,43,0.1)]",
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

const Checkbox = ({ id, label, checked, onChange }: any) => (
  <div className="flex items-center gap-2.5">
    <button
      type="button"
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0",
        checked ? "bg-[#1A56DB] border-[#1A56DB] text-white" : "bg-white border-[#E2E8F0] hover:border-[#1A56DB]"
      )}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </button>
    <label htmlFor={id} className="text-[13.5px] text-[#64748B] font-medium select-none cursor-pointer hover:text-[#0F172A] transition-colors" onClick={() => onChange(!checked)}>
      {label}
    </label>
  </div>
);

export default function LoginForm() {
  const { form, onSubmit, showPassword, toggleShowPassword } = useLogin();
  const { register, setValue, watch, formState: { errors, isSubmitting } } = form;
  const rememberMe = watch("rememberMe");

  return (
    <div className="min-h-screen w-full flex bg-white text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      
      {/* LEFT COLUMN: Visuals */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 bg-slate-50 border-r border-slate-200 text-slate-900 overflow-hidden">
        <BackgroundPattern />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#1A56DB] rounded-xl flex items-center justify-center shadow-lg shadow-[#1A56DB]/20">
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
            <span className="text-[12px] font-bold text-[#F59E0B] tracking-wide uppercase">Nền tảng số 1 Việt Nam</span>
          </div>
          <h1 className="text-[3.5rem] font-black leading-[1.1] mb-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Sự nghiệp<br />
            <em className="not-italic text-[#1A56DB]">không chỉ</em><br />
            là công việc.
          </h1>
          <p className="text-slate-500 text-[17px] leading-relaxed max-w-md">
            Hàng nghìn cơ hội từ các doanh nghiệp hàng đầu đang chờ đón bạn. Đăng nhập để tiếp tục hành trình xây dựng sự nghiệp mơ ước.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-slate-200 pt-8">
          <div>
            <p className="text-[24px] font-black text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>2M+</p>
            <p className="text-[12px] text-slate-500 uppercase tracking-wider font-bold mt-1">Ứng viên</p>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <p className="text-[24px] font-black text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>15K+</p>
            <p className="text-[12px] text-slate-500 uppercase tracking-wider font-bold mt-1">Nhà tuyển dụng</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2 text-slate-900">
          <div className="w-8 h-8 bg-[#1A56DB] rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </div>
          <span className="text-xl font-black" style={{ fontFamily: "'Manrope', sans-serif" }}>JobFy</span>
        </Link>
        <Link to="/" className="absolute top-8 right-8 flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#1A56DB] transition-colors">
          <ChevronLeft size={16} /> Quay lại trang chủ
        </Link>

        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[2.2rem] font-black mb-3 text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Chào mừng trở lại.
            </h2>
            <p className="text-[#64748B] text-[15px]">
              Đăng nhập để xem các công việc phù hợp nhất với bạn.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Email của bạn</p>
              <InputField icon={Mail} type="email" placeholder="name@example.com" error={!!errors.email} {...register("email")} />
              {errors.email && <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <p className="text-[13px] font-bold text-[#0F172A] mb-2">Mật khẩu</p>
              <div className="relative">
                <InputField icon={Lock} type={showPassword ? "text" : "password"} placeholder="••••••••" error={!!errors.password} {...register("password")} />
                <button type="button" onClick={toggleShowPassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors z-20">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <Checkbox id="remember" label="Ghi nhớ đăng nhập" checked={!!rememberMe} onChange={(c: boolean) => setValue("rememberMe", c)} />
              <Link to="/forgot-password" className="text-[13px] font-bold text-[#1A56DB] hover:text-[#1447C0] transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập ngay"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-[#E2E8F0] flex-1" />
            <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">Hoặc tiếp tục với</span>
            <div className="h-px bg-[#E2E8F0] flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a href={`${env.API_URL}/auth/google`} className="flex items-center justify-center gap-2.5 h-12 rounded-xl border-2 border-[#E2E8F0] hover:border-[#0F172A] bg-white text-[14px] font-bold text-[#0F172A] transition-all">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Google
            </a>
            <a href={`${env.API_URL}/auth/facebook`} className="flex items-center justify-center gap-2.5 h-12 rounded-xl border-2 border-[#E2E8F0] hover:border-[#0F172A] bg-white text-[14px] font-bold text-[#0F172A] transition-all">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              Facebook
            </a>
          </div>

          <p className="text-center text-[14px] text-[#64748B] mt-10">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-bold text-[#1A56DB] hover:text-[#1447C0] hover:underline underline-offset-4 transition-all">
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
