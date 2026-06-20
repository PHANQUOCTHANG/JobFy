import { z } from "zod";

const reportTypes = ["spam", "fake_job", "inappropriate", "scam", "other"] as const;
const reportStatuses = ["pending", "reviewed", "resolved", "dismissed"] as const;

export const CreateReportSchema = z.object({
  body: z.object({
    type: z.enum(reportTypes),
    refType: z.string().min(1).max(50),
    refId: z.string().min(1).max(36),
    reason: z.string().min(10, "Reason must be at least 10 characters")
  })
});

export const UpdateReportStatusSchema = z.object({
  body: z.object({
    status: z.enum(reportStatuses),
    resolutionNote: z.string().optional()
  })
});

export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const ReportPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(reportStatuses).optional(),
    refType: z.string().optional()
  })
});
