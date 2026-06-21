import slugify from "slugify";
import AppError from "@/utils/appError";
import { SkillQuery } from "./skill.type";
import { ISkillRepository } from "./skill.repository";
import { ISkillCategoryRepository } from "@/module/skill-category/skill-category.repository";
import {
  CreateSkillRequestDto,
  UpdateSkillRequestDto,
} from "./skill.request";
import { SkillResponseDto } from "./skill.response";
import {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} from "@/utils/cache";

export interface ISkillService {
  create(dto: CreateSkillRequestDto): Promise<SkillResponseDto>;
  findAll(query?: SkillQuery): Promise<any>;
  findById(id: number): Promise<SkillResponseDto>;
  update(id: number, dto: UpdateSkillRequestDto): Promise<SkillResponseDto>;
  delete(id: number): Promise<void>;
}

export class SkillService implements ISkillService {
  private readonly CACHE_KEY = "skills";
  private readonly CACHE_TTL_LIST = 600; // 10 phút
  private readonly CACHE_TTL_DETAIL = 900; // 15 phút

  constructor(
    private readonly skillRepo: ISkillRepository,
    private readonly categoryRepo: ISkillCategoryRepository
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, locale: "vi" });
  }

  // Tạo kỹ năng mới
  async create(dto: CreateSkillRequestDto): Promise<SkillResponseDto> {
    if (dto.categoryId) {
      const category = await this.categoryRepo.findById(dto.categoryId);
      if (!category) throw new AppError("Nhóm kỹ năng không tồn tại", 404);
    }

    const slug = this.generateSlug(dto.name);
    const existed = await this.skillRepo.findBySlug(slug);
    if (existed) throw new AppError("Kỹ năng này đã tồn tại", 409);

    const skill = await this.skillRepo.create({
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
      name: dto.name,
      slug,
      isVerified: dto.isVerified ?? false,
    });

    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);

    return SkillResponseDto.from(skill);
  }

  // Lấy danh sách kỹ năng
  async findAll(query: SkillQuery): Promise<any> {
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await this.skillRepo.findAll(query);
    const response = {
      ...result,
      data: SkillResponseDto.fromList(result.data),
    };

    await setCache(cacheKey, response, this.CACHE_TTL_LIST);

    return response;
  }

  // Lấy chi tiết kỹ năng
  async findById(id: number): Promise<SkillResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<SkillResponseDto>(cacheKey);
    if (cached) return cached;

    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new AppError("Không tìm thấy kỹ năng", 404);

    const response = SkillResponseDto.from(skill);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);

    return response;
  }

  // Cập nhật thông tin kỹ năng
  async update(id: number, dto: UpdateSkillRequestDto): Promise<SkillResponseDto> {
    const exists = await this.skillRepo.findById(id);
    if (!exists) throw new AppError("Kỹ năng không tồn tại", 404);

    const updateData: any = { ...dto };

    if (dto.categoryId && dto.categoryId !== exists.categoryId) {
      const category = await this.categoryRepo.findById(dto.categoryId);
      if (!category) throw new AppError("Nhóm kỹ năng không tồn tại", 404);
    }

    if (dto.name && dto.name !== exists.name) {
      const slug = this.generateSlug(dto.name);
      const existed = await this.skillRepo.findBySlug(slug);
      if (existed && existed.id !== id) {
        throw new AppError("Kỹ năng này đã tồn tại", 409);
      }
      updateData.slug = slug;
    }

    const updated = await this.skillRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);
    
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);

    return SkillResponseDto.from(updated);
  }

  // Xóa mềm kỹ năng
  async delete(id: number): Promise<void> {
    const exists = await this.skillRepo.findById(id);
    if (!exists) throw new AppError("Kỹ năng không tồn tại để xóa", 404);

    await this.skillRepo.softDelete(id);

    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);
  }
}
