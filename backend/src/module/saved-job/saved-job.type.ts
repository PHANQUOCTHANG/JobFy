import { SavedJob, Jobs, Company } from "@prisma/client";

export interface ISavedJob extends SavedJob {
  job?: Jobs & { company?: Company };
}

export interface SavedJobPaginationParams {
  page?: number;
  limit?: number;
}
