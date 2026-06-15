import React, { useState, useMemo } from 'react';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { Filter, LayoutTemplate, Palette, Globe, Check, Briefcase, Columns, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CvTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'style' | 'industry'>('style');
  const [activeLang, setActiveLang] = useState('Tất cả');
  const [activeStyle, setActiveStyle] = useState('Tất cả');
  const [activeIndustry, setActiveIndustry] = useState('Tất cả');
  const [activeColumns, setActiveColumns] = useState('Tất cả');

  const languages = ['Tất cả', 'Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật'];
  const styles = ['Tất cả', 'Đơn giản', 'Hiện đại', 'Sáng tạo', 'Harvard'];
  const industries = ['Tất cả', 'Lập trình viên', 'Nhân viên kinh doanh', 'Nhân viên kế toán', 'Chuyên viên marketing', 'Thiết kế / Mỹ thuật', 'Biên phiên dịch', 'Giáo dục / Đào tạo'];
  const columns = ['Tất cả', '1 cột', '2 cột'];

  const filteredCvs = useMemo(() => {
    return mockCvTemplates.filter(cv => {
      if (activeLang !== 'Tất cả' && cv.language !== activeLang) return false;
      if (activeTab === 'style' && activeStyle !== 'Tất cả' && cv.style !== activeStyle) return false;
      if (activeTab === 'industry' && activeIndustry !== 'Tất cả' && cv.industry !== activeIndustry) return false;
      
      if (activeColumns !== 'Tất cả') {
        if (activeColumns === '1 cột' && cv.columns !== 1) return false;
        if (activeColumns === '2 cột' && cv.columns !== 2) return false;
      }
      return true;
    });
  }, [activeTab, activeLang, activeStyle, activeIndustry, activeColumns]);

  return (
    <div className="bg-[#f4f5f5] min-h-screen pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] py-12 px-4 text-center">
        <h1 className="text-3xl md:text-[32px] font-bold text-white mb-4">
          Tạo CV Xin Việc Online Chuyên Nghiệp
        </h1>
        <p className="text-white/90 text-base mb-8 max-w-2xl mx-auto">
          Danh sách mẫu CV xin việc chuẩn, thiết kế chuẩn phom, dễ dàng chỉnh sửa. 
          Giúp bạn ghi điểm tuyệt đối trong mắt nhà tuyển dụng.
        </p>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 mt-8">
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('style')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'style' 
                  ? 'bg-[#4F46E5] text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#4F46E5]'
              }`}
            >
              Mẫu CV theo style
            </button>
            <button
              onClick={() => setActiveTab('industry')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'industry' 
                  ? 'bg-[#4F46E5] text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#4F46E5]'
              }`}
            >
              Mẫu CV theo ngành nghề
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-[#212f3f] text-lg mb-4 flex items-center gap-2 border-b pb-3">
                <Filter size={18} /> Bộ lọc Mẫu CV
              </h2>
              
              {/* Filter by Language */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Globe size={16} /> Ngôn ngữ
                </h3>
                <div className="flex flex-col gap-2">
                  {languages.map(lang => (
                    <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        activeLang === lang ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                      }`}>
                        {activeLang === lang && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-[14px] ${activeLang === lang ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                        {lang}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Filters based on Active Tab */}
              {activeTab === 'style' && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Palette size={16} /> Thiết kế
                  </h3>
                  <div className="flex flex-col gap-2">
                    {styles.map(style => (
                      <label key={style} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          activeStyle === style ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                        }`}>
                          {activeStyle === style && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-[14px] ${activeStyle === style ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                          {style}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'industry' && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Briefcase size={16} /> Ngành nghề
                  </h3>
                  <div className="flex flex-col gap-2">
                    {industries.map(industry => (
                      <label key={industry} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          activeIndustry === industry ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                        }`}>
                          {activeIndustry === industry && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-[14px] ${activeIndustry === industry ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                          {industry}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter by Columns */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Columns size={16} /> Bố cục
                </h3>
                <div className="flex flex-col gap-2">
                  {columns.map(col => (
                    <label key={col} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        activeColumns === col ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                      }`}>
                        {activeColumns === col && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-[14px] ${activeColumns === col ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                        {col}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="font-bold text-[#212f3f] text-lg">
                Hiển thị {filteredCvs.length} mẫu CV
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sắp xếp theo:</span>
                <select className="border-gray-300 rounded text-sm text-gray-700 outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] py-1.5 px-3">
                  <option>Mới nhất</option>
                  <option>Được dùng nhiều nhất</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCvs.map(cv => (
                <div key={cv.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {cv.isHot && (
                      <span className="bg-[#ff4b4b] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
                        HOT
                      </span>
                    )}
                    {cv.isNew && (
                      <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
                        <Sparkles size={10} /> MỚI
                      </span>
                    )}
                  </div>

                  {/* CV Image */}
                  <div className="relative aspect-[1/1.414] bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img 
                      src={cv.thumbnail} 
                      alt={cv.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={() => navigate(`/cv/editor/${cv.id}`)}
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2.5 rounded-full font-semibold transition-colors transform translate-y-4 group-hover:translate-y-0 duration-200 shadow-lg"
                      >
                        Sử dụng mẫu này
                      </button>
                    </div>
                  </div>

                  {/* CV Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-[#212f3f] mb-2 line-clamp-1 group-hover:text-[#4F46E5] transition-colors text-lg">{cv.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">{cv.language}</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">{cv.style}</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">{cv.columns} cột</span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                      <p className="text-[12px] text-gray-500">
                        Ngành: <span className="font-medium text-[#212f3f]">{cv.industry}</span>
                      </p>
                      <p className="text-[12px] text-gray-400 font-medium">
                        {cv.usageCount.toLocaleString()} <span className="text-gray-400">lượt dùng</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Bottom Color Accent */}
                  {cv.color && (
                    <div className="h-1 w-full absolute bottom-0" style={{ backgroundColor: cv.color }}></div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredCvs.length === 0 && (
              <div className="bg-white p-16 text-center rounded-lg border border-gray-200 shadow-sm mt-6">
                <LayoutTemplate className="mx-auto text-gray-300 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold text-[#212f3f] mb-2">Không tìm thấy mẫu CV nào</h3>
                <p className="text-gray-500">Vui lòng thử thay đổi tiêu chí lọc của bạn để tìm thấy kết quả.</p>
                <button 
                  onClick={() => {
                    setActiveLang('Tất cả');
                    setActiveStyle('Tất cả');
                    setActiveIndustry('Tất cả');
                    setActiveColumns('Tất cả');
                  }}
                  className="mt-6 px-6 py-2 bg-[#f0f5ff] text-[#4F46E5] font-semibold rounded-full hover:bg-[#d1f0df] transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvTemplatesPage;
