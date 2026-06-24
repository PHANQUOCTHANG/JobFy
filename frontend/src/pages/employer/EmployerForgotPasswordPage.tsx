import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { sendOtp } from '@/features/auth/slice/authSlice';
import { Mail, ArrowLeft, Loader2, ChevronRight, KeyRound } from 'lucide-react';
import { BackgroundPattern, FeatureBadge, InputField } from '../../components/ui/AuthComponents';

const EmployerForgotPasswordPage: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: { email: string }) => {
    const resultAction = await dispatch(sendOtp(data.email));
    if (sendOtp.fulfilled.match(resultAction)) {
      toast.success('Mã xác thực đã được gửi đến email của bạn');
      navigate('/employer/verify-otp', { state: { email: data.email } });
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <aside className="hidden lg:flex flex-col w-[45%] relative bg-[#00307c] overflow-hidden p-12">
        <BackgroundPattern />
        <div className="relative z-10 mt-auto">
          <FeatureBadge
            icon={KeyRound}
            title="Khôi phục quyền truy cập"
            desc="Chúng tôi sẽ giúp bạn lấy lại mật khẩu an toàn và nhanh chóng."
          />
        </div>
      </aside>

      <main className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link to="/employer/login" className="flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#00307c] mb-8 transition-colors">
            <ArrowLeft size={15} /> Quay lại đăng nhập
          </Link>

          <div className="mb-8">
            <h2 className="font-black text-[#0F172A] text-[32px] mb-2 tracking-tight">Quên mật khẩu?</h2>
            <p className="text-[#64748B] text-[15px] leading-relaxed">
              Nhập email đăng ký của bạn. Chúng tôi sẽ gửi mã OTP để xác nhận danh tính của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              icon={Mail}
              label="Email doanh nghiệp"
              id="forgot-email"
              type="email"
              placeholder="email@congty.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: { value: /^\S+@\S+$/i, message: 'Email không đúng định dạng' }
              })}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00307c] hover:bg-[#002568] text-white font-bold rounded-xl shadow-lg shadow-[#00307c]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Gửi mã xác thực
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-[13px] text-center text-slate-500">
              Bạn gặp khó khăn khi khôi phục?{' '}
              <Link to="/contact" className="text-[#00307c] font-bold hover:underline">Liên hệ hỗ trợ</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerForgotPasswordPage;