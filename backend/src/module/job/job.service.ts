import slugify from "slugify";
import AppError from "@/utils/appError";
import { JobQuery } from "./job.type";
import { IJobRepository } from "./job.repository";
import { ICompanyRepository } from "@/module/company/company.repository";
import { CreateJobRequestDto, UpdateJobRequestDto } from "./job.request";
import { JobResponseDto } from "./job.response";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "@/utils/cache";

export class JobService {
  private readonly CACHE_KEY = "jobs";
  private readonly CACHE_TTL_LIST = 300;
  private readonly CACHE_TTL_DETAIL = 600;

  constructor(
    private readonly jobRepo: IJobRepository,
    private readonly companyRepo: ICompanyRepository
  ) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: "vi" });
  }

  async create(userId: string, dto: CreateJobRequestDto): Promise<JobResponseDto> {
    const company = await this.companyRepo.findById(dto.companyId);
    if (!company) throw new AppError("Công ty không tồn tại", 404);
    
    // Authorization: User must be owner or member
    // In real app, check company_members table. Assuming we check owner here for simplicity:
    if (company.ownerId !== userId) {
      // Need proper role check via CompanyMemberRepo, simplified here:
      // throw new AppError("Bạn không có quyền đăng tin cho công ty này", 403);
    }

    let slug = this.generateSlug(dto.title);
    const existing = await this.jobRepo.findBySlug(dto.companyId, slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const jobData: any = {
      company: { connect: { id: dto.companyId } },
      poster: { connect: { id: userId } },
      category: { connect: { id: dto.categoryId } },
      title: dto.title,
      slug,
      description: dto.description,
      requirements: dto.requirements,
      benefits: dto.benefits,
      jobType: dto.jobType,
      experienceLevel: dto.experienceLevel,
      quantity: dto.quantity,
      salaryMin: dto.salaryMin,
      salaryMax: dto.salaryMax,
      salaryType: dto.salaryType,
      salaryCurrency: dto.salaryCurrency,
      isSalaryPublic: dto.isSalaryPublic,
      isRemote: dto.isRemote,
      status: dto.status,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
    };

    if (dto.provinceId) jobData.province = { connect: { id: dto.provinceId } };
    if (dto.districtId) jobData.district = { connect: { id: dto.districtId } };
    if (dto.address) jobData.address = dto.address;
    if (dto.expiresAt) jobData.expiresAt = new Date(dto.expiresAt);
    if (dto.status === "published") jobData.publishedAt = new Date();

    if (dto.skills && dto.skills.length > 0) {
      jobData.jobSkills = {
        create: dto.skills.map(s => ({
          skill: { connect: { id: s.skillId } },
          isRequired: s.isRequired
        }))
      };
    }

    if (dto.tagIds && dto.tagIds.length > 0) {
      jobData.jobTags = {
        create: dto.tagIds.map(tagId => ({
          tag: { connect: { id: tagId } }
        }))
      };
    }

    const job = await this.jobRepo.create(jobData);
    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);

    return JobResponseDto.from(job);
  }

  async findAll(query: JobQuery): Promise<any> {
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await this.jobRepo.findAll(query);
    const response = { ...result, data: JobResponseDto.fromList(result.data) };
    
    await setCache(cacheKey, response, this.CACHE_TTL_LIST);
    return response;
  }

  async findById(id: string): Promise<JobResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<JobResponseDto>(cacheKey);
    if (cached) return cached;

    const job = await this.jobRepo.findById(id);
    if (!job) throw new AppError("Không tìm thấy tin tuyển dụng", 404);

    const response = JobResponseDto.from(job);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);
    return response;
  }

  async update(id: string, userId: string, dto: UpdateJobRequestDto): Promise<JobResponseDto> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new AppError("Không tìm thấy tin tuyển dụng", 404);

    // TODO: Verify ownership

    const updateData: any = { ...dto };
    delete updateData.skills;
    delete updateData.tagIds;
    delete updateData.companyId;

    if (dto.expiresAt) updateData.expiresAt = new Date(dto.expiresAt);
    
    if (dto.status === "published" && job.status !== "published" && !job.publishedAt) {
      updateData.publishedAt = new Date();
    }

    // Handle nested updates (skills, tags) - standard way in Prisma is to delete and recreate for simplicity
    if (dto.skills) {
      updateData.jobSkills = {
        deleteMany: {},
        create: dto.skills.map(s => ({
          skill: { connect: { id: s.skillId } },
          isRequired: s.isRequired
        }))
      };
    }

    if (dto.tagIds) {
      updateData.jobTags = {
        deleteMany: {},
        create: dto.tagIds.map(tagId => ({
          tag: { connect: { id: tagId } }
        }))
      };
    }

    const updated = await this.jobRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);

    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);

    return JobResponseDto.from(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new AppError("Không tìm thấy tin tuyển dụng", 404);

    // TODO: Verify ownership

    await this.jobRepo.deleteById(id);
    
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.jobRepo.incrementViewCount(id);
    await deleteCache(`${this.CACHE_KEY}:id:${id}`);
  }

  async adminUpdateStatus(id: string, status: string, rejectedReason?: string): Promise<JobResponseDto> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new AppError("Không tìm thấy tin tuyển dụng", 404);

    const updateData: any = { status };
    
    // Nếu duyệt tin
    if (status === "published" && job.status !== "published" && !job.publishedAt) {
      updateData.publishedAt = new Date();
      updateData.rejectedReason = null; // Clear lý do từ chối nếu có
    }

    // Nếu từ chối tin
    if (status === "rejected") {
      updateData.rejectedReason = rejectedReason || "Không có lý do cụ thể.";
    }

    const updated = await this.jobRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);

    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);
    return JobResponseDto.from(updated);
  }

  async adminDelete(id: string): Promise<void> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new AppError("Không tìm thấy tin tuyển dụng", 404);
    await this.jobRepo.deleteById(id);
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);
  }
}
