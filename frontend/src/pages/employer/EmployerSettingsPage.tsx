import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { employerApi } from "../../types/employerApi";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, FileText, Send, Upload, Edit3, ShieldCheck, MapPin, AlignLeft, Save, X, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/config/firebase";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

// Schema validation cho Bước 3
const verificationSchema = z.object({
  taxCode: z.string()
    .regex(/^[0-9]{10,13}$/, "Mã số thuế phải từ 10-13 chữ số"),
  legalName: z.string().min(5, "Tên doanh nghiệp pháp lý quá ngắn"),
  businessLicenseUrl: z.string().url("Vui lòng tải lên giấy phép kinh doanh"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const EmployerSettingsPage = () => {
  const queryClient = useQueryClient();
  const [otpValue, setOtpValue] = useState("");
  const [showOtpInput, setShowOtpValue] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Phone Verification States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { businessLicenseUrl: "" }
  });

  // 1. Fetch tiến trình xác thực
  const { data: progress, isLoading } = useQuery({
    queryKey: ["employer-verification-progress"],
    queryFn: employerApi.getProgress,
  });

  // 2. Mutation: Gửi lại OTP
  const resendOtpMutation = useMutation({
    mutationFn: employerApi.resendOtp,
    onSuccess: () => {
      toast.success("Mã xác thực OTP mới đã được gửi vào email của bạn");
      setShowOtpValue(true);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Không thể gửi mã lúc này")
  });

  // Mutation: Xác thực OTP
  const verifyEmailMutation = useMutation({
    mutationFn: employerApi.verifyEmail,
    onSuccess: () => {
      toast.success("Xác thực email thành công!");
      queryClient.invalidateQueries({ queryKey: ["employer-verification-progress"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Mã OTP không chính xác")
  });

  // 3. Mutation: Gửi hồ sơ pháp lý
  const submitLegalMutation = useMutation({
    mutationFn: employerApi.submitLegal,
    onSuccess: () => {
      toast.success("Hồ sơ pháp lý đã được gửi!", {
        description: "Quản trị viên sẽ kiểm tra và phản hồi trong vòng 24h làm việc."
      });
      queryClient.invalidateQueries({ queryKey: ["employer-verification-progress"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Gửi hồ sơ thất bại")
  });

  // 4. Mutation: Xác nhận Phone Firebase ID Token
  const verifyPhoneMutation = useMutation({
    mutationFn: employerApi.verifyPhone,
    onSuccess: () => {
      toast.success("Xác thực số điện thoại thành công!");
      queryClient.invalidateQueries({ queryKey: ["employer-verification-progress"] });
      setShowPhoneOtpInput(false);
      setPhoneNumber("");
      setPhoneOtp("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Xác thực số điện thoại trên máy chủ thất bại")
  });

  // Gửi OTP SĐT qua Firebase
  const handleSendPhoneOtp = async () => {
    if (!phoneNumber) return toast.error("Vui lòng nhập số điện thoại");
    setIsSendingPhoneOtp(true);
    try {
      // Chuẩn bị ReCaptcha
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
        });
      }

      // Format số điện thoại về chuẩn E.164 nếu cần (Ví dụ: 0912... -> +84912...)
      let formattedPhone = phoneNumber;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+84' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowPhoneOtpInput(true);
      toast.success("Đã gửi mã OTP đến số điện thoại của bạn");
    } catch (error: any) {
      console.error(error);
      toast.error("Gửi mã OTP thất bại. " + (error.message || "Vui lòng kiểm tra lại số điện thoại."));
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  // Xác thực OTP SĐT qua Firebase
  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || !confirmationResult) return;
    setIsVerifyingPhoneOtp(true);
    try {
      const result = await confirmationResult.confirm(phoneOtp);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Gọi BE để cập nhật DB
      verifyPhoneMutation.mutate(idToken);
    } catch (error: any) {
      console.error(error);
      toast.error("Mã OTP không hợp lệ hoặc đã hết hạn");
    } finally {
      setIsVerifyingPhoneOtp(false);
    }
  };

  const onVerifySubmit = (data: VerificationFormData) => {
    submitLegalMutation.mutate({
      taxCode: data.taxCode,
      businessLicenseUrl: data.businessLicenseUrl
    });
  };

  // Xử lý upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const res = await employerApi.uploadDocument(file);
        if (res.status === "success" && res.data.url) {
          setValue("businessLicenseUrl", res.data.url);
          toast.success("Đã tải lên tệp: " + file.name);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi tải tệp lên");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const stepsCompleted = useMemo(() => {
    if (!progress) return 0;
    let count = 0;
    if (progress.step1.isCompleted) count++;
    if (progress.step1_5?.isCompleted) count++;
    if (progress.step2.isCompleted) count++;
    if (progress.step3.isVerified) count++;
    return count;
  }, [progress]);

  const totalSteps = 4; // Tính cả phone
  const isFullyVerified = progress?.step1.isCompleted && progress?.step1_5?.isCompleted && progress?.step2.isCompleted && progress?.step3.isVerified;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-[#00307c]" size={40} />
        <p className="font-bold text-slate-500">Đang tải tiến trình xác thực...</p>
      </div>
    );
  }

  const isStep3Pending = progress?.step3.hasTaxCode && !progress?.step3.isVerified;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
      {/* reCAPTCHA container ẩn đi */}
      <div id="recaptcha-container"></div>
      {/* Status Banner */}
      {!isFullyVerified ? (
        <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl flex gap-4 items-center border border-rose-200 shadow-sm">
          <AlertCircle className="text-rose-600 shrink-0" size={24} />
          <p className="text-[14px] font-bold leading-relaxed">
            Tài khoản của bạn chưa được xác thực hoàn toàn. Vui lòng hoàn tất các bước dưới đây để có thể đăng tin tuyển dụng và tìm kiếm nhân tài.
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50 text-emerald-800 p-5 rounded-2xl flex gap-4 items-center border border-emerald-200 shadow-sm">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
          <div>
            <p className="text-[15px] font-black uppercase tracking-tight">Doanh nghiệp đã xác thực Platinum</p>
            <p className="text-[13px] font-medium opacity-80">Tài khoản của bạn hiện có đầy đủ quyền hạn trên hệ thống JobFy.</p>
          </div>
        </div>
      )}

      {/* Verification Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-black text-[#0F172A]">Tiến trình xác thực doanh nghiệp</h2>
          <span className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">
            HOÀN THÀNH {stepsCompleted}/{totalSteps} BƯỚC
          </span>
        </div>

        {/* Step 1: Email */}
        <div className={`bg-white rounded-3xl p-6 border ${progress?.step1.isCompleted ? 'border-emerald-100 shadow-sm' : 'border-[#E2E8F0] shadow-none'} flex flex-col md:flex-row gap-6 items-start md:items-center`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${progress?.step1.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            {progress?.step1.isCompleted ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-black text-[#0F172A]">Bước 1: Xác thực Email</h3>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase border ${progress?.step1.isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {progress?.step1.isCompleted ? 'ĐÃ XÁC THỰC' : 'CHƯA XÁC MINH'}
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#64748B]">Email <strong className="text-[#0F172A]">{progress?.step1.email}</strong> dùng để quản trị và nhận hồ sơ.</p>

            {!progress?.step1.isCompleted && (showOtpInput || progress?.step1.email) && (
              <div className="mt-3 flex items-center gap-2 animate-in slide-in-from-top-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Nhập mã OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-32 p-2 border-2 border-slate-200 rounded-lg text-center font-bold tracking-[0.2em] focus:border-[#00307c] outline-none transition-all"
                />
                <button
                  onClick={() => {
                    console.log('[FE] submit OTP=', otpValue, 'email=', progress?.step1?.email);
                    verifyEmailMutation.mutate(otpValue);
                  }}
                  disabled={verifyEmailMutation.isPending || otpValue.length !== 6}
                  className="px-4 py-2 bg-[#00307c] text-white text-[12px] font-bold rounded-lg hover:bg-[#002568] disabled:opacity-50"
                >
                  {verifyEmailMutation.isPending ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
                </button>
              </div>
            )}
          </div>
          {!progress?.step1.isCompleted && (
            <button
              disabled={resendOtpMutation.isPending}
              onClick={() => resendOtpMutation.mutate()}
              className="px-4 py-2 border-2 border-[#E2E8F0] rounded-xl text-[12px] font-black text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {resendOtpMutation.isPending && <Loader2 size={14} className="animate-spin" />}
              {showOtpInput ? 'GỬI LẠI MÃ' : 'GỬI MÃ XÁC THỰC'}
            </button>
          )}
        </div>

        {/* Step 1.5: Phone Verification */}
        <div className={`bg-white rounded-3xl p-6 border ${progress?.step1_5?.isCompleted ? 'border-emerald-100 shadow-sm' : 'border-[#E2E8F0] shadow-none'} flex flex-col md:flex-row gap-6 items-start md:items-center`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${progress?.step1_5?.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            {progress?.step1_5?.isCompleted ? <CheckCircle2 size={24} /> : <Phone size={24} />}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-black text-[#0F172A]">Bước 2: Xác thực Số Điện Thoại</h3>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase border ${progress?.step1_5?.isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {progress?.step1_5?.isCompleted ? 'ĐÃ XÁC THỰC' : 'CHƯA XÁC MINH'}
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#64748B]">Số điện thoại {progress?.step1_5?.phone && <strong className="text-[#0F172A]">{progress?.step1_5.phone}</strong>} dùng để ứng viên liên hệ trực tiếp.</p>

            {!progress?.step1_5?.isCompleted && (
              <div className="mt-3 flex flex-col gap-2 animate-in slide-in-from-top-2">
                {!showPhoneOtpInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại (VD: 0912...)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-48 p-2 border-2 border-slate-200 rounded-lg font-medium focus:border-[#00307c] outline-none transition-all"
                    />
                    <button
                      onClick={handleSendPhoneOtp}
                      disabled={isSendingPhoneOtp || !phoneNumber}
                      className="px-4 py-2 bg-[#00307c] text-white text-[12px] font-bold rounded-lg hover:bg-[#002568] disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSendingPhoneOtp && <Loader2 size={14} className="animate-spin" />}
                      NHẬN OTP
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Nhập mã OTP SMS"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      className="w-32 p-2 border-2 border-slate-200 rounded-lg text-center font-bold tracking-[0.2em] focus:border-[#00307c] outline-none transition-all"
                    />
                    <button
                      onClick={handleVerifyPhoneOtp}
                      disabled={isVerifyingPhoneOtp || phoneOtp.length !== 6 || verifyPhoneMutation.isPending}
                      className="px-4 py-2 bg-[#00307c] text-white text-[12px] font-bold rounded-lg hover:bg-[#002568] disabled:opacity-50 flex items-center gap-2"
                    >
                      {(isVerifyingPhoneOtp || verifyPhoneMutation.isPending) ? "ĐANG XÁC THỰC..." : "XÁC NHẬN"}
                    </button>
                    <button
                      onClick={() => { setShowPhoneOtpInput(false); setPhoneOtp(""); }}
                      className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-[12px] font-bold"
                    >
                      HỦY
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Company Info */}
        <div className={`bg-white rounded-3xl p-6 border ${progress?.step2.isCompleted ? 'border-emerald-100 shadow-sm' : 'border-[#E2E8F0] shadow-none'} flex flex-col md:flex-row gap-6 items-start md:items-center`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${progress?.step2.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-[#00307c]'}`}>
            {progress?.step2.isCompleted ? <CheckCircle2 size={24} /> : <Edit3 size={24} />}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-black text-[#0F172A]">Bước 3: Cập nhật thông tin công ty</h3>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border uppercase ${progress?.step2.isCompleted ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-[#F1F5F9] text-[#00307c] border-[#E2E8F0]'}`}>
                {progress?.step2.isCompleted ? 'HOÀN TẤT' : 'CẦN CẬP NHẬT'}
              </span>
            </div>
            <p className="text-[13px] font-medium text-[#64748B]">Cung cấp thông tin cơ bản về doanh nghiệp, địa chỉ và lĩnh vực hoạt động.</p>
          </div>
          <Link
            to="/employer/company"
            className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-[12px] font-black hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            {progress?.step2.isCompleted ? 'CHỈNH SỬA' : 'CẬP NHẬT NGAY'}
            <Edit3 size={16} />
          </Link>
        </div>

        {/* Step 3: Legal Documents */}
        <div className={`bg-white rounded-3xl p-6 border ${progress?.step3.isVerified ? 'border-emerald-100' : 'border-[#E2E8F0]'} space-y-6 shadow-sm`}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${progress?.step3.isVerified ? 'bg-emerald-100 text-emerald-600' : isStep3Pending ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
              {progress?.step3.isVerified ? <ShieldCheck size={24} /> : <FileText size={24} />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-[#0F172A]">Bước 4: Xác thực giấy đăng ký doanh nghiệp</h3>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border uppercase ${progress?.step3.isVerified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  isStep3Pending ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {progress?.step3.isVerified ? 'ĐÃ XÁC THỰC' : isStep3Pending ? 'ĐANG CHỜ DUYỆT' : 'CHƯA TẢI LÊN'}
                </span>
              </div>
              <p className="text-[13px] font-medium text-[#64748B]">Tải lên bản quét giấy phép kinh doanh hợp lệ (PDF hoặc JPG) để kích hoạt tài khoản tuyển dụng.</p>
            </div>
          </div>

          {!progress?.step3.isVerified && (
            <form onSubmit={handleSubmit(onVerifySubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">TÊN DOANH NGHIỆP TRÊN GIẤY PHÉP</span>
                  <input
                    {...register("legalName")}
                    disabled={isStep3Pending}
                    className={`w-full p-3 border rounded-xl bg-white focus:border-[#00307c] outline-none transition-all text-[14px] font-bold text-[#0F172A] disabled:bg-slate-50 ${errors.legalName ? 'border-rose-500' : 'border-[#E2E8F0]'}`}
                    placeholder="CÔNG TY TNHH JOBFY VIỆT NAM"
                    type="text"
                  />
                  {errors.legalName && <p className="text-rose-500 text-[11px] font-bold">{errors.legalName.message}</p>}
                </label>
                <label className="block space-y-2">
                  <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">MÃ SỐ THUẾ / SỐ GIẤY PHÉP</span>
                  <input
                    {...register("taxCode")}
                    disabled={isStep3Pending}
                    className={`w-full p-3 border rounded-xl bg-white focus:border-[#00307c] outline-none transition-all text-[14px] font-bold text-[#0F172A] disabled:bg-slate-50 ${errors.taxCode ? 'border-rose-500' : 'border-[#E2E8F0]'}`}
                    placeholder="0123456789"
                    type="text"
                  />
                  {errors.taxCode && <p className="text-rose-500 text-[11px] font-bold">{errors.taxCode.message}</p>}
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">HỒ SƠ PHÁP LÝ (PDF, JPG)</span>
                <label className={`flex-1 min-h-[140px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${isStep3Pending || isUploading ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : watch("businessLicenseUrl") ? 'bg-emerald-50 border-emerald-200 cursor-pointer' : 'bg-[#F8FAFC] border-[#CBD5E1] hover:bg-[#F1F5F9] cursor-pointer group'}`}>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} disabled={isStep3Pending || isUploading} />
                  <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#00307c]">
                    {isUploading ? <Loader2 className="animate-spin text-[#00307c]" size={20} /> : watch("businessLicenseUrl") ? <CheckCircle2 className="text-emerald-600" size={20} /> : <Upload size={20} />}
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-black text-[#0F172A]">
                      {isUploading ? "Đang tải lên..." : watch("businessLicenseUrl") ? "Đã chọn tệp thành công" : "Click để tải tệp lên"}
                    </p>
                    <p className="text-[12px] font-medium text-[#64748B] mt-0.5">
                      {watch("businessLicenseUrl") ? "Bạn có thể thay đổi bằng cách nhấn lại" : "Kích thước tối đa: 10MB"}
                    </p>
                  </div>
                </label>
                {errors.businessLicenseUrl && <p className="text-rose-500 text-[11px] font-bold">{errors.businessLicenseUrl.message}</p>}
              </div>
            </form>)}

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
            <AlertCircle className="text-[#00307c] shrink-0" size={20} />
            <p className="text-[13px] font-medium text-[#475569] leading-relaxed">
              Quy trình xác thực thường mất từ <strong className="text-[#00307c]">12-24 giờ làm việc</strong>. Khi đã gửi hồ sơ, bạn không thể thay đổi thông tin cho đến khi có kết quả duyệt.
            </p>
          </div>

          {!progress?.step3.isVerified && (
            <div className="flex items-center justify-end gap-4 mt-2">
              <button
                type="button"
                disabled={submitLegalMutation.isPending || isStep3Pending || !progress?.step2.isCompleted}
                className="px-8 py-3 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white text-[14px] font-black rounded-xl shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit(onVerifySubmit)}              >
                {submitLegalMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Gửi hồ sơ xác thực</>}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 text-center pb-6">
        <p className="text-[13px] font-medium text-[#94A3B8]">© 2026 JobFy Enterprise. Môi trường tuyển dụng chuyên nghiệp.</p>
      </footer>
    </div>
  );
};

export default EmployerSettingsPage;
