import slugify from "slugify";
import AppError from "@/utils/appError";
import { SkillCategoryQuery } from "./skill-category.type";
import { ISkillCategoryRepository } from "./skill-category.repository";
import {
  CreateSkillCategoryRequestDto,
  UpdateSkillCategoryRequestDto,
} from "./skill-category.request";
import { SkillCategoryResponseDto } from "./skill-category.response";
import {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} from "@/utils/cache";

export interface ISkillCategoryService {
  create(dto: CreateSkillCategoryRequestDto): Promise<SkillCategoryResponseDto>;
  findAll(query?: SkillCategoryQuery): Promise<any>;
  findById(id: number): Promise<SkillCategoryResponseDto>;
  update(id: number, dto: UpdateSkillCategoryRequestDto): Promise<SkillCategoryResponseDto>;
  delete(id: number): Promise<void>;
}

export class SkillCategoryService implements ISkillCategoryService {
  private readonly CACHE_KEY = "skill_categories";
  private readonly CACHE_TTL_LIST = 600; // 10 phút
  private readonly CACHE_TTL_DETAIL = 900; // 15 phút

  constructor(private readonly categoryRepo: ISkillCategoryRepository) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, locale: "vi" });
  }

  // Tạo nhóm kỹ năng mới
  async create(dto: CreateSkillCategoryRequestDto): Promise<SkillCategoryResponseDto> {
    const slug = this.generateSlug(dto.name);

    const existed = await this.categoryRepo.findBySlug(slug);
    if (existed) throw new AppError("Nhóm kỹ năng đã tồn tại", 409);

    const category = await this.categoryRepo.create({
      ...dto,
      slug,
    });

    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);

    return SkillCategoryResponseDto.from(category);
  }

  // Lấy danh sách nhóm kỹ năng
  async findAll(query: SkillCategoryQuery): Promise<any> {
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await this.categoryRepo.findAll(query);
    const response = {
      ...result,
      data: SkillCategoryResponseDto.fromList(result.data),
    };

    await setCache(cacheKey, response, this.CACHE_TTL_LIST);

    return response;
  }

  // Lấy chi tiết nhóm kỹ năng
  async findById(id: number): Promise<SkillCategoryResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<SkillCategoryResponseDto>(cacheKey);
    if (cached) return cached;

    const category = await this.categoryRepo.findById(id);
    if (!category) throw new AppError("Không tìm thấy nhóm kỹ năng", 404);

    const response = SkillCategoryResponseDto.from(category);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);

    return response;
  }

  // Cập nhật thông tin nhóm kỹ năng
  async update(id: number, dto: UpdateSkillCategoryRequestDto): Promise<SkillCategoryResponseDto> {
    const exists = await this.categoryRepo.findById(id);
    if (!exists) throw new AppError("Nhóm kỹ năng không tồn tại", 404);

    const updateData: any = { ...dto };
    
    if (dto.name && dto.name !== exists.name) {
      const slug = this.generateSlug(dto.name);
      const existed = await this.categoryRepo.findBySlug(slug);
      if (existed && existed.id !== id) {
        throw new AppError("Nhóm kỹ năng này đã tồn tại", 409);
      }
      updateData.slug = slug;
    }

    const updated = await this.categoryRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);
    
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);

    return SkillCategoryResponseDto.from(updated);
  }

  // Xóa mềm nhóm kỹ năng
  async delete(id: number): Promise<void> {
    const exists = await this.categoryRepo.findById(id);
    if (!exists) throw new AppError("Nhóm kỹ năng không tồn tại để xóa", 404);

    await this.categoryRepo.softDelete(id);

    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);
  }
}
