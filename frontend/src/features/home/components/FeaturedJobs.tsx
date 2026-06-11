import { useState } from "react";
import { ArrowRight, MapPin, Bookmark, BookmarkCheck, Building2, Clock, Inbox } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SectionHeading } from "./Typography";
import { Job } from "../types";

export function FeaturedJobs({ jobs }: { jobs: Job[] }) {
  const [saved, setSaved] = useState<number[]>([]);

  const toggleSave = (id: number) =>
    setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const LOGO_COL: Record<string, string> = {
    FPT: "#FF6B2C", VNG: "#0066FF", TK: "#1A94FF", GR: "#00B14F", VP: "#E31837", SP: "#F05A28", MM: "#A50064", LZ: "#0F146D",
  };

  return (
    <section className="py-20 px-5 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <SectionLabel>Cơ hội nổi bật</SectionLabel>
            <SectionHeading>
              Việc làm<br />
              <em className="not-italic text-[#1A56DB]">dành cho bạn</em>
            </SectionHeading>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {["Tất cả", "Full-time", "Remote", "Hybrid"].map((f, i) => (
              <button key={f}
                className={`text-[12px] font-bold px-4 py-2 rounded-full transition-all border ${
                  i === 0 ? "bg-[#0F172A] text-white border-[#0F172A]" : "border-[#E2DDD3] text-[#64748B] hover:border-[#0F172A] hover:text-[#0F172A]"
                }`}>{f}</button>
            ))}
          </div>
        </Reveal>

        {(!jobs || jobs.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-24 bg-[#F4F6FA] rounded-2xl border border-[#E2E8F0] border-dashed">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#64748B] font-medium text-[14px]">Chưa có dữ liệu việc làm</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
            {/* Large featured card */}
            <Reveal>
              <div className="relative bg-white text-slate-900 rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between p-7 border border-slate-200 hover:border-[#1A56DB]/40 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 min-h-[320px] border-l-4 border-l-[#1A56DB]">
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                        style={{ background: LOGO_COL["FPT"] }}>FPT</div>
                      <div>
                        <span className="text-[11px] bg-[#EEF2FF] text-[#1A56DB] border border-[#C7D2FE] px-2.5 py-0.5 rounded-full font-bold">⭐ Nổi bật</span>
                        <p className="text-[13px] text-slate-500 mt-1.5 flex items-center gap-1"><MapPin size={11} />Hà Nội</p>
                      </div>
                    </div>
                    <button onClick={() => toggleSave(1)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                      {saved.includes(1) ? <BookmarkCheck size={17} className="text-[#1A56DB]" /> : <Bookmark size={17} className="text-slate-400" />}
                    </button>
                  </div>
                  <h3 className="text-[1.5rem] font-black text-slate-900 group-hover:text-[#1A56DB] transition-colors mb-4 leading-snug"
                    style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Senior React Developer
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "Full-time"].map((t, i) => (
                      <span key={t} className={`text-[12px] px-2.5 py-1 rounded-lg font-medium ${i === 3 ? "bg-[#EEF2FF] text-[#1A56DB] border border-[#C7D2FE]" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-between pt-5 border-t border-slate-200 mt-6">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-0.5">Mức lương</p>
                    <p className="font-black text-emerald-600 text-[1.2rem]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      25 – 40 triệu<span className="text-[13px] text-slate-400 font-normal">/tháng</span>
                    </p>
                  </div>
                  <button className="flex items-center gap-2 bg-[#1A56DB] hover:bg-[#1447C0] text-white font-bold px-5 py-2.5 rounded-xl text-[13px] transition-all shadow-md shadow-[#1A56DB]/20 group-hover:gap-3">
                    Ứng tuyển <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Stack of smaller cards */}
            <div className="flex flex-col gap-3">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={i * 55}>
                  <div className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#C7D2FE] hover:shadow-md rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 shadow-sm"
                        style={{ background: LOGO_COL[job.logo] ?? "#1A56DB" }}>{job.logo}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#0F172A] text-[13.5px] leading-snug group-hover:text-[#1A56DB] transition-colors truncate">{job.title}</h4>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5 flex items-center gap-1.5">
                          <Building2 size={10} />{job.company}
                          <span className="w-1 h-1 bg-[#C5B8A8] rounded-full" />
                          <MapPin size={10} />{job.location}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[13px] font-black text-[#1A56DB]">{job.salary}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">{job.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#EDE9E1]">
                      <div className="flex gap-1.5">
                        {job.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-md">{t}</span>
                        ))}
                        {job.remote && <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold">Remote</span>}
                        {job.hot && <span className="text-[11px] bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-md font-semibold">Gấp</span>}
                      </div>
                      <span className="text-[11px] text-[#94A3B8] flex items-center gap-1"><Clock size={10} />{job.posted}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal className="text-center mt-10">
          <a href="#" className="inline-flex items-center gap-2 border-2 border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all text-[13px] group">
            Xem tất cả 50,000+ việc làm
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
