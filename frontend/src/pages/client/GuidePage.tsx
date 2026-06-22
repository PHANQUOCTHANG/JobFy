import React from 'react';
import { Search, BookOpen, Lightbulb, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: <BookOpen className="w-8 h-8 text-[#4F46E5]" />,
    title: 'Bí quyết viết CV',
    desc: 'Hướng dẫn viết CV chuyên nghiệp, chuẩn ATS giúp bạn ghi điểm với nhà tuyển dụng ngay từ vòng lọc hồ sơ.',
    count: 24,
  },
  {
    icon: <Users className="w-8 h-8 text-[#F59E0B]" />,
    title: 'Kỹ năng phỏng vấn',
    desc: 'Tuyển tập các câu hỏi phỏng vấn thường gặp và cách trả lời thông minh, tự tin trước mọi nhà tuyển dụng.',
    count: 35,
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-[#10B981]" />,
    title: 'Phát triển sự nghiệp',
    desc: 'Lộ trình thăng tiến, cách đàm phán lương và những kỹ năng mềm cần thiết để thành công trong công việc.',
    count: 18,
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-[#EC4899]" />,
    title: 'Góc nhìn chuyên gia',
    desc: 'Chia sẻ kinh nghiệm thực chiến từ các chuyên gia nhân sự và những người đi trước trong ngành.',
    count: 12,
  },
];

const featuredArticles = [
  {
    id: 1,
    title: 'Cách viết mục Tiêu chuẩn nghề nghiệp trong CV gây ấn tượng',
    category: 'Bí quyết viết CV',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
    date: '20/06/2026',
    readTime: '5 phút đọc',
  },
  {
    id: 2,
    title: 'Top 10 câu hỏi phỏng vấn hóc búa và cách trả lời khéo léo',
    category: 'Kỹ năng phỏng vấn',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    date: '18/06/2026',
    readTime: '8 phút đọc',
  },
  {
    id: 3,
    title: 'Gen Z và nghệ thuật đàm phán lương khi nhảy việc',
    category: 'Phát triển sự nghiệp',
    image: 'https://images.unsplash.com/photo-1554200876-56c2f25224fa?auto=format&fit=crop&w=600&q=80',
    date: '15/06/2026',
    readTime: '6 phút đọc',
  },
];

export const GuidePage: React.FC = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#e3f2fd] via-[#e3f2fd]/80 to-[#f6f7fa] pt-20 pb-28 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[#1e40af]">
            Cẩm nang Nghề nghiệp
          </h1>
          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto font-medium">
            Khám phá hàng ngàn bài viết, bí quyết và lời khuyên chuyên gia giúp bạn chinh phục mọi nấc thang sự nghiệp.
          </p>
          
          <div className="max-w-2xl mx-auto relative bg-white rounded-2xl p-2 flex shadow-lg border border-blue-100">
            <div className="flex-1 flex items-center px-4">
              <Search className="text-gray-400 w-6 h-6 mr-3" />
              <input 
                type="text" 
                placeholder="Tìm kiếm bài viết, chủ đề..." 
                className="w-full text-gray-800 outline-none bg-transparent py-2 text-lg"
              />
            </div>
            <button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-xl font-bold transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 border border-slate-100 cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5 group-hover:bg-indigo-50 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#4F46E5] transition-colors">{cat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {cat.desc}
              </p>
              <div className="text-sm font-semibold text-[#4F46E5] flex items-center gap-1">
                {cat.count} bài viết <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Bài viết nổi bật</h2>
            <p className="text-slate-500">Những nội dung được đọc nhiều nhất tuần qua</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-[#4F46E5] font-bold hover:underline">
            Xem tất cả <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#4F46E5]">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-3">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-[#4F46E5] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-[#4F46E5] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Đọc tiếp <ArrowRight size={16} />
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="md:hidden w-full mt-8 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
          Xem tất cả bài viết
        </button>
      </section>

      {/* Career Path Banner */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F46E5] rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EC4899] rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 md:max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#4F46E5]/20 text-indigo-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Target size={16} /> Định hướng nghề nghiệp
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Khám phá lộ trình thăng tiến cho riêng bạn
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              JobFy cung cấp các bản đồ nghề nghiệp chi tiết cho từng lĩnh vực: IT, Marketing, Sales, Design... Giúp bạn biết rõ mình đang ở đâu và cần học gì để tiến xa hơn.
            </p>
            <Link to="/jobs" className="inline-flex items-center justify-center bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-4 rounded-xl font-bold transition-colors w-full md:w-auto">
              Xem chi tiết bản đồ
            </Link>
          </div>
          <div className="relative z-10 hidden lg:block">
            <img 
              src="https://illustrations.popsy.co/amber/freelancer.svg" 
              alt="Career Path" 
              className="w-96 h-auto drop-shadow-2xl brightness-110"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuidePage;
