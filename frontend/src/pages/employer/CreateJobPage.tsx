import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import api from "@/lib/axios";
import { useMyCompany, useProvinces, useDistricts, useIndustries, useSkills } from "@/features/companies/hooks/useManageCompany";
import { toast } from "sonner";
import { employerApi } from "@/types/employerApi"; // Import employerApi
import { Loader2 } from "lucide-react"; // Đã thêm import Loader2

const CreateJobPage = () => {
  const navigate = useNavigate();

  const { data: myCompany } = useMyCompany();
  const companyId = myCompany?.id;

  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Constants for salary slider
  // Tùy theo currency, slider sẽ dùng ngưỡng khác nhau.
  // - VND: 0 -> 200,000,000 bước 1,000,000
  // - USD: 0 -> 10,000 bước 100
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



  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState(""); // Changed to number
  const [benefits, setBenefits] = useState("");
  const [salaryMin, setSalaryMin] = useState<number>(20_000_000); // Changed to number, with default
  const [salaryMax, setSalaryMax] = useState<number>(35_000_000); // Changed to number, with default
  const [isSalaryPublic, setIsSalaryPublic] = useState(true);
  const [salaryType, setSalaryType] = useState<string>("monthly");
  const [salaryCurrency, setSalaryCurrency] = useState<string>("VND");
  const [provinceId, setProvinceId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [isRemote, setIsRemote] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [jobType, setJobType] = useState<
    | "full_time"
    | "part_time"
    | "contract"
    | "internship"
    | "freelance"
    | "remote"
  >("full_time");
  const [experienceLevel, setExperienceLevel] = useState<
    | "intern"
    | "fresher"
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "manager"
    | "director"
    | "executive"
  >("mid");

  const { data: provinces } = useProvinces() as any;
  const { data: districts } = useDistricts(provinceId ? Number(provinceId) : undefined) as any;
  const { data: industries } = useIndustries() as any;
  const { data: skills } = useSkills() as any;

  // Fetch verification progress
  const { data: verificationProgress, isLoading: isLoadingVerification } = useQuery({
    queryKey: ["employer-verification-progress"],
    queryFn: employerApi.getProgress,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const industryId = useMemo(() => {
    // Theo useManageCompany.ts: payload có industryId, nên myCompany nhiều khả năng có industryId.
    return myCompany?.industryId ? Number(myCompany.industryId) : 1;
  }, [myCompany]);

  // Reset salaryMin and salaryMax when salaryCurrency changes
  useEffect(() => {
    if (salaryCurrency === "USD") {
      setSalaryMin(SLIDER_DEFAULT_MIN_USD);
      setSalaryMax(SLIDER_DEFAULT_MAX_USD);
    } else { // VND
      setSalaryMin(SLIDER_DEFAULT_MIN_VND);
      setSalaryMax(SLIDER_DEFAULT_MAX_VND);
    }
  }, [salaryCurrency]);

  const isFullyVerified = useMemo(() => {
    if (!verificationProgress) return false;
    return verificationProgress.step1.isCompleted && verificationProgress.step2.isCompleted && verificationProgress.step3.isVerified;
  }, [verificationProgress]);


  const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  };


  const { min: sliderMinBound, max: sliderMaxBound, step: sliderStep } = getSliderConfig();
  const sliderMin = clamp(salaryMin, sliderMinBound, sliderMaxBound);
  const sliderMax = clamp(salaryMax, sliderMinBound, sliderMaxBound);
  const normalizedSliderMin = Math.min(sliderMin, sliderMax);
  const normalizedSliderMax = Math.max(sliderMin, sliderMax);



  const handlePublish = async (targetStatus: "draft" | "published" = "published") => {
    setStatus(targetStatus);

    if (targetStatus === "published" && !isFullyVerified) {
      toast.error("Bạn cần hoàn tất xác thực doanh nghiệp để đăng tin tuyển dụng.", {
        description: "Vui lòng truy cập trang Cài đặt để hoàn tất các bước xác thực.",
      });
      return;
    }

    setIsPublishing(true);
    setIsPublished(false);
    try {

      if (!companyId) {
        toast.error("Chưa lấy được thông tin công ty của bạn. Vui lòng thử lại sau.");
        return;
      }
      if (!categoryId) {
        toast.error("Vui lòng chọn Lĩnh vực / Ngành nghề");
        return;
      }
      if (!title.trim()) {
        toast.error("Vui lòng nhập Tên vị trí tuyển dụng");
        return;
      }
      if (!description.trim()) {
        toast.error("Vui lòng nhập Mô tả công việc");
        return;
      }
      if (!requirements.trim()) {
        toast.error("Vui lòng nhập Yêu cầu ứng viên");
        return;
      }
      // Validation for salary (now numbers)
      if (isNaN(salaryMin) || isNaN(salaryMax)) {
        toast.error("Mức lương tối thiểu và tối đa không hợp lệ.");
        return;
      }
      if (salaryMin > salaryMax) {
        toast.error("Mức lương tối thiểu không được lớn hơn mức lương tối đa.");
        return;
      }
      if (!expiresAt) {
        toast.error("Vui lòng chọn Hạn chót nộp hồ sơ");
        return;
      }

      const payload = {
        companyId,
        categoryId: Number(categoryId),
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.trim(),
        benefits: benefits.trim(),
        salaryMin, // Already a number
        salaryMax, // Already a number
        salaryType,
        salaryCurrency,
        isRemote,
        isSalaryPublic,
        provinceId: provinceId ? Number(provinceId) : undefined,
        districtId: districtId ? Number(districtId) : undefined,
        address: address.trim() || undefined,
        jobType,
        experienceLevel,
        industryId,
        expiresAt: new Date(expiresAt).toISOString(),
        status: targetStatus,
        quantity: Number(quantity || 1),
        metaTitle: title.trim(),
        metaDescription: description.trim().slice(0, 160),
        skills: selectedSkills.map(id => ({ skillId: Number(id), isRequired: true })),
      };

      const { data } = await api.post("/jobs", payload);
      const created = data?.data;

      setIsPublished(true);
      toast.success("Tạo tin tuyển dụng thành công");

      // nếu backend trả về job id/slug bạn có thể redirect chi tiết; hiện redirect danh sách.
      setTimeout(() => {
        navigate(`/employer/${EMPLOYER_PATHS.JOBS}`);
      }, 600);

      return created;
    } catch (err: any) {
      const message = err?.response?.data?.message || "Tạo tin thất bại";
      toast.error(message);
      setIsPublishing(false);
      setIsPublished(false);
    }
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

      <div className="p-6 md:p-10 flex-grow overflow-y-auto custom-scrollbar animate-fade-in relative">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Job Creation Card */}
          {!isFullyVerified && (
            <div className="bg-rose-50 text-rose-800 p-5 rounded-2xl flex gap-4 items-center border border-rose-200 shadow-sm">
              <span className="material-symbols-outlined text-rose-600 text-[24px] shrink-0">info</span>
              <div>
                <p className="text-[15px] font-black uppercase tracking-tight">Chưa xác thực doanh nghiệp</p>
                <p className="text-[13px] font-medium opacity-80">Bạn cần hoàn tất xác thực doanh nghiệp tại trang <a href="/employer/settings" className="underline font-bold text-rose-700 hover:text-rose-900">Cài đặt</a> để có thể đăng tin tuyển dụng.</p>
              </div>
            </div>
          )}


          <div className="bg-white border border-[#F1F5F9] rounded-[24px] p-6 md:p-10 space-y-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)]">

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
                    className="w-full pl-4 pr-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14.5px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white placeholder:text-[#94A3B8] placeholder:font-medium"
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
                    className="w-full px-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14.5px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer appearance-none"
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
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white focus-within:border-[#00307c] focus-within:ring-4 focus-within:ring-[#00307c]/5 transition-all">
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-3 py-2.5 flex items-center space-x-1 overflow-x-auto">
                  <button className="p-2 hover:bg-[#E2E8F0] rounded-xl text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
                  <div className="h-5 w-px bg-[#CBD5E1] mx-1"></div>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">image</span></button>
                  <button className="p-1.5 hover:bg-[#E2E8F0] rounded-lg text-[#64748B] transition-colors"><span className="material-symbols-outlined text-[18px]">code</span></button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-5 border-none focus:ring-0 text-[14.5px] font-medium text-[#334155] leading-relaxed resize-y min-h-[180px] outline-none placeholder:text-[#94A3B8]"
                  placeholder="Mô tả trách nhiệm và công việc hàng ngày..."
                ></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">checklist</span> Yêu cầu ứng viên*
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14.5px] font-medium text-[#334155] leading-relaxed bg-[#F8FAFC] focus:bg-white resize-y min-h-[140px] placeholder:text-[#94A3B8]"
                placeholder="Danh sách kỹ năng, bằng cấp và chứng chỉ cần thiết..."
              ></textarea>
            </div>

            {/* Row: Skills */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">psychology</span> Kỹ năng yêu cầu*
              </label>
              <div className="flex flex-wrap gap-3 mt-2 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl max-h-[200px] overflow-y-auto">
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

            {/* Row: Benefits */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                <span className="material-symbols-outlined text-[18px]">card_giftcard</span> Quyền lợi ứng viên*
              </label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14.5px] font-medium text-[#334155] leading-relaxed bg-[#F8FAFC] focus:bg-white resize-y min-h-[120px] placeholder:text-[#94A3B8]"
                placeholder="Các phúc lợi, chế độ bảo hiểm, lộ trình thăng tiến và đãi ngộ..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-3">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">payments</span> Cấu hình mức lương
                </label>
                <div className="space-y-4">
                  {/* Double slider (only slider, no input number) */}
                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div className="text-[10px] font-bold text-[#94A3B8]">
                        {formatCurrency(getSliderConfig().min)}+
                      </div>
                      <div className="text-[10px] font-bold text-[#94A3B8]">{formatCurrency(getSliderConfig().max)}</div>
                    </div>

                    <div className="relative" aria-label="Mức lương">

                      {/* Range track */}
                      <div className="h-2 rounded-full bg-[#E2E8F0]" />

                      {/* Active range overlay */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-[#00307c]"
                        style={{
                          left: `${((sliderMin - sliderMinBound) / (sliderMaxBound - sliderMinBound)) * 100}%`,
                          width: `${((sliderMax - sliderMin) / (sliderMaxBound - sliderMinBound)) * 100}%`,
                        }}
                      />

                      {/* Sliders */}
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
                            setSalaryMax(nextMax < salaryMin ? salaryMin : nextMax);
                          }}
                          className="absolute left-0 right-0 w-full top-0"
                          aria-label="Mức lương tối đa"
                        />
                      </div>
                    </div>


                    <div className="text-[13.5px] font-black text-[#00307c]">
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
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] appearance-none cursor-pointer"
                        >
                          <option value="monthly">Theo tháng</option>
                          <option value="hourly">Theo giờ</option>
                          <option value="yearly">Theo năm</option>
                          <option value="daily">Theo ngày</option>
                          <option value="negotiable">Theo hợp đồng</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px] pointer-events-none">expand_more</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#94A3B8] ml-1">Tiền tệ</label>
                      <div className="relative">
                        <select
                          value={salaryCurrency}
                          onChange={(e) => setSalaryCurrency(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[13px] font-bold text-[#0F172A] bg-[#F8FAFC] appearance-none cursor-pointer"
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px] pointer-events-none">expand_more</span>
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
                    <span className="text-[13px] font-bold text-[#475569] group-hover:text-[#00307c] transition-colors">Công khai lương</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      checked={isRemote}
                      onChange={(e) => setIsRemote(e.target.checked)}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c] transition-all"
                      type="checkbox"
                    />
                    <span className="text-[13px] font-bold text-[#475569] group-hover:text-[#00307c] transition-colors">Remote</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span> Kinh nghiệm
                </label>
                <div className="relative">
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer appearance-none"
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
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">work_history</span> Loại hình
                </label>
                <div className="relative">
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer appearance-none"
                  >
                    <option value="full-time">Toàn thời gian</option>
                    <option value="part-time">Bán thời gian</option>
                    <option value="contract">Hợp đồng / Dự án ngắn hạn</option>
                    <option value="internship">Thực tập sinh</option>
                    <option value="freelance">Làm tự do</option>
                    <option value="remote">Làm việc từ xa hoàn toàn</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">groups</span> Số lượng
                </label>
                <div className="relative">
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value || 1))}
                    className="w-full pl-4 pr-10 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white"
                    min="1"
                    type="number"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] material-symbols-outlined text-[18px]">person</span>
                </div>
              </div>
            </div>

            {/* Row 5: Location & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">map</span> Tỉnh / Thành phố
                </label>
                <div className="relative">
                  <select
                    value={provinceId}
                    onChange={(e) => {
                      setProvinceId(e.target.value);
                      setDistrictId("");
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer appearance-none"
                  >
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">location_city</span> Quận / Huyện
                </label>
                <div className="relative">
                  <select
                    value={districtId}
                    disabled={!provinceId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white cursor-pointer disabled:opacity-50 appearance-none"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">home_pin</span> Địa chỉ chi tiết
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white placeholder:text-[#94A3B8]"
                  placeholder="Số nhà, tên đường..."
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-[#64748B] uppercase tracking-widest flex items-center gap-2 ml-1">
                  <span className="material-symbols-outlined text-[18px]">event_busy</span> Hạn chót nộp*
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px]">calendar_today</span>
                  <input
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-4 focus:ring-[#00307c]/5 outline-none transition-all text-[14px] font-bold text-[#0F172A] bg-[#F8FAFC] focus:bg-white"
                    type="date"
                  />
                </div>
              </div>
            </div>

            {/* AI Suggestion Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[20px] p-5 flex items-start space-x-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#00307c] shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <p className="text-[14px] font-black text-blue-900 mb-1">Trình tối ưu hóa AI</p>
                <p className="text-[13.5px] text-blue-800/80 font-semibold leading-relaxed">
                  Mẹo: Các vị trí <span className="text-[#00307c] font-black">"{title || 'Tuyển dụng'}"</span> có mô tả chi tiết trên 500 từ thường thu hút ứng viên chất lượng hơn 30%.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pb-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-6 py-3 text-[#64748B] hover:bg-[#F1F5F9] rounded-2xl transition-all text-[14.5px] font-black"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              <span>Hủy bỏ</span>
            </button>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button
                onClick={() => handlePublish("draft")}
                className="flex-1 sm:flex-grow-0 px-8 py-3.5 border-2 border-[#E2E8F0] hover:bg-white hover:border-[#00307c] hover:text-[#00307c] rounded-2xl text-[14.5px] font-black text-[#475569] transition-all whitespace-nowrap"
              >
                Lưu bản nháp
              </button>
              <button
                onClick={() => handlePublish("published")}
                disabled={isPublishing || isPublished || !isFullyVerified || isLoadingVerification}
                className={`flex-grow sm:flex-grow-0 px-10 py-3.5 text-white rounded-2xl text-[14.5px] font-black transition-all shadow-[0_10px_20px_-6px_rgba(0,48,124,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(0,48,124,0.4)] flex items-center justify-center gap-2 min-w-[200px] ${isPublished ? "bg-emerald-600" : "bg-gradient-to-r from-[#00307c] to-[#0052cc]"
                  }`}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Đang xử lý...
                  </>
                ) : isPublished ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    Đã hoàn tất
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                    Đăng tuyển ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Overlay Decor */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none z-0">
        <span className="material-symbols-outlined text-[300px] text-[#00307c] select-none">draw</span>
      </div>

      {/* Custom CSS for range slider thumbs */}
      <style>{`
        .range-slider-container input[type="range"] {
          -webkit-appearance: none; /* Hides the slider track and thumb */
          width: 100%; /* Full-width */
          height: 20px; /* Adjust height for easier interaction */
          position: absolute;
          background: transparent; /* Make the track transparent */
          pointer-events: none; /* Allow clicks/drags to pass through to the thumb */
        }

        .range-slider-container input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; /* Override default look */
          width: 20px; /* Set a specific slider thumb size */
          height: 20px;
          background: #00307c; /* Thumb color */
          border: 2px solid #fff; /* White border */
          border-radius: 50%; /* Make it circular */
          cursor: grab;
          pointer-events: auto; /* Make thumb interactive */
          margin-top: -8px; /* Adjust to center vertically on the track */
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
    </div>
  );
};

export default CreateJobPage;
