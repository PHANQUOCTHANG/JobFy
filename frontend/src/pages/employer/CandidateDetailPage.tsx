import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CandidateDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("Đang xem xét");
  const [interviewType, setInterviewType] = useState<"online" | "offline">("offline");
  const [rating, setRating] = useState(4);
  const [softSkill, setSoftSkill] = useState("Xuất sắc");
  const [attitude, setAttitude] = useState("Tích cực");
  const [note, setNote] = useState("");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-all border border-[#E2E8F0] shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h2 className="text-[18px] font-black text-[#00307c] leading-none">Chi tiết ứng viên</h2>
            <span className="text-[12px] font-medium text-[#64748B] mt-0.5">
              ID: #{id || "CAN-9921"} • Nguyễn Thị Thu Thảo
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#F1F5F9] px-4 py-2 rounded-full border border-[#E2E8F0]">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Trạng thái:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-[14px] font-bold text-[#00307c] py-0 pr-6 cursor-pointer outline-none"
            >
              <option>Đang xem xét</option>
              <option>Phỏng vấn vòng 1</option>
              <option>Phỏng vấn vòng 2</option>
              <option>Gửi Offer</option>
              <option>Đã tuyển</option>
              <option>Từ chối</option>
            </select>
          </div>
          <button className="w-9 h-9 flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-all">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        <section className="flex-[1.2] flex flex-col bg-white rounded-2xl border border-[#F1F5F9] overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">picture_as_pdf</span>
              <span className="text-[14px] font-black text-[#0F172A]">Nguyen_Thu_Thao_CV.pdf</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] rounded-lg transition-all">
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] rounded-lg transition-all">
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] rounded-lg transition-all">
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#E8EDF5]/50 overflow-y-auto p-4 sm:p-8 flex justify-center items-start custom-scrollbar">
            <div className="w-full max-w-[560px] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.12)] p-6 sm:p-8 rounded-xl border border-[#F1F5F9] h-fit">
              <div className="flex gap-5 items-start border-b border-[#F1F5F9] pb-5 mb-5">
                <div className="w-20 h-20 bg-[#E5EEFF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#00307c] text-[40px]">person</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-[22px] font-black text-[#00307c]">NGUYỄN THỊ THU THẢO</h3>
                  <p className="text-[14px] font-bold text-[#475569]">Senior Frontend Developer</p>
                  <div className="flex gap-3 text-[12px] font-medium text-[#64748B]">
                    <span>thuthao.dev@email.com</span>
                    <span>|</span>
                    <span>090 456 7890</span>
                    <span>|</span>
                    <span>TP. Hồ Chí Minh</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <section>
                  <h4 className="text-[12px] font-black text-[#00307c] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-[#E5EEFF]"></div>
                    Kinh nghiệm làm việc
                    <div className="h-px flex-1 bg-[#E5EEFF]"></div>
                  </h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-[#00307c]/30 pl-4 hover:border-[#00307c] transition-colors group">
                      <p className="text-[14px] font-black text-[#0F172A] group-hover:text-[#00307c] transition-colors">Senior Frontend Developer tại TechVN Corp</p>
                      <p className="text-[12px] font-bold text-[#94A3B8] mb-1">2021 - Hiện tại</p>
                      <p className="text-[13px] text-[#475569] leading-relaxed">
                        Phát triển và duy trì hệ thống Fintech phục vụ 2M+ người dùng. Dẫn dắt team 5 developer, thiết lập quy trình CI/CD và design system với React + TypeScript.
                      </p>
                    </div>
                    <div className="border-l-4 border-[#00307c]/20 pl-4 opacity-70">
                      <p className="text-[14px] font-black text-[#0F172A]">Frontend Developer tại Creative Agency</p>
                      <p className="text-[12px] font-bold text-[#94A3B8]">2019 - 2021</p>
                      <p className="text-[13px] text-[#475569]">Xây dựng các landing page và web app cho khách hàng doanh nghiệp vừa và nhỏ.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[12px] font-black text-[#00307c] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-[#E5EEFF]"></div>
                    Kỹ năng
                    <div className="h-px flex-1 bg-[#E5EEFF]"></div>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "React / Next.js", level: 95 },
                      { label: "TypeScript", level: 90 },
                      { label: "Tailwind CSS", level: 88 },
                      { label: "AWS / Cloud", level: 72 },
                    ].map((skill) => (
                      <div key={skill.label}>
                        <div className="flex justify-between text-[12px] font-bold mb-1">
                          <span className="text-[#0F172A]">{skill.label}</span>
                          <span className="text-[#00307c]">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-[#00307c] to-[#0052cc] h-full rounded-full"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-[12px] font-black text-[#00307c] uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-[#E5EEFF]"></div>
                    Học vấn
                    <div className="h-px flex-1 bg-[#E5EEFF]"></div>
                  </h4>
                  <div className="border-l-4 border-[#00307c]/20 pl-4">
                    <p className="text-[14px] font-black text-[#0F172A]">Kỹ sư Công nghệ thông tin</p>
                    <p className="text-[12px] font-bold text-[#94A3B8]">ĐH Bách Khoa TP.HCM • 2015 - 2019</p>
                    <p className="text-[13px] text-[#475569] mt-0.5">GPA: 3.7/4.0 — Tốt nghiệp Xuất sắc</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-1 min-w-[340px]">
          <div className="bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2 mb-5 text-[#00307c]">
              <span className="material-symbols-outlined text-[22px]">assignment</span>
              <h3 className="text-[16px] font-black">Biểu mẫu đánh giá</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Kiến thức chuyên môn</label>
                <div className="flex gap-2">
                  {[3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setRating(val)}
                      className={`flex-1 py-3 rounded-xl text-[13px] font-black border-2 transition-all ${
                        rating === val
                          ? "border-[#00307c] bg-blue-50 text-[#00307c]"
                          : "border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {val}/5
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Kỹ năng mềm</label>
                  <select
                    value={softSkill}
                    onChange={(e) => setSoftSkill(e.target.value)}
                    className="w-full rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-bold text-[#0F172A] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all p-2.5"
                  >
                    <option>Xuất sắc</option>
                    <option>Tốt</option>
                    <option>Khá</option>
                    <option>Trung bình</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Thái độ</label>
                  <select
                    value={attitude}
                    onChange={(e) => setAttitude(e.target.value)}
                    className="w-full rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-bold text-[#0F172A] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all p-2.5"
                  >
                    <option>Tích cực</option>
                    <option>Trung lập</option>
                    <option>Cần cải thiện</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Ghi chú phỏng vấn</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập nhận xét chi tiết về ứng viên..."
                  className="w-full rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all min-h-[80px] p-3 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F1F5F9] border-l-4 border-l-emerald-500 p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">calendar_today</span>
              <h3 className="text-[16px] font-black text-[#0F172A]">Lịch hẹn phỏng vấn</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Thời gian</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all p-2.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Hình thức</label>
                <div className="flex bg-[#F1F5F9] rounded-xl p-1">
                  <button
                    onClick={() => setInterviewType("offline")}
                    className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
                      interviewType === "offline" ? "bg-white shadow-sm text-[#0F172A]" : "text-[#64748B]"
                    }`}
                  >
                    Trực tiếp
                  </button>
                  <button
                    onClick={() => setInterviewType("online")}
                    className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
                      interviewType === "online" ? "bg-white shadow-sm text-[#0F172A]" : "text-[#64748B]"
                    }`}
                  >
                    Trực tuyến
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Người phỏng vấn</label>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZZGA35rbgXQ8HUasKsaTMLFr18wMKLt9frneKpnibzTCkIaTVihFugslkPHngTlxPJZAs-jGOQt-6tZ22uwIWSXnxOtoXcrJ0ikX1gUBaKqEljnP-yJaFGwS8dT8mkTDv0Fq65Zyln_MS2LRxugSiXMrZL6ifP4l99PmGxAKGE4izQDkvOTYQJdVQXLXvbr6ZGx8WC89acWR0jQY8YP2z4HgLH2rUxz77EiV3vOMH8qZrbfQpuNRKc7ZaH3YomeM49sbEqJwa1E"
                      alt="Interviewer 1"
                    />
                    <img
                      className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7VC7wTu7BHahQ3TAz7ecZBgx72QxeQkDF-FpQ1Gx2MbhBZFkzXJcXljvrce3FuQV-U4wSUSFlhEq6Ltkly9U_mw9B3oqsKp48jUXFrWYuxiKhMAV97LfRRfeKo_ZUfKh8Z9Z7zDAb3VZ3IgSaa9Hoj47GYZqKQK0PzY7cHROfYHNmIWDen4c2skDarnGVUTIQaM1uxnkGEmevbdb_zK2Mg3HsqvJgvyc3Lbctdr1-P0IpHQ9jw73HURCEMpGLdIigXJDENp2k-h0"
                      alt="Interviewer 2"
                    />
                    <button className="w-9 h-9 rounded-full border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:border-[#00307c] hover:text-[#00307c] transition-colors">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                  <span className="text-[12px] font-bold text-[#64748B]">2 người tham gia</span>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">
                  {interviewType === "offline" ? "Địa điểm" : "Link họp"}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                    {interviewType === "offline" ? "location_on" : "videocam"}
                  </span>
                  <input
                    type="text"
                    defaultValue={interviewType === "offline" ? "Phòng họp Sigma, Tầng 12" : "https://meet.google.com/..."}
                    className="w-full pl-9 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/30 rounded-2xl border border-blue-100 p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-[#00307c]">
                <span className="material-symbols-outlined text-[22px]">payments</span>
                <h3 className="text-[16px] font-black">Thỏa thuận Offer</h3>
              </div>
              <span className="px-2.5 py-1 bg-[#00307c] text-white text-[10px] font-black rounded-md uppercase tracking-wider">Bản nháp</span>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Mức lương (Net)</label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[12px] font-bold">VND</span>
                    <input
                      type="text"
                      defaultValue="35,000,000"
                      className="w-full rounded-xl border-[#E2E8F0] bg-white text-[13px] font-black text-[#0F172A] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all p-2.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="w-full rounded-xl border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all p-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-wider mb-2 block">Quyền lợi bổ sung</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Bảo hiểm PVI", checked: true },
                    { label: "WFH 2 ngày/tuần", checked: true },
                    { label: "Cấp MacBook Pro", checked: false },
                  ].map((benefit) => (
                    <label
                      key={benefit.label}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full text-[12px] font-bold cursor-pointer hover:border-[#00307c] transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={benefit.checked}
                        className="rounded text-[#00307c] focus:ring-[#00307c] border-[#CBD5E1]"
                      />
                      <span className="text-[#475569]">{benefit.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-2xl text-[14px] font-black shadow-[0_6px_16px_-4px_rgba(0,48,124,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(0,48,124,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">send</span>
              Gửi Phê Duyệt
            </button>
            <button className="px-6 py-3 border-2 border-[#E2E8F0] text-[#475569] rounded-2xl text-[14px] font-bold hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all">
              Lưu nháp
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
