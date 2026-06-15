import { ArrowUpRight, Inbox } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SectionHeading } from "./Typography";
import { Company } from "../types";

export function TopCompanies({ companies }: { companies: Company[] }) {
  return (
    <section className="py-20 px-5 lg:px-10 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Đối tác</SectionLabel>
            <SectionHeading>
              Nhà tuyển dụng<br />
              <em className="not-italic text-[#4F46E5]">hàng đầu</em>
            </SectionHeading>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold text-[#4F46E5] group">
            15,000+ công ty <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Reveal>

        {(!companies || companies.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E2E8F0] border-dashed">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#64748B] font-medium text-[14px]">Chưa có dữ liệu nhà tuyển dụng</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {companies.map((c, i) => (
              <Reveal key={c.name} delay={i * 35}>
                <button className="group bg-white hover:bg-[#EEF2FF] border border-slate-200 hover:border-[#C7D2FE] rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 w-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-[11px] mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform"
                    style={{ background: c.bg }}>{c.logo}</div>
                  <p className="text-[12px] font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-tight">{c.name.split(" ")[0]}</p>
                  <p className="text-[11px] text-slate-500 mt-1 transition-colors">{c.openings} vị trí</p>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
