import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { companyProfileSchema, CompanyProfileInput } from "../schemas/company.schema";
import { useUpdateMyCompany } from "../hooks/useManageCompany";

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
import { Button } from "@/components/ui/button";
import { Company } from "../types";

interface ManageCompanyFormProps {
  initialData?: Company;
}

export const ManageCompanyForm: React.FC<ManageCompanyFormProps> = ({ initialData }) => {
  const { mutate: updateCompany, isPending } = useUpdateMyCompany();

  const form = useForm<CompanyProfileInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(companyProfileSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      taxCode: initialData?.taxCode || "",
      website: initialData?.website || "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      foundedYear: initialData?.foundedYear || "" as any,
      size: initialData?.size || undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      industryId: initialData?.industryId || "" as any,
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provinceId: initialData?.provinceId || "" as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      districtId: initialData?.districtId || "" as any,
      address: initialData?.address || "",
      facebookUrl: initialData?.facebookUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      logoUrl: initialData?.logoUrl || "",
      coverUrl: initialData?.coverUrl || "",
    },
  });

  const onSubmit = (data: CompanyProfileInput) => {
    const cleanedData: Partial<Company> = {
      ...data,
      foundedYear: data.foundedYear === "" ? undefined : data.foundedYear,
      industryId: data.industryId === "" ? undefined : data.industryId,
      provinceId: data.provinceId === "" ? undefined : data.provinceId,
      districtId: data.districtId === "" ? undefined : data.districtId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    
    updateCompany(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
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

        <section className="bg-white border border-[#F1F5F9] rounded-3xl overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="h-48 relative bg-[#F8FAFC] group">
            {form.watch("coverUrl") ? (
              <img alt="Company Cover" className="w-full h-full object-cover opacity-80" src={form.watch("coverUrl")} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#64748B]">
                <span className="material-symbols-outlined text-4xl opacity-20">image</span>
              </div>
            )}
            <button type="button" className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[#0F172A] text-[13px] font-bold flex items-center gap-2 hover:bg-white shadow-sm transition-all border border-white/50">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Thay đổi ảnh bìa
            </button>
          </div>
          <div className="px-8 pb-8 relative">
            <div className="relative -top-12 flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-28 h-28 rounded-2xl bg-white p-2 shadow-lg border border-[#F1F5F9] relative group">
                {form.watch("logoUrl") ? (
                  <img alt="Logo" className="w-full h-full object-contain rounded-xl" src={form.watch("logoUrl")} />
                ) : (
                  <div className="w-full h-full bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#94A3B8]">
                    <span className="material-symbols-outlined text-3xl">domain</span>
                  </div>
                )}
                <button type="button" className="absolute inset-0 bg-[#0F172A]/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-white text-[28px]">photo_camera</span>
                </button>
              </div>
              <div className="flex-1 mb-2">
                <h3 className="text-[20px] font-black text-[#0F172A]">Nhận diện thương hiệu</h3>
                <p className="text-[13px] font-medium text-[#64748B] italic mt-1">Kích thước khuyên dùng cho logo: 400x400px. Định dạng: PNG, SVG.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
               <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Logo URL</FormLabel>
                      <FormControl>
                        <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Cover Image URL</FormLabel>
                      <FormControl>
                        <Input className="h-12 rounded-xl border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20" placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>
        </section>

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
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mã số thuế</FormLabel>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <section className="bg-white border border-[#F1F5F9] rounded-3xl p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-8 border-l-4 border-emerald-500 pl-4">
            <h3 className="text-[20px] font-black text-[#0F172A]">Văn hóa & Môi trường</h3>
            <button type="button" className="text-[#00307c] font-bold text-[14px] flex items-center gap-1.5 hover:underline transition-all">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Thêm ảnh mới
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative aspect-square rounded-2xl overflow-hidden border border-[#F1F5F9]">
              <img alt="Culture" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLiVxdhIY8umUiBLsAvWQPVI5DnnN1cERctweXp8rNVRUKykH3fYdrQEWMPZYSFzELPDR9MV8a5gq5BfbjGwvGODTZ6w9Lddgfd0u8WhrGyN5a5zZW_HZ3PMgoNjsqD_UU1PAB2OhwXkHXPh_CddVPn74UsZL0xoj4sAM4zOhKt6k0fXGrKWGwwatEif7XssbkLASQ33uKQCvXgE-jR_NiSjNgbaOqpNfsfxQfBk5bYWgojhtzIY2EhjXFG1zpHWd7iaDUdChv-hk"/>
              <div className="absolute inset-0 bg-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <button type="button" className="p-2 bg-white rounded-full text-[#64748B] hover:text-rose-600 shadow-sm"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                <button type="button" className="p-2 bg-white rounded-full text-[#64748B] hover:text-[#00307c] shadow-sm"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
              </div>
            </div>
            
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
