export class JobResponseDto {
  id: string;
  companyId: string;
  categoryId: number;
  title: string;
  slug: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  jobType: string;
  experienceLevel: string | null;
  quantity: number;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryType: string;
  salaryCurrency: string;
  isSalaryPublic: boolean;
  provinceId: number | null;
  districtId: number | null;
  address: string | null;
  isRemote: boolean;
  status: string;
  publishedAt: string | null;
  expiresAt: string | null;
  viewCount: number;
  applyCount: number;
  saveCount: number;
  createdAt: string;

  // Relations
  company?: any;
  category?: any;
  province?: any;
  district?: any;
  skills?: any[];
  tags?: any[];

  constructor(job: any) {
    this.id = job.id;
    this.companyId = job.companyId;
    this.categoryId = job.categoryId;
    this.title = job.title;
    this.slug = job.slug;
    this.description = job.description;
    this.requirements = job.requirements;
    this.benefits = job.benefits;
    this.jobType = job.jobType;
    this.experienceLevel = job.experienceLevel;
    this.quantity = job.quantity;
    this.salaryMin = job.salaryMin;
    this.salaryMax = job.salaryMax;
    this.salaryType = job.salaryType;
    this.salaryCurrency = job.salaryCurrency;
    this.isSalaryPublic = job.isSalaryPublic;
    this.provinceId = job.provinceId;
    this.districtId = job.districtId;
    this.address = job.address;
    this.isRemote = job.isRemote;
    this.status = job.status;
    this.publishedAt = job.publishedAt ? job.publishedAt.toISOString() : null;
    this.expiresAt = job.expiresAt ? job.expiresAt.toISOString() : null;
    this.viewCount = job.viewCount;
    this.applyCount = job.applyCount;
    this.saveCount = job.saveCount;
    this.createdAt = job.createdAt.toISOString();

    if (job.company) this.company = job.company;
    if (job.category) this.category = job.category;
    if (job.province) this.province = job.province;
    if (job.district) this.district = job.district;

    if (job.jobSkills) {
      this.skills = job.jobSkills.map((js: any) => ({
        id: js.skill.id,
        name: js.skill.name,
        isRequired: js.isRequired
      }));
    }

    if (job.jobTags) {
      this.tags = job.jobTags.map((jt: any) => ({
        id: jt.tag.id,
        name: jt.tag.name
      }));
    }
  }

  static from(job: any): JobResponseDto {
    return new JobResponseDto(job);
  }

  static fromList(jobs: any[]): JobResponseDto[] {
    return jobs.map((job) => new JobResponseDto(job));
  }
}
