import { z } from "zod";

const skillBase = z.object({
  categoryId: z.number().int().positive("Category ID không hợp lệ").nullable().optional(),
  name: z.string().trim().min(1, "Tên kỹ năng tối thiểu 1 ký tự").max(100, "Tên kỹ năng tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả không quá 500 ký tự").nullable().optional(),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const CreateSkillSchema = skillBase.partial({
  categoryId: true,
  description: true,
  isVerified: true,
  isActive: true,
  sortOrder: true,
});

export const UpdateSkillSchema = skillBase.partial();

export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID phải là số nguyên dương").transform(Number),
});

export type CreateSkillRequestDto = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillRequestDto = z.infer<typeof UpdateSkillSchema>;
