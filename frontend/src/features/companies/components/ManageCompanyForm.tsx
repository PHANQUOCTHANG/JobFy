import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { companyProfileSchema, CompanyProfileInput } from "../schemas/company.schema";
import { 
  useUpdateMyCompany, 
  useIndustries, 
  useProvinces, 
  useDistricts 
} from "../hooks/useManageCompany";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "../types";
import { Button } from "@/components/ui/button"; // Đảm bảo import đúng Button

interface ManageCompanyFormProps {
  initialData?: Company;
}

// Helper function to format Prisma CompanySize enum for frontend Select component
const formatCompanySizeForSelect = (prismaSize: string | undefined | null): string | undefined => {
  if (!prismaSize) return undefined;
  return prismaSize.replace('value_', ''); // Converts "value_1_10" to "1_10"
};

export const ManageCompanyForm: React.FC<ManageCompanyFormProps> = ({ initialData }) => {
  const { mutate: updateCompany, isPending } = useUpdateMyCompany();
  
  // Fetch data for select fields
  const { data: industries, isLoading: isLoadingIndustries } = useIndustries();
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  
  const form = useForm<CompanyProfileInput>({
    resolver: zodResolver(companyProfileSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      taxCode: initialData?.taxCode || "",
      website: initialData?.website || "",
      foundedYear: initialData?.foundedYear || "" as any, // Giữ nguyên
      size: formatCompanySizeForSelect(initialData?.size) || undefined, // Áp dụng hàm chuyển đổi
      industryId: initialData?.industryId || "" as any,
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      provinceId: initialData?.provinceId || "" as any,
      districtId: initialData?.districtId || "" as any,
      address: initialData?.address || "",
      facebookUrl: initialData?.facebookUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      logoUrl: initialData?.logoUrl || "",
      coverUrl: initialData?.coverUrl || "",
    },
  });

  const selectedProvinceId = form.watch("provinceId");
  const { data: districts, isLoading: isLoadingDistricts } = useDistricts(selectedProvinceId ? Number(selectedProvinceId) : undefined);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleUpload = async (file: File, type: "logo" | "cover") => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      if (type === "logo") setIsUploadingLogo(true);
      else setIsUploadingCover(true);

      const resp = await api.post("/employer/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const url = resp.data.data.url;
      if (type === "logo") {
        form.setValue("logoUrl", url);
      } else {
        form.setValue("coverUrl", url);
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      else setIsUploadingCover(false);
      
      // Reset input value to allow selecting the same file again
      if (type === "logo" && logoInputRef.current) logoInputRef.current.value = "";
      if (type === "cover" && coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const onSubmit = (data: CompanyProfileInput) => {
    const cleanedData: Partial<Company> = {
      ...data,
      foundedYear: data.foundedYear === "" ? undefined : data.foundedYear,
      industryId: data.industryId === "" ? undefined : data.industryId,
      provinceId: data.provinceId === "" ? undefined : data.provinceId,
      districtId: data.districtId === "" ? undefined : data.districtId,
    } as any;
    
    updateCompany(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* ACTION HEADER FOR FORM - Since it's sticky, we can just put the submit button prominently here or at bottom */}
        <div className="flex justify-end mb-4">
          <button 
            type="submit" 
            disabled={isPending}
            className="px-6 py-2.5 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-xl font-bold shadow-[0_8px_20px_-6px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                Lưu thay đổi
              </>
            )}
          </button>
        </div>

        {/* Brand Identity Section */}
        <section className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Cover Image Area */}
          <div className="h-[240px] relative bg-gradient-to-r from-blue-50 to-indigo-50 group">
            {form.watch("coverUrl") ? (
              <img alt="Company Cover" className="w-full h-full object-cover" src={form.watch("coverUrl")} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-blue-300">
                <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center backdrop-blur-sm shadow-sm mb-3">
                  <span className="material-symbols-outlined text-[40px] text-blue-400">landscape</span>
                </div>
                <p className="font-semibold text-blue-400/80 text-sm">Chưa có ảnh bìa</p>
              </div>
            )}
            
            {/* Cover Upload Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={(e) => e.target.files && handleUpload(e.target.files[0], "cover")} />
              <button 
                onClick={(e) => { e.preventDefault(); coverInputRef.current?.click() }} 
                disabled={isUploadingCover} 
                className="bg-white/95 backdrop-blur-md hover:bg-white text-[#0F172A] px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-80 border border-white/50"
              >
                {isUploadingCover ? <Loader2 className="w-5 h-5 animate-spin text-[#00307c]" /> : <span className="material-symbols-outlined text-[20px] text-[#00307c]">add_photo_alternate</span>}
                {isUploadingCover ? "Đang tải ảnh bìa lên..." : "Tải ảnh bìa mới"}
              </button>
            </div>
            
            {/* Gradient bottom shadow to blend with content */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          </div>

          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative -top-16">
              
              {/* Logo Area */}
              <div className="relative group z-10">
                <div className="w-36 h-36 rounded-3xl bg-white p-2 shadow-xl border-4 border-white relative overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
                  {form.watch("logoUrl") ? (
                    <img alt="Logo" className="w-full h-full object-contain rounded-2xl bg-white" src={form.watch("logoUrl")} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-2xl flex flex-col items-center justify-center text-[#94A3B8]">
                      <span className="material-symbols-outlined text-[48px] text-[#CBD5E1] mb-1">storefront</span>
                    </div>
                  )}
                  
                  {/* Logo Upload Overlay */}
                  <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => e.target.files && handleUpload(e.target.files[0], "logo")} />
                  <div className="absolute inset-0 bg-[#0F172A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm rounded-2xl cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                    <div className="flex flex-col items-center text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      {isUploadingLogo ? <Loader2 className="w-8 h-8 animate-spin mb-2" /> : <span className="material-symbols-outlined text-[32px] mb-1">linked_camera</span>}
                      <span className="text-[12px] font-bold tracking-wide">{isUploadingLogo ? "ĐANG TẢI..." : "THAY LOGO"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Text Info */}
              <div className="flex-1 text-center md:text-left pt-2 md:pt-16 pb-2">
                <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight">{form.watch("name") || "Tên công ty"}</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-2">
                  <span className="text-[14px] font-medium text-[#64748B] flex items-center justify-center md:justify-start gap-1">
                    <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                    Nhận diện thương hiệu
                  </span>
                  <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#E2E8F0]"></span>
                  <p className="text-[13px] text-[#94A3B8]">Khuyên dùng logo <span className="font-semibold text-[#64748B]">400x400px</span> (PNG, SVG)</p>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* General Info Form */}
        <section className="bg-white border border-[#F1F5F9] rounded-3xl p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-8 border-l-4 border-[#00307c] pl-4">
            <h3 className="text-[20px] font-black text-[#0F172A]">Thông tin chung</h3>
            <span className="material-symbols-outlined text-[#94A3B8] text-[20px] cursor-help" title="Thông tin này sẽ hiển thị công khai trên trang tuyển dụng của bạn">info</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Tên công ty <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="Ví dụ: JobFy Solutions Global" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="industryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Lĩnh vực hoạt động <span className="text-rose-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isLoadingIndustries}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20">
                        <SelectValue placeholder={isLoadingIndustries ? "Đang tải..." : "Chọn lĩnh vực"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-[#E2E8F0] shadow-xl">
                      {industries?.map((industry: any) => (
                        <SelectItem key={industry.id} value={industry.id.toString()}>
                          {industry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mã số thuế (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="Nhập mã số thuế" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foundedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Năm thành lập</FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" type="number" placeholder="Ví dụ: 2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Quy mô nhân sự</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}> {/* Sử dụng 'value' thay vì 'defaultValue' để đảm bảo component được kiểm soát */}
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20">
                        <SelectValue placeholder="Chọn quy mô" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-[#E2E8F0] shadow-xl">
                      <SelectItem value="1_10">1 - 10 nhân viên</SelectItem>
                      <SelectItem value="11_50">11 - 50 nhân viên</SelectItem>
                      <SelectItem value="51_200">51 - 200 nhân viên</SelectItem>
                      <SelectItem value="201_500">201 - 500 nhân viên</SelectItem>
                      <SelectItem value="501_1000">501 - 1000 nhân viên</SelectItem>
                      <SelectItem value="1001_5000">1001 - 5000 nhân viên</SelectItem>
                      <SelectItem value="5000_plus">5000+ nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provinceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Tỉnh / Thành phố <span className="text-rose-500">*</span></FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("districtId", ""); // Reset district when province changes
                  }} value={field.value?.toString()} disabled={isLoadingProvinces}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20">
                        <SelectValue placeholder={isLoadingProvinces ? "Đang tải..." : "Chọn Tỉnh/Thành phố"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-[#E2E8F0] shadow-xl">
                      {provinces?.map((province: any) => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Quận / Huyện <span className="text-rose-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={!selectedProvinceId || isLoadingDistricts}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20">
                        <SelectValue placeholder={!selectedProvinceId ? "Chọn Tỉnh/Thành phố trước" : isLoadingDistricts ? "Đang tải..." : "Chọn Quận/Huyện"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-[#E2E8F0] shadow-xl">
                      {districts?.map((district: any) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Địa chỉ chi tiết <span className="text-rose-500">*</span></FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="Số nhà, tên đường, phường/xã..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Website chính thức</FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mô tả ngắn gọn (Slogan/Tagline)</FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="Định hình tương lai công nghệ..." {...field} />
                  </FormControl>
                  <FormDescription className="text-[12px] font-medium text-[#94A3B8]">Tối đa 255 ký tự, xuất hiện trên card công ty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Giới thiệu chi tiết</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Giới thiệu về lịch sử, môi trường làm việc, văn hóa công ty..." 
                      className="min-h-[160px] resize-y rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 p-4"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Culture & Environment Section */}
        <section className="bg-white border border-[#F1F5F9] rounded-3xl p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-8 border-l-4 border-emerald-500 pl-4">
            <h3 className="text-[20px] font-black text-[#0F172A]">Văn hóa & Môi trường</h3>
            <button type="button" className="text-[#00307c] font-bold text-[14px] flex items-center gap-1.5 hover:underline transition-all">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Thêm ảnh mới
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Hardcoded sample images to match the UI mockup */}
            <div className="group relative aspect-square rounded-2xl overflow-hidden border border-[#F1F5F9]">
              <img alt="Culture" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLiVxdhIY8umUiBLsAvWQPVI5DnnN1cERctweXp8rNVRUKykH3fYdrQEWMPZYSFzELPDR9MV8a5gq5BfbjGwvGODTZ6w9Lddgfd0u8WhrGyN5a5zZW_HZ3PMgoNjsqD_UU1PAB2OhwXkHXPh_CddVPn74UsZL0xoj4sAM4zOhKt6k0fXGrKWGwwatEif7XssbkLASQ33uKQCvXgE-jR_NiSjNgbaOqpNfsfxQfBk5bYWgojhtzIY2EhjXFG1zpHWd7iaDUdChv-hk"/>
              <div className="absolute inset-0 bg-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <button type="button" className="p-2 bg-white rounded-full text-[#64748B] hover:text-rose-600 shadow-sm"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                <button type="button" className="p-2 bg-white rounded-full text-[#64748B] hover:text-[#00307c] shadow-sm"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
              </div>
            </div>
            
            {/* NÚT SUBMIT */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" disabled={isPending} className="px-8 bg-[#4F46E5] hover:bg-[#4338CA]">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thông tin công ty
                  </>
                )}
              </Button>
            </div>
            
            <div className="aspect-square border-2 border-dashed border-[#CBD5E1] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#00307c] hover:bg-blue-50 transition-all cursor-pointer group bg-[#F8FAFC]">
              <span className="material-symbols-outlined text-[#94A3B8] text-[32px] group-hover:text-[#00307c]">upload_file</span>
              <span className="text-[13px] font-bold text-[#64748B] group-hover:text-[#00307c]">Tải lên ảnh</span>
            </div>
          </div>
        </section>

      </form>
    </Form>
  );
};
