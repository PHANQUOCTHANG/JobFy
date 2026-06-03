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
              <em className="not-italic text-[#D44E2B]">dành cho bạn</em>
            </SectionHeading>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {["Tất cả", "Full-time", "Remote", "Hybrid"].map((f, i) => (
              <button key={f}
                className={`text-[12px] font-bold px-4 py-2 rounded-full transition-all border ${
                  i === 0 ? "bg-[#111018] text-white border-[#111018]" : "border-[#E2DDD3] text-[#6B6059] hover:border-[#111018] hover:text-[#111018]"
                }`}>{f}</button>
            ))}
          </div>
        </Reveal>

        {(!jobs || jobs.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-24 bg-[#F7F4EE] rounded-2xl border border-[#E8E2D8] border-dashed">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#6B6059] font-medium text-[14px]">Chưa có dữ liệu việc làm</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
            {/* Large featured card */}
            <Reveal>
              <div className="relative bg-[#111018] text-white rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between p-7 border border-white/5 hover:border-[#D44E2B]/40 transition-all duration-300 min-h-[320px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D44E2B]/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#D44E2B]/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                        style={{ background: LOGO_COL["FPT"] }}>FPT</div>
                      <div>
                        <span className="text-[11px] bg-[#D44E2B]/20 text-[#D44E2B] border border-[#D44E2B]/30 px-2.5 py-0.5 rounded-full font-black">⭐ Nổi bật</span>
                        <p className="text-[13px] text-[#6B6059] mt-1.5 flex items-center gap-1"><MapPin size={11} />Hà Nội</p>
                      </div>
                    </div>
                    <button onClick={() => toggleSave(1)} className="p-2 rounded-lg bg-white/5 hover:bg-white/12 transition-colors">
                      {saved.includes(1) ? <BookmarkCheck size={17} className="text-[#E8A83A]" /> : <Bookmark size={17} className="text-[#5A5048]" />}
                    </button>
                  </div>
                  <h3 className="text-[1.5rem] font-black text-white group-hover:text-[#E8A83A] transition-colors mb-4 leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    Senior React Developer
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "Full-time"].map((t, i) => (
                      <span key={t} className={`text-[12px] px-2.5 py-1 rounded-lg ${i === 3 ? "bg-[#D44E2B]/15 text-[#D44E2B] border border-[#D44E2B]/25" : "bg-white/8 text-[#9B8E7F] border border-white/8"}`}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-between pt-5 border-t border-white/8 mt-6">
                  <div>
                    <p className="text-[11px] text-[#5A5048] mb-0.5">Mức lương</p>
                    <p className="font-black text-[#E8A83A] text-[1.2rem]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      25 – 40 triệu<span className="text-[13px] text-[#5A5048] font-normal">/tháng</span>
                    </p>
                  </div>
                  <button className="flex items-center gap-2 bg-[#D44E2B] hover:bg-[#BF3F1E] text-white font-bold px-5 py-2.5 rounded-xl text-[13px] transition-all shadow-lg shadow-[#D44E2B]/25 group-hover:gap-3">
                    Ứng tuyển <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Stack of smaller cards */}
            <div className="flex flex-col gap-3">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={i * 55}>
                  <div className="bg-[#F7F4EE] hover:bg-white border border-[#E8E2D8] hover:border-[#D44E2B]/30 hover:shadow-lg rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 shadow-sm"
                        style={{ background: LOGO_COL[job.logo] ?? "#D44E2B" }}>{job.logo}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#111018] text-[13.5px] leading-snug group-hover:text-[#D44E2B] transition-colors truncate">{job.title}</h4>
                        <p className="text-[11px] text-[#9B8E7F] mt-0.5 flex items-center gap-1.5">
                          <Building2 size={10} />{job.company}
                          <span className="w-1 h-1 bg-[#C5B8A8] rounded-full" />
                          <MapPin size={10} />{job.location}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[13px] font-black text-[#D44E2B]">{job.salary}</p>
                        <p className="text-[11px] text-[#9B8E7F] mt-0.5">{job.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#EDE9E1]">
                      <div className="flex gap-1.5">
                        {job.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[11px] bg-[#EDE9E1] text-[#6B6059] px-2.5 py-0.5 rounded-md">{t}</span>
                        ))}
                        {job.remote && <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-semibold">Remote</span>}
                        {job.hot && <span className="text-[11px] bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-md font-semibold">Gấp</span>}
                      </div>
                      <span className="text-[11px] text-[#9B8E7F] flex items-center gap-1"><Clock size={10} />{job.posted}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal className="text-center mt-10">
          <a href="#" className="inline-flex items-center gap-2 border-2 border-[#111018] text-[#111018] hover:bg-[#111018] hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all text-[13px] group">
            Xem tất cả 50,000+ việc làm
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
