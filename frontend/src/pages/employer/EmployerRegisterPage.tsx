import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  Users,
  Zap,
  Shield,
  Briefcase,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';

/* ─── Background Pattern ─── */
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
    <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-white/10 rounded-full blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px]" />
  </div>
);

/* ─── Reusable InputField ─── */
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
              ? 'text-red-500'
              : 'text-[#94A3B8] group-focus-within:text-[#00307c]'
          }`}
        >
          <Icon size={17} strokeWidth={2} />
        </div>
        <input
          ref={ref}
          id={id}
          className={`w-full bg-white hover:bg-slate-50 focus:bg-white rounded-xl border pl-11 pr-4 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-200 ${
            error
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

/* ─── Feature Badge ─── */
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
const EmployerRegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex bg-slate-50 text-slate-900"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* ════════════════════════════
          LEFT: Visual / Branding Panel
         ════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-[45%] relative bg-[#00307c] overflow-hidden p-12">
        <BackgroundPattern />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase size={20} className="text-[#00307c]" strokeWidth={2.5} />
          </div>
          <span className="text-white text-[22px] font-black tracking-tight">
            JobFy<span className="text-[#83fc8e]">.</span>
          </span>
        </div>

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

        <div className="relative z-10 flex justify-between mt-8 text-white/35 text-[11px] uppercase tracking-wider font-semibold">
          <span>© 2024 JobFy Enterprise</span>
          <span>Trusted by 500+ Companies</span>
        </div>
      </aside>

      {/* ════════════════════════════
          RIGHT: Register Form
         ════════════════════════════ */}
      <main className="w-full lg:w-[55%] flex items-start justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="flex items-center justify-between mb-10 mt-2">
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
              to="/login"
              className="text-[13px] font-bold text-[#00307c] hover:underline underline-offset-4 transition-all"
            >
              Đăng nhập
            </Link>
          </div>

          <div className="mb-8">
            <h2
              className="font-black text-[#0F172A] mb-2"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}
            >
              Tạo tài khoản doanh nghiệp
            </h2>
            <p className="text-[#64748B] text-[15px] leading-relaxed">
              Điền thông tin bên dưới để bắt đầu tuyển dụng với JobFy.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">

            <InputField
              icon={Building2}
              label="Tên công ty"
              id="company-name"
              type="text"
              placeholder="Ví dụ: Công ty TNHH Công nghệ ABC"
            />

            <InputField
              icon={Mail}
              label="Email doanh nghiệp"
              id="email"
              type="email"
              placeholder="name@company.com"
            />

            <InputField
              icon={Phone}
              label="Số điện thoại"
              id="phone"
              type="tel"
              placeholder="0123 456 789"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                icon={Lock}
                label="Mật khẩu"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
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
              <InputField
                icon={Lock}
                label="Nhập lại mật khẩu"
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
            </div>

            <div className="flex items-start gap-3 py-1">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] accent-[#00307c] cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-[13px] text-[#64748B] leading-relaxed cursor-pointer"
              >
                Tôi đồng ý với{' '}
                <Link
                  to="#"
                  className="text-[#00307c] font-bold hover:underline underline-offset-2"
                >
                  Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link
                  to="#"
                  className="text-[#00307c] font-bold hover:underline underline-offset-2"
                >
                  Chính sách bảo mật
                </Link>{' '}
                của JobFy.
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#00307c] hover:bg-[#002568] text-white text-[14.5px] font-bold rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00307c]/25 mt-2"
            >
              <span>Tạo tài khoản miễn phí</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Hoặc
            </span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <button
            type="button"
            className="w-full h-12 border-2 border-[#E2E8F0] hover:border-[#0F172A] bg-white text-[#0F172A] text-[14.5px] font-bold rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Đăng ký với Google</span>
          </button>

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

          <p className="text-center text-[14px] text-[#64748B] mt-6">
            Đã có tài khoản?{' '}
            <Link
              to="/employer/login"
              className="font-bold text-[#00307c] hover:underline underline-offset-4 transition-all"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default EmployerRegisterPage;
