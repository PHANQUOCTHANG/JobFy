import { Request, Response } from "express";
import { SubscriptionService } from "./subscription.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toPlanListResponse, toSubscriptionResponse, toPaymentListResponse, toPaymentResponse } from "./subscription.response";

const subscriptionService = new SubscriptionService();

export const getPlans = catchAsync(async (req: Request, res: Response) => {
  const plans = await subscriptionService.getPlans();
  sendResponse(res, 200, "Success", toPlanListResponse(plans));
});

export const getActiveSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { companyId } = req.query;
  if (!companyId || typeof companyId !== 'string') {
    return res.status(400).json({ message: "companyId is required" });
  }

  const sub = await subscriptionService.getActiveSubscription(companyId, userId);
  sendResponse(res, 200, "Success", sub ? toSubscriptionResponse(sub) : null);
});

export const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const sub = await subscriptionService.createSubscription(req.body, userId);
  sendResponse(res, 201, "Subscription created", toSubscriptionResponse(sub));
});

export const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const sub = await subscriptionService.cancelSubscription(id as string, userId);
  sendResponse(res, 200, "Subscription cancelled", toSubscriptionResponse(sub));
});

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { companyId, page, limit } = req.query;
  if (!companyId || typeof companyId !== 'string') {
    return res.status(400).json({ message: "companyId is required" });
  }

  const result = await subscriptionService.getPayments(companyId, userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  sendResponse(res, 200, "Success", {
    data: toPaymentListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const payment = await subscriptionService.createPayment(req.body, userId);
  sendResponse(res, 201, "Payment initiated", toPaymentResponse(payment));
});
