import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      setTimeout(() => {
        navigate(`/employer/${EMPLOYER_PATHS.JOBS}`);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      <header className="flex justify-between items-center w-full px-6 md:px-8 h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-all border border-[#E2E8F0] shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h2 className="text-[18px] font-black text-[#00307c] leading-none">Đăng tin tuyển dụng mới</h2>
        </div>
      </header>

      <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar animate-fade-in relative">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between relative px-4">
            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-[#E2E8F0] -z-10 -translate-y-1/2"></div>
            <div className="flex flex-col items-center bg-[#F8FAFC] px-4">
              <div className="w-10 h-10 rounded-full bg-[#00307c] text-white flex items-center justify-center font-bold mb-2 shadow-sm">1</div>
              <span className="text-[11px] font-black text-[#00307c] uppercase tracking-wider">THÔNG TIN CƠ BẢN</span>
            </div>
            <div className="flex flex-col items-center bg-[#F8FAFC] px-4">
              <div className="w-10 h-10 rounded-full bg-white text-[#64748B] flex items-center justify-center font-bold mb-2 border border-[#E2E8F0]">2</div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">CHI TIẾT</span>
            </div>
            <div className="flex flex-col items-center bg-[#F8FAFC] px-4">
              <div className="w-10 h-10 rounded-full bg-white text-[#64748B] flex items-center justify-center font-bold mb-2 border border-[#E2E8F0]">3</div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">CÀI ĐẶT</span>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 space-y-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Tên vị trí tuyển dụng*</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white" 
                  placeholder="VD: Senior Frontend Developer" 
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Lĩnh vực / Ngành nghề*</label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer">
                  <option>Công nghệ thông tin</option>
                  <option>Marketing & Bán hàng</option>
                  <option>Nhân sự</option>
                  <option>Tài chính & Ngân hàng</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Mô tả công việc*</label>
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white focus-within:border-[#00307c] focus-within:ring-2 focus-within:ring-[#00307c]/20 transition-all">
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-2 flex items-center space-x-1 overflow-x-auto">
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
                  <div className="h-5 w-px bg-[#CBD5E1] mx-1"></div>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">image</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">code</span></button>
                </div>
                <textarea 
                  className="w-full p-4 border-none focus:ring-0 text-[14px] text-[#0F172A] resize-y min-h-[160px] outline-none" 
                  placeholder="Mô tả trách nhiệm và công việc hàng ngày..." 
                ></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Yêu cầu ứng viên*</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white resize-y min-h-[120px]" 
                placeholder="Danh sách kỹ năng, bằng cấp và chứng chỉ cần thiết..." 
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Mức lương</label>
                <div className="flex items-center space-x-2">
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white" 
                    placeholder="Tối thiểu" 
                    type="text"
                  />
                  <span className="text-[#94A3B8]">-</span>
                  <input 
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white" 
                    placeholder="Tối đa" 
                    type="text"
                  />
                </div>
                <label className="flex items-center space-x-2 mt-2 cursor-pointer w-fit">
                  <input className="rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]" type="checkbox" />
                  <span className="text-[13px] font-medium text-[#475569]">Thỏa thuận</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Kinh nghiệm</label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer">
                  <option>Mới đi làm / Thực tập</option>
                  <option>1-3 năm kinh nghiệm</option>
                  <option>3-5 năm kinh nghiệm</option>
                  <option>Trên 5 năm</option>
                  <option>Quản lý / Giám đốc</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Số lượng tuyển</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white" 
                  min="1" 
                  type="number" 
                  defaultValue="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Địa điểm làm việc</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px]">location_on</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white" 
                    placeholder="Quận 1, TP. Hồ Chí Minh" 
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">Hạn chót nộp hồ sơ</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px]">calendar_today</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white" 
                    type="date"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
              <span className="material-symbols-outlined text-[#00307c] text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <div>
                <p className="text-[13px] font-black text-blue-900 mb-0.5">Tối ưu nội dung bằng AI</p>
                <p className="text-[13px] text-blue-800/80 font-medium leading-relaxed">Chúng tôi nhận thấy mức lương bạn đưa ra khá cạnh tranh. Thêm "Thời gian làm việc linh hoạt" có thể tăng lượt ứng tuyển lên 15%.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pb-10">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 text-[#64748B] hover:bg-[#E2E8F0] rounded-xl transition-colors text-[14px] font-black"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Hủy bỏ</span>
            </button>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button className="flex-grow sm:flex-grow-0 px-6 py-3 border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] hover:border-[#CBD5E1] rounded-xl text-[14px] font-black text-[#475569] transition-all">
                Lưu nháp
              </button>
              <button 
                onClick={handlePublish}
                disabled={isPublishing || isPublished}
                className={`flex-grow sm:flex-grow-0 px-8 py-3 text-white rounded-xl text-[14px] font-black transition-all shadow-[0_6px_16px_-4px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(0,48,124,0.5)] flex items-center justify-center gap-2 min-w-[160px] ${
                  isPublished ? "bg-emerald-600 shadow-[0_6px_16px_-4px_rgba(5,150,105,0.4)]" : "bg-gradient-to-r from-[#00307c] to-[#0047b3]"
                }`}
              >
                {isPublishing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    Đang đăng...
                  </>
                ) : isPublished ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Đã đăng!
                  </>
                ) : (
                  "Đăng tin ngay"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none z-0">
        <span className="material-symbols-outlined text-[200px] text-[#00307c] select-none">architecture</span>
      </div>
    </div>
  );
};

export default CreateJobPage;
