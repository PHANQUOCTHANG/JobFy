import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerateFullCv } from '@/features/ai/hooks/useAi';
import { cvApi } from '@/features/cv/api/cv.api';
import { Sparkles, ArrowRight, Loader2, Bot, FileText, CheckCircle2 } from 'lucide-react';
import { AiLanguage } from '@/features/ai/types';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';

export const AiCvBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const generateFullCvMutation = useGenerateFullCv();
  
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<AiLanguage>('vi');
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [creationStep, setCreationStep] = useState<0 | 1 | 2>(0); 
  // 0: idle, 1: generating AI, 2: saving to DB
  
  const isAuthenticated = useAppSelector(state => !!state.auth.token);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Vui lòng nhập thông tin của bạn');
      return;
    }

    setCreationStep(1);
    generateFullCvMutation.mutate({ prompt, language }, {
      onSuccess: async (res) => {
        try {
          const cvDataFromAi = res.data?.data || res.data;
          setCreationStep(2);
          setIsCreatingResume(true);
          
          // Gắn mặc định template là cv-1
          cvDataFromAi.templateId = 'cv-1';
          
          if (isAuthenticated) {
            setCreationStep(2);
            setIsCreatingResume(true);
            try {
              const createRes = await cvApi.createResume(cvDataFromAi);
              const newCvId = createRes.data?.data?.id;
              
              if (newCvId) {
                toast.success('CV đã được tạo thành công!');
                navigate(`/cv/editor/cv-1?id=${newCvId}`);
              } else {
                throw new Error('Không nhận được ID từ server');
              }
            } catch (error) {
              console.error('Error saving CV:', error);
              toast.error('Đã xảy ra lỗi khi lưu CV vào hệ thống.');
              setCreationStep(0);
            } finally {
              setIsCreatingResume(false);
            }
          } else {
            toast.success('AI đã tạo CV thành công! Bạn có thể lưu lại sau.');
            navigate(`/cv/editor/cv-1`, { state: { aiGeneratedCv: cvDataFromAi } });
          }
        } catch (error) {
          console.error('Error processing AI response:', error);
          toast.error('Đã xảy ra lỗi khi xử lý dữ liệu.');
          setCreationStep(0);
        }
      },
      onError: () => {
        setCreationStep(0);
      }
    });
  };

  const isWorking = generateFullCvMutation.isPending || isCreatingResume;

  return (
    <div className="min-h-screen bg-[#f4f5f5] py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] px-8 py-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
              <Sparkles size={200} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6 backdrop-blur-sm">
                <Bot size={32} className="text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4">Tạo CV Nhanh Với AI</h1>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Chỉ cần nhập một đoạn giới thiệu bản thân, lịch sử công việc từ LinkedIn hoặc copy từ CV cũ, AI của chúng tôi sẽ tự động sắp xếp thành một bản CV hoàn chỉnh và chuyên nghiệp nhất.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <label className="block text-gray-700 font-bold text-lg">Nội dung của bạn</label>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${language === 'vi' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${language === 'en' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  English
                </button>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ví dụ: Mình là Tuấn, lập trình viên Frontend với 3 năm kinh nghiệm làm React, NextJS. Từng làm việc tại công ty XYZ với vai trò Lead Frontend, tối ưu hiệu năng website tăng 30%. Tiếng Anh giao tiếp tốt..."
              className="w-full h-64 p-5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 focus:border-[#4F46E5] resize-none text-gray-700 text-base leading-relaxed bg-gray-50 hover:bg-white transition-colors"
              disabled={isWorking}
            />

            {/* Steps feedback */}
            {creationStep > 0 && (
              <div className="mt-6 bg-[#EEF2FF] rounded-xl p-5 border border-[#4F46E5]/20 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {creationStep === 1 ? <Loader2 size={20} className="text-[#4F46E5] animate-spin" /> : <CheckCircle2 size={20} className="text-green-500" />}
                  <span className={`font-medium ${creationStep === 1 ? 'text-[#4F46E5]' : 'text-gray-700'}`}>1. AI đang phân tích dữ liệu và viết CV...</span>
                </div>
                <div className="flex items-center gap-3">
                  {creationStep === 2 ? <Loader2 size={20} className="text-[#4F46E5] animate-spin" /> : (creationStep > 2 ? <CheckCircle2 size={20} className="text-green-500" /> : <div className="w-5" />)}
                  <span className={`font-medium ${creationStep === 2 ? 'text-[#4F46E5]' : 'text-gray-400'}`}>2. Đang tạo CV và áp dụng mẫu...</span>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isWorking || !prompt.trim()}
                className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4F46E5]/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                {isWorking ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    Tạo CV Ngay
                    <ArrowRight size={20} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 border-t border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-400" /> Dữ liệu được cấu trúc tự động
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gray-400" /> Tối ưu ngôn từ chuyên nghiệp
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-gray-400" /> Dễ dàng chỉnh sửa sau đó
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCvBuilderPage;
