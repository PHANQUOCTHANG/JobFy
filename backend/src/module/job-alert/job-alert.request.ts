import { z } from "zod";

export const CreateJobAlertSchema = z.object({
  body: z.object({
    name: z.string().max(255).optional(),
    filters: z.any(),
    frequency: z.enum(["daily", "weekly"]).optional()
  })
});

export const UpdateJobAlertSchema = z.object({
  body: z.object({
    name: z.string().max(255).optional(),
    filters: z.any().optional(),
    frequency: z.enum(["daily", "weekly"]).optional(),
    isActive: z.boolean().optional()
  })
});

export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const PaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  })
});
