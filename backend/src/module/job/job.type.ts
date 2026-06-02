import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";
import { ExperienceLevel, JobStatus, JobType, SalaryType } from "@prisma/client";

export interface JobQuery extends BaseQuery {
  companyId?: string;
  categoryId?: number;
  provinceId?: number;
  districtId?: number;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  status?: JobStatus;
  isRemote?: boolean;
}

export const normalizeJobQuery = (query: any): JobQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.companyId && { companyId: String(query.companyId) }),
  ...(query.categoryId !== undefined && { categoryId: Number(query.categoryId) }),
  ...(query.provinceId !== undefined && { provinceId: Number(query.provinceId) }),
  ...(query.districtId !== undefined && { districtId: Number(query.districtId) }),
  ...(query.jobType && { jobType: query.jobType as JobType }),
  ...(query.experienceLevel && { experienceLevel: query.experienceLevel as ExperienceLevel }),
  ...(query.salaryMin !== undefined && { salaryMin: Number(query.salaryMin) }),
  ...(query.salaryMax !== undefined && { salaryMax: Number(query.salaryMax) }),
  ...(query.salaryType && { salaryType: query.salaryType as SalaryType }),
  ...(query.status && { status: query.status as JobStatus }),
  ...(query.isRemote !== undefined && { isRemote: String(query.isRemote) === "true" }),
});
