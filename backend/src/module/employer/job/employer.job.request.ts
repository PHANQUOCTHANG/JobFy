import { z } from "zod";
import { JobType, ExperienceLevel, SalaryType, JobStatus } from "@prisma/client";

export const createJobSchema = z.object({
  categoryId: z.number().int().positive("Category ID phải là số nguyên dương"),
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(255),
  description: z.string().min(20, "Mô tả công việc quá ngắn"),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  jobType: z.nativeEnum(JobType).optional().default(JobType.full_time),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  quantity: z.number().int().min(1).optional().default(1),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  salaryType: z.nativeEnum(SalaryType).optional().default(SalaryType.monthly),
  salaryCurrency: z.string().length(3).optional().default("VND"),
  isSalaryPublic: z.boolean().optional().default(true),
  provinceId: z.number().int().positive().optional(),
  districtId: z.number().int().positive().optional(),
  address: z.string().max(500).optional(),
  isRemote: z.boolean().optional().default(false),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  status: z.nativeEnum(JobStatus).optional().default(JobStatus.draft),
  
  // Relations that might be passed on creation
  skillIds: z.array(z.number().int().positive()).optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
});

export const updateJobSchema = createJobSchema.partial().omit({ status: true });

export const changeJobStatusSchema = z.object({
  status: z.nativeEnum(JobStatus),
});

export const getJobsQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
  status: z.nativeEnum(JobStatus).optional(),
  keyword: z.string().optional(),
  categoryId: z.string().optional().transform(val => (val ? parseInt(val) : undefined)),
});

export type CreateJobRequest = z.infer<typeof createJobSchema>;
export type UpdateJobRequest = z.infer<typeof updateJobSchema>;
export type ChangeJobStatusRequest = z.infer<typeof changeJobStatusSchema>;
export type GetJobsQueryRequest = z.infer<typeof getJobsQuerySchema>;
