import React, { useState, useMemo, useEffect } from 'react';
import { mockCvTemplates } from '@/features/cv/api/mockData';
import { MiniCvPreview } from '@/features/cv/components/CvEditor/MiniCvPreview';
import { Filter, LayoutTemplate, Palette, Globe, Check, Briefcase, Columns, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CvTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'style' | 'industry'>('style');
  const [activeLang, setActiveLang] = useState('Tất cả');
  const [activeStyle, setActiveStyle] = useState('Tất cả');
  const [activeIndustry, setActiveIndustry] = useState('Tất cả');
  const [activeColumns, setActiveColumns] = useState('Tất cả');
  const [sortOrder, setSortOrder] = useState('Mới nhất');
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Dynamic filter lists
  const languages = useMemo(() => {
    const set = new Set(mockCvTemplates.map(cv => cv.language));
    return ['Tất cả', ...Array.from(set).sort()];
  }, []);

  const industries = useMemo(() => {
    const set = new Set(mockCvTemplates.map(cv => cv.industry));
    return ['Tất cả', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const styles = ['Tất cả', 'Đơn giản', 'Hiện đại', 'Sáng tạo', 'Harvard', 'Chuyên nghiệp', 'Tối giản', 'Công nghệ', 'Thanh lịch'];
  const columns = ['Tất cả', '1 cột', '2 cột'];

  const handleTabSwitch = (tab: 'style' | 'industry') => {
    setActiveTab(tab);
    if (tab === 'style') setActiveIndustry('Tất cả');
    if (tab === 'industry') setActiveStyle('Tất cả');
  };

  const getCount = (type: 'lang' | 'style' | 'industry' | 'col', value: string) => {
    if (value === 'Tất cả') return '';
    const filtered = mockCvTemplates.filter(cv => {
      if (type !== 'lang' && activeLang !== 'Tất cả' && cv.language !== activeLang) return false;
      if (type !== 'style' && activeTab === 'style' && activeStyle !== 'Tất cả' && cv.style !== activeStyle) return false;
      if (type !== 'industry' && activeTab === 'industry' && activeIndustry !== 'Tất cả' && cv.industry !== activeIndustry) return false;
      if (type !== 'col' && activeColumns !== 'Tất cả') {
        if (activeColumns === '1 cột' && cv.columns !== 1) return false;
        if (activeColumns === '2 cột' && cv.columns !== 2) return false;
      }
      
      if (type === 'lang' && cv.language !== value) return false;
      if (type === 'style' && cv.style !== value) return false;
      if (type === 'industry' && cv.industry !== value) return false;
      if (type === 'col') {
        if (value === '1 cột' && cv.columns !== 1) return false;
        if (value === '2 cột' && cv.columns !== 2) return false;
      }
      return true;
    });
    return `(${filtered.length})`;
  };

  const isOptionDisabled = (type: 'lang' | 'style' | 'industry' | 'col', value: string) => {
    return value !== 'Tất cả' && getCount(type, value) === '(0)';
  };

  const filteredCvs = useMemo(() => {
    const result = mockCvTemplates.filter(cv => {
      if (activeLang !== 'Tất cả' && cv.language !== activeLang) return false;
      if (activeTab === 'style' && activeStyle !== 'Tất cả' && cv.style !== activeStyle) return false;
      if (activeTab === 'industry' && activeIndustry !== 'Tất cả' && cv.industry !== activeIndustry) return false;
      
      if (activeColumns !== 'Tất cả') {
        if (activeColumns === '1 cột' && cv.columns !== 1) return false;
        if (activeColumns === '2 cột' && cv.columns !== 2) return false;
      }
      return true;
    });

    if (sortOrder === 'Mới nhất') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    } else if (sortOrder === 'Được dùng nhiều nhất') {
      result.sort((a, b) => b.usageCount - a.usageCount);
    }
    return result;
  }, [activeTab, activeLang, activeStyle, activeIndustry, activeColumns, sortOrder]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (activeLang !== 'Tất cả') filters.push({ type: 'lang', label: activeLang });
    if (activeTab === 'style' && activeStyle !== 'Tất cả') filters.push({ type: 'style', label: activeStyle });
    if (activeTab === 'industry' && activeIndustry !== 'Tất cả') filters.push({ type: 'industry', label: activeIndustry });
    if (activeColumns !== 'Tất cả') filters.push({ type: 'col', label: activeColumns });
    return filters;
  }, [activeLang, activeStyle, activeIndustry, activeColumns, activeTab]);

  const removeFilter = (type: string) => {
    if (type === 'lang') setActiveLang('Tất cả');
    if (type === 'style') setActiveStyle('Tất cả');
    if (type === 'industry') setActiveIndustry('Tất cả');
    if (type === 'col') setActiveColumns('Tất cả');
  };

  const clearAllFilters = () => {
    setActiveLang('Tất cả');
    setActiveStyle('Tất cả');
    setActiveIndustry('Tất cả');
    setActiveColumns('Tất cả');
  };

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFilterOpen]);

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Globe size={16} /> Ngôn ngữ
        </h3>
        <div className="flex flex-col gap-2">
          {languages.map(lang => {
            const disabled = isOptionDisabled('lang', lang);
            return (
              <div 
                key={lang} 
                onClick={() => !disabled && setActiveLang(lang)}
                className={`flex items-center justify-between cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    activeLang === lang ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                  }`}>
                    {activeLang === lang && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`text-[14px] ${activeLang === lang ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                    {lang}
                  </span>
                </div>
                <span className="text-[12px] text-gray-400">{getCount('lang', lang)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {activeTab === 'style' && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Palette size={16} /> Thiết kế
          </h3>
          <div className="flex flex-col gap-2">
            {styles.map(style => {
              const disabled = isOptionDisabled('style', style);
              return (
                <div 
                  key={style} 
                  onClick={() => !disabled && setActiveStyle(style)}
                  className={`flex items-center justify-between cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      activeStyle === style ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                    }`}>
                      {activeStyle === style && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-[14px] ${activeStyle === style ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                      {style}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-400">{getCount('style', style)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'industry' && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Briefcase size={16} /> Ngành nghề
          </h3>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {industries.map(industry => {
              const disabled = isOptionDisabled('industry', industry);
              return (
                <div 
                  key={industry} 
                  onClick={() => !disabled && setActiveIndustry(industry)}
                  className={`flex items-center justify-between cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      activeIndustry === industry ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                    }`}>
                      {activeIndustry === industry && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-[14px] line-clamp-1 ${activeIndustry === industry ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                      {industry}
                    </span>
                  </div>
                  <span className="text-[12px] text-gray-400">{getCount('industry', industry)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Columns size={16} /> Bố cục
        </h3>
        <div className="flex flex-col gap-2">
          {columns.map(col => {
            const disabled = isOptionDisabled('col', col);
            return (
              <div 
                key={col} 
                onClick={() => !disabled && setActiveColumns(col)}
                className={`flex items-center justify-between cursor-pointer group ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    activeColumns === col ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-gray-300 group-hover:border-[#4F46E5]'
                  }`}>
                    {activeColumns === col && <Check size={12} className="text-white" />}
                  </div>
                  <span className={`text-[14px] ${activeColumns === col ? 'text-[#4F46E5] font-medium' : 'text-gray-600 group-hover:text-[#4F46E5]'}`}>
                    {col}
                  </span>
                </div>
                <span className="text-[12px] text-gray-400">{getCount('col', col)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-[#f4f5f5] min-h-screen pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
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
        
        {/* Banner tạo CV bằng AI */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} />
          </div>
          <div className="flex-1 relative z-10">
            <h2 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-600" /> Bạn lười điền form từng mục?
            </h2>
            <p className="text-indigo-700/80 text-[14.5px]">
              Thử nghiệm công nghệ AI mới! Chỉ cần dán nội dung giới thiệu bản thân hoặc CV cũ, hệ thống sẽ tự động phân tích và điền vào mẫu CV siêu tốc chỉ trong 5 giây.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <button 
              onClick={() => navigate('/cv/ai-builder')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-md shadow-indigo-200"
            >
              Tạo CV bằng AI ngay
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200 inline-flex flex-wrap justify-center">
            <button
              onClick={() => handleTabSwitch('style')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'style' 
                  ? 'bg-[#4F46E5] text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#4F46E5]'
              }`}
            >
              Mẫu CV theo style
            </button>
            <button
              onClick={() => handleTabSwitch('industry')}
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
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h2 className="font-bold text-[#212f3f] text-lg flex items-center gap-2">
                  <Filter size={18} /> Bộ lọc CV
                </h2>
                {activeFilters.length > 0 && (
                  <button onClick={clearAllFilters} className="text-sm text-red-500 hover:underline">
                    Xóa tất cả
                  </button>
                )}
              </div>
              <FilterContent />
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="font-bold text-[#212f3f] text-lg">
                  Hiển thị {filteredCvs.length} mẫu CV
                </h2>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <SlidersHorizontal size={16} />
                    Bộ lọc {activeFilters.length > 0 && <span className="bg-[#4F46E5] text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px]">{activeFilters.length}</span>}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 hidden sm:inline">Sắp xếp theo:</span>
                    <select 
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="border border-gray-300 rounded text-sm text-gray-700 outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] py-1.5 px-3 bg-white"
                    >
                      <option value="Mới nhất">Mới nhất</option>
                      <option value="Được dùng nhiều nhất">Được dùng nhiều nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                  <span className="text-sm text-gray-500 mr-1">Đang lọc:</span>
                  {activeFilters.map((filter, idx) => (
                    <span key={idx} className="bg-[#eef2ff] text-[#4F46E5] border border-[#c7d2fe] px-3 py-1 rounded-full text-[13px] flex items-center gap-1.5 font-medium animate-fadeIn">
                      {filter.label}
                      <button onClick={() => removeFilter(filter.type)} className="hover:bg-[#c7d2fe] rounded-full p-0.5 transition-colors">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearAllFilters}
                    className="text-[13px] text-gray-500 hover:text-red-500 underline ml-2 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCvs.map((cv, index) => (
                <div 
                  key={cv.id} 
                  className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  
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

                  <div className="relative aspect-[1/1.414] bg-gray-100 overflow-hidden border-b border-gray-100">
                    <MiniCvPreview templateStyle={cv.style} color={cv.color || '#4F46E5'} />
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={() => navigate(`/cv/editor/${cv.id}`)}
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2.5 rounded-full font-semibold transition-colors transform translate-y-4 group-hover:translate-y-0 duration-200 shadow-lg"
                      >
                        Sử dụng mẫu này
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-[#212f3f] mb-2 line-clamp-1 group-hover:text-[#4F46E5] transition-colors text-lg">{cv.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">{cv.language}</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">{cv.style}</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 font-medium">{cv.columns} cột</span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                      <p className="text-[12px] text-gray-500 line-clamp-1 flex-1 mr-2">
                        Ngành: <span className="font-medium text-[#212f3f]">{cv.industry}</span>
                      </p>
                      <p className="text-[12px] text-gray-400 font-medium whitespace-nowrap">
                        {cv.usageCount.toLocaleString()} <span className="text-gray-400 hidden sm:inline">lượt dùng</span>
                      </p>
                    </div>
                  </div>
                  
                  {cv.color && (
                    <div className="h-1 w-full absolute bottom-0" style={{ backgroundColor: cv.color }}></div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredCvs.length === 0 && (
              <div className="bg-white p-16 text-center rounded-lg border border-gray-200 shadow-sm mt-6 animate-fadeIn">
                <LayoutTemplate className="mx-auto text-gray-300 w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold text-[#212f3f] mb-2">Không tìm thấy mẫu CV nào</h3>
                <p className="text-gray-500">Vui lòng thử thay đổi tiêu chí lọc của bạn để tìm thấy kết quả.</p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2 bg-[#f0f5ff] text-[#4F46E5] font-semibold rounded-full hover:bg-[#d1f0df] transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        className={`fixed inset-0 bg-black/50 z-[100] lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileFilterOpen(false)}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[101] lg:hidden transition-transform duration-300 flex flex-col max-h-[85vh] ${isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg text-[#212f3f]">Bộ lọc CV</h2>
          <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          <FilterContent />
        </div>
        
        <div className="p-4 border-t flex gap-3 bg-white">
          <button 
            onClick={() => { clearAllFilters(); setIsMobileFilterOpen(false); }}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Xóa bộ lọc
          </button>
          <button 
            onClick={() => setIsMobileFilterOpen(false)}
            className="flex-1 py-3 bg-[#4F46E5] text-white font-semibold rounded-lg hover:bg-[#4338CA] transition-colors shadow-md"
          >
            Áp dụng
          </button>
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; 
        }
      `}</style>
    </div>
  );
};

export default CvTemplatesPage;
