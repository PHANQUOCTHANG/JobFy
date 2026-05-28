import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";

export interface IndustryQuery extends BaseQuery {
  isActive?: boolean;
}

export const normalizeIndustryQuery = (query: any): IndustryQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
});
