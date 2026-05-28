import { z } from "zod";

// Schema base dùng chung cho tất cả skill categories
const skillCategoryBase = z.object({
  name: z.string().trim().min(2, "Tên nhóm kỹ năng tối thiểu 2 ký tự").max(100, "Tên nhóm tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả không quá 500 ký tự").nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// Validation tạo nhóm kỹ năng mới (dành cho Admin)
export const CreateSkillCategorySchema = skillCategoryBase.partial({
  description: true,
  isActive: true,
  sortOrder: true,
});

// Validation cập nhật nhóm kỹ năng (Admin)
export const UpdateSkillCategorySchema = skillCategoryBase.partial();

// Validation ID parameter
export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID phải là số nguyên dương").transform(Number),
});

export type CreateSkillCategoryRequestDto = z.infer<typeof CreateSkillCategorySchema>;
export type UpdateSkillCategoryRequestDto = z.infer<typeof UpdateSkillCategorySchema>;
