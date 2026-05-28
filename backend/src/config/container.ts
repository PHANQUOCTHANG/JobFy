import prisma from "@/lib/prisma";
import { AuthService, IAuthService } from "@/module/auth/auth.service";
import { EmailService, IEmailService } from "@/module/auth/email/email.service";
import {
  IOtpRepository,
  OtpRepository,
} from "@/module/auth/otp/otp.repository";
import { IOtpService, OtpService } from "@/module/auth/otp/otp.service";
import {
  IRefreshTokenRepository,
  RefreshTokenRepository,
} from "@/module/auth/refreshToken/refreshToken.repository";

import { IUserRepository, UserRepository } from "@/module/user/user.repository";
import { UserService } from "@/module/user/user.service";

import { IIndustryRepository, IndustryRepository } from "@/module/industry/industry.repository";
import { IIndustryService, IndustryService } from "@/module/industry/industry.service";

import { IJobCategoryRepository, JobCategoryRepository } from "@/module/job-category/job-category.repository";
import { IJobCategoryService, JobCategoryService } from "@/module/job-category/job-category.service";


// User
const userRepository: IUserRepository = new UserRepository(prisma);
export const userService = new UserService(userRepository);

// Email
export const emailService: IEmailService = new EmailService();

// Otp
const otpRepository: IOtpRepository = new OtpRepository(prisma);
export const otpService: IOtpService = new OtpService(
  otpRepository,
  userRepository,
);

// Refresh Token
const refreshTokenRepository: IRefreshTokenRepository =
  new RefreshTokenRepository(prisma);

// Auth
export const authService: IAuthService = new AuthService(
  userRepository,
  refreshTokenRepository,
  otpRepository,
);

// Industry
const industryRepository: IIndustryRepository = new IndustryRepository(prisma);
export const industryService: IIndustryService = new IndustryService(industryRepository);

// Job Category
const jobCategoryRepository: IJobCategoryRepository = new JobCategoryRepository(prisma);
export const jobCategoryService: IJobCategoryService = new JobCategoryService(
  jobCategoryRepository,
  industryRepository
);

// Skill Category
import { ISkillCategoryRepository, SkillCategoryRepository } from "@/module/skill-category/skill-category.repository";
import { ISkillCategoryService, SkillCategoryService } from "@/module/skill-category/skill-category.service";
const skillCategoryRepository: ISkillCategoryRepository = new SkillCategoryRepository(prisma);
export const skillCategoryService: ISkillCategoryService = new SkillCategoryService(skillCategoryRepository);

// Skill
import { ISkillRepository, SkillRepository } from "@/module/skill/skill.repository";
import { ISkillService, SkillService } from "@/module/skill/skill.service";
const skillRepository: ISkillRepository = new SkillRepository(prisma);
export const skillService: ISkillService = new SkillService(
  skillRepository,
  skillCategoryRepository
);

// Company
import { ICompanyRepository, CompanyRepository } from "@/module/company/company.repository";
import { ICompanyLocationRepository, CompanyLocationRepository } from "@/module/company/company-location.repository";
import { ICompanyMemberRepository, CompanyMemberRepository } from "@/module/company/company-member.repository";
import { ICompanyService, CompanyService } from "@/module/company/company.service";

const companyRepository: ICompanyRepository = new CompanyRepository(prisma);
const companyLocationRepository: ICompanyLocationRepository = new CompanyLocationRepository(prisma);
const companyMemberRepository: ICompanyMemberRepository = new CompanyMemberRepository(prisma);

export const companyService: ICompanyService = new CompanyService(
  companyRepository,
  companyLocationRepository,
  companyMemberRepository,
  userRepository
);

