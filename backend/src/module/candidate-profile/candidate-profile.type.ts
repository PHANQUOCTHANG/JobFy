import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";
import { ExperienceLevel, GenderType, SalaryType } from "@prisma/client";

export interface CandidateProfileQuery extends BaseQuery {
  provinceId?: number;
  experienceLevel?: ExperienceLevel;
  isLooking?: boolean;
}

export const normalizeCandidateProfileQuery = (query: any): CandidateProfileQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.provinceId !== undefined && { provinceId: Number(query.provinceId) }),
  ...(query.experienceLevel !== undefined && { experienceLevel: query.experienceLevel as ExperienceLevel }),
  ...(query.isLooking !== undefined && { isLooking: String(query.isLooking) === "true" }),
});
