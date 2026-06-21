import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSkills } from "@/features/companies/hooks/useManageCompany";

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onSuccess: () => void;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({ isOpen, onClose, job, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: skills } = useSkills() as any;
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const SLIDER_MIN_VALUE_VND = 0;
  const SLIDER_MAX_VALUE_VND = 200_000_000;
  const SLIDER_STEP_VND = 1_000_000;

  const SLIDER_DEFAULT_MIN_VND = 20_000_000;
  const SLIDER_DEFAULT_MAX_VND = 35_000_000;

  const SLIDER_MIN_VALUE_USD = 0;
  const SLIDER_MAX_VALUE_USD = 10_000;
  const SLIDER_STEP_USD = 50;

  const SLIDER_DEFAULT_MIN_USD = 2000;
  const SLIDER_DEFAULT_MAX_USD = 4000;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: "VND",
    jobType: "full_time",
    experienceLevel: "mid",
    address: "",
    expiresAt: "",
    status: "published"
  });

  useEffect(() => {
    if (job && isOpen) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        salaryMin: job.salaryMin || 0,
        salaryMax: job.salaryMax || 0,
        salaryCurrency: job.salaryCurrency || "VND",
        jobType: job.jobType || "full_time",
        experienceLevel: job.experienceLevel || "mid",
        address: job.address || "",
        expiresAt: job.expiresAt ? job.expiresAt.split("T")[0] : "",
        status: job.status || "published"
      });
      setSelectedSkills(job.skills ? job.skills.map((s: any) => s.id.toString()) : []);
    }
  }, [job, isOpen]);

  const getSliderConfig = () => {
    if (formData.salaryCurrency === "USD") {
      return {
        min: SLIDER_MIN_VALUE_USD,
        max: SLIDER_MAX_VALUE_USD,
        step: SLIDER_STEP_USD,
      };
    }

    return {
      min: SLIDER_MIN_VALUE_VND,
      max: SLIDER_MAX_VALUE_VND,
      step: SLIDER_STEP_VND,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  };

  const { min: sliderMinBound, max: sliderMaxBound, step: sliderStep } = getSliderConfig();
  const sliderMin = clamp(Number(formData.salaryMin), sliderMinBound, sliderMaxBound);
  const sliderMax = clamp(Number(formData.salaryMax), sliderMinBound, sliderMaxBound);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        salaryCurrency: formData.salaryCurrency,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        address: formData.address,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        status: formData.status,
        skills: selectedSkills.map(id => ({ skillId: Number(id), isRequired: true }))
      };

      await api.patch(`/jobs/${job.id}`, payload);
      toast.success("Cập nhật tin tuyển dụng thành công");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-[24px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between bg-white relative z-10">
          <div>
            <h2 className="text-[22px] font-black text-[#0F172A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00307c] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>edit_square</span>
              Chỉnh sửa tin tuyển dụng
            </h2>
            <p className="text-[14px] text-[#64748B] font-medium mt-1">Cập nhật thông tin chi tiết cho vị trí tuyển dụng này</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          <form id="editJobForm" onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-[#F1F5F9] shadow-sm">
            
            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">badge</span> Tên vị trí <span className="text-rose-500">*</span>
              </label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-bold text-[#0F172A]" placeholder="VD: Senior Frontend Developer" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">work_history</span> Loại hình
                </label>
                <div className="relative">
                  <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14px] font-bold text-[#0F172A] appearance-none cursor-pointer bg-white">
                    <option value="full_time">Toàn thời gian</option>
                    <option value="part_time">Bán thời gian</option>
                    <option value="remote">Làm việc từ xa hoàn toàn</option>
                    <option value="internship">Thực tập sinh</option>
                    <option value="contract">Hợp đồng / Dự án</option>
                    <option value="freelance">Làm tự do</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span> Kinh nghiệm
                </label>
                <div className="relative">
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14px] font-bold text-[#0F172A] appearance-none cursor-pointer bg-white">
                    <option value="intern">Thực tập sinh</option>
                    <option value="fresher">Mới tốt nghiệp / Chưa có kinh nghiệm</option>
                    <option value="junior">Junior (Dưới 2 năm)</option>
                    <option value="mid">Mid-level (2-4 năm)</option>
                    <option value="senior">Senior (Trên 5 năm)</option>
                    <option value="lead">Lead / Trưởng nhóm</option>
                    <option value="manager">Quản lý</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">payments</span> Cấu hình mức lương
              </label>
              <div className="space-y-4 bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0]">
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div className="text-[10px] font-bold text-[#94A3B8]">
                      {formatCurrency(getSliderConfig().min)}+
                    </div>
                    <div className="text-[10px] font-bold text-[#94A3B8]">{formatCurrency(getSliderConfig().max)}</div>
                  </div>

                  <div className="relative" aria-label="Mức lương">
                    <div className="h-2 rounded-full bg-[#E2E8F0]" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#00307c]"
                      style={{
                        left: `${((sliderMin - sliderMinBound) / (sliderMaxBound - sliderMinBound)) * 100}%`,
                        width: `${((sliderMax - sliderMin) / (sliderMaxBound - sliderMinBound)) * 100}%`,
                      }}
                    />
                    <div className="range-slider-container relative mt-[-10px]">
                      <input
                        type="range"
                        min={sliderMinBound}
                        max={sliderMaxBound}
                        step={getSliderConfig().step}
                        value={sliderMin}
                        onChange={(e) => {
                          const nextMin = Number(e.target.value);
                          setFormData(prev => ({ ...prev, salaryMin: nextMin > Number(prev.salaryMax) ? Number(prev.salaryMax) : nextMin }));
                        }}
                        className="absolute left-0 right-0 w-full top-0"
                        aria-label="Mức lương tối thiểu"
                      />

                      <input
                        type="range"
                        min={sliderMinBound}
                        max={sliderMaxBound}
                        step={getSliderConfig().step}
                        value={sliderMax}
                        onChange={(e) => {
                          const nextMax = Number(e.target.value);
                          setFormData(prev => ({ ...prev, salaryMax: nextMax < Number(prev.salaryMin) ? Number(prev.salaryMin) : nextMax }));
                        }}
                        className="absolute left-0 right-0 w-full top-0"
                        aria-label="Mức lương tối đa"
                      />
                    </div>
                  </div>

                  <div className="text-[13.5px] font-black text-[#00307c] text-center pt-2">
                    Từ {formatCurrency(sliderMin)} - Đến {formatCurrency(sliderMax)}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
                  <div className="w-1/3 relative min-w-[120px]">
                    <select 
                      name="salaryCurrency" 
                      value={formData.salaryCurrency} 
                      onChange={(e) => {
                        const newCurrency = e.target.value;
                        handleChange(e);
                        // Reset min/max when currency changes
                        if (newCurrency === "USD") {
                          setFormData(prev => ({ ...prev, salaryMin: SLIDER_DEFAULT_MIN_USD, salaryMax: SLIDER_DEFAULT_MAX_USD, salaryCurrency: "USD" }));
                        } else {
                          setFormData(prev => ({ ...prev, salaryMin: SLIDER_DEFAULT_MIN_VND, salaryMax: SLIDER_DEFAULT_MAX_VND, salaryCurrency: "VND" }));
                        }
                      }} 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[13px] font-bold text-[#0F172A] appearance-none cursor-pointer bg-white"
                    >
                      <option value="VND">VND</option>
                      <option value="USD">USD</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span> Địa chỉ chi tiết
              </label>
              <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14px] font-bold text-[#0F172A]" placeholder="VD: 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">event_busy</span> Hạn chót
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">calendar_today</span>
                  <input type="date" name="expiresAt" value={formData.expiresAt} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14px] font-bold text-[#0F172A]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">toggle_on</span> Trạng thái
                </label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14px] font-bold text-[#0F172A] appearance-none cursor-pointer bg-white">
                    <option value="published">Đang hoạt động</option>
                    <option value="draft">Bản nháp</option>
                    <option value="paused">Tạm dừng</option>
                    <option value="closed">Đã đóng</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">subject</span> Mô tả công việc <span className="text-rose-500">*</span>
              </label>
              <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-4 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#334155] min-h-[140px] resize-y" placeholder="Mô tả chi tiết công việc..." />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">checklist</span> Yêu cầu ứng viên
              </label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full p-4 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#334155] min-h-[120px] resize-y" placeholder="Danh sách kỹ năng, bằng cấp..." />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">card_giftcard</span> Quyền lợi
              </label>
              <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="w-full p-4 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#334155] min-h-[120px] resize-y" placeholder="Các phúc lợi, đãi ngộ..." />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">psychology</span> Kỹ năng yêu cầu
              </label>
              <div className="p-4 rounded-xl border border-[#E2E8F0] focus-within:border-[#00307c] focus-within:ring-4 focus-within:ring-[#00307c]/10 bg-white transition-all">
                <div className="flex flex-wrap gap-3">
                  {skills?.map((skill: any) => (
                    <label key={skill.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        value={skill.id}
                        checked={selectedSkills.includes(skill.id.toString())}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, val]);
                          } else {
                            setSelectedSkills(selectedSkills.filter(id => id !== val));
                          }
                        }}
                        className="w-4 h-4 rounded text-[#00307c] border-[#CBD5E1] focus:ring-[#00307c]/20 transition-all cursor-pointer"
                      />
                      <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#0F172A] transition-colors select-none">
                        {skill.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#F1F5F9] flex justify-end gap-3 bg-white relative z-10">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors text-[14.5px]">
            Hủy bỏ
          </button>
          <button type="submit" form="editJobForm" disabled={isSubmitting} className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#00307c] to-[#0052cc] hover:shadow-[0_10px_20px_-6px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 transition-all flex items-center gap-2 text-[14.5px] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none">
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[20px]">save</span>
            )}
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Custom CSS for range slider thumbs */}
      <style>{`
        .range-slider-container input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 20px;
          position: absolute;
          background: transparent;
          pointer-events: none;
        }

        .range-slider-container input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #00307c;
          border: 2px solid #fff;
          border-radius: 50%;
          cursor: grab;
          pointer-events: auto;
          margin-top: -8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .range-slider-container input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #00307c;
          border: 2px solid #fff;
          border-radius: 50%;
          cursor: grab;
          pointer-events: auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>,
    document.body
  );
};
