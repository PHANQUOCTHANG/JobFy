import React, { useState } from 'react';
import { useGenerateCoverLetter } from '@/features/ai/hooks/useAi';
import { useCreateCoverLetter } from '@/features/cover-letter/hooks/useCoverLetter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Save, FileText, Loader2, Copy, CheckCircle2, Edit3 } from 'lucide-react';

const TEMPLATE_VI = `Kính gửi Nhà Tuyển Dụng,

Tôi viết thư này để bày tỏ sự quan tâm của mình đối với vị trí [Tên vị trí] tại [Tên công ty]. Với nền tảng kiến thức và kinh nghiệm trong lĩnh vực [Lĩnh vực], tôi tin rằng mình có thể mang lại những đóng góp tích cực cho công ty.

Trong thời gian làm việc tại [Công ty cũ/Trường học], tôi đã tích lũy được các kỹ năng như [Kỹ năng 1], [Kỹ năng 2]. Đặc biệt, tôi đã từng hoàn thành xuất sắc dự án [Tên dự án/Thành tích], giúp [Kết quả đạt được].

Tôi rất ấn tượng với môi trường làm việc tại [Tên công ty] và mong muốn được trở thành một phần của đội ngũ.

Cảm ơn anh/chị đã dành thời gian xem xét hồ sơ của tôi. Tôi rất mong có cơ hội tham gia phỏng vấn để trao đổi chi tiết hơn về sự phù hợp của tôi đối với vị trí này.

Trân trọng,
[Tên của bạn]
[Số điện thoại]
[Email]`;

const TEMPLATE_EN = `Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in [Your Field/Degree] and my passion for [Industry/Field], I am confident in my ability to make a meaningful contribution to your team.

During my time at [Previous Company/University], I developed key skills in [Skill 1] and [Skill 2]. One of my most notable achievements was [Key Achievement/Project], which demonstrated my ability to deliver results under pressure.

I have been following [Company Name]'s recent projects and I am highly impressed by your commitment to innovation. I would be thrilled to bring my dedication and expertise to your esteemed organization.

Thank you for considering my application. I have attached my resume for your review and I look forward to the opportunity to discuss how my skills align with your needs in an interview.

Sincerely,
[Your Name]
[Your Phone Number]
[Your Email]`;
import { AiLanguageToggle } from '@/features/ai/components/AiLanguageToggle';
import { AiLanguage } from '@/features/ai/types';
import { toast } from 'sonner';

export const CoverLetterPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cvContent, setCvContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState<AiLanguage>('vi');
  
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generateMutation = useGenerateCoverLetter();
  const saveMutation = useCreateCoverLetter();

  const handleGenerate = () => {
    if (!jobDescription || !cvContent) {
      toast.error('Vui lòng nhập mô tả công việc và nội dung CV/Kinh nghiệm của bạn.');
      return;
    }

    generateMutation.mutate({
      jobData: jobDescription,
      cvData: cvContent,
      companyName,
      jobTitle,
      tone,
      language
    }, {
      onSuccess: (res) => {
        const content = res.data?.data?.content;
        if (content) {
          setGeneratedLetter(content);
        }
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    toast.success('Đã copy vào clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedLetter) return;
    
    saveMutation.mutate({
      title: `Cover Letter - ${companyName || 'Công ty'} - ${jobTitle || 'Vị trí'}`,
      content: generatedLetter,
      isAiGenerated: true,
    });
  };

  return (
    <div className="bg-[#f4f5f5] min-h-[calc(100vh-64px)] py-8 font-sans">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-bold text-[#212f3f] flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              AI Cover Letter Generator
            </h1>
            <p className="text-slate-500 mt-1">Tự động viết thư xin việc chinh phục nhà tuyển dụng trong 5 giây.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Ngôn ngữ viết:</span>
            <AiLanguageToggle language={language} onChange={setLanguage} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Input */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">1</div>
              <h2 className="text-[16px] font-bold text-[#212f3f]">Thông tin Công việc</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-black">Vị trí ứng tuyển (Tùy chọn)</Label>
                <Input placeholder="VD: Frontend Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="text-black" />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Tên công ty (Tùy chọn)</Label>
                <Input placeholder="VD: JobFy Company" value={companyName} onChange={e => setCompanyName(e.target.value)} className="text-black" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex justify-between items-center text-black">
                <span>Mô tả công việc (JD) <span className="text-red-500">*</span></span>
              </Label>
              <Textarea 
                placeholder="Dán toàn bộ mô tả công việc (Job Description) vào đây để AI phân tích..."
                className="min-h-[150px] resize-none text-black"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 pt-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">2</div>
              <h2 className="text-[16px] font-bold text-[#212f3f]">Thông tin của bạn</h2>
            </div>

            <div className="space-y-2">
              <Label className="text-black">Kinh nghiệm & Kỹ năng cốt lõi <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Tóm tắt ngắn gọn các kinh nghiệm, thành tựu, kỹ năng của bạn (Hoặc paste toàn bộ CV text vào đây)..."
                className="min-h-[150px] resize-none text-black"
                value={cvContent}
                onChange={e => setCvContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black">Giọng điệu (Tone)</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-white text-black border-slate-200">
                  <SelectValue placeholder="Chọn giọng điệu..." />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border-slate-200">
                  <SelectItem value="professional" className="focus:bg-blue-100 focus:text-blue-700 data-[state=checked]:text-blue-700 data-[state=checked]:bg-blue-50">Chuyên nghiệp, Lịch sự</SelectItem>
                  <SelectItem value="enthusiastic" className="focus:bg-blue-100 focus:text-blue-700 data-[state=checked]:text-blue-700 data-[state=checked]:bg-blue-50">Nhiệt huyết, Năng động</SelectItem>
                  <SelectItem value="confident" className="focus:bg-blue-100 focus:text-blue-700 data-[state=checked]:text-blue-700 data-[state=checked]:bg-blue-50">Tự tin, Khẳng định năng lực</SelectItem>
                  <SelectItem value="creative" className="focus:bg-blue-100 focus:text-blue-700 data-[state=checked]:text-blue-700 data-[state=checked]:bg-blue-50">Sáng tạo, Phá cách</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-12 text-[15px] font-bold rounded-lg shadow-md"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang dùng phép thuật AI...</>
              ) : (
                <><Sparkles className="mr-2 h-5 w-5" /> Viết Cover Letter ngay</>
              )}
            </Button>
          </div>

          {/* Result Output */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden h-[calc(100vh-180px)] lg:h-auto min-h-[600px]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-[16px] font-bold text-[#212f3f] flex items-center gap-2">
                <FileText className="text-emerald-500" size={20} />
                Kết quả Cover Letter
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!generatedLetter} className="text-black hover:text-black border-slate-300">
                  {isCopied ? <CheckCircle2 size={16} className="mr-1.5 text-green-600" /> : <Copy size={16} className="mr-1.5" />}
                  Copy
                </Button>
                <Button size="sm" className="bg-[#00b14f] hover:bg-[#009e46] text-black" onClick={handleSave} disabled={!generatedLetter || saveMutation.isPending}>
                  {saveMutation.isPending ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <Save size={16} className="mr-1.5" />}
                  Lưu
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-auto bg-white">
              {!generatedLetter ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <Sparkles size={40} className="text-slate-300" />
                  </div>
                  <p>Bản nháp Cover Letter của bạn sẽ xuất hiện ở đây.</p>
                  
                  <div className="flex items-center gap-4 mt-4 w-full max-w-sm justify-center">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-xs text-slate-400 font-medium">Hoặc viết thủ công từ mẫu</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700" onClick={() => setGeneratedLetter(TEMPLATE_VI)}>
                      <Edit3 size={14} className="mr-1.5" /> Mẫu Tiếng Việt
                    </Button>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" onClick={() => setGeneratedLetter(TEMPLATE_EN)}>
                      <Edit3 size={14} className="mr-1.5" /> Mẫu Tiếng Anh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none prose-p:text-black prose-p:leading-relaxed text-black">
                  <div className="whitespace-pre-wrap outline-none text-black" contentEditable suppressContentEditableWarning>
                    {generatedLetter}
                  </div>
                  <p className="text-xs text-gray-400 mt-8 italic border-t pt-4">
                    * Bạn có thể click vào để chỉnh sửa trực tiếp đoạn văn bản trên.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
