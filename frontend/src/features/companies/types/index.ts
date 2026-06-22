export interface Company {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  businessLicenseUrl?: string;
  website?: string;
  taxCode?: string;
  foundedYear?: number;
  size?: '1_10' | '11_50' | '51_200' | '201_500' | '501_1000' | '1001_5000' | '5000_plus';
  industryId?: number;
  description?: string;
  shortDescription?: string;
  provinceId?: number;
  districtId?: number;
  address?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  totalJobs: number;
  totalReviews: number;
  avgRating?: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  industry?: {
    id: number;
    name: string;
  };
  locations?: CompanyLocation[];
}

export interface CompanyLocation {
  id: number;
  companyId: string;
  provinceId: number;
  districtId?: number;
  address: string;
  isHeadquarters: boolean;
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface CompanyReview {
  id: string;
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
  employmentStart?: string;
  employmentEnd?: string;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
