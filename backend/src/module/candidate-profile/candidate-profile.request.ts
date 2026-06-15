import { z } from "zod";
import { ExperienceLevel, GenderType, SalaryType } from "@prisma/client";

const candidateProfileBase = z.object({
  fullName: z.string().trim().min(1, "Họ tên không được để trống").max(255, "Họ tên tối đa 255 ký tự"),
  headline: z.string().max(255, "Tiêu đề tối đa 255 ký tự").nullable().optional(),
  gender: z.nativeEnum(GenderType).nullable().optional(),
  dob: z.string().datetime().nullable().optional(),
  provinceId: z.number().int().positive().nullable().optional(),
  districtId: z.number().int().positive().nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  linkedinUrl: z.string().url("Link LinkedIn không hợp lệ").max(500).nullable().optional(),
  githubUrl: z.string().url("Link Github không hợp lệ").max(500).nullable().optional(),
  portfolioUrl: z.string().url("Link Portfolio không hợp lệ").max(500).nullable().optional(),
  desiredJobTitle: z.string().max(255).nullable().optional(),
  desiredSalaryMin: z.number().int().nonnegative().nullable().optional(),
  desiredSalaryMax: z.number().int().nonnegative().nullable().optional(),
  desiredSalaryType: z.nativeEnum(SalaryType).nullable().optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).nullable().optional(),
  isLooking: z.boolean().default(true),
  isProfilePublic: z.boolean().default(true),
  bio: z.string().max(2000).nullable().optional(),
});

const salaryRefinement = (data: { desiredSalaryMin?: number | null; desiredSalaryMax?: number | null }) => {
  if (data.desiredSalaryMin != null && data.desiredSalaryMax != null) {
    return data.desiredSalaryMin <= data.desiredSalaryMax;
  }
  return true;
};

const salaryRefinementOptions = {
  message: "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu",
  path: ["desiredSalaryMax"],
};

export const CreateCandidateProfileSchema = candidateProfileBase.refine(salaryRefinement, salaryRefinementOptions);

export const UpdateCandidateProfileSchema = candidateProfileBase.partial().refine(salaryRefinement, salaryRefinementOptions);

export type CreateCandidateProfileRequestDto = z.infer<typeof CreateCandidateProfileSchema>;
export type UpdateCandidateProfileRequestDto = z.infer<typeof UpdateCandidateProfileSchema>;
