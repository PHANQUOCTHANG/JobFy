import slugify from "slugify";
import AppError from "@/utils/appError";
import { IndustryQuery } from "./industry.type";
import { IIndustryRepository } from "./industry.repository";
import {
  CreateIndustryRequestDto,
  UpdateIndustryRequestDto,
} from "./industry.request";
import { IndustryResponseDto } from "./industry.response";
import {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} from "@/utils/cache";

export interface IIndustryService {
  create(dto: CreateIndustryRequestDto): Promise<IndustryResponseDto>;
  findAll(query?: IndustryQuery): Promise<any>;
  findById(id: number): Promise<IndustryResponseDto>;
  update(id: number, dto: UpdateIndustryRequestDto): Promise<IndustryResponseDto>;
  delete(id: number): Promise<void>;
}

export class IndustryService implements IIndustryService {
  private readonly CACHE_KEY = "industries";
  private readonly CACHE_TTL_LIST = 600; // 10 phút - danh sách
  private readonly CACHE_TTL_DETAIL = 900; // 15 phút - chi tiết

  constructor(private readonly industryRepo: IIndustryRepository) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, locale: "vi" });
  }

  // Tạo ngành nghề mới
  async create(dto: CreateIndustryRequestDto): Promise<IndustryResponseDto> {
    const slug = this.generateSlug(dto.name);

    const existed = await this.industryRepo.findBySlug(slug);
    if (existed) throw new AppError("Ngành nghề đã tồn tại", 409);

    const industry = await this.industryRepo.create({
      ...dto,
      slug,
    });

    // Xóa cache danh sách
    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);

    return IndustryResponseDto.from(industry);
  }

  // Lấy danh sách ngành nghề (phân trang, tìm kiếm, lọc)
  async findAll(query: IndustryQuery): Promise<any> {
    // Tạo cache key từ query parameters
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    // Lấy từ DB
    const result = await this.industryRepo.findAll(query);
    const response = {
      ...result,
      data: IndustryResponseDto.fromList(result.data),
    };

    // Lưu cache (10 phút)
    await setCache(cacheKey, response, this.CACHE_TTL_LIST);

    return response;
  }

  // Lấy chi tiết ngành nghề theo ID
  async findById(id: number): Promise<IndustryResponseDto> {
    // Kiểm tra cache trước
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<IndustryResponseDto>(cacheKey);
    if (cached) return cached;

    // Lấy từ DB
    const industry = await this.industryRepo.findById(id);
    if (!industry) throw new AppError("Không tìm thấy ngành nghề", 404);

    const response = IndustryResponseDto.from(industry);

    // Lưu cache (15 phút)
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);

    return response;
  }

  // Cập nhật thông tin ngành nghề
  async update(id: number, dto: UpdateIndustryRequestDto): Promise<IndustryResponseDto> {
    // Kiểm tra tồn tại
    const exists = await this.industryRepo.findById(id);
    if (!exists) throw new AppError("Ngành nghề không tồn tại", 404);

    const updateData: any = { ...dto };
    
    if (dto.name && dto.name !== exists.name) {
      const slug = this.generateSlug(dto.name);
      const existed = await this.industryRepo.findBySlug(slug);
      if (existed && existed.id !== id) {
        throw new AppError("Ngành nghề này đã tồn tại", 409);
      }
      updateData.slug = slug;
    }

    // Cập nhật record
    const updated = await this.industryRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);
    
    // Xóa cache liên quan
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`), // Cache chi tiết ID
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`), // Cache danh sách
    ]);

    return IndustryResponseDto.from(updated);
  }

  // Xóa mềm ngành nghề
  async delete(id: number): Promise<void> {
    // Kiểm tra tồn tại
    const exists = await this.industryRepo.findById(id);
    if (!exists) throw new AppError("Ngành nghề không tồn tại để xóa", 404);

    // Đánh dấu xóa mềm
    await this.industryRepo.softDelete(id);

    // Xóa cache liên quan
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`), // Cache chi tiết ID
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`), // Cache danh sách (bị ảnh hưởng bởi xóa)
    ]);
  }
}
