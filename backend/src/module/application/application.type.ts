import { BaseQuery, normalizeQuery as baseNormalizeQuery } from "@/utils/query";
import { ApplicationStatus } from "@prisma/client";

export interface ApplicationQuery extends BaseQuery {
  jobId?: string;
  candidateId?: string;
  status?: ApplicationStatus;
}

export const normalizeApplicationQuery = (query: any): ApplicationQuery => ({
  ...baseNormalizeQuery(query),
  ...(query.jobId && { jobId: String(query.jobId) }),
  ...(query.candidateId && { candidateId: String(query.candidateId) }),
  ...(query.status && { status: query.status as ApplicationStatus }),
});
