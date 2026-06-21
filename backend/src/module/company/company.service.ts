import slugify from "slugify";
import AppError from "@/utils/appError";
import { CompanyQuery } from "./company.type";
import { ICompanyRepository } from "./company.repository";
import { ICompanyLocationRepository } from "./company-location.repository";
import { ICompanyMemberRepository } from "./company-member.repository";
import { IUserRepository } from "@/module/user/user.repository";
import {
  CreateCompanyRequestDto,
  UpdateCompanyRequestDto,
  CreateCompanyLocationRequestDto,
  UpdateCompanyLocationRequestDto,
  CreateCompanyMemberRequestDto,
  UpdateCompanyMemberRequestDto,
} from "./company.request";
import { CompanyResponseDto } from "./company.response";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "@/utils/cache";
import { Prisma } from "@prisma/client";

export interface ICompanyService {
  createCompany(userId: string, dto: CreateCompanyRequestDto): Promise<CompanyResponseDto>;
  findAllCompanies(query: CompanyQuery): Promise<any>;
  findCompanyById(id: string): Promise<CompanyResponseDto>;
  updateCompany(id: string, userId: string, isAdmin: boolean, dto: UpdateCompanyRequestDto): Promise<CompanyResponseDto>;
  deleteCompany(id: string, userId: string, isAdmin: boolean): Promise<void>;
  verifyCompany(id: string, verified: boolean): Promise<CompanyResponseDto>;

  getLocations(companyId: string): Promise<any[]>;
  addLocation(companyId: string, userId: string, isAdmin: boolean, dto: CreateCompanyLocationRequestDto): Promise<any>;
  updateLocation(companyId: string, locationId: number, userId: string, isAdmin: boolean, dto: UpdateCompanyLocationRequestDto): Promise<any>;
  deleteLocation(companyId: string, locationId: number, userId: string, isAdmin: boolean): Promise<void>;

  getMembers(companyId: string): Promise<any[]>;
  addMember(companyId: string, userId: string, isAdmin: boolean, dto: CreateCompanyMemberRequestDto): Promise<any>;
  updateMember(companyId: string, memberId: number, userId: string, isAdmin: boolean, dto: UpdateCompanyMemberRequestDto): Promise<any>;
  removeMember(companyId: string, memberId: number, userId: string, isAdmin: boolean): Promise<void>;
}

export class CompanyService implements ICompanyService {
  private readonly CACHE_KEY = "companies";
  private readonly CACHE_TTL_LIST = 600;
  private readonly CACHE_TTL_DETAIL = 900;

  constructor(
    private readonly companyRepo: ICompanyRepository,
    private readonly locationRepo: ICompanyLocationRepository,
    private readonly memberRepo: ICompanyMemberRepository,
    private readonly userRepo: IUserRepository
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, locale: "vi" });
  }

  private async checkPermission(companyId: string, userId: string, isAdmin: boolean): Promise<void> {
    if (isAdmin) return;
    const company = await this.companyRepo.findById(companyId);
    if (!company) throw new AppError("Công ty không tồn tại", 404);
    if (company.ownerId !== userId) {
      const member = await this.memberRepo.findByCompanyAndUser(companyId, userId);
      if (!member || !member.isActive) {
        throw new AppError("Bạn không có quyền thao tác trên công ty này", 403);
      }
    }
  }

  private async invalidateCache(companyId?: string) {
    if (companyId) await deleteCache(`${this.CACHE_KEY}:id:${companyId}`);
    await deleteCacheByPattern(`${this.CACHE_KEY}:list:*`);
  }

  // ================= COMPANY =================
  async createCompany(userId: string, dto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    const slug = this.generateSlug(dto.name);
    const existed = await this.companyRepo.findBySlug(slug);
    if (existed) throw new AppError("Tên công ty này đã được sử dụng", 409);

    const company = await this.companyRepo.create({
      ...dto,
      owner: { connect: { id: userId } },
      slug,
      ...(dto.industryId && { industry: { connect: { id: dto.industryId } } }),
      ...(dto.provinceId && { province: { connect: { id: dto.provinceId } } }),
      ...(dto.districtId && { district: { connect: { id: dto.districtId } } }),
      size: dto.size as any,
    });

    await this.invalidateCache();
    return CompanyResponseDto.from(company);
  }

  async findAllCompanies(query: CompanyQuery): Promise<any> {
    const cacheKey = `${this.CACHE_KEY}:list:${JSON.stringify(query)}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await this.companyRepo.findAll(query);
    const response = {
      ...result,
      data: CompanyResponseDto.fromList(result.data),
    };

    await setCache(cacheKey, response, this.CACHE_TTL_LIST);
    return response;
  }

  async findCompanyById(id: string): Promise<CompanyResponseDto> {
    const cacheKey = `${this.CACHE_KEY}:id:${id}`;
    const cached = await getCache<CompanyResponseDto>(cacheKey);
    if (cached) return cached;

    const company = await this.companyRepo.findByIdWithRelations(id);
    if (!company) throw new AppError("Không tìm thấy công ty", 404);

    const response = CompanyResponseDto.from(company);
    await setCache(cacheKey, response, this.CACHE_TTL_DETAIL);
    return response;
  }

  async updateCompany(id: string, userId: string, isAdmin: boolean, dto: UpdateCompanyRequestDto): Promise<CompanyResponseDto> {
    await this.checkPermission(id, userId, isAdmin);

    const updateData: Prisma.CompanyUpdateInput = { ...dto };
    delete (updateData as any).industryId;
    delete (updateData as any).provinceId;
    delete (updateData as any).districtId;

    if (dto.name) {
      const slug = this.generateSlug(dto.name);
      const existed = await this.companyRepo.findBySlug(slug);
      if (existed && existed.id !== id) throw new AppError("Tên công ty đã tồn tại", 409);
      updateData.slug = slug;
    }
    if (dto.industryId) updateData.industry = { connect: { id: dto.industryId } };
    if (dto.provinceId) updateData.province = { connect: { id: dto.provinceId } };
    if (dto.districtId) updateData.district = { connect: { id: dto.districtId } };
    if (dto.size) updateData.size = dto.size as any;

    const updated = await this.companyRepo.updateById(id, updateData);
    if (!updated) throw new AppError("Cập nhật thất bại", 500);

    await this.invalidateCache(id);
    return CompanyResponseDto.from(updated);
  }

  async deleteCompany(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const company = await this.companyRepo.findById(id);
    if (!company) throw new AppError("Công ty không tồn tại", 404);
    if (!isAdmin && company.ownerId !== userId) {
      throw new AppError("Chỉ chủ sở hữu hoặc Admin mới có quyền xóa", 403);
    }
    
    await this.companyRepo.softDelete(id);
    await this.invalidateCache(id);
  }

  async verifyCompany(id: string, verified: boolean): Promise<CompanyResponseDto> {
    const company = await this.companyRepo.findById(id);
    if (!company) throw new AppError("Công ty không tồn tại", 404);
    const updated = await this.companyRepo.updateById(id, { isVerified: verified });
    if (!updated) throw new AppError("Cập nhật thất bại", 500);
    await this.invalidateCache(id);
    return CompanyResponseDto.from(updated);
  }

  // ================= LOCATION =================
  async getLocations(companyId: string): Promise<any[]> {
    return this.locationRepo.findByCompanyId(companyId);
  }

  async addLocation(companyId: string, userId: string, isAdmin: boolean, dto: CreateCompanyLocationRequestDto): Promise<any> {
    await this.checkPermission(companyId, userId, isAdmin);
    const location = await this.locationRepo.create({
      ...dto,
      company: { connect: { id: companyId } },
      province: { connect: { id: dto.provinceId } },
      ...(dto.districtId && { district: { connect: { id: dto.districtId } } }),
    });
    await this.invalidateCache(companyId);
    return location;
  }

  async updateLocation(companyId: string, locationId: number, userId: string, isAdmin: boolean, dto: UpdateCompanyLocationRequestDto): Promise<any> {
    await this.checkPermission(companyId, userId, isAdmin);
    const exists = await this.locationRepo.findById(locationId);
    if (!exists || exists.companyId !== companyId) throw new AppError("Địa điểm không tồn tại", 404);

    const updateData: any = { ...dto };
    if (dto.provinceId) updateData.province = { connect: { id: dto.provinceId } };
    if (dto.districtId) updateData.district = { connect: { id: dto.districtId } };

    const updated = await this.locationRepo.updateById(locationId, updateData);
    await this.invalidateCache(companyId);
    return updated;
  }

  async deleteLocation(companyId: string, locationId: number, userId: string, isAdmin: boolean): Promise<void> {
    await this.checkPermission(companyId, userId, isAdmin);
    const exists = await this.locationRepo.findById(locationId);
    if (!exists || exists.companyId !== companyId) throw new AppError("Địa điểm không tồn tại", 404);

    await this.locationRepo.deleteById(locationId);
    await this.invalidateCache(companyId);
  }

  // ================= MEMBER =================
  async getMembers(companyId: string): Promise<any[]> {
    return this.memberRepo.findByCompanyId(companyId);
  }

  async addMember(companyId: string, userId: string, isAdmin: boolean, dto: CreateCompanyMemberRequestDto): Promise<any> {
    await this.checkPermission(companyId, userId, isAdmin);
    
    const targetUser = await this.userRepo.findByEmail(dto.email);
    if (!targetUser) throw new AppError("Không tìm thấy người dùng với email này", 404);

    const existed = await this.memberRepo.findByCompanyAndUser(companyId, targetUser.id);
    if (existed) throw new AppError("Người dùng này đã là thành viên", 409);

    const member = await this.memberRepo.create({
      company: { connect: { id: companyId } },
      user: { connect: { id: targetUser.id } },
      role: dto.role,
    });

    await this.invalidateCache(companyId);
    return member;
  }

  async updateMember(companyId: string, memberId: number, userId: string, isAdmin: boolean, dto: UpdateCompanyMemberRequestDto): Promise<any> {
    await this.checkPermission(companyId, userId, isAdmin);
    const exists = await this.memberRepo.findById(memberId);
    if (!exists || exists.companyId !== companyId) throw new AppError("Thành viên không tồn tại", 404);

    const updated = await this.memberRepo.updateById(memberId, dto);
    await this.invalidateCache(companyId);
    return updated;
  }

  async removeMember(companyId: string, memberId: number, userId: string, isAdmin: boolean): Promise<void> {
    await this.checkPermission(companyId, userId, isAdmin);
    const exists = await this.memberRepo.findById(memberId);
    if (!exists || exists.companyId !== companyId) throw new AppError("Thành viên không tồn tại", 404);

    await this.memberRepo.deleteById(memberId);
    await this.invalidateCache(companyId);
  }
}
