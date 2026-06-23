import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCvEditor } from '@/features/cv/hooks/useCvEditor';
import { useAppSelector } from '@/store/hooks';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { CvPreview } from '@/features/cv/components/CvEditor/CvPreview';
import { InlineCvEditor } from '@/features/cv/components/CvEditor/InlineCvEditor';
import { DesignPanel } from '@/features/cv/components/CvEditor/DesignPanel';
import { useGenerateSummary, useSuggestSkills, useReviewCv } from '@/features/ai/hooks/useAi';
import { AiLanguageToggle } from '@/features/ai/components/AiLanguageToggle';
import { CvReviewPanel } from '@/features/ai/components/CvReviewPanel';
import { AiLanguage, CvReviewResult } from '@/features/ai/types';
import { cvApi } from '@/features/cv/api/cv.api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Eye, Download, Save, CheckCircle2,
  Palette, Plus, Layout, RefreshCw, Lightbulb, BookOpen, X
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export const CvEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const cvId = searchParams.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(state => !!state.auth.token);
  const template = mockCvTemplates.find(t => t.id === templateId) || mockCvTemplates[0];

  const {
    cvData,
    isSaved,
    isInitializing,
    updatePersonalInfo,
    updateArrayField,
    updateTitle,
    setCvData,
    markAsSaved
  } = useCvEditor(cvId || undefined, template.id);

  const [showDesignPanel, setShowDesignPanel] = useState(true);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [previewZoom, setPreviewZoom] = useState(75);
  const [aiLanguage, setAiLanguage] = useState<AiLanguage>('vi');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [reviewResult, setReviewResult] = useState<CvReviewResult | null>(null);
  
  const generateSummaryMutation = useGenerateSummary();
  const suggestSkillsMutation = useSuggestSkills();
  const reviewCvMutation = useReviewCv();

  const handleGenerateSummary = () => {
    generateSummaryMutation.mutate({
      jobTitle: cvData.personalInfo.jobTitle,
      experiences: cvData.experiences,
      skills: cvData.skills,
      educations: cvData.educations,
      language: aiLanguage
    }, {
      onSuccess: (res) => {
        const summary = res.data?.data?.summary;
        if (summary) {
          updatePersonalInfo({ summary });
        }
      }
    });
  };

  const handleSuggestSkills = () => {
    suggestSkillsMutation.mutate({
      jobTitle: cvData.personalInfo.jobTitle || 'Nhân viên',
      existingSkills: cvData.skills.map(s => s.name),
      language: aiLanguage
    }, {
      onSuccess: (res) => {
        const skills = res.data?.data || res.data || [];
        setSuggestedSkills(skills as string[]);
      }
    });
  };

  const handleAddSuggestedSkill = (skillName: string) => {
    // Add new skill
    updateArrayField('skills', [
      ...cvData.skills,
      { id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name: skillName, description: '', level: 4 }
    ]);
    // Remove from suggestions
    setSuggestedSkills(prev => prev.filter(s => s !== skillName));
  };

  const handleReviewCv = () => {
    reviewCvMutation.mutate({
      cvData,
      language: aiLanguage
    }, {
      onSuccess: (res) => {
        const result = res.data?.data || res.data;
        if (result) {
          setReviewResult(result as CvReviewResult);
        }
      }
    });
  };

  const [cvSettings, setCvSettings] = useState({
    color: template.color || '#000000',
    font: 'Roboto',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    lineHeight: 1.5,
    background: 'white',
  });

  useEffect(() => {
    if (cvData.personalInfo?.settings) {
      setCvSettings(prev => ({ ...prev, ...cvData.personalInfo.settings }));
    }
  }, [cvData.personalInfo?.settings]);

  // Nhận dữ liệu CV được AI tạo nếu không có ID (Guest user)
  useEffect(() => {
    const aiGeneratedCv = (location.state as any)?.aiGeneratedCv;
    if (aiGeneratedCv && isInitializing && !cvId) {
      setCvData(prev => ({
        ...prev,
        ...aiGeneratedCv,
        id: `cv_${Date.now()}`,
        templateId: template.id
      }));
      // Xóa state để không lặp lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isInitializing, cvId, template.id, setCvData]);

  const printRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Xuất PDF ──
  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false });
      const data = canvas.toDataURL('image/jpeg', 0.85); // Chuyển từ PNG sang JPEG để giảm 90% dung lượng
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(data, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${cvData.title || 'My_CV'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      toast.error('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại sau.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Auto download if query param download=true ──
  useEffect(() => {
    if (!isInitializing && searchParams.get('download') === 'true') {
      const timer = setTimeout(() => {
        handleExportPDF();
        searchParams.delete('download');
        setSearchParams(searchParams, { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitializing, searchParams, setSearchParams]);

  // ── Cảnh báo beforeunload khi có dữ liệu chưa lưu ──
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isSaved]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full" />
      </div>
    );
  }

  // ── Lưu CV (gọi API thật) ──
  const handleSaveCv = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu CV.', { id: 'save-cv' });
      // Lưu tạm vào localStorage fallback để không mất dữ liệu
      try {
        const STORAGE_KEY = 'jobfy_my_cvs_fallback';
        const stored = localStorage.getItem(STORAGE_KEY);
        let cvs = stored ? JSON.parse(stored) : [];
        cvs = cvs.filter((c: any) => c.id !== cvData.id);
        cvs.push(cvData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
      } catch(e) {}
      
      // Chuyển hướng đến trang đăng nhập
      navigate('/login?redirect=/cv/editor/' + template.id);
      return;
    }

    setIsSaving(true);
    try {
      toast.loading('Đang lưu CV...', { id: 'save-cv' });

      const dataToSave = {
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          settings: cvSettings
        }
      };

      const isUuid = dataToSave.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dataToSave.id);

      if (isUuid) {
        // Cập nhật CV đã tồn tại
        await cvApi.updateResume(dataToSave.id!, dataToSave);
        markAsSaved(dataToSave);
        toast.success('Lưu CV thành công!', { id: 'save-cv' });
      } else {
        // Tạo CV mới
        const res = await cvApi.createResume(dataToSave);
        const responseData = res.data?.data || res.data;
        const newId = responseData?.id;

        if (newId) {
          const updatedCvData = { ...cvData, id: newId };
          setCvData(updatedCvData);
          markAsSaved(updatedCvData);
          // Cập nhật URL không reload trang
          window.history.replaceState(null, '', `/cv/editor/${cvData.templateId}?id=${newId}`);
        } else {
          markAsSaved(cvData);
        }
        toast.success('Tạo CV thành công!', { id: 'save-cv' });
      }
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Lưu CV thất bại, vui lòng thử lại.';
      toast.error(msg, { id: 'save-cv' });
    } finally {
      setIsSaving(false);
    }
  };


  const sidebarItems = [
    { icon: Palette, label: 'Thiết kế\n& Font', onClick: () => { setShowDesignPanel(true); setShowReviewPanel(false); }, isActive: showDesignPanel },
    { icon: Plus, label: 'Thêm\nmục', onClick: () => { }, isActive: false },
    { icon: Layout, label: 'Bố cục', onClick: () => { }, isActive: false },
    { icon: RefreshCw, label: 'Đổi mẫu\nCV', onClick: () => navigate('/cv'), isActive: false },
    { icon: Lightbulb, label: 'Gợi ý\nviết CV', onClick: () => { setShowReviewPanel(true); setShowDesignPanel(false); }, isActive: showReviewPanel },
    { icon: BookOpen, label: 'Thư viện\nCV', onClick: () => navigate('/cv/cover-letter'), isActive: false },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif", background: '#f0f0f0' }}>

      <div className="bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0" style={{ height: 48 }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={cvData.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="font-semibold text-sm text-gray-800 border border-[#4F46E5] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] bg-white"
            style={{ minWidth: 180 }}
          />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {isSaved
              ? <><CheckCircle2 size={11} className="text-green-500" /> Đã lưu</>
              : <><Save size={11} className="animate-pulse" /> Đang lưu...</>
            }
          </div>
          
          <div className="ml-4 flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Ngôn ngữ AI:</span>
            <AiLanguageToggle language={aiLanguage} onChange={setAiLanguage} />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded" title="Undo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 7v6h6"/><path d="M3 13c0-4.97 4.03-9 9-9a9 9 0 0 1 9 9"/></svg>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded" title="Redo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 7v6h-6"/><path d="M21 13c0-4.97-4.03-9-9-9a9 9 0 0 0-9 9"/></svg>
          </button>
          <div className="h-5 w-px bg-gray-200 mx-1" />

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
          >
            <Eye size={13} /> Xem trước
          </button>

          <button
            onClick={handleSaveCv}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[#00B14F] hover:bg-[#009643] text-white text-xs font-bold px-4 py-1.5 rounded transition-colors disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={13} /> Lưu CV
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>

        <div className="bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20" style={{ width: 72 }}>
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className={`w-full flex flex-col items-center justify-center pt-4 pb-3 gap-1 transition-all border-l-2 ${item.isActive
                  ? 'border-[#00B14F] text-[#00B14F] bg-green-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <item.icon size={18} strokeWidth={item.isActive ? 2.5 : 2} />
              <span className="text-[9px] font-semibold text-center leading-tight whitespace-pre-line px-1">{item.label}</span>
            </button>
          ))}
        </div>

        {showDesignPanel && (
          <div className="bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10 overflow-hidden" style={{ width: 240 }}>
            <DesignPanel
              currentColor={cvSettings.color}
              onChangeColor={(c) => setCvSettings(prev => ({ ...prev, color: c }))}
              currentFont={cvSettings.font}
              onChangeFont={(f) => setCvSettings(prev => ({ ...prev, font: f }))}
              fontSize={cvSettings.fontSize}
              onChangeFontSize={(s) => setCvSettings(prev => ({ ...prev, fontSize: s }))}
              lineHeight={cvSettings.lineHeight}
              onChangeLineHeight={(h) => setCvSettings(prev => ({ ...prev, lineHeight: h }))}
              background={cvSettings.background}
              onChangeBackground={(b) => setCvSettings(prev => ({ ...prev, background: b }))}
              onClose={() => setShowDesignPanel(false)}
            />
          </div>
        )}

        {showReviewPanel && (
          <div className="bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10 overflow-hidden" style={{ width: 320 }}>
            <CvReviewPanel 
              result={reviewResult}
              isLoading={reviewCvMutation.isPending}
              onReview={handleReviewCv}
              onClose={() => setShowReviewPanel(false)}
            />
          </div>
        )}

        <div className="flex-1 overflow-auto" style={{ background: '#e4e4e4' }}>
          <div className="sticky top-4 float-right mr-4 flex items-center gap-1 bg-white rounded-full shadow-md px-3 py-1.5 z-30" style={{ width: 'fit-content' }}>
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="text-gray-500 hover:text-gray-800 font-bold w-5 h-5 flex items-center justify-center">−</button>
            <span className="text-xs font-semibold text-gray-700 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="text-gray-500 hover:text-gray-800 font-bold w-5 h-5 flex items-center justify-center">+</button>
          </div>

          <div className="p-8 flex justify-center min-h-full">
            <div
              className="bg-white shadow-xl origin-top transition-transform duration-200"
              style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${zoom / 100})`,
                marginBottom: `${(zoom / 100 - 1) * 1123}px`
              }}
            >
              <InlineCvEditor
                data={cvData}
                color={cvSettings.color}
                font={cvSettings.font}
                fontSize={cvSettings.fontSize}
                lineHeight={cvSettings.lineHeight}
                background={cvSettings.background}
                templateStyle={template.style}
                onUpdatePersonalInfo={updatePersonalInfo}
                onUpdateArrayField={updateArrayField}
                onGenerateSummary={handleGenerateSummary}
                isGeneratingSummary={generateSummaryMutation.isPending}
                onSuggestSkills={handleSuggestSkills}
                isSuggestingSkills={suggestSkillsMutation.isPending}
                suggestedSkills={suggestedSkills}
                onAddSuggestedSkill={handleAddSuggestedSkill}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-[-9999px] left-[-9999px]">
        <div ref={printRef} style={{ width: 794, minHeight: 1123, background: 'white' }}>
          <CvPreview
            data={cvData}
            color={cvSettings.color}
            font={cvSettings.font}
            fontSize={cvSettings.fontSize}
            lineHeight={cvSettings.lineHeight}
            background={cvSettings.background}
            templateStyle={template.style}
          />
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[920px] w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white z-10 flex-shrink-0">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Xem trước CV</h3>
              <p className="text-xs text-gray-400 mt-0.5">Kiểm tra bố cục trước khi lưu hoặc tải xuống</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
                <button
                  onClick={() => setPreviewZoom(z => Math.max(40, z - 10))}
                  className="text-gray-600 hover:text-gray-900 font-bold w-5 h-5 flex items-center justify-center"
                >−</button>
                <span className="text-xs font-semibold text-gray-700 w-10 text-center">{previewZoom}%</span>
                <button
                  onClick={() => setPreviewZoom(z => Math.min(130, z + 10))}
                  className="text-gray-600 hover:text-gray-900 font-bold w-5 h-5 flex items-center justify-center"
                >+</button>
              </div>
              <button
                onClick={() => setPreviewZoom(75)}
                className="text-xs text-gray-500 hover:text-[#4F46E5] px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              >Khớp màn hình</button>
              <div className="w-px h-6 bg-gray-200" />
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
              >
                <Download size={13} />
                {isExporting ? 'Đang xuất...' : 'Tải PDF'}
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* CV Preview Area */}
          <div className="flex-1 overflow-auto bg-[#e8e8e8] flex justify-center items-start pt-8 pb-8">
            <div
              className="bg-white shadow-2xl origin-top transition-transform duration-150"
              style={{
                width: 794,
                minHeight: 1123,
                transform: `scale(${previewZoom / 100})`,
                transformOrigin: 'top center',
                marginBottom: previewZoom < 100 ? `${(previewZoom / 100 - 1) * 1123}px` : 0,
              }}
            >
              <div className="pointer-events-none select-none">
                <CvPreview
                  ref={previewRef}
                  data={cvData}
                  color={cvSettings.color}
                  font={cvSettings.font}
                  fontSize={cvSettings.fontSize}
                  lineHeight={cvSettings.lineHeight}
                  background={cvSettings.background}
                  templateStyle={template.style}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CvEditorPage;
