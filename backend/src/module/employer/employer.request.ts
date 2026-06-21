import { z } from "zod";

// Khớp với Enum CompanySize trong database
const CompanySizeEnum = z.enum(['1_10', '11_50', '51_200', '201_500', '501_1000', '1001_5000', '5000_plus']);

// Schema cho Bước 2: Cập nhật thông tin cơ bản
export const updateCompanyInfoSchema = z.object({
  name: z.string().min(5, "Tên công ty phải từ 5 ký tự").max(255),
  industryId: z.number().int().positive("Vui lòng chọn lĩnh vực hoạt động"),
  address: z.string().min(10, "Địa chỉ chi tiết quá ngắn"),
  provinceId: z.number().int(),
  districtId: z.number().int(),
  website: z.string().url("Định dạng website không hợp lệ").or(z.literal("")).nullable().optional(),
  size: CompanySizeEnum.optional(),
  description: z.string().optional(),
  logoUrl: z.string().url("Định dạng logo không hợp lệ").optional().or(z.literal("")),
  taxCode: z.string().regex(/^[0-9]{10,13}$/, "Mã số thuế phải từ 10-13 chữ số").or(z.literal("")).nullable().optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).nullable().optional(),
  shortDescription: z.string().max(500, "Mô tả ngắn không được vượt quá 500 ký tự").nullable().optional(),
  facebookUrl: z.string().url("URL Facebook không hợp lệ").or(z.literal("")).nullable().optional(),
  linkedinUrl: z.string().url("URL LinkedIn không hợp lệ").or(z.literal("")).nullable().optional(),
  coverUrl: z.string().url("URL ảnh bìa không hợp lệ").or(z.literal("")).nullable().optional(),
});

// Schema cho Bước 3: Hồ sơ pháp lý
export const submitLegalDocsSchema = z.object({
  taxCode: z.string().regex(/^[0-9]{10,13}$/, "Mã số thuế phải từ 10-13 chữ số"),
  businessLicenseUrl: z.string().url("Cần tải lên bản quét giấy phép hợp lệ"),
});

export type UpdateCompanyInfoRequest = z.infer<typeof updateCompanyInfoSchema>;
export type SubmitLegalDocsRequest = z.infer<typeof submitLegalDocsSchema>;