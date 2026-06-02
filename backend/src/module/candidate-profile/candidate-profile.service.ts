import AppError from "@/utils/appError";
import { CandidateProfileQuery } from "./candidate-profile.type";
import { ICandidateProfileRepository } from "./candidate-profile.repository";
import { IUserRepository } from "@/module/user/user.repository";
import {
  CreateCandidateProfileRequestDto,
  UpdateCandidateProfileRequestDto,
} from "./candidate-profile.request";
import { CandidateProfileResponseDto } from "./candidate-profile.response";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "@/utils/cache";

export interface ICandidateProfileService {
  create(userId: string, dto: CreateCandidateProfileRequestDto): Promise<CandidateProfileResponseDto>;
  findAll(query?: CandidateProfileQuery): Promise<any>;
  findById(id: string): Promise<CandidateProfileResponseDto>;
  findByUserId(userId: string): Promise<CandidateProfileResponseDto>;
  updateByUserId(userId: string, dto: UpdateCandidateProfileRequestDto): Promise<CandidateProfileResponseDto>;
  incrementViewCount(id: string): Promise<void>;
}

export class CandidateProfileService implements ICandidateProfileService {
  private readonly CACHE_KEY = "candidate-profiles";
  private readonly CACHE_TTL_LIST = 600; // 10 minutes
  private readonly CACHE_TTL_DETAIL = 900; // 15 minutes

  constructor(
    private readonly profileRepo: ICandidateProfileRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async create(userId: string, dto: CreateCandidateProfileRequestDto): Promise<CandidateProfileResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);
    if (user.role !== "candidate") throw new AppError("Chỉ ứng viên mới có thể tạo hồ sơ", 403);

    const existed = await this.profileRepo.findByUserId(userId);
    if (existed) throw new AppError("Bạn đã có hồ sơ ứng viên", 409);

    const dobDate = dto.dob ? new Date(dto.dob) : undefined;

    const profile = await this.profileRepo.create({
      user: { connect: { id: userId } },
      fullName: dto.fullName,
      headline: dto.headline,
      gender: dto.gender,
      dob: dobDate,
      provinceId: dto.provinceId,
      districtId: dto.districtId,
      address: dto.address,
      linkedinUrl: dto.linkedinUrl,
      githubUrl: dto.githubUrl,
      portfolioUrl: dto.portfolioUrl,
      desiredJobTitle: dto.desiredJobTitle,
      desiredSalaryMin: dto.desiredSalaryMin,
      desiredSalaryMax: dto.desiredSalaryMax,
      desiredSalaryType: dto.desiredSalaryType,
      experienceLevel: dto.experienceLevel,
      isLooking: dto.isLooking ?? true,
      isProfilePublic: dto.isProfilePublic ?? true,
      bio: dto.bio,
    });

    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);

    return CandidateProfileResponseDto.from(profile);
  }

  async findAll(query: CandidateProfileQuery): Promise<any> {
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await this.profileRepo.findAll(query);
    const response = {
      ...result,
      data: CandidateProfileResponseDto.fromList(result.data),
    };

    await setCache(cacheKey, response, this.CACHE_TTL_LIST);
    return response;
  }

  async findById(id: string): Promise<CandidateProfileResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<CandidateProfileResponseDto>(cacheKey);
    if (cached) return cached;

    const profile = await this.profileRepo.findById(id);
    if (!profile) throw new AppError("Không tìm thấy hồ sơ", 404);
    if (!profile.isProfilePublic) throw new AppError("Hồ sơ này đang ở chế độ riêng tư", 403);

    const response = CandidateProfileResponseDto.from(profile);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);

    return response;
  }

  async findByUserId(userId: string): Promise<CandidateProfileResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:userId:${userId}`;
    const cached = await getCache<CandidateProfileResponseDto>(cacheKey);
    if (cached) return cached;

    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new AppError("Bạn chưa có hồ sơ ứng viên", 404);

    const response = CandidateProfileResponseDto.from(profile);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);

    return response;
  }

  async updateByUserId(userId: string, dto: UpdateCandidateProfileRequestDto): Promise<CandidateProfileResponseDto> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) throw new AppError("Bạn chưa có hồ sơ ứng viên", 404);

    const dobDate = dto.dob ? new Date(dto.dob) : undefined;
    const updateData: any = { ...dto };
    if (dobDate !== undefined) updateData.dob = dobDate;

    const updated = await this.profileRepo.updateById(profile.id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);

    await Promise.all([
      deleteCache(`${this.CACHE_KEY}:id:${profile.id}`),
      deleteCache(`${this.CACHE_KEY}:userId:${userId}`),
      deleteCacheByPattern(`${this.CACHE_KEY}:list:*`),
    ]);

    return CandidateProfileResponseDto.from(updated);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.profileRepo.incrementViewCount(id);
    await deleteCache(`${this.CACHE_KEY}:id:${id}`);
  }
}
