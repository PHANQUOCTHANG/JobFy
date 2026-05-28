import { z } from "zod";

// Schema base dùng chung cho tất cả job categories
const jobCategoryBase = z.object({
  industryId: z.number().int().positive("Industry ID không hợp lệ"),
  parentId: z.number().int().positive("Parent ID không hợp lệ").nullable().optional(),
  name: z.string().trim().min(2, "Tên danh mục tối thiểu 2 ký tự").max(150, "Tên danh mục tối đa 150 ký tự"),
  description: z.string().max(500, "Mô tả không quá 500 ký tự").nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// Validation tạo danh mục mới (dành cho Admin)
export const CreateJobCategorySchema = jobCategoryBase.partial({
  parentId: true,
  description: true,
  isActive: true,
  sortOrder: true,
});

// Validation cập nhật danh mục (Admin)
export const UpdateJobCategorySchema = jobCategoryBase.partial();

// Validation ID parameter
export const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID phải là số nguyên dương").transform(Number),
});

export type CreateJobCategoryRequestDto = z.infer<typeof CreateJobCategorySchema>;
export type UpdateJobCategoryRequestDto = z.infer<typeof UpdateJobCategorySchema>;
