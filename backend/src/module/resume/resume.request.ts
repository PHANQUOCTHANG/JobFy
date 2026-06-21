import { z } from "zod";
import { DegreeType, JobType, SkillLevel } from "@prisma/client";

// ================= Resume Base =================
const FileUrlSchema = z
  .string()
  .max(500)
  .nullable()
  .optional()
  .transform((val) => (val === "" ? null : val))
  .refine((val) => val == null || /^https?:\/\//.test(val), { message: "fileUrl phải là URL hợp lệ" });

const CreateResumeBaseSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề CV không được trống").max(255),
  templateId: z.string().max(100).nullable().optional(),
  personalData: z.any().nullable().optional(),
  isPrimary: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

export const CreateResumeSchema = CreateResumeBaseSchema.extend({
  fileUrl: FileUrlSchema,
});

export const UpdateResumeSchema = CreateResumeBaseSchema.partial().extend({
  fileUrl: FileUrlSchema,
});

// ================= Resume Education =================
export const CreateResumeEducationSchema = z.object({
  schoolName: z.string().trim().min(1).max(255),
  degree: z.nativeEnum(DegreeType).default("bachelor"),
  fieldOfStudy: z.string().max(255).nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  isCurrent: z.boolean().default(false),
  gpa: z.number().min(0).max(10).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const UpdateResumeEducationSchema = CreateResumeEducationSchema.partial();

// ================= Resume Experience =================
export const CreateResumeExperienceSchema = z.object({
  companyId: z.string().uuid().nullable().optional(),
  companyName: z.string().trim().min(1).max(255),
  jobTitle: z.string().trim().min(1).max(255),
  employmentType: z.nativeEnum(JobType).nullable().optional(),
  provinceId: z.number().int().positive().nullable().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const UpdateResumeExperienceSchema = CreateResumeExperienceSchema.partial();

// ================= Resume Skill =================
export const CreateResumeSkillSchema = z.object({
  skillId: z.number().int().positive(),
  level: z.nativeEnum(SkillLevel).nullable().optional(),
  years: z.number().int().nonnegative().nullable().optional(),
});

export const UpdateResumeSkillSchema = z.object({
  level: z.nativeEnum(SkillLevel).nullable().optional(),
  years: z.number().int().nonnegative().nullable().optional(),
});

// ================= Resume Certification =================
export const CreateResumeCertificationSchema = z.object({
  name: z.string().trim().min(1).max(255),
  issuer: z.string().max(255).nullable().optional(),
  issueDate: z.string().datetime().nullable().optional(),
  expireDate: z.string().datetime().nullable().optional(),
  credentialUrl: z.string().url().max(500).nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const UpdateResumeCertificationSchema = CreateResumeCertificationSchema.partial();

// ================= Resume Project =================
export const CreateResumeProjectSchema = z.object({
  name: z.string().trim().min(1).max(255),
  role: z.string().max(255).nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  url: z.string().url().max(500).nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const UpdateResumeProjectSchema = CreateResumeProjectSchema.partial();

// ================= Params =================
export const IdParamSchema = z.object({
  id: z.string().uuid("ID không hợp lệ"),
});

export const NestedIdParamSchema = z.object({
  id: z.string().uuid("Resume ID không hợp lệ"),
  nestedId: z.string().regex(/^\d+$/, "ID con phải là số").transform(Number),
});
