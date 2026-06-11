import { ICompanyReview } from "./company-review.type";

export const toCompanyReviewResponse = (review: ICompanyReview) => {
  return {
    id: review.id,
    companyId: review.companyId,
    overallRating: review.overallRating,
    cultureRating: review.cultureRating,
    salaryRating: review.salaryRating,
    managementRating: review.managementRating,
    workLifeRating: review.workLifeRating,
    title: review.title,
    pros: review.pros,
    cons: review.cons,
    advice: review.advice,
    jobTitle: review.jobTitle,
    isCurrentEmployee: review.isCurrentEmployee,
    employmentStart: review.employmentStart,
    employmentEnd: review.employmentEnd,
    isAnonymous: review.isAnonymous,
    isApproved: review.isApproved,
    createdAt: review.createdAt,
    reviewer: (review.reviewer && !review.isAnonymous) ? {
      id: review.reviewer.id,
      email: review.reviewer.email,
      avatarUrl: review.reviewer.avatarUrl,
    } : undefined
  };
};

export const toCompanyReviewListResponse = (reviews: ICompanyReview[]) => {
  return reviews.map(toCompanyReviewResponse);
};
