import slugify from "slugify";
import AppError from "@/utils/appError";
import { JobCategoryQuery } from "./job-category.type";
import { IJobCategoryRepository } from "./job-category.repository";
import {
  CreateJobCategoryRequestDto,
  UpdateJobCategoryRequestDto,
} from "./job-category.request";
import { JobCategoryResponseDto } from "./job-category.response";
import { IIndustryRepository } from "@/module/industry/industry.repository";
import {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} from "@/utils/cache";

export interface IJobCategoryService {
  create(dto: CreateJobCategoryRequestDto): Promise<JobCategoryResponseDto>;
  findAll(query?: JobCategoryQuery): Promise<any>;
  findById(id: number): Promise<JobCategoryResponseDto>;
  update(id: number, dto: UpdateJobCategoryRequestDto): Promise<JobCategoryResponseDto>;
  delete(id: number): Promise<void>;
}

export class JobCategoryService implements IJobCategoryService {
  private readonly CACHE_KEY = "job_categories";
  private readonly CACHE_TTL_LIST = 600; // 10 phút - danh sách
  private readonly CACHE_TTL_DETAIL = 900; // 15 phút - chi tiết

  constructor(
    private readonly jobCategoryRepo: IJobCategoryRepository,
    private readonly industryRepo: IIndustryRepository
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, locale: "vi" });
  }

  // Tạo danh mục mới
  async create(dto: CreateJobCategoryRequestDto): Promise<JobCategoryResponseDto> {
    const industry = await this.industryRepo.findById(dto.industryId);
    if (!industry) throw new AppError("Ngành nghề không tồn tại", 404);

    if (dto.parentId) {
      const parent = await this.jobCategoryRepo.findById(dto.parentId);
      if (!parent) throw new AppError("Danh mục cha không tồn tại", 404);
    }

    const slug = this.generateSlug(dto.name);

    const existed = await this.jobCategoryRepo.findBySlug(slug);
    if (existed) throw new AppError("Danh mục này đã tồn tại", 409);

    const category = await this.jobCategoryRepo.create({
      industry: { connect: { id: dto.industryId } },
      ...(dto.parentId && { parent: { connect: { id: dto.parentId } } }),
      name: dto.name,
      slug,
      description: dto.description,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });

    // Xóa cache danh sách
    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);

    return JobCategoryResponseDto.from(category);
  }

  // Lấy danh sách danh mục (phân trang, tìm kiếm, lọc)
  async findAll(query: JobCategoryQuery): Promise<any> {
    // Tạo cache key từ query parameters
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    // Lấy từ DB
    const result = await this.jobCategoryRepo.findAll(query);
    const response = {
      ...result,
      data: JobCategoryResponseDto.fromList(result.data),
    };

    // Lưu cache (10 phút)
    await setCache(cacheKey, response, this.CACHE_TTL_LIST);

    return response;
  }

  // Lấy chi tiết danh mục theo ID
  async findById(id: number): Promise<JobCategoryResponseDto> {
    // Kiểm tra cache trước
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<JobCategoryResponseDto>(cacheKey);
    if (cached) return cached;

    // Lấy từ DB
    const category = await this.jobCategoryRepo.findById(id);
    if (!category) throw new AppError("Không tìm thấy danh mục", 404);

    const response = JobCategoryResponseDto.from(category);

    // Lưu cache (15 phút)
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);

    return response;
  }

  // Cập nhật thông tin danh mục
  async update(id: number, dto: UpdateJobCategoryRequestDto): Promise<JobCategoryResponseDto> {
    // Kiểm tra tồn tại
    const exists = await this.jobCategoryRepo.findById(id);
    if (!exists) throw new AppError("Danh mục không tồn tại", 404);

    const updateData: any = { ...dto };

    if (dto.industryId && dto.industryId !== exists.industryId) {
      const industry = await this.industryRepo.findById(dto.industryId);
      if (!industry) throw new AppError("Ngành nghề không tồn tại", 404);
    }

    if (dto.parentId && dto.parentId !== exists.parentId) {
      const parent = await this.jobCategoryRepo.findById(dto.parentId);
      if (!parent) throw new AppError("Danh mục cha không tồn tại", 404);
    }
    
    if (dto.name && dto.name !== exists.name) {
      const slug = this.generateSlug(dto.name);
      const existed = await this.jobCategoryRepo.findBySlug(slug);
      if (existed && existed.id !== id) {
        throw new AppError("Danh mục này đã tồn tại", 409);
      }
      updateData.slug = slug;
    }

    // Cập nhật record
    const updated = await this.jobCategoryRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);
    
    // Xóa cache liên quan
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`), // Cache chi tiết ID
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`), // Cache danh sách
    ]);

    return JobCategoryResponseDto.from(updated);
  }

  // Xóa mềm danh mục
  async delete(id: number): Promise<void> {
    // Kiểm tra tồn tại
    const exists = await this.jobCategoryRepo.findById(id);
    if (!exists) throw new AppError("Danh mục không tồn tại để xóa", 404);

    // Đánh dấu xóa mềm
    await this.jobCategoryRepo.softDelete(id);

    // Xóa cache liên quan
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`), // Cache chi tiết ID
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`), // Cache danh sách
    ]);
  }
}
