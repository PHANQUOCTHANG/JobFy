import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";

export interface SkillQuery extends BaseQuery {
  isActive?: boolean;
  categoryId?: number;
  isVerified?: boolean;
}

export const normalizeSkillQuery = (query: any): SkillQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
  ...(query.categoryId !== undefined && { categoryId: Number(query.categoryId) }),
  ...(query.isVerified !== undefined && { isVerified: String(query.isVerified) === "true" }),
});
