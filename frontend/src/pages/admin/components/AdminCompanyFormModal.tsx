import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const companySchema = z.object({
  name: z.string().min(1, "Tên công ty là bắt buộc"),
  website: z.string().optional(),
  size: z.string().optional(),
  industryId: z.string().optional(),
  shortDescription: z.string().optional(),
  address: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface AdminCompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: any | null;
  onSubmit: (id: string, data: Partial<CompanyFormValues>) => void;
  isPending?: boolean;
}

const formatCompanySizeForSelect = (prismaSize: string | undefined | null): string | undefined => {
  if (!prismaSize) return undefined;
  return prismaSize.replace('value_', '');
};

const AdminCompanyFormModal: React.FC<AdminCompanyFormModalProps> = ({
  isOpen,
  onClose,
  company,
  onSubmit,
  isPending,
}) => {
  const { data: industries } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/industries");
      return res.data.data;
    },
    enabled: isOpen,
  });

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      website: "",
      size: "",
      industryId: "",
      shortDescription: "",
      address: "",
    },
  });

  useEffect(() => {
    if (company && isOpen) {
      form.reset({
        name: company.name || "",
        website: company.website || "",
        size: formatCompanySizeForSelect(company.size) || "",
        industryId: company.industryId ? company.industryId.toString() : "",
        shortDescription: company.shortDescription || "",
        address: company.address || "",
      });
    }
  }, [company, isOpen, form]);

  const handleSubmit = (values: CompanyFormValues) => {
    if (!company) return;
    const cleanedData: any = { ...values };
    if (cleanedData.industryId) cleanedData.industryId = Number(cleanedData.industryId);
    if (!cleanedData.industryId) delete cleanedData.industryId;
    if (cleanedData.size) cleanedData.size = `value_${cleanedData.size}`;
    
    onSubmit(company.id, cleanedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="p-6 bg-muted/30 border-b border-border/50">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            Chỉnh sửa thông tin Công ty
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm">
            Admin có quyền ghi đè thay đổi các thông tin cơ bản của công ty.
          </DialogDescription>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} id="admin-company-form" className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase text-muted-foreground">Tên công ty *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên công ty..." className="rounded-xl h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase text-muted-foreground">Ngành nghề</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-11">
                            <SelectValue placeholder="Chọn ngành nghề" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {industries?.map((ind: any) => (
                            <SelectItem key={ind.id} value={ind.id.toString()}>{ind.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase text-muted-foreground">Quy mô</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-11">
                            <SelectValue placeholder="Chọn quy mô" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
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
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase text-muted-foreground">Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="rounded-xl h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase text-muted-foreground">Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ chi tiết..." className="rounded-xl h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase text-muted-foreground">Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Giới thiệu sơ lược về công ty..." className="rounded-xl resize-none min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="p-4 bg-muted/30 border-t border-border/50 flex justify-end gap-3">
          <Button variant="outline" className="rounded-xl font-medium" onClick={onClose}>Hủy bỏ</Button>
          <Button 
            type="submit" 
            form="admin-company-form"
            className="rounded-xl font-bold"
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCompanyFormModal;
