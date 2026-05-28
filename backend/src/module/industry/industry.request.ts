import { z } from "zod";

// Schema base dùng chung cho tất cả industries
const industryBase = z.object({
  name: z.string().trim().min(2, "Tên ngành nghề tối thiểu 2 ký tự").max(150, "Tên ngành nghề tối đa 150 ký tự"),
  iconUrl: z.string().url("Icon URL không hợp lệ").max(500).nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// Validation tạo ngành nghề mới (dành cho Admin)
export const CreateIndustrySchema = industryBase.partial({
  iconUrl: true,
  isActive: true,
  sortOrder: true,
});

// Validation cập nhật ngành nghề (Admin)
export const UpdateIndustrySchema = industryBase.partial();

// Validation ID parameter
export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID phải là số nguyên dương").transform(Number),
});

export type CreateIndustryRequestDto = z.infer<typeof CreateIndustrySchema>;
export type UpdateIndustryRequestDto = z.infer<typeof UpdateIndustrySchema>;
