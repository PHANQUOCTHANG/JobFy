import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Activity,
  Users,
  BarChart2,
  type LucideIcon,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/features/auth/slice/authSlice";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth.schema";

/* ─── Background Pattern ─── */
const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    />
    {/* Glow balls */}
    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px]" />
    <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[100px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
  </div>
);

/* ─── Input Field ─── */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, error, rightElement, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-[13px] font-bold text-[#0F172A]">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${
            error
              ? "text-red-500"
              : "text-[#94A3B8] group-focus-within:text-[#4F46E5]"
          }`}
        >
          <Icon size={17} strokeWidth={2} />
        </div>
        <input
          ref={ref}
          id={id}
          className={`w-full bg-white hover:bg-slate-50 focus:bg-white rounded-xl border pl-11 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-200 ${
            rightElement ? "pr-11" : "pr-4"
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
              : "border-[#E2E8F0] focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
          }`}
          style={{ height: "50px" }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-[12px] font-medium mt-0.5">{error}</p>
      )}
    </div>
  )
);
InputField.displayName = "InputField";

/* ─── Stat Item ─── */
const StatItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-4 py-3">
    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
      <Icon size={16} className="text-white" strokeWidth={2} />
    </div>
    <div>
      <p className="text-white font-black text-[15px] leading-none">{value}</p>
      <p className="text-white/55 text-[11px] mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─── Main Page ─── */
const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as any,
    mode: "onBlur",
    defaultValues: { email: "", password: "", rememberMe: false, role: "admin" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    // Always force role = admin
    const resultAction = await dispatch(loginUser({ ...data, role: "admin" }));
    setIsLoading(false);

    if (loginUser.fulfilled.match(resultAction)) {
      const { user } = resultAction.payload;

      // Check if account is admin
      if (user.role !== "admin") {
        toast.error("Quyền truy cập bị từ chối", {
          description: "Tài khoản của bạn không có quyền Admin.",
        });
        // Logout and stay on admin login
        dispatch({ type: "auth/logout" });
        return;
      }

      toast.success("Đăng nhập thành công!", {
        description: `Chào mừng Admin ${user.fullName || user.email}!`,
      });
      navigate("/admin");
    } else {
      const errorPayload = resultAction.payload as any;
      const message = errorPayload?.message || "Đăng nhập thất bại";
      const errorCode = errorPayload?.errorCode;

      if (errorCode === "ACCOUNT_LOCKED") {
        toast.error("Tài khoản đã bị khóa", { description: message });
      } else {
        setError("email", { type: "server", message: " " });
        setError("password", { type: "server", message });
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ════ LEFT: Branding Panel ════ */}
      <aside className="hidden lg:flex flex-col w-[45%] relative bg-[#1e1b4b] overflow-hidden p-12">
        <BackgroundPattern />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 border border-white/25 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={20} className="text-[#a5b4fc]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white text-[22px] font-black tracking-tight">
              Job<span className="text-[#a5b4fc]">Fy</span>
            </span>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em]">
              Admin Console
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 mt-16 mb-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#a5b4fc] animate-pulse" />
            <span className="text-white/70 text-[11px] font-bold uppercase tracking-wider">
              Khu vực quản trị hệ thống
            </span>
          </div>
          <h1
            className="text-white font-black leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)" }}
          >
            Toàn quyền kiểm soát
            <br />
            <em className="not-italic text-[#a5b4fc]">hệ thống</em> JobFy.
          </h1>
          <p className="text-white/55 text-[16px] leading-relaxed max-w-sm">
            Quản lý người dùng, kiểm duyệt tin tuyển dụng, xác thực công ty và theo dõi toàn bộ hoạt động nền tảng.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-1 gap-3 mb-12">
          <StatItem icon={Users} label="Người dùng trên hệ thống" value="10,000+" />
          <StatItem icon={BarChart2} label="Tin tuyển dụng đang hoạt động" value="2,500+" />
          <StatItem icon={Activity} label="Uptime hệ thống" value="99.9%" />
        </div>

        {/* Security notice */}
        <div className="relative z-10 flex items-start gap-3 bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
          <ShieldCheck size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-amber-200/80 text-[12px] leading-relaxed">
            Khu vực này chỉ dành cho quản trị viên được ủy quyền. Mọi hoạt động đăng nhập đều được ghi lại và giám sát.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between mt-8 text-white/25 text-[11px] uppercase tracking-wider font-semibold">
          <span>© 2024 JobFy System</span>
          <span>Admin v2.0</span>
        </div>
      </aside>

      {/* ════ RIGHT: Login Form ════ */}
      <main className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-[#1e1b4b] rounded-xl flex items-center justify-center">
              <ShieldCheck size={17} className="text-[#a5b4fc]" strokeWidth={2.5} />
            </div>
            <span className="text-[20px] font-black text-[#0F172A]">
              JobFy<span className="text-[#4F46E5]">.</span>Admin
            </span>
          </div>

          {/* Admin badge */}
          <div className="inline-flex items-center gap-2 bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-full px-3.5 py-1.5 mb-6">
            <ShieldCheck size={13} className="text-[#4F46E5]" />
            <span className="text-[#4F46E5] text-[11.5px] font-bold uppercase tracking-wider">
              Cổng quản trị viên
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2
              className="font-black text-[#0F172A] mb-2"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)" }}
            >
              Đăng nhập Admin
            </h2>
            <p className="text-[#64748B] text-[15px] leading-relaxed">
              Vui lòng xác thực danh tính để truy cập bảng điều khiển quản trị.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              {...register("email")}
              icon={Mail}
              label="Email quản trị viên"
              id="admin-login-email"
              type="email"
              placeholder="admin@jobfy.com"
              error={errors.email?.message}
            />

            <InputField
              {...register("password")}
              icon={Lock}
              label="Mật khẩu"
              id="admin-login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14.5px] font-bold rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#4F46E5]/25 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Đang xác thực...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Truy cập bảng điều khiển
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <ShieldCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Trang này được bảo vệ bởi lớp mã hóa TLS. Mọi phiên đăng nhập đều được ghi nhật ký để đảm bảo an toàn hệ thống.
            </p>
          </div>

          {/* Back link */}
          <p className="text-center text-[13px] text-[#64748B] mt-6">
            <button
              onClick={() => navigate("/")}
              className="font-bold text-[#4F46E5] hover:underline underline-offset-4 transition-all"
            >
              ← Quay lại trang chủ
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;
