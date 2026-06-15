import { z } from "zod";
import { NotificationType } from "@prisma/client";

// Define NotificationType values for Zod validation
const notificationTypes = [
  "application_update",
  "new_job_match",
  "message",
  "system",
  "review",
  "payment",
  "company_update"
] as const;

export const CreateNotificationSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
    type: z.enum(notificationTypes),

    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
    body: z.string().max(500, "Body must be at most 500 characters").optional(),
    refType: z.string().max(50, "Ref type must be at most 50 characters").optional(),
    refId: z.string().max(36, "Ref ID must be at most 36 characters").optional(),
    data: z.any().optional()
  })
});

export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid notification ID format")
});

export const NotificationPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    isRead: z.string().transform(v => v === "true").optional()
  })
});
