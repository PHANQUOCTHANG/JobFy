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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "../types";

interface ManageCompanyFormProps {
  initialData?: Company;
}

export const ManageCompanyForm: React.FC<ManageCompanyFormProps> = ({ initialData }) => {
  const { mutate: updateCompany, isPending } = useUpdateMyCompany();

  const form = useForm<CompanyProfileInput>({
    resolver: zodResolver(companyProfileSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      taxCode: initialData?.taxCode || "",
      website: initialData?.website || "",
      foundedYear: initialData?.foundedYear || "" as any,
      size: initialData?.size || undefined,
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

  const onSubmit = (data: CompanyProfileInput) => {
    // Clean empty strings to undefined to match Partial<Company>
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Cover & Logo Preview Section */}
          <div className="relative w-full h-48 bg-slate-100 mb-16">
            {form.watch("coverUrl") ? (
              <img src={form.watch("coverUrl")} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm bg-slate-50 border-b border-slate-200">
                Ảnh bìa công ty
              </div>
            )}
            
            <div className="absolute -bottom-10 left-8">
              <div className="w-24 h-24 bg-white rounded-xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                {form.watch("logoUrl") ? (
                  <img src={form.watch("logoUrl")} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs text-center p-2 font-medium">
                    Logo
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 pt-0 space-y-10">
            {/* THÔNG TIN CƠ BẢN */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Tên công ty <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Công ty Cổ phần Công nghệ JobFy" {...field} />
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
                      <FormLabel>Mã số thuế</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã số thuế" {...field} />
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
                      <FormLabel>Năm thành lập</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ví dụ: 2020" {...field} />
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
                      <FormLabel>Quy mô nhân sự</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quy mô" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                    <FormItem>
                      <FormLabel>Website công ty</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* MÔ TẢ */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Mô tả chi tiết
              </h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn gọn (Slogan/Tagline)</FormLabel>
                      <FormControl>
                        <Input placeholder="Định hình tương lai công nghệ..." {...field} />
                      </FormControl>
                      <FormDescription>Tối đa 255 ký tự, xuất hiện trên card công ty.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả đầy đủ</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Giới thiệu về lịch sử, môi trường làm việc, văn hóa công ty..." 
                          className="min-h-[150px] resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ĐỊA CHỈ & LIÊN HỆ */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Địa chỉ & Truyền thông
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Địa chỉ chi tiết</FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, Tên đường, Phường/Xã..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
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
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* NÚT SUBMIT */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" disabled={isPending} className="px-8 bg-[#1A56DB] hover:bg-[#1447C0]">
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
            
          </div>
        </form>
      </Form>
    </div>
  );
};
