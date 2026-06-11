import { z } from "zod";

export const CreateCompanyReviewSchema = z.object({
  body: z.object({
    companyId: z.string().uuid("Invalid company ID"),
    overallRating: z.number().min(1).max(5),
    cultureRating: z.number().min(1).max(5).optional(),
    salaryRating: z.number().min(1).max(5).optional(),
    managementRating: z.number().min(1).max(5).optional(),
    workLifeRating: z.number().min(1).max(5).optional(),
    title: z.string().max(255).optional(),
    pros: z.string().optional(),
    cons: z.string().optional(),
    advice: z.string().optional(),
    jobTitle: z.string().max(255).optional(),
    isCurrentEmployee: z.boolean().optional(),
    employmentStart: z.string().transform(str => new Date(str)).optional(),
    employmentEnd: z.string().transform(str => new Date(str)).optional(),
    isAnonymous: z.boolean().optional(),
  })
});

export const UpdateCompanyReviewSchema = z.object({
  body: z.object({
    overallRating: z.number().min(1).max(5).optional(),
    cultureRating: z.number().min(1).max(5).optional(),
    salaryRating: z.number().min(1).max(5).optional(),
    managementRating: z.number().min(1).max(5).optional(),
    workLifeRating: z.number().min(1).max(5).optional(),
    title: z.string().max(255).optional(),
    pros: z.string().optional(),
    cons: z.string().optional(),
    advice: z.string().optional(),
    jobTitle: z.string().max(255).optional(),
    isCurrentEmployee: z.boolean().optional(),
    employmentStart: z.string().transform(str => new Date(str)).optional(),
    employmentEnd: z.string().transform(str => new Date(str)).optional(),
    isAnonymous: z.boolean().optional(),
  })
});

export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const CompanyReviewPaginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    companyId: z.string().uuid().optional(),
  })
});
