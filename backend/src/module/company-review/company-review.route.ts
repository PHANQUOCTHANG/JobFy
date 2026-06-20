import { Router } from "express";
import * as reviewCtrl from "./company-review.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { 
  CreateCompanyReviewSchema, 
  UpdateCompanyReviewSchema, 
  UuidParamSchema, 
  CompanyReviewPaginationSchema 
} from "./company-review.request";

const router = Router();

router.get(
  "/",
  validationMiddleware(CompanyReviewPaginationSchema, "query"),
  reviewCtrl.getReviews
);

router.post(
  "/",
  requireAuth,
  validationMiddleware(CreateCompanyReviewSchema),
  reviewCtrl.createReview
);

router.patch(
  "/:id",
  requireAuth,
  validationMiddleware(UuidParamSchema, "params"),
  validationMiddleware(UpdateCompanyReviewSchema),
  reviewCtrl.updateReview
);

router.delete(
  "/:id",
  requireAuth,
  validationMiddleware(UuidParamSchema, "params"),
  reviewCtrl.deleteReview
);

router.patch(
  "/:id/approve",
  requireAuth,
  requireRole("admin"),
  validationMiddleware(UuidParamSchema, "params"),
  reviewCtrl.approveReview
);

export default router;
