import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";

export interface JobCategoryQuery extends BaseQuery {
  isActive?: boolean;
  industryId?: number;
  parentId?: number;
}

export const normalizeJobCategoryQuery = (query: any): JobCategoryQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
  ...(query.industryId !== undefined && { industryId: Number(query.industryId) }),
  ...(query.parentId !== undefined && { parentId: Number(query.parentId) }),
});
