import { z } from "zod";

export const addNoteSchema = z.object({
  applicationId: z.string().uuid("Application ID không hợp lệ"),
  content: z.string().min(2, "Nội dung ghi chú phải có ít nhất 2 ký tự").max(2000),
  isInternal: z.boolean().optional().default(true),
});

export const updateNoteSchema = z.object({
  content: z.string().min(2, "Nội dung ghi chú phải có ít nhất 2 ký tự").max(2000),
});

export type AddNoteRequest = z.infer<typeof addNoteSchema>;
export type UpdateNoteRequest = z.infer<typeof updateNoteSchema>;
