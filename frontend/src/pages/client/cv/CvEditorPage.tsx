import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCvEditor } from '@/features/cv/hooks/useCvEditor';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { PersonalInfoForm } from '@/features/cv/components/CvEditor/PersonalInfoForm';
import { ExperienceForm } from '@/features/cv/components/CvEditor/ExperienceForm';
import { EducationForm } from '@/features/cv/components/CvEditor/EducationForm';
import { SkillsForm } from '@/features/cv/components/CvEditor/SkillsForm';
import { CvPreview } from '@/features/cv/components/CvEditor/CvPreview';
import { ChevronLeft, Download, Save, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const CvEditorPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const template = mockCvTemplates.find(t => t.id === templateId) || mockCvTemplates[0];
  
  const { 
    cvData, 
    isSaved, 
    updatePersonalInfo, 
    updateArrayField,
    updateTitle
  } = useCvEditor(undefined, template.id);

  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const data = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.title || 'My_CV'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại sau.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-[#f4f5f5] min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/cv')}
            className="text-gray-500 hover:text-[#4F46E5] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <input 
              type="text" 
              value={cvData.title}
              onChange={(e) => updateTitle(e.target.value)}
              className="font-bold text-lg text-[#212f3f] border-b border-transparent hover:border-gray-300 focus:border-[#4F46E5] focus:outline-none bg-transparent transition-colors"
            />
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              {isSaved ? (
                <><CheckCircle2 size={12} className="text-[#4F46E5]" /> Đã lưu tự động</>
              ) : (
                <><Save size={12} /> Đang lưu...</>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isExporting ? 'Đang tạo PDF...' : 'Tải xuống PDF'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-[45%] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`flex-shrink-0 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'personal' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Thông tin cá nhân
            </button>
            <button 
              onClick={() => setActiveTab('experience')}
              className={`flex-shrink-0 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'experience' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Kinh nghiệm
            </button>
            <button 
              onClick={() => setActiveTab('education')}
              className={`flex-shrink-0 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'education' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Học vấn
            </button>
            <button 
              onClick={() => setActiveTab('skills')}
              className={`flex-shrink-0 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'skills' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Kỹ năng
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 pb-20">
            {activeTab === 'personal' && (
              <PersonalInfoForm data={cvData.personalInfo} onChange={updatePersonalInfo} />
            )}
            {activeTab === 'experience' && (
              <ExperienceForm data={cvData.experiences} onChange={(data) => updateArrayField('experiences', data)} />
            )}
            {activeTab === 'education' && (
              <EducationForm data={cvData.educations} onChange={(data) => updateArrayField('educations', data)} />
            )}
            {activeTab === 'skills' && (
              <SkillsForm data={cvData.skills} onChange={(data) => updateArrayField('skills', data)} />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-[55%] bg-gray-600 h-[calc(100vh-64px)] overflow-y-auto flex justify-center py-10 relative">
          {/* Zoom controls could go here */}
          
          <div className="transform scale-[0.8] xl:scale-[0.9] origin-top shadow-2xl">
            <CvPreview 
              ref={printRef} 
              data={cvData} 
              color={template.color}
              templateStyle={template.style} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvEditorPage;
