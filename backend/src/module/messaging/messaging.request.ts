import { z } from "zod";

export const CreateConversationSchema = z.object({
  body: z.object({
    companyId: z.string().uuid("Invalid company ID"),
    candidateId: z.string().uuid("Invalid candidate ID"),
    jobId: z.string().uuid("Invalid job ID").optional(),
  })
});

export const SendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Message content is required"),
    attachmentUrl: z.string().max(500).optional()
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
