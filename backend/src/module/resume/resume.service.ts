import AppError from "@/utils/appError";
import { ResumeQuery } from "./resume.type";
import { IResumeRepository } from "./resume.repository";
import { ICandidateProfileRepository } from "@/module/candidate-profile/candidate-profile.repository";
import { ResumeResponseDto } from "./resume.response";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "@/utils/cache";

export class ResumeService {
  private readonly CACHE_KEY = "resumes";
  private readonly CACHE_TTL_LIST = 600;
  private readonly CACHE_TTL_DETAIL = 900;

  constructor(
    private readonly resumeRepo: IResumeRepository,
    private readonly candidateProfileRepo: ICandidateProfileRepository
  ) {}

  private async checkOwnership(resumeId: string, userId: string): Promise<string> {
    const profile = await this.candidateProfileRepo.findByUserId(userId);
    if (!profile) throw new AppError("Bạn chưa có hồ sơ ứng viên", 403);
    
    const resume = await this.resumeRepo.findById(resumeId);
    if (!resume) throw new AppError("Không tìm thấy CV", 404);
    if (resume.candidateId !== profile.id) throw new AppError("Bạn không có quyền chỉnh sửa CV này", 403);
    
    return profile.id;
  }

  // ================= Resume Base =================
  async create(userId: string, dto: any): Promise<ResumeResponseDto> {
    const profile = await this.candidateProfileRepo.findByUserId(userId);
    if (!profile) throw new AppError("Bạn chưa có hồ sơ ứng viên", 403);

    const resume = await this.resumeRepo.create({
      candidate: { connect: { id: profile.id } },
      title: dto.title,
      fileUrl: dto.fileUrl,
      isPrimary: dto.isPrimary ?? false,
      isPublic: dto.isPublic ?? true,
    });

    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);
    return ResumeResponseDto.from(resume);
  }

  async findAll(query: ResumeQuery): Promise<any> {
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await this.resumeRepo.findAll(query);
    const response = { ...result, data: ResumeResponseDto.fromList(result.data) };
    
    await setCache(cacheKey, response, this.CACHE_TTL_LIST);
    return response;
  }

  async findById(id: string): Promise<ResumeResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<ResumeResponseDto>(cacheKey);
    if (cached) return cached;

    const resume = await this.resumeRepo.findById(id);
    if (!resume) throw new AppError("Không tìm thấy CV", 404);

    const response = ResumeResponseDto.from(resume);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);
    return response;
  }

  async update(id: string, userId: string, dto: any): Promise<ResumeResponseDto> {
    await this.checkOwnership(id, userId);

    const updated = await this.resumeRepo.updateById(id, dto);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);

    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);

    return ResumeResponseDto.from(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.checkOwnership(id, userId);
    await this.resumeRepo.deleteById(id);
    
    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${id}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.resumeRepo.incrementViewCount(id);
    await deleteCache(`${this.CACHE_KEY}:id:${id}`);
  }

  // ================= Education =================
  async addEducation(resumeId: string, userId: string, dto: any) {
    await this.checkOwnership(resumeId, userId);
    const data = {
      resume: { connect: { id: resumeId } },
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };
    const result = await this.resumeRepo.addEducation(data);
    await deleteCache(`${this.CACHE_KEY}:id:${resumeId}`);
    return result;
  }

  async updateEducation(resumeId: string, eduId: number, userId: string, dto: any) {
    await this.checkOwnership(resumeId, userId);
    const data = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    
    const result = await this.resumeRepo.updateEducation(eduId, data);
    await deleteCache(`${this.CACHE_KEY}:id:${resumeId}`);
    return result;
  }

  async deleteEducation(resumeId: string, eduId: number, userId: string) {
    await this.checkOwnership(resumeId, userId);
    await this.resumeRepo.deleteEducation(eduId);
    await deleteCache(`${this.CACHE_KEY}:id:${resumeId}`);
  }

  // ================= Experience =================
  async addExperience(resumeId: string, userId: string, dto: any) {
    await this.checkOwnership(resumeId, userId);
    const data: any = {
      resume: { connect: { id: resumeId } },
      companyName: dto.companyName,
      jobTitle: dto.jobTitle,
      employmentType: dto.employmentType,
      provinceId: dto.provinceId,
      isCurrent: dto.isCurrent ?? false,
      description: dto.description,
      sortOrder: dto.sortOrder ?? 0,
      startDate: new Date(dto.startDate),
    };
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.companyId) data.company = { connect: { id: dto.companyId } };

    const result = await this.resumeRepo.addExperience(data);
    await deleteCache(`${this.CACHE_KEY}:id:${resumeId}`);
    return result;
  }

  async updateExperience(resumeId: string, expId: number, userId: string, dto: any) {
    await this.checkOwnership(resumeId, userId);
    const data = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    const result = await this.resumeRepo.updateExperience(expId, data);
    await deleteCache(`${this.CACHE_KEY}:id:${resumeId}`);
    return result;
  }

  async deleteExperience(resumeId: string, expId: number, userId: string) {
    await this.checkOwnership(resumeId, userId);
    await this.resumeRepo.deleteExperience(expId);
    await deleteCache(`${this.CACHE_KEY}:id:${resumeId}`);
  }
}
