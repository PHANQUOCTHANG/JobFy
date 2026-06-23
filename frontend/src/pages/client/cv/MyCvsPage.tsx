import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { FileText, Plus, Trash2, Edit3, Download, Upload, Loader2, RefreshCw } from 'lucide-react';
import { cvApi } from '@/features/cv/api/cv.api';
import { toast } from 'sonner';

import { MiniCvPreview } from '@/features/cv/components/CvEditor/MiniCvPreview';

interface ResumeItem {
  id: string;
  title: string;
  templateId: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  personalData?: any;
}

export const MyCvsPage: React.FC = () => {
  const [cvs, setCvs] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const fetchCvs = async () => {
    setIsLoading(true);
    try {
      const response = await cvApi.getMyResumes();
      // Endpoint /resumes/my trả về { data: ResumeResponseDto[] }
      const data = response.data?.data;
      if (Array.isArray(data)) {
        setCvs(data);
      } else {
        setCvs([]);
      }
    } catch (err: any) {
      console.error('Could not fetch resumes:', err);
      // Nếu chưa có hồ sơ ứng viên (403) thì hiện danh sách rỗng
      if (err?.response?.status === 403) {
        setCvs([]);
      } else {
        toast.error('Không thể tải danh sách CV. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa CV này?')) return;

    try {
      await cvApi.deleteResume(id);
      setCvs(prev => prev.filter(cv => cv.id !== id));
      toast.success('Đã xóa CV thành công!');
    } catch (e: any) {
      console.error('Failed to delete CV:', e);
      toast.error(e?.response?.data?.message || 'Xóa CV thất bại. Vui lòng thử lại.');
    }
  };

  const processPdfUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && !url.split('?')[0].toLowerCase().endsWith('.pdf')) {
      // Đối với các file CV cũ không có đuôi .pdf, không thể mở inline được vì bị lỗi 404 nếu thêm đuôi .pdf
      // Cách duy nhất là thêm tham số fl_attachment để ép tải xuống với tên đúng định dạng
      if (url.includes('/upload/')) {
        return url.replace('/upload/', '/upload/fl_attachment:CV.pdf/');
      }
    }
    return url;
  };

  const getTemplateName = (templateId: string | null) => {
    if (!templateId) return 'CV tải lên';
    if (templateId === 'uploaded') return 'CV tải lên';
    return mockCvTemplates.find(t => t.id === templateId)?.name || 'Mẫu CV';
  };

  const getTemplateThumb = (templateId: string | null) => {
    if (!templateId || templateId === 'uploaded') {
      return 'https://placehold.co/400x560/f1f5f9/94a3b8?text=PDF';
    }
    return mockCvTemplates.find(t => t.id === templateId)?.thumbnail || '/images/cv/simple.png';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Chỉ hỗ trợ file định dạng PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File CV không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);
    toast.loading('Đang tải lên CV của bạn...', { id: 'upload-cv' });

    try {
      // Bước 1: Upload file lên Cloudinary
      const uploadRes = await cvApi.uploadCvPdf(file);
      const fileUrl = uploadRes.data?.data || uploadRes.data;

      if (!fileUrl || typeof fileUrl !== 'string') {
        throw new Error('Không nhận được URL file từ server');
      }

      // Bước 2: Tạo bản ghi CV với fileUrl
      const cvTitle = file.name.replace(/\.pdf$/i, '');
      await cvApi.createResume({
        title: cvTitle || 'CV tải lên',
        templateId: 'uploaded',
        fileUrl,
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          jobTitle: '',
          summary: '',
        },
        experiences: [],
        educations: [],
        skills: [],
        certificates: [],
      });

      toast.success('Tải lên CV thành công!', { id: 'upload-cv' });
      fetchCvs(); // Refresh list
    } catch (error: any) {
      console.error('Upload failed:', error);
      const msg = error?.response?.data?.message || error?.message || 'Tải lên thất bại. Vui lòng thử lại.';
      toast.error(msg, { id: 'upload-cv' });
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const isUploaded = (templateId: string | null) =>
    !templateId || templateId === 'uploaded';

  const createdCvs = cvs.filter(cv => !isUploaded(cv.templateId));
  const uploadedCvs = cvs.filter(cv => isUploaded(cv.templateId));

  const renderCvCard = (cv: ResumeItem) => (
    <div key={cv.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow hover:border-emerald-300">
      <div 
        className="p-4 border-b flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => {
          if (isUploaded(cv.templateId)) {
            if (cv.fileUrl) window.open(processPdfUrl(cv.fileUrl), '_blank');
          } else {
            navigate(`/cv/editor/${cv.templateId}?id=${cv.id}`);
          }
        }}
      >
        <div className="w-16 h-20 bg-gray-100 rounded border flex-shrink-0 overflow-hidden relative shadow-sm">
          {isUploaded(cv.templateId) ? (
            <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center text-red-500">
              <FileText size={24} />
              <span className="text-[10px] font-bold mt-1">PDF</span>
            </div>
          ) : (
            <MiniCvPreview 
              templateStyle={mockCvTemplates.find(t => t.id === cv.templateId)?.style || 'Hiện đại'} 
              color={cv.personalData?.settings?.color || mockCvTemplates.find(t => t.id === cv.templateId)?.color || '#4F46E5'}
              scale={0.0806} 
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#212f3f] line-clamp-1" title={cv.title || 'CV chưa đặt tên'}>
            {cv.title || 'CV chưa đặt tên'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Mẫu: {getTemplateName(cv.templateId)}</p>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Cập nhật lần cuối: {new Date(cv.updatedAt).toLocaleDateString('vi-VN', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="p-3 bg-slate-50 flex items-center justify-between mt-auto border-t border-slate-100">
        {/* Nút Sửa */}
        {!isUploaded(cv.templateId) ? (
          <button
            onClick={() => navigate(`/cv/editor/${cv.templateId}?id=${cv.id}`)}
            className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-[#4F46E5] transition-colors flex-1"
          >
            <Edit3 size={15} />
            <span className="text-[13px] font-medium">Sửa</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-slate-300 flex-1 cursor-not-allowed" title="CV tải lên không thể chỉnh sửa">
            <Edit3 size={15} />
            <span className="text-[13px] font-medium">Sửa</span>
          </div>
        )}

        <div className="w-px h-5 bg-slate-200" />

        {/* Nút Tải xuống */}
        {!isUploaded(cv.templateId) ? (
          <button
            onClick={() => navigate(`/cv/editor/${cv.templateId}?id=${cv.id}&download=true`)}
            className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-[#4F46E5] transition-colors flex-1"
            title="Tải xuống PDF"
          >
            <Download size={15} />
            <span className="text-[13px] font-medium">Tải xuống</span>
          </button>
        ) : cv.fileUrl ? (
          <a
            href={processPdfUrl(cv.fileUrl)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-[#4F46E5] transition-colors flex-1"
            title="Xem/Tải file PDF gốc"
          >
            <Download size={15} />
            <span className="text-[13px] font-medium">T Tải xuống</span>
          </a>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-slate-300 flex-1 cursor-not-allowed">
            <Download size={15} />
            <span className="text-[13px] font-medium">Tải xuống</span>
          </div>
        )}

        <div className="w-px h-5 bg-slate-200" />

        {/* Nút Xóa */}
        <button
          onClick={() => handleDelete(cv.id)}
          className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-red-500 transition-colors flex-1"
        >
          <Trash2 size={15} />
          <span className="text-[13px] font-medium">Xóa</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f4f5f5] min-h-[calc(100vh-64px)] py-10 font-sans">
      <div className="max-w-[1140px] mx-auto px-4">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[22px] font-bold text-[#212f3f] mb-1.5">Quản lý CV</h1>
            <p className="text-[14px] text-slate-500">Quản lý và chỉnh sửa các CV bạn đã tạo hoặc tải lên trên hệ thống.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchCvs}
              disabled={isLoading}
              className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors bg-white shadow-sm"
              title="Làm mới danh sách"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="bg-white p-16 text-center rounded-xl border border-slate-200 shadow-sm">
            <Loader2 className="mx-auto text-[#4F46E5] w-10 h-10 mb-4 animate-spin" />
            <p className="text-slate-500">Đang tải danh sách CV...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Created CVs Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[18px] font-bold text-slate-800">CV đã tạo trên JobFy</h2>
                <Link
                  to="/cv"
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2 rounded-full font-bold flex items-center gap-1.5 transition-colors text-[14px] shadow-sm shadow-[#4F46E5]/20"
                >
                  <Plus size={18} strokeWidth={2.5} /> Tạo CV
                </Link>
              </div>
              
              {createdCvs.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                     <FileText size={40} />
                  </div>
                  <p className="text-slate-400 font-medium text-[14px]">Chưa có CV nào được tạo.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdCvs.map(renderCvCard)}
                </div>
              )}
            </div>

            {/* Uploaded CVs Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[18px] font-bold text-slate-800">CV đã tải lên JobFy</h2>
                <label className={`cursor-pointer bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2 rounded-full font-bold flex items-center gap-1.5 transition-colors text-[14px] shadow-sm shadow-[#4F46E5]/20 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} strokeWidth={2.5} />}
                  Tải CV lên
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
              
              {uploadedCvs.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                     <Upload size={40} />
                  </div>
                  <p className="text-slate-400 font-medium text-[14px]">Chưa có CV nào được tải lên.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedCvs.map(renderCvCard)}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MyCvsPage;
