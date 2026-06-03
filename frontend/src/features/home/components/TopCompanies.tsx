import { ArrowUpRight, Inbox } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SectionHeading } from "./Typography";
import { Company } from "../types";

export function TopCompanies({ companies }: { companies: Company[] }) {
  return (
    <section className="py-20 px-5 lg:px-10 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Đối tác</SectionLabel>
            <SectionHeading>
              Nhà tuyển dụng<br />
              <em className="not-italic text-[#D44E2B]">hàng đầu</em>
            </SectionHeading>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-[#D44E2B] group">
            15,000+ công ty <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>

        {(!companies || companies.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E8E2D8] border-dashed">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#6B6059] font-medium text-[14px]">Chưa có dữ liệu nhà tuyển dụng</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {companies.map((c, i) => (
              <Reveal key={c.name} delay={i * 35}>
                <button className="group bg-white hover:bg-[#111018] border border-[#E8E2D8] hover:border-transparent rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-[11px] mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform"
                    style={{ background: c.bg }}>{c.logo}</div>
                  <p className="text-[12px] font-bold text-[#111018] group-hover:text-white transition-colors leading-tight">{c.name.split(" ")[0]}</p>
                  <p className="text-[11px] text-[#9B8E7F] group-hover:text-[#5A5048] mt-1 transition-colors">{c.openings} vị trí</p>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
