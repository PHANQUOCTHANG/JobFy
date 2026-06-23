import React, { useMemo, useState, useEffect } from "react";
import api from "@/lib/axios";
import { useProvinces, useDistricts, useIndustries, useSkills } from "@/features/companies/hooks/useManageCompany";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any | null;
  onSuccess?: () => void;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({ isOpen, onClose, job, onSuccess }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  // Constants for salary slider
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

  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [salaryMin, setSalaryMin] = useState<number>(20_000_000);
  const [salaryMax, setSalaryMax] = useState<number>(35_000_000);
  const [isSalaryPublic, setIsSalaryPublic] = useState(true);
  const [salaryType, setSalaryType] = useState<string>("monthly");
  const [salaryCurrency, setSalaryCurrency] = useState<string>("VND");
  const [provinceId, setProvinceId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [isRemote, setIsRemote] = useState(false);
  const [jobType, setJobType] = useState<string>("full_time");
  const [experienceLevel, setExperienceLevel] = useState<string>("mid");

  const { data: provinces } = useProvinces() as any;
  const { data: districts } = useDistricts(provinceId ? Number(provinceId) : undefined) as any;
  const { data: industries } = useIndustries() as any;
  const { data: skills } = useSkills() as any;

  const getSliderConfig = () => {
    if (salaryCurrency === "USD") {
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

  useEffect(() => {
    if (isOpen && job) {
      setTitle(job.title || "");
      setCategoryId(job.categoryId ? job.categoryId.toString() : "");
      setDescription(job.description || "");
      setRequirements(job.requirements || "");
      setBenefits(job.benefits || "");
      setSalaryMin(job.salaryMin ?? (job.salaryCurrency === "USD" ? SLIDER_DEFAULT_MIN_USD : SLIDER_DEFAULT_MIN_VND));
      setSalaryMax(job.salaryMax ?? (job.salaryCurrency === "USD" ? SLIDER_DEFAULT_MAX_USD : SLIDER_DEFAULT_MAX_VND));
      setIsSalaryPublic(job.isSalaryPublic ?? true);
      setSalaryType(job.salaryType || "monthly");
      setSalaryCurrency(job.salaryCurrency || "VND");
      setProvinceId(job.provinceId ? job.provinceId.toString() : "");
      setDistrictId(job.districtId ? job.districtId.toString() : "");
      setAddress(job.address || "");
      setQuantity(job.quantity || 1);
      
      if (job.expiresAt) {
        try {
          setExpiresAt(new Date(job.expiresAt).toISOString().split('T')[0]);
        } catch(e) {
          setExpiresAt("");
        }
      } else {
        setExpiresAt("");
      }

      setIsRemote(job.isRemote ?? false);
      setJobType(job.jobType || "full_time");
      setExperienceLevel(job.experienceLevel || "mid");

      if (job.jobSkills) {
        setSelectedSkills(job.jobSkills.map((s: any) => s.skillId.toString()));
      } else {
        setSelectedSkills([]);
      }
    }
  }, [isOpen, job]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  };

  const { min: sliderMinBound, max: sliderMaxBound } = getSliderConfig();
  const sliderMin = clamp(salaryMin, sliderMinBound, sliderMaxBound);
  const sliderMax = clamp(salaryMax, sliderMinBound, sliderMaxBound);

  const handleSave = async () => {
    setIsPublishing(true);
    try {
      if (!categoryId) {
        Swal.fire({ title: "Thiếu thông tin", text: "Vui lòng chọn Lĩnh vực / Ngành nghề", icon: "warning", confirmButtonColor: "#00307c" });
        return;
      }
      if (!title.trim()) {
        Swal.fire({ title: "Thiếu thông tin", text: "Vui lòng nhập Tên vị trí tuyển dụng", icon: "warning", confirmButtonColor: "#00307c" });
        return;
      }
      if (!description.trim()) {
        Swal.fire({ title: "Thiếu thông tin", text: "Vui lòng nhập Mô tả công việc", icon: "warning", confirmButtonColor: "#00307c" });
        return;
      }
      if (!requirements.trim()) {
        Swal.fire({ title: "Thiếu thông tin", text: "Vui lòng nhập Yêu cầu ứng viên", icon: "warning", confirmButtonColor: "#00307c" });
        return;
      }
      if (isNaN(salaryMin) || isNaN(salaryMax)) {
        Swal.fire({ title: "Lỗi", text: "Mức lương tối thiểu và tối đa không hợp lệ.", icon: "error", confirmButtonColor: "#00307c" });
        return;
      }
      if (salaryMin > salaryMax) {
        Swal.fire({ title: "Lỗi", text: "Mức lương tối thiểu không được lớn hơn mức lương tối đa.", icon: "error", confirmButtonColor: "#00307c" });
        return;
      }
      if (!expiresAt) {
        Swal.fire({ title: "Thiếu thông tin", text: "Vui lòng chọn Hạn chót nộp hồ sơ", icon: "warning", confirmButtonColor: "#00307c" });
        return;
      }

      const payload = {
        categoryId: Number(categoryId),
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.trim(),
        benefits: benefits.trim(),
        salaryMin,
        salaryMax,
        salaryType,
        salaryCurrency,
        isRemote,
        isSalaryPublic,
        provinceId: provinceId ? Number(provinceId) : undefined,
        districtId: districtId ? Number(districtId) : undefined,
        address: address.trim() || undefined,
        jobType,
        experienceLevel,
        expiresAt: new Date(expiresAt).toISOString(),
        quantity: Number(quantity || 1),
        metaTitle: title.trim(),
        metaDescription: description.trim().slice(0, 160),
        skillIds: selectedSkills.map(id => Number(id)), // Update request uses skillIds directly
      };

      await api.patch(`/employer/jobs/${job.id}`, payload);

      Swal.fire({ title: "Thành công!", text: "Cập nhật tin tuyển dụng thành công", icon: "success", confirmButtonColor: "#00307c", timer: 1500, showConfirmButton: false });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Cập nhật tin thất bại";
      Swal.fire({ title: "Lỗi!", text: message, icon: "error", confirmButtonColor: "#00307c" });
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#F1F5F9] bg-white flex justify-between items-center z-10 sticky top-0">
          <div>
            <h2 className="text-[20px] font-black text-[#00307c] tracking-tight">Chỉnh sửa tin tuyển dụng</h2>
            <p className="text-[13px] font-semibold text-[#64748B] mt-1 line-clamp-1">{job?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#F1F5F9] rounded-xl transition-all text-[#64748B] hover:text-[#0F172A]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#F8FAFC]">
          <div className="bg-white border border-[#F1F5F9] rounded-[20px] p-6 md:p-8 space-y-8 shadow-sm">

            {/* Row 1: Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">badge</span> Tên vị trí tuyển dụng*
                </label>
                <div className="relative group">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white placeholder:text-[#94A3B8] placeholder:font-medium"
                    placeholder="VD: Senior Frontend Developer"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">category</span> Lĩnh vực / Ngành nghề*
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer appearance-none"
                  >
                    <option value="" disabled hidden>Chọn Lĩnh vực / Ngành nghề</option>
                    {industries?.map((industry: any) => (
                      <option key={industry.id} value={industry.id.toString()}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">subject</span> Mô tả công việc*
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#334155] leading-relaxed resize-y min-h-[140px] bg-[#F8FAFC] focus:bg-white placeholder:text-[#94A3B8]"
                placeholder="Mô tả trách nhiệm và công việc hàng ngày..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">checklist</span> Yêu cầu ứng viên*
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#334155] leading-relaxed bg-[#F8FAFC] focus:bg-white resize-y min-h-[120px] placeholder:text-[#94A3B8]"
                placeholder="Danh sách kỹ năng, bằng cấp và chứng chỉ cần thiết..."
              ></textarea>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">psychology</span> Kỹ năng yêu cầu*
              </label>
              <div className="flex flex-wrap gap-2 mt-2 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl max-h-[180px] overflow-y-auto custom-scrollbar">
                {skills?.map((skill: any) => (
                  <label key={skill.id} className="flex items-center space-x-2 cursor-pointer group bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:border-[#00307c] transition-colors">
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
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c] transition-all"
                    />
                    <span className="text-[13px] font-bold text-[#475569] group-hover:text-[#00307c] transition-colors">{skill.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">card_giftcard</span> Quyền lợi ứng viên*
              </label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#334155] leading-relaxed bg-[#F8FAFC] focus:bg-white resize-y min-h-[100px] placeholder:text-[#94A3B8]"
                placeholder="Các phúc lợi, chế độ bảo hiểm, lộ trình thăng tiến và đãi ngộ..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-3">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">payments</span> Cấu hình mức lương
                </label>
                <div className="space-y-4">
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
                            setSalaryMin(nextMin > salaryMax ? salaryMax : nextMin);
                          }}
                          className="absolute left-0 right-0 w-full top-0"
                        />
                        <input
                          type="range"
                          min={sliderMinBound}
                          max={sliderMaxBound}
                          step={getSliderConfig().step}
                          value={sliderMax}
                          onChange={(e) => {
                            const nextMax = Number(e.target.value);
                            setSalaryMax(nextMax < salaryMin ? salaryMin : nextMax);
                          }}
                          className="absolute left-0 right-0 w-full top-0"
                        />
                      </div>
                    </div>
                    <div className="text-[13px] font-black text-[#00307c]">
                      Từ {formatCurrency(salaryMin)} - Đến {formatCurrency(salaryMax)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#94A3B8] ml-1">Loại</label>
                      <div className="relative">
                        <select
                          value={salaryType}
                          onChange={(e) => setSalaryType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[12px] font-bold text-[#0F172A] bg-[#F8FAFC] appearance-none"
                        >
                          <option value="monthly">Theo tháng</option>
                          <option value="hourly">Theo giờ</option>
                          <option value="yearly">Theo năm</option>
                          <option value="daily">Theo ngày</option>
                          <option value="negotiable">Theo hợp đồng</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#94A3B8] ml-1">Tiền tệ</label>
                      <div className="relative">
                        <select
                          value={salaryCurrency}
                          onChange={(e) => setSalaryCurrency(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[12px] font-bold text-[#0F172A] bg-[#F8FAFC] appearance-none"
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      checked={isSalaryPublic}
                      onChange={(e) => setIsSalaryPublic(e.target.checked)}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c] transition-all"
                      type="checkbox"
                    />
                    <span className="text-[13px] font-bold text-[#475569]">Công khai lương</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c] transition-all"
                      type="checkbox"
                    />
                    <span className="text-[13px] font-bold text-[#475569]">Remote</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span> Kinh nghiệm
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] cursor-pointer appearance-none"
                >
                  <option value="intern">Thực tập sinh</option>
                  <option value="fresher">Mới tốt nghiệp / Chưa có kinh nghiệm</option>
                  <option value="junior">Junior (Dưới 2 năm kinh nghiệm)</option>
                  <option value="mid">Mid (2-4 năm kinh nghiệm)</option>
                  <option value="senior">Senior (Trên 5 năm kinh nghiệm)</option>
                  <option value="lead">Trưởng nhóm kỹ thuật / Team Lead</option>
                  <option value="manager">Trưởng phòng / Quản lý</option>
                  <option value="director">Giám đốc bộ phận</option>
                  <option value="executive">Giám đốc điều hành / C-level</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">work_history</span> Loại hình
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] cursor-pointer appearance-none"
                >
                  <option value="full-time">Toàn thời gian</option>
                  <option value="part-time">Bán thời gian</option>
                  <option value="contract">Hợp đồng / Dự án ngắn hạn</option>
                  <option value="internship">Thực tập sinh</option>
                  <option value="freelance">Làm tự do</option>
                  <option value="remote">Làm việc từ xa hoàn toàn</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">groups</span> Số lượng
                </label>
                <input
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value || 1))}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC]"
                  min="1"
                  type="number"
                />
              </div>
            </div>

            {/* Row: Location & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">map</span> Tỉnh / Thành phố
                </label>
                <select
                  value={provinceId}
                  onChange={(e) => {
                    setProvinceId(e.target.value);
                    setDistrictId("");
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] appearance-none"
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {provinces?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">location_city</span> Quận / Huyện
                </label>
                <select
                  value={districtId}
                  disabled={!provinceId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] appearance-none disabled:opacity-50"
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts?.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">home_pin</span> Địa chỉ chi tiết
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] placeholder:text-[#94A3B8]"
                  placeholder="Số nhà, tên đường..."
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">event_busy</span> Hạn chót nộp*
                </label>
                <input
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC]"
                  type="date"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#F1F5F9] bg-white flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isPublishing}
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-white bg-[#00307c] hover:bg-[#00225c] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
            Lưu thay đổi
          </button>
        </div>

        {/* Custom CSS for slider inside modal */}
        <style>{`
          .range-slider-container input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 16px;
            position: absolute;
            background: transparent;
            pointer-events: none;
          }
          .range-slider-container input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: #00307c;
            border: 2px solid #fff;
            border-radius: 50%;
            cursor: grab;
            pointer-events: auto;
            margin-top: -6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </div>
    </div>
  );
};
