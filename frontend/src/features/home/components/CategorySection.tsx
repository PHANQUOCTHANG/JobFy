import { ArrowUpRight, ChevronRight, Inbox } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SectionHeading } from "./Typography";
import { Category } from "../types";

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-20 px-5 lg:px-10 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Ngành nghề</SectionLabel>
            <SectionHeading>
              Chọn lĩnh vực<br />
              <em className="not-italic text-[#D44E2B]">của bạn</em>
            </SectionHeading>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-[#D44E2B] group">
            Tất cả ngành nghề
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>

        {(!categories || categories.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E8E2D8] border-dashed">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#6B6059] font-medium text-[14px]">Chưa có dữ liệu ngành nghề</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-0">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Reveal key={cat.id} delay={i * 45}>
                  <a href="#"
                    className="group flex items-center gap-4 py-4 border-b border-[#E2DDD3] hover:border-[#D44E2B]/40 transition-all last:border-0">
                    <span className="text-[11px] font-black text-[#C5B8A8] w-6 flex-shrink-0 group-hover:text-[#D44E2B] transition-colors font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#EDE9E1] group-hover:bg-[#D44E2B] flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-sm">
                      <Icon size={17} className="text-[#6B6059] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#1A1612] text-[14px] group-hover:text-[#D44E2B] transition-colors block truncate">{cat.name}</span>
                      <span className="text-[11px] text-[#9B8E7F] mt-0.5 block">{cat.count.toLocaleString()} vị trí</span>
                    </div>
                    <ChevronRight size={15} className="text-[#C5B8A8] group-hover:text-[#D44E2B] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </a>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
