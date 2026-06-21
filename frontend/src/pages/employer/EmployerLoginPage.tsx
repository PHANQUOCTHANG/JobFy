import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginEmployer, googleLoginEmployer } from '@/features/auth/slice/authSlice';
import { loginSchema, LoginRequest } from '@/../../backend/src/module/auth/auth.request';
import { useGoogleLogin } from '@react-oauth/google';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Users,
  Zap,
  Shield,
  ArrowLeft,
  Loader2,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import GoogleLoginButton from '@/features/auth/components/GoogleLoginButton';

/* ─── Background Pattern (same as Register) ─── */
const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    />
    {/* Glows */}
    <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-white/10 rounded-full blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px]" />
  </div>
);

/* ─── Reusable InputField (same as Register) ─── */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  labelRight?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, labelRight, error, rightElement, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-[13px] font-bold text-[#0F172A]">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${error
              ? 'text-red-500'
              : 'text-[#94A3B8] group-focus-within:text-[#00307c]'
            }`}
        >
          <Icon size={17} strokeWidth={2} />
        </div>
        <input
          ref={ref}
          id={id}
          className={`w-full bg-white hover:bg-slate-50 focus:bg-white rounded-xl border pl-11 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-200 ${rightElement ? 'pr-11' : 'pr-4'
            } ${error
              ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
              : 'border-[#E2E8F0] focus:border-[#00307c] focus:shadow-[0_0_0_3px_rgba(0,48,124,0.10)]'
            }`}
          style={{ height: '50px' }}
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
InputField.displayName = 'InputField';

/* ─── Feature Badge (same as Register) ─── */
const FeatureBadge = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
      <Icon size={18} className="text-white" strokeWidth={2} />
    </div>
    <div>
      <p className="text-white font-bold text-[14px]">{title}</p>
      <p className="text-white/60 text-[12px]">{desc}</p>
    </div>
  </div>
);

/* ─── Main Page ─── */
const EmployerLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'employer',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    const resultAction = await dispatch(loginEmployer({ ...data, role: 'employer' }));

    if (loginEmployer.fulfilled.match(resultAction)) {
      toast.success('Đăng nhập thành công!');
      navigate('/employer');
    } else {
      toast.error(resultAction.payload as string || 'Đăng nhập thất bại');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const resultAction = await dispatch(googleLoginEmployer(tokenResponse.access_token));
        if (googleLoginEmployer.fulfilled.match(resultAction)) {
          toast.success('Đăng nhập bằng Google thành công!');
          navigate('/employer');
        } else {
          toast.error(resultAction.payload as string || 'Đăng nhập bằng Google thất bại');
        }
      } catch (error) {
        toast.error('Đăng nhập bằng Google thất bại');
      }
    },
    onError: () => toast.error('Đăng nhập bằng Google thất bại'),
  });

  return (
    <div
      className="min-h-screen w-full flex bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ════════════════════════════
          LEFT: Visual / Branding Panel (same as Register)
         ════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-[45%] relative bg-[#00307c] overflow-hidden p-12">
        <BackgroundPattern />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase size={20} className="text-[#00307c]" strokeWidth={2.5} />
          </div>
          <span className="text-white text-[22px] font-black tracking-tight">
            JobFy<span className="text-[#83fc8e]">.</span>
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 mt-16 mb-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#83fc8e] animate-pulse" />
            <span className="text-white/80 text-[12px] font-bold uppercase tracking-wider">
              Nền tảng tuyển dụng #1 Việt Nam
            </span>
          </div>
          <h1
            className="text-white font-black leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
          >
            Tìm kiếm nhân tài
            <br />
            <em className="not-italic text-[#83fc8e]">nhanh hơn</em> với AI.
          </h1>
          <p className="text-white/65 text-[16px] leading-relaxed max-w-sm">
            Đăng tin tuyển dụng, quản lý ứng viên và ra quyết định thông minh — tất cả trong một nền tảng duy nhất.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 flex flex-col gap-5 mb-12">
          <FeatureBadge
            icon={Zap}
            title="AI Matching chính xác 95%"
            desc="Khớp ứng viên phù hợp tự động"
          />
          <FeatureBadge
            icon={Users}
            title="500+ doanh nghiệp tin dùng"
            desc="Từ startup đến tập đoàn lớn"
          />
          <FeatureBadge
            icon={Shield}
            title="Bảo mật dữ liệu tuyệt đối"
            desc="Tuân thủ chuẩn ISO 27001"
          />
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-[#83fc8e]" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="text-white/90 text-[14px] leading-relaxed italic mb-4">
            "JobFy giúp chúng tôi giảm 40% thời gian tuyển dụng. Hệ thống AI matching cực kỳ chính xác và dễ sử dụng."
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7X05WuGq4MYAfz-GNnFpeLX9sH6v4zZyfRfLd_Qpa8rjsY44byupWSonEYXu0vomysgXiHV5uKA6yNgYHRnne_aL18BYMyZJgz2Z6UmF7VXiCVyPPjYIPzmg8Y6OamZAm3PwKdG82VSzUFwnJrPB0jROgXU6agwX7Qc53BVCpmHpgxXK5RE35l1NFa8CyHvAmtN1vXlM7tbAgTmLKlrSelhHzGhATc8VEVUdION-Y3cV0gEQTc27ja3WhKhXpi-m_CkQIPYeNDeM"
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white/40 object-cover"
            />
            <div>
              <p className="text-white font-bold text-[13px]">Nguyễn Lan Anh</p>
              <p className="text-white/55 text-[11px] uppercase tracking-wider font-medium">
                HR Director · TechCorp
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex justify-between mt-8 text-white/35 text-[11px] uppercase tracking-wider font-semibold">
          <span>© 2024 JobFy Enterprise</span>
          <span>Trusted by 500+ Companies</span>
        </div>
      </aside>

      {/* ════════════════════════════
          RIGHT: Login Form
         ════════════════════════════ */}
      <main className="w-full lg:w-[55%] flex items-start justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Top Nav */}
          <div className="flex items-center justify-between mb-10 mt-2">
            {/* Mobile logo */}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <div className="w-9 h-9 bg-[#00307c] rounded-xl flex items-center justify-center">
                <Briefcase size={17} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[20px] font-black text-[#0F172A]">
                JobFy<span className="text-[#00307c]">.</span>
              </span>
            </Link>
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#00307c] transition-colors"
            >
              <ArrowLeft size={15} />
              Quay lại trang chủ
            </Link>
            <Link
              to="/employer/register"
              className="text-[13px] font-bold text-[#00307c] hover:underline underline-offset-4 transition-all"
            >
              Đăng ký
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2
              className="font-black text-[#0F172A] mb-2"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}
            >
              Chào mừng trở lại
            </h2>
            <p className="text-[#64748B] text-[15px] leading-relaxed">
              Vui lòng đăng nhập để quản lý quy trình tuyển dụng của bạn.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <InputField
              icon={Mail}
              label="Email doanh nghiệp"
              id="login-email"
              type="email"
              placeholder="email@congty.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <InputField
              icon={Lock}
              label="Mật khẩu"
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              labelRight={
                <Link
                  to="/employer/forgot-password"
                  className="text-[12px] font-bold text-[#00307c] hover:underline underline-offset-2"
                >
                  Quên mật khẩu?
                </Link>
              }
              error={errors.password?.message}
              {...register('password')}
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

            {/* Remember me */}
            <div className="flex items-center gap-3 py-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] accent-[#00307c] cursor-pointer"
                {...register('rememberMe')}
              />
              <label
                htmlFor="remember"
                className="text-[13px] text-[#64748B] cursor-pointer font-medium"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00307c] hover:bg-[#002568] text-white text-[14.5px] font-bold rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-lg shadow-[#00307c]/25 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập ngay'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Hoặc
            </span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Google Sign In */}
          <div className="w-full relative mt-[-10px] [&>div]:justify-center">
            <GoogleLoginButton role="employer" />
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-[#F1F5F9]">
            {[
              { icon: Shield, label: 'Bảo mật SSL' },
              { icon: CheckCircle2, label: 'Miễn phí 30 ngày' },
              { icon: Zap, label: 'Thiết lập trong 2 phút' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[#94A3B8]">
                <Icon size={13} strokeWidth={2} />
                <span className="text-[11.5px] font-semibold">{label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-[14px] text-[#64748B] mt-6">
            Chưa có tài khoản doanh nghiệp?{' '}
            <Link
              to="/employer/register"
              className="font-bold text-[#00307c] hover:underline underline-offset-4 transition-all"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmployerLoginPage;
