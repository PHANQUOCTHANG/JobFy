import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtp, sendOtp } from '@/features/auth/types/authSlice';
import { ShieldCheck, ArrowLeft, Loader2, KeyRound, ChevronRight } from 'lucide-react';
import { BackgroundPattern, FeatureBadge, InputField } from './AuthComponents';
import { VerifyOtpPage } from '../auth';

const EmployerVerifyOtpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const { isLoading } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { otp: '' }
  });

  useEffect(() => {
    if (!email) {
      toast.warning('Phiên giao dịch không hợp lệ. Vui lòng thử lại.');
      navigate('/employer/login', { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null;

  const onSubmit = async (data: { otp: string }) => {
    const resultAction = await dispatch(verifyOtp({ email, otp: data.otp }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      toast.success('Xác thực mã thành công!');
      navigate('/employer/reset-password', { state: { email, otp: data.otp } });
    } else {
      toast.error(resultAction.payload as string);
    }
  };

  const handleResend = async () => {
    await dispatch(sendOtp(email));
    toast.success('Mã OTP đã được gửi lại.');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <aside className="hidden lg:flex flex-col w-[45%] relative bg-[#00307c] overflow-hidden p-12">
        <BackgroundPattern />
        <div className="relative z-10 mt-auto">
          <FeatureBadge
            icon={ShieldCheck}
            title="Xác thực an toàn"
            desc="Mã OTP có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này."
          />
        </div>
      </aside>

      <main className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link to="/employer/forgot-password" className="flex items-center gap-1.5 text-[13px] font-bold text-[#64748B] hover:text-[#00307c] mb-8 transition-colors">
            <ArrowLeft size={15} /> Quay lại
          </Link>

          <div className="mb-8">
            <h2 className="font-black text-[#0F172A] text-[32px] mb-2">Nhập mã OTP</h2>
            <p className="text-[#64748B] text-[15px] leading-relaxed">
              Mã xác thực đã được gửi tới <span className="text-[#0F172A] font-bold">{email}</span>. Vui lòng kiểm tra hộp thư đến hoặc thư rác.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              icon={KeyRound}
              label="Mã xác thực (6 số)"
              id="verify-otp"
              type="text"
              maxLength={6}
              placeholder="000000"
              error={errors.otp?.message}
              {...register('otp', {
                required: 'Vui lòng nhập mã OTP',
                pattern: { value: /^\d{6}$/, message: 'Mã OTP phải có 6 chữ số' }
              })}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00307c] hover:bg-[#002568] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Xác thực ngay <ChevronRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] text-[#64748B]">
              Không nhận được mã?{' '}
              <button onClick={handleResend} className="font-bold text-[#00307c] hover:underline">Gửi lại mã</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerVerifyOtpPage;