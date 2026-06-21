import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPassword } from '@/features/auth/slice/authSlice';
import { resetPasswordSchema } from '@/../../backend/src/module/auth/auth.request';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { BackgroundPattern, FeatureBadge, InputField } from '../../components/ui/AuthComponents';

const EmployerResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Email và OTP được truyền từ trang Verify thông qua state
  const { email, otp } = location.state || {};
  const { isLoading } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp, newPassword: '' } as any
  });

  const passwordValue = watch('newPassword', '');

  // Logic độ mạnh mật khẩu (Tương tự EmployerRegisterPage)
  const getStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    const length = pass.length;
    if (length < 8) return { score: 1, label: 'Yếu', color: 'bg-red-500', text: 'text-red-500' };
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) return { score: 4, label: 'Rất mạnh', color: 'bg-emerald-500', text: 'text-emerald-500' };
    return { score: 2, label: 'Trung bình', color: 'bg-yellow-500', text: 'text-yellow-500' };
  };
  const strength = getStrength(passwordValue);

  const onSubmit = async (data: any) => {
    const resultAction = await dispatch(resetPassword(data));
    if (resetPassword.fulfilled.match(resultAction)) {
      toast.success('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
      navigate('/employer/login');
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <p className="font-bold text-slate-600 mb-4">Phiên làm việc không hợp lệ.</p>
          <Link to="/employer/login" className="text-[#00307c] font-black underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <aside className="hidden lg:flex flex-col w-[45%] relative bg-[#00307c] overflow-hidden p-12">
        <BackgroundPattern />
        <div className="relative z-10 mt-auto">
          <FeatureBadge
            icon={CheckCircle2}
            title="Hoàn tất bảo mật"
            desc="Mật khẩu mới sẽ giúp bạn truy cập lại vào hệ thống tuyển dụng AI."
          />
        </div>
      </aside>

      <main className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
          <div className="mb-10 text-center lg:text-left">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 mx-auto lg:mx-0">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-[32px] font-black text-[#0F172A] mb-2">Mật khẩu mới</h2>
            <p className="text-[#64748B] text-[15px]">Hãy thiết lập một mật khẩu mạnh để bảo vệ tài khoản.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <InputField
                icon={Lock}
                label="Mật khẩu mới"
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.newPassword?.message as string | undefined}
                {...register('newPassword')}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              {passwordValue && (
                <div className="px-1 pt-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`h-full flex-1 rounded-full ${s <= strength.score ? strength.color : 'bg-slate-200'} transition-all duration-500`} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-bold mt-1.5 ${strength.text}`}>Độ mạnh: {strength.label}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00307c] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Cập nhật mật khẩu'}
            </button>

            <Link to="/employer/login" className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#00307c] mt-4 transition-colors">
              <ArrowLeft size={15} /> Hủy bỏ
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EmployerResetPasswordPage;