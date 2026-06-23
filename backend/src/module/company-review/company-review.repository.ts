import prisma from "@/lib/prisma";
import { CreateCompanyReviewPayload, UpdateCompanyReviewPayload, CompanyReviewPaginationParams } from "./company-review.type";

export class CompanyReviewRepository {
  async createReview(data: CreateCompanyReviewPayload) {
    return await prisma.companyReview.create({
      data,
      include: { reviewer: true }
    });
  }

  async updateReview(id: string, data: UpdateCompanyReviewPayload & { isApproved?: boolean }) {
    return await prisma.companyReview.update({
      where: { id },
      data,
      include: { reviewer: true }
    });
  }

  async deleteReview(id: string) {
    return await prisma.companyReview.delete({
      where: { id }
    });
  }

  async getReviewById(id: string) {
    return await prisma.companyReview.findUnique({
      where: { id },
      include: { reviewer: true }
    });
  }

  async getReviews(params: CompanyReviewPaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.companyId) where.companyId = params.companyId;
    if (params.isApproved !== undefined) where.isApproved = params.isApproved;

    const [data, total] = await Promise.all([
      prisma.companyReview.findMany({
        where,
        include: { 
          reviewer: { include: { candidateProfile: true } },
          company: true
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.companyReview.count({ where })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async approveReview(id: string) {
    const review = await prisma.companyReview.update({
      where: { id },
      data: { isApproved: true, approvedAt: new Date() }
    });
    
    await this.updateCompanyAvgRating(review.companyId);
    return review;
  }

  async updateCompanyAvgRating(companyId: string) {
    const agg = await prisma.companyReview.aggregate({
      where: { companyId, isApproved: true },
      _avg: { overallRating: true },
      _count: { id: true }
    });

    await prisma.company.update({
      where: { id: companyId },
      data: {
        avgRating: agg._avg.overallRating || null,
        totalReviews: agg._count.id
      }
    });
  }
}
