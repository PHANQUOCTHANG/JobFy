import { ArrowUpRight, ArrowRight, Inbox } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SectionHeading } from "./Typography";
import { Article } from "../types";

export function BlogSection({ articles }: { articles: Article[] }) {
  return (
    <section className="py-20 px-5 lg:px-10 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Cẩm nang</SectionLabel>
            <SectionHeading>
              Phát triển <em className="not-italic text-[#D44E2B]">sự nghiệp</em>
            </SectionHeading>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-[#D44E2B] group">
            Xem tất cả bài viết <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>

        {(!articles || articles.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E8E2D8] border-dashed">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#6B6059] font-medium text-[14px]">Chưa có bài viết cẩm nang nào</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <Reveal key={article.id} delay={i * 80}>
                <a href="#" className="block bg-white rounded-2xl p-6 border border-[#E8E2D8] hover:border-[#D44E2B]/30 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[12px] font-bold px-3 py-1 rounded-full text-white flex items-center gap-1.5" style={{ backgroundColor: article.tagColor }}>
                      <span>{article.emoji}</span> {article.tag}
                    </span>
                    <span className="text-[12px] text-[#9B8E7F] ml-auto">{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-[17px] text-[#111018] group-hover:text-[#D44E2B] transition-colors mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {article.title}
                  </h3>
                  <p className="text-[13.5px] text-[#6B6059] mb-6 flex-1 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F7F4EE]">
                    <span className="text-[12px] text-[#9B8E7F] font-medium">{article.date}</span>
                    <span className="text-[12px] font-bold text-[#D44E2B] flex items-center gap-1">Đọc thêm <ArrowRight size={12} /></span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
