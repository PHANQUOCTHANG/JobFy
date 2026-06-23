import { z } from "zod";

export const GenerateJDSchema = z.object({
  title: z.string().min(1, "Vui lòng cung cấp tiêu đề công việc"),
  skills: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  jobType: z.string().optional(),
  description: z.string().optional()
});

export const GenerateQuestionsSchema = z.object({
  title: z.string().min(1, "Vui lòng cung cấp tiêu đề công việc"),
  skills: z.array(z.string()).optional(),
  description: z.string().optional()
});

export type GenerateJDRequestDto = z.infer<typeof GenerateJDSchema>;
export type GenerateQuestionsRequestDto = z.infer<typeof GenerateQuestionsSchema>;
