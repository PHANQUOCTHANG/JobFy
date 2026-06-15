import React from 'react';
import { Laptop, Briefcase, Calculator, PenTool, Database, Megaphone, Stethoscope, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopCategoriesSection: React.FC = () => {
  const categories = [
    { id: 1, name: 'IT Phần mềm', jobsCount: 12540, icon: <Laptop size={24} /> },
    { id: 2, name: 'Kinh doanh / Bán hàng', jobsCount: 9830, icon: <ShoppingBag size={24} /> },
    { id: 3, name: 'Hành chính / Văn phòng', jobsCount: 8210, icon: <Briefcase size={24} /> },
    { id: 4, name: 'Kế toán / Kiểm toán', jobsCount: 6500, icon: <Calculator size={24} /> },
    { id: 5, name: 'Marketing / Truyền thông', jobsCount: 5420, icon: <Megaphone size={24} /> },
    { id: 6, name: 'Thiết kế / Mỹ thuật', jobsCount: 3200, icon: <PenTool size={24} /> },
    { id: 7, name: 'IT Phần cứng / Mạng', jobsCount: 2150, icon: <Database size={24} /> },
    { id: 8, name: 'Y tế / Chăm sóc sức khỏe', jobsCount: 1840, icon: <Stethoscope size={24} /> },
  ];

  return (
    <div className="py-8">
      <h2 className="text-[20px] md:text-[24px] font-bold text-[#212f3f] mb-6">
        Ngành nghề trọng điểm
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <Link 
            key={cat.id} 
            to={`/jobs?categoryId=${cat.id}`}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 hover:border-[#4F46E5] group flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#f4f5f5] text-gray-500 flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white transition-colors flex-shrink-0">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-bold text-[#212f3f] text-sm md:text-base group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {cat.jobsCount.toLocaleString()} việc làm
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
