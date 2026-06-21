import { z } from "zod";

export const scheduleInterviewSchema = z.object({
  applicationId: z.string().uuid("Application ID không hợp lệ"),
  scheduledAt: z.string().datetime({ message: "Định dạng thời gian không hợp lệ (ISO 8601)" }),
  duration: z.number().int().positive("Thời lượng phỏng vấn phải lớn hơn 0 (phút)").default(60),
  type: z.enum(["online", "offline"], { message: "Loại phỏng vấn là bắt buộc" }),
  location: z.string().min(5, "Địa điểm/Link meeting quá ngắn").max(500),
  note: z.string().max(1000).optional(),
});

export const updateInterviewSchema = scheduleInterviewSchema.partial().omit({ applicationId: true });

export const cancelInterviewSchema = z.object({
  reason: z.string().min(10, "Lý do hủy phỏng vấn phải có ít nhất 10 ký tự").max(500),
});

export type ScheduleInterviewRequest = z.infer<typeof scheduleInterviewSchema>;
export type UpdateInterviewRequest = z.infer<typeof updateInterviewSchema>;
export type CancelInterviewRequest = z.infer<typeof cancelInterviewSchema>;
