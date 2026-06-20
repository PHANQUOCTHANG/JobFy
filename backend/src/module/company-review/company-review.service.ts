import { CompanyReviewRepository } from "./company-review.repository";
import { CreateCompanyReviewPayload, UpdateCompanyReviewPayload, CompanyReviewPaginationParams } from "./company-review.type";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/error";
import prisma from "@/lib/prisma";

export class CompanyReviewService {
  private repository: CompanyReviewRepository;

  constructor() {
    this.repository = new CompanyReviewRepository();
  }

  async createReview(data: CreateCompanyReviewPayload) {
    // Check if company exists
    const company = await prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company) throw new NotFoundError("Company not found");

    // Check if user already reviewed
    const existing = await prisma.companyReview.findUnique({
      where: { companyId_reviewerId: { companyId: data.companyId, reviewerId: data.reviewerId } }
    });
    if (existing) throw new BadRequestError("You have already reviewed this company");

    return await this.repository.createReview(data);
  }

  async updateReview(id: string, reviewerId: string, data: UpdateCompanyReviewPayload) {
    const review = await this.repository.getReviewById(id);
    if (!review) throw new NotFoundError("Review not found");
    if (review.reviewerId !== reviewerId) throw new ForbiddenError("Not allowed to update this review");

    return await this.repository.updateReview(id, data);
  }

  async deleteReview(id: string, reviewerId: string, role: string) {
    const review = await this.repository.getReviewById(id);
    if (!review) throw new NotFoundError("Review not found");
    if (review.reviewerId !== reviewerId && role !== "admin") {
      throw new ForbiddenError("Not allowed to delete this review");
    }

    await this.repository.deleteReview(id);
    if (review.isApproved) {
      await this.repository.updateCompanyAvgRating(review.companyId);
    }
  }

  async getReviews(params: CompanyReviewPaginationParams) {
    // By default, only show approved reviews unless explicitly queried (and maybe check role in controller)
    return await this.repository.getReviews(params);
  }

  async approveReview(id: string) {
    const review = await this.repository.getReviewById(id);
    if (!review) throw new NotFoundError("Review not found");
    if (review.isApproved) throw new BadRequestError("Review is already approved");

    return await this.repository.approveReview(id);
  }
}
