import { z } from "zod";

export const JobIdParamSchema = z.object({
  jobId: z.string().uuid("Invalid job ID format"),
});

export const SavedJobPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  })
});
