import { Request, Response } from "express";
import { CompanyReviewService } from "./company-review.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toCompanyReviewListResponse, toCompanyReviewResponse } from "./company-review.response";

const reviewService = new CompanyReviewService();

export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, companyId } = req.query;
  const result = await reviewService.getReviews({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    companyId: companyId as string,
    isApproved: true // Public endpoint only returns approved reviews
  });

  sendResponse(res, 200, "Success", {
    data: toCompanyReviewListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const review = await reviewService.createReview({
    ...req.body,
    reviewerId: userId
  });
  sendResponse(res, 201, "Review created and pending approval", toCompanyReviewResponse(review));
});

export const updateReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const reviewId = Array.isArray(id) ? id[0] : id;
  if (!reviewId) return res.status(400).json({ message: "Invalid id" });
  const review = await reviewService.updateReview(reviewId, userId, req.body);
  sendResponse(res, 200, "Review updated", toCompanyReviewResponse(review));
});


export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;
  if (!userId || !role) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const reviewId = Array.isArray(id) ? id[0] : id;
  if (!reviewId) return res.status(400).json({ message: "Invalid id" });
  await reviewService.deleteReview(reviewId, userId, role);
  sendResponse(res, 200, "Review deleted");
});


export const approveReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const reviewId = Array.isArray(id) ? id[0] : id;
  if (!reviewId) return res.status(400).json({ message: "Invalid id" });
  const review = await reviewService.approveReview(reviewId);
  sendResponse(res, 200, "Review approved", toCompanyReviewResponse(review));
});

