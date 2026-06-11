import { Router } from "express";
import * as subCtrl from "./subscription.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { CreateSubscriptionSchema, CreatePaymentSchema, UuidParamSchema, PaymentPaginationSchema } from "./subscription.request";

const router = Router();

// Public routes
router.get("/plans", subCtrl.getPlans);

// Protected routes for employers
router.get("/my", requireAuth, requireRole("employer"), subCtrl.getActiveSubscription);

router.post(
  "/",
  requireAuth,
  requireRole("employer"),
  validationMiddleware(CreateSubscriptionSchema),
  subCtrl.createSubscription
);

router.delete(
  "/:id/cancel",
  requireAuth,
  requireRole("employer"),
  validationMiddleware(UuidParamSchema, "params"),
  subCtrl.cancelSubscription
);

// Payment routes (mounted on /api/v1/payments in index.route.ts)
export const paymentRouter = Router();

paymentRouter.get(
  "/",
  requireAuth,
  requireRole("employer"),
  validationMiddleware(PaymentPaginationSchema, "query"),
  subCtrl.getPayments
);

paymentRouter.post(
  "/",
  requireAuth,
  requireRole("employer"),
  validationMiddleware(CreatePaymentSchema),
  subCtrl.createPayment
);

export default router;
