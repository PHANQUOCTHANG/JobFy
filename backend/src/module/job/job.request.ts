import { z } from "zod";
import { ExperienceLevel, JobStatus, JobType, SalaryType } from "@prisma/client";

// Schema object gốc — CHƯA có .refine() để có thể dùng .partial()
const jobBaseObject = z.object({
  companyId: z.string().uuid("Company ID không hợp lệ"),
  categoryId: z.number().int().positive("Category ID không hợp lệ"),
  title: z.string().trim().min(1, "Tiêu đề không được trống").max(255),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  requirements: z.string().nullable().optional(),
  benefits: z.string().nullable().optional(),
  jobType: z.nativeEnum(JobType).default("full_time"),
  experienceLevel: z.nativeEnum(ExperienceLevel).nullable().optional(),
  quantity: z.number().int().min(1).default(1),
  salaryMin: z.number().int().nonnegative().nullable().optional(),
  salaryMax: z.number().int().nonnegative().nullable().optional(),
  salaryType: z.nativeEnum(SalaryType).default("monthly"),
  salaryCurrency: z.string().length(3).default("VND"),
  isSalaryPublic: z.boolean().default(true),
  provinceId: z.number().int().positive().nullable().optional(),
  districtId: z.number().int().positive().nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  isRemote: z.boolean().default(false),
  status: z.nativeEnum(JobStatus).default("draft"),
  expiresAt: z.string().datetime().nullable().optional(),
  metaTitle: z.string().max(255).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),

  // Relations
  tagIds: z.array(z.number().int().positive()).optional(),
  skills: z.array(z.object({
    skillId: z.number().int().positive(),
    isRequired: z.boolean().default(true)
  })).optional()
});

// Refinement kiểm tra lương — dùng chung cho cả Create lẫn Update
const salaryRefine = (data: { salaryMin?: number | null; salaryMax?: number | null }) => {
  if (data.salaryMin && data.salaryMax) {
    return data.salaryMin <= data.salaryMax;
  }
  return true;
};

const salaryRefineConfig = {
  message: "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu",
  path: ["salaryMax"],
};

// CreateJobSchema: yêu cầu đủ field + refinement
export const CreateJobSchema = jobBaseObject.refine(salaryRefine, salaryRefineConfig);

// UpdateJobSchema: tất cả field đều optional (partial) rồi mới refine
export const UpdateJobSchema = jobBaseObject.partial().refine(salaryRefine, salaryRefineConfig);

export const IdParamSchema = z.object({
  id: z.string().uuid("ID không hợp lệ"),
});

export type CreateJobRequestDto = z.infer<typeof CreateJobSchema>;
export type UpdateJobRequestDto = z.infer<typeof UpdateJobSchema>;

