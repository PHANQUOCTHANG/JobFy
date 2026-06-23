import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";
import { CompanySize } from "@prisma/client";

export interface CompanyQuery extends BaseQuery {
  industryId?: number;
  provinceId?: number;
  region?: string;
  size?: CompanySize;
  isActive?: boolean;
  isVerified?: boolean;
}

export const normalizeCompanyQuery = (query: any): CompanyQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.industryId !== undefined && { industryId: Number(query.industryId) }),
  ...(query.provinceId !== undefined && { provinceId: Number(query.provinceId) }),
  ...(query.region && { region: String(query.region) }),
  ...(query.size && { size: query.size as CompanySize }),
  ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
  ...(query.isVerified !== undefined && { isVerified: String(query.isVerified) === "true" }),
});
