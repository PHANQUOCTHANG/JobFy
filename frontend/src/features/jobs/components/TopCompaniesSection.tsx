import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopCompaniesSection: React.FC = () => {
  // Using some dummy premium data for UI representation
  const companies = [
    {
      id: '1',
      name: 'Công ty Cổ phần Viễn thông FPT',
      logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
      jobsCount: 25,
      description: 'Môi trường làm việc năng động, chuyên nghiệp.'
    },
    {
      id: '2',
      name: 'Công ty Cổ phần VNG',
      logo: 'https://vng.com.vn/assets/images/logo.png',
      jobsCount: 18,
      description: 'Phát triển các sản phẩm hàng triệu người dùng.'
    },
    {
      id: '3',
      name: 'Tiki Corporation',
      logo: 'https://salt.tikicdn.com/ts/upload/ae/f4/6d/4664fae2b7ba50aba552eb5ad54f0081.png',
      jobsCount: 12,
      description: 'Nền tảng thương mại điện tử hàng đầu Việt Nam.'
    },
    {
      id: '4',
      name: 'Tập đoàn Masan',
      logo: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/9d/Masan_Group_logo.svg/1200px-Masan_Group_logo.svg.png',
      jobsCount: 30,
      description: 'Tập đoàn kinh tế tư nhân đa ngành lớn nhất.'
    }
  ];

  return (
    <div className="py-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#212f3f]">
          Top Công ty Hàng đầu
        </h2>
        <Link 
          to="/companies" 
          className="text-[#4F46E5] font-medium flex items-center gap-1 hover:text-[#009842] transition-colors"
        >
          Xem tất cả <ChevronRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {companies.map(company => (
          <Link 
            key={company.id} 
            to={`/companies/${company.id}`}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:border-[#4F46E5] group flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-white border border-gray-100 shadow-sm rounded-lg flex items-center justify-center p-2 mb-4 group-hover:-translate-y-1 transition-transform">
              <img 
                src={company.logo} 
                alt={company.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h3 className="font-bold text-[#212f3f] text-base mb-2 line-clamp-2 group-hover:text-[#4F46E5] transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
              {company.description}
            </p>
            <div className="w-full bg-[#f4f5f5] text-[#212f3f] font-medium py-2 rounded-md group-hover:bg-blue-50 group-hover:text-[#4F46E5] transition-colors">
              {company.jobsCount} việc làm
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
