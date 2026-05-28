import { z } from "zod";
import { CompanySize } from "@prisma/client";

// ==================== COMPANY ====================
const companyBase = z.object({
  name: z.string().trim().min(2, "Tên công ty tối thiểu 2 ký tự").max(255),
  logoUrl: z.string().url("URL không hợp lệ").max(500).nullable().optional(),
  coverUrl: z.string().url("URL không hợp lệ").max(500).nullable().optional(),
  website: z.string().url("URL không hợp lệ").max(500).nullable().optional(),
  taxCode: z.string().max(50).nullable().optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).nullable().optional(),
  size: z.nativeEnum(CompanySize).nullable().optional(),
  industryId: z.number().int().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().max(500).nullable().optional(),
  provinceId: z.number().int().positive().nullable().optional(),
  districtId: z.number().int().positive().nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  facebookUrl: z.string().url("URL không hợp lệ").max(500).nullable().optional(),
  linkedinUrl: z.string().url("URL không hợp lệ").max(500).nullable().optional(),
  isActive: z.boolean().default(true),
});

export const CreateCompanySchema = companyBase.partial({
  logoUrl: true, coverUrl: true, website: true, taxCode: true,
  foundedYear: true, size: true, industryId: true, description: true,
  shortDescription: true, provinceId: true, districtId: true,
  address: true, facebookUrl: true, linkedinUrl: true, isActive: true,
});

export const UpdateCompanySchema = companyBase.partial();

// ==================== COMPANY LOCATION ====================
const locationBase = z.object({
  provinceId: z.number().int().positive("Province ID không hợp lệ"),
  districtId: z.number().int().positive().nullable().optional(),
  address: z.string().min(5).max(500),
  isHeadquarters: z.boolean().default(false),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export const CreateCompanyLocationSchema = locationBase.partial({
  districtId: true, isHeadquarters: true, lat: true, lng: true,
});

export const UpdateCompanyLocationSchema = locationBase.partial();

// ==================== COMPANY MEMBER ====================
export const CreateCompanyMemberSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  role: z.string().min(2).max(50).default("recruiter"),
});

export const UpdateCompanyMemberSchema = z.object({
  role: z.string().min(2).max(50).optional(),
  isActive: z.boolean().optional(),
});

// ==================== PARAMETERS ====================
export const UuidParamSchema = z.object({
  id: z.string().uuid("ID phải là chuẩn UUID"),
});

export const IntParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID phải là số nguyên dương").transform(Number),
});

export type CreateCompanyRequestDto = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyRequestDto = z.infer<typeof UpdateCompanySchema>;
export type CreateCompanyLocationRequestDto = z.infer<typeof CreateCompanyLocationSchema>;
export type UpdateCompanyLocationRequestDto = z.infer<typeof UpdateCompanyLocationSchema>;
export type CreateCompanyMemberRequestDto = z.infer<typeof CreateCompanyMemberSchema>;
export type UpdateCompanyMemberRequestDto = z.infer<typeof UpdateCompanyMemberSchema>;
