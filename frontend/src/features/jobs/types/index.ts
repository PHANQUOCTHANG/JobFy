import { Company } from "@/features/companies";

export interface JobCategory {
  id: number;
  industryId: number;
  parentId?: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface JobSkill {
  id: number;
  jobId: string;
  skillId: number;
  isRequired: boolean;
  skill?: {
    id: number;
    name: string;
  };
}

export interface Job {
  id: string;
  companyId: string;
  postedBy: string;
  categoryId: number;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  benefits?: string;
  jobType:
    | "full_time"
    | "part_time"
    | "contract"
    | "internship"
    | "freelance"
    | "remote";
  experienceLevel?:
    | "intern"
    | "fresher"
    | "junior"
    | "mid"
    | "senior"
    | "lead"
    | "manager"
    | "director"
    | "executive";
  quantity: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType: "hourly" | "daily" | "monthly" | "yearly" | "negotiable";
  salaryCurrency: string;
  isSalaryPublic: boolean;
  provinceId?: number;
  districtId?: number;
  address?: string;
  isRemote: boolean;
  status: "draft" | "published" | "closed" | "expired" | "paused";
  publishedAt?: string;
  expiresAt?: string;
  viewCount: number;
  applyCount: number;
  saveCount: number;
  createdAt: string;
  updatedAt: string;

  // Relations
  company?: Company;
  category?: JobCategory;
  jobSkills?: JobSkill[];
  province?: { id: number; name: string };
  district?: { id: number; name: string; provinceId: number };
}
export interface JobFilterParams {
  keyword?: string;
  search?: string;
  categoryId?: number;
  categorySlug?: string;
  industryId?: number;
  provinceId?: number;
  districtIds?: string; // Comma-separated string of district IDs (e.g., "1,2,3")
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  page?: number;
  limit?: number;
  searchMode?: 'title' | 'company' | 'both';
}
