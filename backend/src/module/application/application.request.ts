import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const CreateApplicationSchema = z.object({
  jobId: z.string().uuid("Job ID không hợp lệ"),
  resumeId: z.string().uuid("Resume ID không hợp lệ").nullable().optional(),
  coverLetter: z.string().max(2000).nullable().optional(),
  source: z.string().max(50).nullable().optional(),
});

export const UpdateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  note: z.string().max(500).nullable().optional(),
});

export const CreateApplicationNoteSchema = z.object({
  content: z.string().trim().min(1, "Nội dung ghi chú không được trống"),
  isInternal: z.boolean().default(true),
});

export const IdParamSchema = z.object({
  id: z.string().uuid("ID không hợp lệ"),
});

export const NestedIdParamSchema = z.object({
  id: z.string().uuid("ID không hợp lệ"),
  nestedId: z.string().regex(/^\d+$/, "ID con phải là số").transform(Number),
});

export type CreateApplicationRequestDto = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationStatusRequestDto = z.infer<typeof UpdateApplicationStatusSchema>;
