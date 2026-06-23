import React from "react";
import { useCandidateDetail } from "../../hooks/useCandidates";

interface Props {
  applicationId: string | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating: boolean;
}

export const ResumeViewerModal: React.FC<Props> = ({ applicationId, onClose, onUpdateStatus, isUpdating }) => {
  const { data: detail, isLoading } = useCandidateDetail(applicationId);

  if (!applicationId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <h2 className="text-xl font-bold text-[#0F172A]">Chi tiết hồ sơ ứng viên</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu hồ sơ...</p>
            </div>
          ) : detail ? (
            <>
              {/* Left Column: Profile Info */}
              <div className="w-1/3 bg-[#F8FAFC] border-r border-[#E2E8F0] overflow-y-auto p-6 scrollbar-thin">
                <div className="flex flex-col items-center text-center mb-6">
                  <img 
                    src={detail.candidate.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.candidate.fullName)}&background=00307c&color=fff`} 
                    alt={detail.candidate.fullName} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
                  />
                  <h3 className="text-xl font-bold text-[#0F172A]">{detail.candidate.fullName}</h3>
                  <p className="text-slate-500 font-medium">{detail.job.title}</p>
                  
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <a href={`mailto:${detail.candidate.user.email}`} className="flex items-center gap-1 text-[13px] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">mail</span>
                      Gửi Email
                    </a>
                    {detail.candidate.user.phone && (
                      <a href={`tel:${detail.candidate.user.phone}`} className="flex items-center gap-1 text-[13px] text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">call</span>
                        Gọi điện
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Info Box */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
                    <h4 className="text-[13px] font-black uppercase text-slate-400 tracking-wider mb-3">Thông tin cơ bản</h4>
                    <ul className="space-y-3 text-[14px]">
                      <li className="flex gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                        <span className="text-slate-700 font-medium">{detail.candidate.user.email}</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">call</span>
                        <span className="text-slate-700 font-medium">{detail.candidate.user.phone || "Chưa cập nhật"}</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">location_on</span>
                        <span className="text-slate-700 font-medium">{detail.candidate.address || "Chưa cập nhật"}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Skills from First Resume */}
                  {detail.candidate.resumes?.[0] && (
                    <>
                      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <h4 className="text-[13px] font-black uppercase text-slate-400 tracking-wider mb-3">Kỹ năng</h4>
                        <div className="flex flex-wrap gap-2">
                          {detail.candidate.resumes[0].skills?.map((s: any, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[13px] font-bold">
                              {s.skill?.name || "Skill"}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <h4 className="text-[13px] font-black uppercase text-slate-400 tracking-wider mb-3">Kinh nghiệm làm việc</h4>
                        <div className="space-y-4">
                          {detail.candidate.resumes[0].experiences?.map((exp: any, idx: number) => (
                            <div key={idx} className="relative pl-4 border-l-2 border-blue-100">
                              <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-1.5"></div>
                              <h5 className="font-bold text-slate-800">{exp.jobTitle}</h5>
                              <p className="text-[13px] text-slate-500 font-medium">{exp.companyName}</p>
                              <p className="text-[12px] text-slate-400 mt-1">
                                {new Date(exp.startDate).toLocaleDateString("vi-VN")} - {exp.isCurrent ? "Hiện tại" : new Date(exp.endDate).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                          ))}
                          {(!detail.candidate.resumes[0].experiences || detail.candidate.resumes[0].experiences.length === 0) && (
                            <p className="text-slate-500 text-[13px] italic">Không có dữ liệu kinh nghiệm.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: PDF Viewer */}
              <div className="flex-1 bg-slate-100 relative">
                {(detail.resume?.fileUrl || detail.candidate.resumes?.[0]?.fileUrl) ? (
                  <iframe 
                    src={`${detail.resume?.fileUrl || detail.candidate.resumes[0].fileUrl}#toolbar=0`} 
                    className="w-full h-full"
                    title="Resume PDF"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[64px] mb-4 opacity-50">description</span>
                    <p className="font-medium text-lg">Ứng viên chưa đính kèm file CV PDF.</p>
                    <p className="text-[14px]">Vui lòng xem thông tin tóm tắt bên trái.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
              <span className="material-symbols-outlined text-[48px] mb-4">error</span>
              <p className="font-medium">Không thể tải dữ liệu hồ sơ.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#F1F5F9] px-6 py-4 flex justify-end gap-3 bg-white">
          <button 
            disabled={isUpdating || detail?.status === 'rejected'}
            onClick={() => onUpdateStatus(applicationId, 'rejected')}
            className="px-6 py-2.5 text-[15px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all disabled:opacity-50"
          >
            Từ chối
          </button>
          <button 
            disabled={isUpdating || detail?.status === 'interviewed'}
            onClick={() => onUpdateStatus(applicationId, 'interviewed')}
            className="px-8 py-2.5 text-[15px] font-bold text-white bg-[#00307c] hover:bg-[#002568] rounded-xl transition-all shadow-[0_4px_12px_rgba(0,48,124,0.2)] disabled:opacity-70 disabled:shadow-none"
          >
            Hẹn phỏng vấn
          </button>
        </div>

      </div>
    </div>
  );
};
