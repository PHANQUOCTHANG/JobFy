import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCompanies, useIndustries } from '@/features/companies';
import { CompanyCard } from '@/features/companies/components/CompanyCard';
import { CompanyCardSkeleton } from '@/features/companies/components/CompanyCardSkeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 9;

export const CompanyListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: industriesResponse } = useIndustries();
  const rawIndustries = industriesResponse?.data || [];
  
  const categories = [
    { id: 'all', name: 'Tất cả', count: '1000+' },
    ...rawIndustries.map((ind: any) => ({
      id: String(ind.id),
      name: ind.name,
      count: ind.count || '100+'
    }))
  ];

  const { data: companiesResponse, isLoading } = useCompanies({
    keyword: searchTerm || undefined,
    industryId: activeCategory !== 'all' ? activeCategory : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE
  });
  
  const paginatedCompanies = companiesResponse?.data || [];
  const totalResults = companiesResponse?.meta?.total || 0;
  const totalPages = Math.max(companiesResponse?.meta?.totalPages || 1, 1);

  // Helper to reset pagination when filtering
  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#f6f7fa] min-h-screen pb-16 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#e3f2fd] via-[#e3f2fd]/80 to-[#f6f7fa] pt-10 pb-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/2 md:w-[60%] lg:w-[50%] opacity-30 md:opacity-100 pointer-events-none flex justify-end">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e3f2fd] via-transparent to-transparent z-10"></div>
            <img 
              src="/skyline.png" 
              alt="Skyline" 
              className="w-full h-full object-cover object-right-bottom mix-blend-multiply opacity-70 scale-[1.05] translate-y-2"
              onError={(e) => {
                // Fallback Unsplash image if local doesn't load
                e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80";
                e.currentTarget.className = "w-full h-full object-cover object-right mix-blend-multiply opacity-20 grayscale";
              }}
            />
          </div>
        </div>
        
        <div className="max-w-[1140px] mx-auto px-4 relative z-20">
          <div className="max-w-[650px] mb-8 mt-4 md:mt-8">
            <h1 className="text-3xl md:text-[34px] font-bold text-[#1e40af] mb-3 tracking-tight leading-snug">
              {totalResults.toLocaleString("vi-VN")} Doanh nghiệp đang tuyển dụng T6/2026
            </h1>
            <p className="text-slate-800 text-[17px] md:text-[18px] font-semibold">
              Các công ty hàng đầu đang tuyển dụng
            </p>
          </div>
          
          <div className="max-w-[700px] flex bg-white rounded-lg border border-blue-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-within:ring-2 focus-within:ring-blue-400/50 transition-all duration-300 p-1.5">
            <div className="flex-1 flex items-center px-4">
              <input 
                type="text" 
                placeholder="Nhập tên công ty..." 
                className="w-full bg-transparent border-none outline-none text-[15px] text-slate-800 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button className="bg-[#1e40af] hover:bg-blue-800 text-white px-8 py-2.5 rounded-md font-bold text-[14px] transition-colors flex items-center whitespace-nowrap">
              TÌM CÔNG TY
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#f6f7fa] pt-4">
        <div className="max-w-[1140px] mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList className="text-[#1e40af] text-[13px]">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="hover:text-blue-800 transition-colors">JobFy</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/companies" className="hover:text-blue-800 transition-colors">Công ty</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-600 font-medium">Công ty đang tuyển dụng</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Categories section */}
          <div className="mb-8">
            <h2 className="text-[20px] font-bold text-slate-800 mb-5">
              Doanh nghiệp hàng đầu đang tuyển dụng
            </h2>
            
            <div className="relative bg-white rounded-[24px] shadow-[0_2px_12px_rgb(0,0,0,0.04)] border border-slate-100 py-3 px-12 md:px-16">
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-0">
                  {categories.map((category) => (
                    <CarouselItem key={category.id} className="pl-0 basis-[130px] md:basis-[150px] lg:basis-[170px] shrink-0">
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className="w-full transition-all duration-200 flex flex-col items-center justify-center group h-[80px]"
                      >
                        <div className={`flex flex-col items-center justify-center gap-1.5 h-full w-full relative pb-1`}>
                          <span className={`font-bold text-[15px] transition-colors ${activeCategory === category.id ? 'text-[#1e40af]' : 'text-slate-700 group-hover:text-[#1e40af]'}`}>
                            {category.name}
                          </span>
                          <span className={`text-[13px] transition-colors ${activeCategory === category.id ? 'text-[#1e40af]/80 font-medium' : 'text-slate-500'}`}>
                            {category.count} Doanh nghiệp
                          </span>
                          
                          {/* Active Underline */}
                          {activeCategory === category.id && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[3px] bg-[#1e40af] rounded-t-md"></div>
                          )}
                        </div>
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-8 md:-left-10 bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm h-10 w-10 z-10" />
                <CarouselNext className="-right-8 md:-right-10 bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm h-10 w-10 z-10" />
              </Carousel>
            </div>
          </div>

          {/* List Companies */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoading
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <CompanyCardSkeleton key={`skeleton-${index}`} />
                  ))
                : paginatedCompanies.map(company => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
              
              {!isLoading && paginatedCompanies.length === 0 && (
                <div className="col-span-full bg-white p-16 text-center rounded-2xl border border-border/40 shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-sm text-slate-500">Vui lòng thử lại với từ khóa khác.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#1e40af] text-white border border-[#1e40af] shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyListPage;
