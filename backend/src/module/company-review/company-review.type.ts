import { CompanyReview, User } from "@prisma/client";

export interface ICompanyReview extends CompanyReview {
  reviewer?: User;
}

export type CreateCompanyReviewPayload = {
  companyId: string;
  reviewerId: string;
  overallRating: number;
  cultureRating?: number;
  salaryRating?: number;
  managementRating?: number;
  workLifeRating?: number;
  title?: string;
  pros?: string;
  cons?: string;
  advice?: string;
  jobTitle?: string;
  isCurrentEmployee?: boolean;
  employmentStart?: Date;
  employmentEnd?: Date;
  isAnonymous?: boolean;
};

export type UpdateCompanyReviewPayload = Partial<Omit<CreateCompanyReviewPayload, "companyId" | "reviewerId">>;

export interface CompanyReviewPaginationParams {
  page?: number;
  limit?: number;
  companyId?: string;
  isApproved?: boolean;
}
