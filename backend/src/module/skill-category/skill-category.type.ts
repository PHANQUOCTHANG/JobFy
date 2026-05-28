import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";

export interface SkillCategoryQuery extends BaseQuery {
  isActive?: boolean;
}

export const normalizeSkillCategoryQuery = (query: any): SkillCategoryQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
});
