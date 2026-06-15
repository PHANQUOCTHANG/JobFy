import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CvData } from '@/features/cv/types';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { FileText, Plus, Trash2, Edit3, Download, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'jobfy_my_cvs';

export const MyCvsPage: React.FC = () => {
  const [cvs, setCvs] = useState<CvData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCvs(JSON.parse(stored).sort((a: CvData, b: CvData) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      }
    } catch (e) {
      console.error('Failed to load CVs from storage', e);
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa CV này?')) {
      const updated = cvs.filter(cv => cv.id !== id);
      setCvs(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const getTemplateName = (templateId: string) => {
    return mockCvTemplates.find(t => t.id === templateId)?.name || 'Mẫu CV';
  };

  const getTemplateThumb = (templateId: string) => {
    return mockCvTemplates.find(t => t.id === templateId)?.thumbnail || '/images/cv/simple.png';
  };

  return (
    <div className="bg-[#f4f5f5] min-h-screen py-10" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1140px] mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#212f3f] mb-2">CV đã tạo của tôi</h1>
            <p className="text-gray-500">Quản lý và chỉnh sửa các CV bạn đã tạo trên hệ thống.</p>
          </div>
          
          <Link 
            to="/cv"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-2.5 rounded-md font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Tạo CV mới
          </Link>
        </div>

        {cvs.length === 0 ? (
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
              <div key={cv.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b flex items-start gap-4">
                  <div className="w-16 h-20 bg-gray-100 rounded border flex-shrink-0 overflow-hidden">
                    <img src={getTemplateThumb(cv.templateId)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#212f3f] line-clamp-1" title={cv.title || 'CV chưa đặt tên'}>
                      {cv.title || 'CV chưa đặt tên'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Mẫu: {getTemplateName(cv.templateId)}</p>
                    <p className="text-xs text-gray-400 mt-1">Cập nhật: {new Date(cv.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 flex items-center justify-between mt-auto">
                  <button
                    onClick={() => navigate(`/cv/editor/${cv.templateId}?id=${cv.id}`)}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#4F46E5] transition-colors flex-1"
                  >
                    <Edit3 size={18} />
                    <span className="text-xs font-medium">Sửa</span>
                  </button>
                  
                  <div className="w-px h-8 bg-gray-200"></div>
                  
                  <button
                    onClick={() => navigate(`/cv/editor/${cv.templateId}?id=${cv.id}`)} // Redirect to editor to export
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#4F46E5] transition-colors flex-1"
                    title="Mở editor để tải xuống"
                  >
                    <Download size={18} />
                    <span className="text-xs font-medium">Tải xuống</span>
                  </button>

                  <div className="w-px h-8 bg-gray-200"></div>
                  
                  <button
                    onClick={() => handleDelete(cv.id!)}
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
