import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useJobCategories } from "../hooks/useJobs";

const ITEMS_PER_PAGE = 6;

const mockBanners = [
  {
    id: 1,
    title1: "QUANTA",
    title2: "QMH COMPUTER",
    subtitle: "TUYỂN DỤNG CÁC VỊ TRÍ",
    jobs: ["Kỹ Sư", "Tổ Trưởng Sản Xuất", "Nhân Viên Tiếng Trung"],
    location: "Lô CN14 KCN Mỹ Thuận, phường Mỹ Lộc, tỉnh Nam Định",
    primaryColor: "#1966d2",
    secondaryColor: "#c8102e",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200&auto=format&fit=crop",
    logoLetter: "C",
    logoText: "Quanta Computer",
    bgText: "Quanta",
  },
  {
    id: 2,
    title1: "SAMSUNG",
    title2: "ELECTRONICS VIỆT NAM",
    subtitle: "CƠ HỘI NGHỀ NGHIỆP LỚN",
    jobs: ["Kỹ sư phần mềm", "Chuyên viên R&D", "Quản lý sản xuất"],
    location: "Khu Công nghiệp Yên Phong I, xã Yên Trung, huyện Yên Phong, Bắc Ninh",
    primaryColor: "#1428a0",
    secondaryColor: "#00a9e0",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    logoLetter: "S",
    logoText: "Samsung Electronics",
    bgText: "Samsung",
  },
  {
    id: 3,
    title1: "FPT",
    title2: "SOFTWARE HÀ NỘI",
    subtitle: "GIA NHẬP ĐỘI NGŨ CHUYÊN GIA",
    jobs: ["Lập trình viên Java", "Kỹ sư AI/Data", "Chuyên gia bảo mật"],
    location: "Tòa nhà FPT, Phố Duy Tân, phường Dịch Vọng Hậu, quận Cầu Giấy, Hà Nội",
    primaryColor: "#f26522",
    secondaryColor: "#333333",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    logoLetter: "F",
    logoText: "FPT Software",
    bgText: "FPT",
  }
];

export const HeroBanner: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [catPage, setCatPage] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);

  const { data: apiCategories } = useJobCategories();

  const allCategories =
    apiCategories && apiCategories.length > 0
      ? apiCategories
      : [
          { id: 1, name: "Kinh doanh/Bán hàng", slug: "sales", isActive: true },
          { id: 2, name: "Marketing/PR/Quảng cáo", slug: "marketing", isActive: true },
          { id: 3, name: "Chăm sóc khách hàng", slug: "customer-service", isActive: true },
          { id: 4, name: "Nhân sự/Hành chính", slug: "admin", isActive: true },
          { id: 5, name: "Công nghệ Thông tin", slug: "it", isActive: true },
          { id: 6, name: "Lao động phổ thông", slug: "labor", isActive: true },
        ];

  const totalPages = Math.ceil(allCategories.length / ITEMS_PER_PAGE);
  const currentCategories = allCategories.slice(
    catPage * ITEMS_PER_PAGE,
    (catPage + 1) * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevBanner = () => {
    setCurrentBanner((prev) => (prev === 0 ? mockBanners.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
  };

  const banner = mockBanners[currentBanner];

  return (
    <div className="max-w-[1140px] mx-auto px-4 mt-6 mb-8 hidden lg:block font-sans">
      <div className="flex gap-4 h-[320px]">
        <div className="w-[300px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col pt-3 pb-4 flex-shrink-0 relative overflow-hidden">
          <div className="flex-1 flex flex-col">
            {currentCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/jobs?categorySlug=${cat.slug}`}
                className={`flex items-center justify-between px-5 py-2.5 text-[14px] font-bold transition-colors group ${
                  activeCategory === cat.id
                    ? "text-[#4F46E5] bg-indigo-50/50"
                    : "text-[#333333] hover:bg-gray-50"
                }`}
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <span className="truncate pr-4">{cat.name}</span>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#4F46E5] transition-colors" strokeWidth={2.5} />
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between px-5 pt-2 mt-1 border-t border-gray-100">
            <span className="text-[#333333] text-[15px] font-medium">
              {catPage + 1}/{totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCatPage((p) => Math.max(0, p - 1))}
                disabled={catPage === 0}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#4F46E5] hover:border-[#4F46E5] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => setCatPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={catPage >= totalPages - 1}
                className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] hover:bg-indigo-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden relative bg-white border border-gray-100 flex shadow-sm group">
          <div className="w-[60%] p-8 flex flex-col relative z-20">
            <div className="mb-5 tracking-tight mt-2">
              <h2 className="text-[38px] font-black leading-none drop-shadow-sm transition-colors duration-500" style={{ fontFamily: "Arial, sans-serif", color: banner.primaryColor }}>
                {banner.title1}
              </h2>
              <h2 className="text-[38px] font-black leading-tight drop-shadow-sm transition-colors duration-500" style={{ fontFamily: "Arial, sans-serif", color: banner.primaryColor }}>
                {banner.title2}
              </h2>
            </div>

            <div className="relative mb-5 flex">
              <div className="text-white font-bold text-[18px] px-8 py-2 relative -ml-8 z-10 flex items-center shadow-md transition-colors duration-500" style={{ backgroundColor: banner.primaryColor }}>
                {banner.subtitle}
                <div className="absolute -right-6 top-0 bottom-0 w-8 skew-x-[-25deg] origin-bottom rounded-r-sm transition-colors duration-500" style={{ backgroundColor: banner.primaryColor }}></div>
                <div className="absolute -right-8 top-0 bottom-0 w-4 skew-x-[-25deg] origin-bottom -z-10 shadow-sm rounded-r-sm transition-colors duration-500" style={{ backgroundColor: banner.secondaryColor }}></div>
              </div>
            </div>

            <div className="space-y-2.5 pl-3 mb-6 relative z-10">
              {banner.jobs.map((job, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex text-[#8ab4f8]">
                    <ChevronRight size={18} strokeWidth={4} />
                    <ChevronRight size={18} strokeWidth={4} className="-ml-3" />
                    <ChevronRight size={18} strokeWidth={4} className="-ml-3" />
                  </div>
                  <span className="font-extrabold text-[17px] tracking-wide transition-colors duration-500" style={{ color: banner.secondaryColor }}>
                    {job}
                  </span>
                </div>
              ))}

              <div className="absolute right-12 bottom-0 flex flex-col items-center opacity-50">
                <Sparkles className="w-8 h-8" style={{ color: banner.primaryColor, fill: banner.primaryColor }} />
                <Sparkles className="w-4 h-4 ml-6 -mt-2" style={{ color: banner.primaryColor, fill: banner.primaryColor }} />
              </div>
            </div>

            <div className="flex items-start gap-2.5 mt-auto bg-white/80 p-2 rounded-xl backdrop-blur-sm inline-flex w-max -ml-2">
              <div className="mt-0.5">
                <MapPin className="w-5 h-5 transition-colors duration-500" style={{ color: banner.primaryColor }} fill="currentColor" stroke="white" />
              </div>
              <span className="text-[13.5px] font-bold max-w-[280px] leading-snug transition-colors duration-500" style={{ color: banner.primaryColor }}>
                {banner.location.split(',').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}{i < banner.location.split(',').length - 1 ? ',' : ''}
                    {i === 1 ? <br /> : ''}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>

          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute right-[35%] -top-10 -bottom-10 w-[200px] bg-white skew-x-[-25deg] z-10 shadow-2xl"></div>
            <div className="absolute right-[34.8%] -top-10 -bottom-10 w-[20px] skew-x-[-25deg] z-10 shadow-xl transition-colors duration-500" style={{ backgroundColor: banner.secondaryColor }}></div>
            <div className="absolute right-[33.5%] -top-10 -bottom-10 w-[20px] skew-x-[-25deg] z-10 transition-colors duration-500" style={{ backgroundColor: banner.primaryColor }}></div>

            <div className="absolute right-0 top-0 bottom-0 w-[45%] z-0">
              <img
                key={banner.image}
                src={banner.image}
                alt="Company Banner"
                className="w-full h-full object-cover filter brightness-105 contrast-110 animate-in fade-in duration-700"
              />

              <div className="absolute top-4 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm flex flex-col items-center">
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="text-[28px] font-black block relative transition-colors duration-500" style={{ color: banner.primaryColor }}>
                    {banner.logoLetter}
                    <span className="absolute top-[40%] right-0 w-4 h-1 rounded-sm transition-colors duration-500" style={{ backgroundColor: banner.secondaryColor }}></span>
                    <span className="absolute top-[60%] right-0 w-4 h-1 rounded-sm transition-colors duration-500" style={{ backgroundColor: banner.secondaryColor }}></span>
                    <span className="absolute top-[80%] right-0 w-4 h-1 rounded-sm transition-colors duration-500" style={{ backgroundColor: banner.secondaryColor }}></span>
                  </span>
                </div>
                <span className="text-[#333333] text-[11px] font-black uppercase tracking-wider mt-1">
                  {banner.logoText}
                </span>
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 px-4">
                <h1
                  key={banner.bgText}
                  className="text-[72px] font-black tracking-tighter w-full text-center animate-in slide-in-from-bottom-4 duration-700"
                  style={{
                    color: banner.primaryColor,
                    WebkitTextStroke: "1px rgba(255,255,255,0.5)",
                    textShadow: `3px 4px 0px ${banner.secondaryColor}, 0px 10px 15px rgba(0,0,0,0.5)`,
                    transform: "scaleY(0.9) perspective(500px) rotateX(15deg)",
                  }}
                >
                  {banner.bgText}
                </h1>
              </div>
            </div>
          </div>

          <button onClick={handlePrevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-full flex items-center justify-center text-gray-500 hover:text-[#1966d2] z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          <button onClick={handleNextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-30 border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          <div className="absolute bottom-4 left-[35%] flex gap-2 z-30">
            {mockBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${
                  currentBanner === idx ? "w-6 bg-[#4F46E5]" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
