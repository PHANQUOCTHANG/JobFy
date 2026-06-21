import { z } from "zod";

export const verifyCompanySchema = z.object({
  status: z.enum(["approved", "rejected"], {
    message: "Trạng thái duyệt phải là approved hoặc rejected",
  }),
  reason: z.string().optional(),
});

export type VerifyCompanyRequest = z.infer<typeof verifyCompanySchema>;