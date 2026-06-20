import React from 'react';
import { FileText, Search, PenTool } from 'lucide-react';

export const CoverLetterPage: React.FC = () => {
  const letters = [
    { id: 1, name: 'Mẫu Cover Letter cho Lập trình viên', style: 'Chuyên nghiệp', usage: 12500 },
    { id: 2, name: 'Mẫu Cover Letter tiếng Anh (Chung)', style: 'Đơn giản', usage: 25400 },
    { id: 3, name: 'Mẫu Cover Letter Sinh viên mới ra trường', style: 'Năng động', usage: 8200 },
    { id: 4, name: 'Mẫu Cover Letter cho Marketing', style: 'Sáng tạo', usage: 6300 },
    { id: 5, name: 'Mẫu Cover Letter Kế toán/Kiểm toán', style: 'Cổ điển', usage: 4100 },
    { id: 6, name: 'Mẫu Cover Letter Nhân sự (HR)', style: 'Chuyên nghiệp', usage: 3800 },
  ];

  return (
    <div className="bg-[#f4f5f5] min-h-screen pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-gradient-to-r from-[#172554] to-[#1e3a8a] py-12 px-4 text-center">
        <h1 className="text-3xl md:text-[32px] font-bold text-white mb-4">
          Tạo Cover Letter (Thư xin việc)
        </h1>
        <p className="text-white/90 text-base mb-8 max-w-2xl mx-auto">
          Một lá thư xin việc được viết tốt sẽ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.
          Chọn mẫu và chỉnh sửa ngay để tạo ấn tượng mạnh mẽ.
        </p>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 mt-8 flex flex-col md:flex-row gap-6">
        
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="font-bold text-[#212f3f] text-lg flex items-center gap-2">
              <FileText size={20} className="text-[#4F46E5]" /> Danh sách mẫu Thư xin việc
            </h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm mẫu..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map(letter => (
              <div key={letter.id} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="w-12 h-12 bg-[#eff6ff] text-[#4F46E5] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PenTool size={24} />
                </div>
                
                <h3 className="font-bold text-[#212f3f] text-lg mb-2 leading-tight group-hover:text-[#4F46E5] transition-colors">
                  {letter.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                    {letter.style}
                  </span>
                  <span className="text-gray-400 text-xs">
                    • {letter.usage.toLocaleString()} lượt dùng
                  </span>
                </div>
                
                <button className="mt-auto w-full py-2 border border-[#4F46E5] text-[#4F46E5] font-semibold rounded-md hover:bg-[#4F46E5] hover:text-white transition-colors">
                  Sử dụng mẫu này
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
