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

  return (
    <div className="bg-[#f4f5f5] min-h-screen py-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1140px] mx-auto px-4">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#212f3f] mb-2">CV đã tạo của tôi</h1>
            <p className="text-gray-500">Quản lý và chỉnh sửa các CV bạn đã tạo trên hệ thống.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchCvs}
              disabled={isLoading}
              className="p-2.5 border border-gray-200 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              title="Làm mới danh sách"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <label className={`cursor-pointer bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50 px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-colors ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              Tải CV lên
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>

            <Link
              to="/cv"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> Tạo CV mới
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="bg-white p-16 text-center rounded-lg border border-gray-200 shadow-sm">
            <Loader2 className="mx-auto text-[#4F46E5] w-10 h-10 mb-4 animate-spin" />
            <p className="text-gray-500">Đang tải danh sách CV...</p>
          </div>
        ) : cvs.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-lg border border-gray-200 shadow-sm">
            <FileText className="mx-auto text-gray-300 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-[#212f3f] mb-2">Bạn chưa có CV nào</h3>
            <p className="text-gray-500 mb-6">Hãy tạo ngay một CV ấn tượng để thu hút nhà tuyển dụng.</p>
            <Link
              to="/cv"
              className="inline-block bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Tạo CV đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map(cv => (
              <div key={cv.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
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
                  <div className="w-16 h-20 bg-gray-100 rounded border flex-shrink-0 overflow-hidden relative">
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
                    <p className="text-xs text-gray-500 mt-1">Mẫu: {getTemplateName(cv.templateId)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Cập nhật: {new Date(cv.updatedAt).toLocaleDateString('vi-VN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex items-center justify-between mt-auto">
                  {/* Nút Sửa */}
                  {!isUploaded(cv.templateId) ? (
                    <button
                      onClick={() => navigate(`/cv/editor/${cv.templateId}?id=${cv.id}`)}
                      className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#4F46E5] transition-colors flex-1"
                    >
                      <Edit3 size={18} />
                      <span className="text-xs font-medium">Sửa</span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-300 flex-1 cursor-not-allowed" title="CV tải lên không thể chỉnh sửa">
                      <Edit3 size={18} />
                      <span className="text-xs font-medium">Sửa</span>
                    </div>
                  )}

                  <div className="w-px h-8 bg-gray-200" />

                  {/* Nút Tải xuống */}
                  {!isUploaded(cv.templateId) ? (
                    <button
                      onClick={() => navigate(`/cv/editor/${cv.templateId}?id=${cv.id}&download=true`)}
                      className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#4F46E5] transition-colors flex-1"
                      title="Tải xuống PDF"
                    >
                      <Download size={18} />
                      <span className="text-xs font-medium">Tải xuống</span>
                    </button>
                  ) : cv.fileUrl ? (
                    <a
                      href={processPdfUrl(cv.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#4F46E5] transition-colors flex-1"
                      title="Xem/Tải file PDF gốc"
                    >
                      <Download size={18} />
                      <span className="text-xs font-medium">Tải xuống</span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-300 flex-1 cursor-not-allowed">
                      <Download size={18} />
                      <span className="text-xs font-medium">Tải xuống</span>
                    </div>
                  )}

                  <div className="w-px h-8 bg-gray-200" />

                  {/* Nút Xóa */}
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-500 transition-colors flex-1"
                  >
                    <Trash2 size={18} />
                    <span className="text-xs font-medium">Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCvsPage;
