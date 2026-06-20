import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useCvEditor } from '@/features/cv/hooks/useCvEditor';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { CvPreview } from '@/features/cv/components/CvEditor/CvPreview';
import { InlineCvEditor } from '@/features/cv/components/CvEditor/InlineCvEditor';
import { DesignPanel } from '@/features/cv/components/CvEditor/DesignPanel';
import { cvApi } from '@/features/cv/api/cv.api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Eye, Download, Save, CheckCircle2,
  Palette, Plus, Layout, RefreshCw, Lightbulb, BookOpen, X, Search
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const CvEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const cvId = searchParams.get('id');
  const navigate = useNavigate();
  const template = mockCvTemplates.find(t => t.id === templateId) || mockCvTemplates[0];

  const {
    cvData,
    isSaved,
    isInitializing,
    updatePersonalInfo,
    updateArrayField,
    updateTitle,
    setCvData
  } = useCvEditor(cvId || undefined, template.id);

  const [showDesignPanel, setShowDesignPanel] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [previewZoom, setPreviewZoom] = useState(100);

  const [cvSettings, setCvSettings] = useState({
    color: template.color || '#000000',
    font: 'Roboto',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    lineHeight: 1.5,
    background: 'white',
  });

  const printRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
    setIsSaving(true);
    try {
      let fileUrl = cvData.fileUrl;
      
      // Tạo PDF và upload lên Cloudinary trước khi lưu db
      if (printRef.current) {
        toast.loading('Đang tạo bản xem trước (PDF)...', { id: 'save-cv' });
        
        // Cần đảm bảo component đang hiển thị đúng, ta sẽ clone hoặc chụp trực tiếp. 
        // html2canvas đôi khi cần chút thời gian nếu font chưa load xong.
        const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false });
        const dataUrl = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], `${cvData.title || 'My_CV'}.pdf`, { type: 'application/pdf' });
        
        toast.loading('Đang tải lên cloud...', { id: 'save-cv' });
        const uploadRes = await cvApi.uploadCvPdf(file);
        fileUrl = uploadRes.data?.data || uploadRes.data;
      }

      toast.loading('Đang lưu vào cơ sở dữ liệu...', { id: 'save-cv' });
      const payloadToSave = { ...cvData, fileUrl };

      const isUuid = cvData.id && cvData.id.includes('-') && cvData.id.length === 36;
      if (isUuid) {
        await cvApi.updateResume(cvData.id!, payloadToSave);
      } else {
        const res = await cvApi.createResume(payloadToSave);
        const responseData = res.data?.data || res.data;
        const newId = responseData?.id;
        if (newId) {
          setCvData(prev => ({ ...prev, id: newId, fileUrl }));
          window.history.replaceState(null, '', `/cv/editor/${cvData.templateId}?id=${newId}`);
        }
      }
      toast.success('Lưu CV thành công!', { id: 'save-cv' });
    } catch (error) {
      console.error(error);
      toast.error('Lưu CV thất bại, vui lòng thử lại.', { id: 'save-cv' });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Xuất PDF ──
  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false });
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.title || 'My_CV'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      toast.error('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại sau.');
    } finally {
      setIsExporting(false);
    }
  };

  const sidebarItems = [
    { icon: Palette, label: 'Thiết kế\n& Font', onClick: () => setShowDesignPanel(p => !p), isActive: showDesignPanel },
    { icon: Plus, label: 'Thêm\nmục', onClick: () => { }, isActive: false },
    { icon: Layout, label: 'Bố cục', onClick: () => { }, isActive: false },
    { icon: RefreshCw, label: 'Đổi mẫu\nCV', onClick: () => navigate('/cv'), isActive: false },
    { icon: Lightbulb, label: 'Gợi ý\nviết CV', onClick: () => { }, isActive: false },
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

        <div className="flex-1 overflow-auto" style={{ background: '#e4e4e4' }}>
          <div className="sticky top-4 float-right mr-4 flex items-center gap-1 bg-white rounded-full shadow-md px-3 py-1.5 z-30" style={{ width: 'fit-content' }}>
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="text-gray-500 hover:text-gray-800 font-bold w-5 h-5 flex items-center justify-center">−</button>
            <span className="text-xs font-semibold text-gray-700 w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="text-gray-500 hover:text-gray-800 font-bold w-5 h-5 flex items-center justify-center">+</button>
          </div>

          <div className="flex justify-center pt-6 pb-10 px-4 clear-both">
            <div style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
              marginBottom: zoom < 100 ? `calc((${zoom / 100} - 1) * 297mm)` : 0,
            }}>
              <InlineCvEditor
                ref={printRef}
                data={cvData}
                color={cvSettings.color}
                font={cvSettings.font}
                fontSize={cvSettings.fontSize}
                lineHeight={cvSettings.lineHeight}
                background={cvSettings.background}
                templateStyle={template.style}
                onUpdatePersonalInfo={updatePersonalInfo}
                onUpdateArrayField={updateArrayField}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[900px] w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 shadow-2xl rounded-xl bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white flex-shrink-0">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Eye size={18} className="text-[#4F46E5]" />
              Xem trước CV
            </h2>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-100" style={{ maxHeight: 'calc(95vh - 120px)' }}>
            <div className="flex justify-center py-8 px-4">
              <div style={{
                transform: `scale(${previewZoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
              }}>
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

          <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-gray-400" />
              <div className="flex items-center gap-1 bg-white rounded-full border border-gray-200 px-2 py-0.5">
                <button onClick={() => setPreviewZoom(z => Math.max(50, z - 10))} className="text-gray-500 hover:text-gray-800 font-bold w-5 h-5 flex items-center justify-center text-sm">−</button>
                <span className="text-xs font-semibold text-gray-700 w-12 text-center">{previewZoom}%</span>
                <button onClick={() => setPreviewZoom(z => Math.min(150, z + 10))} className="text-gray-500 hover:text-gray-800 font-bold w-5 h-5 flex items-center justify-center text-sm">+</button>
              </div>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
            >
              <Download size={13} />
              {isExporting ? 'Đang xuất...' : 'Tải PDF'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CvEditorPage;
