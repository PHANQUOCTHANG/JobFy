import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";

export interface ResumeQuery extends BaseQuery {
  candidateId?: string;
  isPublic?: boolean;
}

export const normalizeResumeQuery = (query: any): ResumeQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.candidateId !== undefined && { candidateId: String(query.candidateId) }),
  ...(query.isPublic !== undefined && { isPublic: String(query.isPublic) === "true" }),
});
