import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useApplyJob, useApplyWithCv } from '../hooks/useApplications';
import { useMyResumes } from '@/features/candidates/hooks/useCandidates';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, AlertCircle, Upload, ChevronDown, X, CheckCircle2, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const uploadSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
});


interface ApplyJobModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  jobId,
  jobTitle,
  companyName,
  isOpen,
  onClose,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [selectedCvType, setSelectedCvType] = useState<'online' | 'upload'>('online');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { data: resumes, isLoading: isLoadingResumes } = useMyResumes();
  const { mutate: apply, isPending } = useApplyJob();
  const { mutate: applyWithCv, isPending: isUploadingCv } = useApplyWithCv();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { register, handleSubmit, formState: { errors }, reset, trigger, getValues } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: '',
    }
  });

  // Reset state when modal closes
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedCvType('online');
      setCoverLetter('');
      setSelectedFile(null);
      setIsSuccess(false);
      reset({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
      });
    }, 300);
  };

  const primaryResume = resumes?.[0];

  const submitApplication = (resumeId: string | null) => {
    apply({ jobId, resumeId, coverLetter }, {
      onSuccess: () => {
        setIsSuccess(true);
        onSuccess?.();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const status = error.response?.status;
        const msg = error.response?.data?.message;
        if (status === 409) {
          toast.error('Bạn đã ứng tuyển công việc này rồi');
        } else if (status === 403) {
          toast.error(msg || 'Bạn chưa có hồ sơ ứng viên');
        } else if (status === 400) {
          toast.error(msg || 'Công việc này không nhận ứng tuyển lúc này');
        } else {
          toast.error('Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại sau.');
        }
      }
    });
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để ứng tuyển');
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      toast.error('Chỉ ứng viên mới có thể ứng tuyển');
      return;
    }

    if (selectedCvType === 'online') {
      if (!primaryResume) {
        toast.error('Bạn chưa có CV nào trên hệ thống. Vui lòng tạo CV hoặc chọn tải lên.');
        return;
      }
      submitApplication(primaryResume.id);
    } else {
      if (!selectedFile) {
        toast.error('Vui lòng chọn hoặc tải lên một tệp CV (PDF, DOCX) trước khi ứng tuyển.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File CV không được vượt quá 5MB.');
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(selectedFile.type) && !['pdf', 'doc', 'docx'].includes(fileExt || '')) {
        toast.error('Chỉ hỗ trợ file PDF, DOC, DOCX.');
        return;
      }

      const isValid = await trigger();
      if (!isValid) {
        toast.error('Vui lòng kiểm tra lại thông tin bắt buộc.');
        return;
      }
      
      const formValues = getValues();
      applyWithCv(
        {
          jobId,
          cvFile: selectedFile,
          coverLetter,
          fullName: formValues.fullName,
          email: formValues.email,
          phone: formValues.phone,
        },
        {
          onSuccess: () => {
            setIsSuccess(true);
            onSuccess?.();
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            const status = error.response?.status;
            const msg = error.response?.data?.message;
            if (status === 409) {
              toast.error('Bạn đã ứng tuyển công việc này rồi');
            } else if (status === 403) {
              toast.error(msg || 'Bạn chưa có hồ sơ ứng viên');
            } else if (status === 400) {
              toast.error(msg || 'Công việc này không nhận ứng tuyển lúc này');
            } else {
              toast.error('Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại sau.');
            }
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-xl">
        {isSuccess ? (
          <div className="text-center py-12 px-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Ứng tuyển thành công!</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              Hồ sơ của bạn đã được gửi đến <strong className="text-slate-700">{companyName}</strong> cho vị trí <strong className="text-slate-700">{jobTitle}</strong>. Chúc bạn may mắn!
            </p>
            
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button 
                  onClick={handleClose}
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base"
                >
                  Tìm việc làm khác
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleClose();
                    navigate('/candidate/applications');
                  }}
                  className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-bold text-base hover:bg-slate-50"
                >
                  Xem lịch sử ứng tuyển
                </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col relative bg-white z-10">
              <DialogTitle className="text-xl font-bold text-slate-800">Ứng tuyển</DialogTitle>
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{jobTitle}</p>
              <button 
                onClick={handleClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Chọn CV để ứng tuyển
                </h3>
                <div className="space-y-3">
                  <label className={`block border ${selectedCvType === 'online' ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200'} rounded-lg p-4 cursor-pointer hover:border-indigo-400 transition-colors`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="cv_type" value="online" checked={selectedCvType === 'online'} onChange={() => setSelectedCvType('online')} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600 accent-indigo-600" />
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{primaryResume?.title || 'Chưa có CV trên hệ thống'}</span>
                              {primaryResume && <span className="text-[10px] font-semibold text-indigo-600 border border-indigo-200 bg-white px-2 py-0.5 rounded-full">CV ứng tuyển gần nhất</span>}
                            </div>
                            {primaryResume && (
                              <div className="flex gap-3 text-sm font-semibold text-indigo-600">
                                  <span className="hover:underline">Xem</span>
                                  <span className="hover:underline">Xem thêm.</span>
                              </div>
                            )}
                        </div>
                      </div>
                  </label>

                  <div className={`border ${selectedCvType === 'upload' ? 'border-indigo-600 shadow-sm' : 'border-slate-200 border-dashed'} rounded-lg transition-colors overflow-hidden`}>
                    <div 
                      onClick={() => setSelectedCvType('upload')}
                      className={`p-6 cursor-pointer hover:border-indigo-400 text-center relative ${selectedCvType === 'upload' ? 'bg-indigo-50/20' : ''}`}
                    >
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <input type="radio" name="cv_type" value="upload" checked={selectedCvType === 'upload'} onChange={() => setSelectedCvType('upload')} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600 accent-indigo-600" />
                          </div>
                          <Upload className="w-5 h-5 text-slate-400 ml-4" />
                          <span className="font-bold text-slate-800">Tải lên CV từ máy tính, chọn hoặc kéo thả</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 ml-6">Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB</p>
                        
                        {selectedFile ? (
                          <div className="ml-6 mt-1 flex items-center justify-center gap-3">
                             <div className="flex items-center gap-1.5 text-indigo-600 bg-white border border-indigo-200 px-3 py-1.5 rounded shadow-sm">
                               <FileText className="w-4 h-4" /> 
                               <span className="font-bold text-sm truncate max-w-[150px]">{selectedFile.name}</span>
                             </div>
                             
                             <button 
                               onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                               className="bg-red-50 hover:bg-red-100 text-red-500 p-1.5 rounded border border-red-100 transition-colors"
                               title="Xoá CV"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>

                             <label onClick={(e) => e.stopPropagation()} className="cursor-pointer">
                               <span className="text-sm font-bold bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 transition-colors inline-block shadow-sm">Chọn CV</span>
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 accept=".doc,.docx,.pdf" 
                                 onChange={(e) => {
                                   if (e.target.files?.[0]) {
                                     setSelectedFile(e.target.files[0]);
                                     setSelectedCvType('upload');
                                   }
                                 }} 
                               />
                             </label>
                          </div>
                        ) : (
                          <div className="ml-6 flex items-center justify-center gap-2">
                            <label onClick={(e) => e.stopPropagation()} className="cursor-pointer">
                               <span className="text-sm font-medium bg-slate-100 text-slate-700 px-4 py-1.5 rounded-md hover:bg-slate-200 transition-colors inline-block">Chọn CV</span>
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 accept=".doc,.docx,.pdf" 
                                 onChange={(e) => {
                                   if (e.target.files?.[0]) {
                                     setSelectedFile(e.target.files[0]);
                                     setSelectedCvType('upload');
                                   }
                                 }} 
                               />
                            </label>
                          </div>
                        )}
                    </div>

                    {selectedCvType === 'upload' && (
                      <div className="border-t border-indigo-100 bg-white p-5 animate-in slide-in-from-top-2 duration-200 cursor-default">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-semibold text-indigo-600">Vui lòng nhập đầy đủ thông tin chi tiết:</h4>
                          <span className="text-xs text-red-500">(*) Thông tin bắt buộc.</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                            <Input className={`h-10 text-slate-800 font-medium ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register('fullName')} />
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message as string}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                              <Input className={`h-10 text-slate-800 font-medium ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register('email')} />
                              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
                            </div>
                            <div>
                              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                              <Input className={`h-10 text-slate-800 font-medium ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`} {...register('phone')} />
                              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message as string}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">Địa điểm làm việc mong muốn <span className="text-red-500">*</span></h3>
                <div className="border border-slate-200 rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-colors">
                  <div className="flex gap-2">
                    <span className="bg-slate-100 text-slate-700 text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">Hồ Chí Minh <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" /></span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Thư giới thiệu:
                </h3>
                <p className="text-sm text-slate-500 mb-3 leading-relaxed">Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển dụng.</p>
                <Textarea 
                  className="h-32 text-sm border-slate-200 rounded-lg focus-visible:ring-indigo-500 resize-none p-3"
                  placeholder="Xin chào,&#10;&#10;Em là Thắng, một Fullstack Developer, em rất thích giải quyết vấn đề và xây dựng sản phẩm..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4 text-red-500" /> Lưu ý:</h4>
                <p className="text-sm text-slate-600 mb-1 leading-relaxed">1. JobFy khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu về thông tin công ty, vị trí việc làm trước khi ứng tuyển.</p>
              </div>

              <div className="space-y-3 pb-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600 accent-indigo-600 cursor-pointer" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Cho phép JobFy sử dụng <span className="underline font-medium text-slate-800 hover:text-indigo-600">công nghệ AI</span> để phân tích độ phù hợp CV của bạn</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600 accent-indigo-600 cursor-pointer" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Tôi đã đọc và đồng ý với <span className="underline font-medium text-slate-800 hover:text-indigo-600">"Thỏa thuận sử dụng dữ liệu cá nhân"</span> của Nhà tuyển dụng</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-10">
              <Button 
                onClick={handleApply} 
                disabled={isPending || isUploadingCv}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-[48px] text-[15px] rounded-lg shadow-md shadow-indigo-600/20"
              >
                {(isPending || isUploadingCv) ? 'Đang nộp hồ sơ...' : 'Nộp hồ sơ ứng tuyển'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
