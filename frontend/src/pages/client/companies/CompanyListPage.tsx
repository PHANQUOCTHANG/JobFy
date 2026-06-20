import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompanies } from '@/features/companies';
import { mockCompanies } from '@/features/companies/api/mockData';
import { CompanyCard } from '@/features/companies/components/CompanyCard';

export const CompanyListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState('Tất cả');
  
  const { data: apiCompanies, isLoading } = useCompanies({ search: searchTerm });
  
  // Use mock data if API is empty or loading for demo purposes
  const companies = (apiCompanies && apiCompanies.length > 0) ? apiCompanies : mockCompanies;

  const alphabet = ['Tất cả', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const filteredCompanies = companies.filter(c => {
    if (activeLetter === 'Tất cả') return true;
    return c.name.toUpperCase().startsWith(activeLetter);
  });

  return (
    <div className="bg-background min-h-screen pb-16 font-sans">
      {/* Hero Search Section */}
      <div className="bg-gradient-brand pt-16 pb-24 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />
        <div className="absolute inset-0 bg-mesh-brand mix-blend-overlay opacity-30 pointer-events-none" />
        
        <div className="max-w-[1140px] mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-[40px] font-black text-white mb-6 tracking-tight drop-shadow-sm">
            Khám phá 100.000+ công ty nổi bật
          </h1>
          <p className="text-primary-foreground/90 text-[16px] md:text-[17px] mb-10 max-w-2xl mx-auto font-medium">
            Tra cứu thông tin công ty và tìm kiếm môi trường làm việc lý tưởng nhất dành cho sự nghiệp của bạn
          </p>
          
          <div className="max-w-3xl mx-auto flex bg-card rounded-2xl p-2.5 shadow-floating focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300">
            <div className="flex-1 flex items-center px-5">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input 
                type="text" 
                placeholder="Nhập tên công ty (ví dụ: FPT, VNG, Shopee)..." 
                className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-xl font-bold transition-all shadow-brand hover:shadow-brand-dynamic active:scale-95 flex items-center gap-2">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1140px] mx-auto px-4 relative z-20 -mt-10">
        
        {/* Alphabet Filter */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-raised mb-8">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="text-[18px] font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full shadow-glow-sm"></span>
              Danh sách công ty nổi bật
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(letter)}
                className={`rounded-xl flex items-center justify-center text-[13.5px] font-bold transition-all duration-300 ${
                  activeLetter === letter 
                    ? 'bg-primary text-primary-foreground shadow-brand scale-105' 
                    : letter === 'Tất cả' 
                      ? 'bg-muted text-foreground w-auto px-5 py-2 hover:bg-primary/10 hover:text-primary'
                      : 'w-10 h-10 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
          
          {filteredCompanies.length === 0 && (
            <div className="col-span-full bg-card p-16 text-center rounded-2xl border border-border/40 shadow-sm flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-5">
                <Search className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-[20px] font-bold text-foreground mb-2">Không tìm thấy kết quả</h3>
              <p className="text-[15px] text-muted-foreground">Vui lòng thử lại với từ khóa khác hoặc chọn chữ cái khác.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CompanyListPage;
