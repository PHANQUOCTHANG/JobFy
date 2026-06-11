import { z } from "zod";

export const AdminLogPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    action: z.string().optional(),
    adminId: z.string().uuid().optional()
  })
});

export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});
