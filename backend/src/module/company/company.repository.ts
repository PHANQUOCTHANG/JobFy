import { PrismaClient, Prisma, Company } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { CompanyQuery } from "./company.type";
import { getSearchPattern } from "@/utils/searchUtils";

export interface ICompanyRepository {
  create(data: Prisma.CompanyCreateInput): Promise<Company>;
  findAll(query: CompanyQuery): Promise<IPaginatedResult<Company>>;
  findById(id: string): Promise<Company | null>;
  findByIdWithRelations(id: string): Promise<any | null>;
  findBySlug(slug: string): Promise<Company | null>;
  updateById(id: string, data: Prisma.CompanyUpdateInput): Promise<Company | null>;
  softDelete(id: string): Promise<void>;
}

export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async findAll(query: CompanyQuery): Promise<IPaginatedResult<Company>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    const where: Prisma.CompanyWhereInput = {
      deletedAt: null, // Chỉ lấy công ty chưa bị xóa mềm
      ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
      ...(query.isVerified !== undefined && { isVerified: query.isVerified }),
      ...(query.industryId !== undefined && { industryId: Number(query.industryId) }),
      ...(query.provinceId !== undefined && { provinceId: Number(query.provinceId) }),
      ...(query.region && { province: { region: query.region } }),
      ...(query.size && { size: query.size }),
      ...(query.search && {
        name: { contains: getSearchPattern(query.search), mode: "insensitive" },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { id, deletedAt: null } });
  }

  async findByIdWithRelations(idOrSlug: string): Promise<any | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where = isUuid ? { id: idOrSlug, deletedAt: null } : { slug: idOrSlug, deletedAt: null };
    return this.prisma.company.findUnique({
      where,
      include: {
        locations: {
          include: { province: true, district: true }
        },
        members: {
          include: { user: { select: { id: true, email: true, avatarUrl: true } } }
        },
        industry: true
      }
    });
  }

  async findBySlug(slug: string): Promise<Company | null> {
    return this.prisma.company.findUnique({ where: { slug, deletedAt: null } });
  }

  async updateById(id: string, data: Prisma.CompanyUpdateInput): Promise<Company | null> {
    try {
      return await this.prisma.company.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.company.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }
}
