import { z } from "zod";

const paymentMethods = ["bank_transfer", "credit_card", "momo", "zalopay", "vnpay"] as const;

export const CreateSubscriptionSchema = z.object({
  body: z.object({
    companyId: z.string().uuid("Invalid company ID"),
    planId: z.number().int().positive("Invalid plan ID"),
    billingPeriod: z.enum(["monthly", "yearly"]).optional().default("monthly")
  })
});

export const CreatePaymentSchema = z.object({
  body: z.object({
    companyId: z.string().uuid("Invalid company ID"),
    subscriptionId: z.string().uuid("Invalid subscription ID").optional(),
    amount: z.number().positive("Amount must be positive"),
    currency: z.string().length(3).optional().default("VND"),
    method: z.enum(paymentMethods)
  })
});

export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const PaymentPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    companyId: z.string().uuid().optional()
  })
});
