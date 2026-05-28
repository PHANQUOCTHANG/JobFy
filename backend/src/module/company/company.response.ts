export class CompanyResponseDto {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  coverUrl: string | null;
  website: string | null;
  taxCode: string | null;
  foundedYear: number | null;
  size: string | null;
  industryId: number | null;
  description: string | null;
  shortDescription: string | null;
  provinceId: number | null;
  districtId: number | null;
  address: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  totalJobs: number;
  totalReviews: number;
  avgRating: number | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;

  // Relations (optional)
  locations?: any[];
  members?: any[];

  constructor(company: any) {
    this.id = company.id;
    this.ownerId = company.ownerId;
    this.name = company.name;
    this.slug = company.slug;
    this.logoUrl = company.logoUrl;
    this.coverUrl = company.coverUrl;
    this.website = company.website;
    this.taxCode = company.taxCode;
    this.foundedYear = company.foundedYear;
    this.size = company.size;
    this.industryId = company.industryId;
    this.description = company.description;
    this.shortDescription = company.shortDescription;
    this.provinceId = company.provinceId;
    this.districtId = company.districtId;
    this.address = company.address;
    this.facebookUrl = company.facebookUrl;
    this.linkedinUrl = company.linkedinUrl;
    this.totalJobs = company.totalJobs;
    this.totalReviews = company.totalReviews;
    this.avgRating = company.avgRating ? Number(company.avgRating) : null;
    this.isVerified = company.isVerified;
    this.isActive = company.isActive;
    this.createdAt = company.createdAt.toISOString();

    if (company.locations) {
      this.locations = company.locations;
    }
    if (company.members) {
      this.members = company.members.map((m: any) => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        isActive: m.isActive,
        createdAt: m.createdAt,
        user: m.user ? { id: m.user.id, email: m.user.email, avatarUrl: m.user.avatarUrl } : undefined
      }));
    }
  }

  static from(company: any): CompanyResponseDto {
    return new CompanyResponseDto(company);
  }

  static fromList(companies: any[]): CompanyResponseDto[] {
    return companies.map((c) => new CompanyResponseDto(c));
  }
}
