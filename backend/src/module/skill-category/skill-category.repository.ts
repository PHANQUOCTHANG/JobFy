import { PrismaClient, Prisma, SkillCategory } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { SkillCategoryQuery } from "./skill-category.type";
import { getSearchPattern } from "@/utils/searchUtils";

export interface ISkillCategoryRepository {
  create(data: Prisma.SkillCategoryCreateInput): Promise<SkillCategory>;
  findAll(query: SkillCategoryQuery): Promise<IPaginatedResult<SkillCategory>>;
  findById(id: number): Promise<SkillCategory | null>;
  findBySlug(slug: string): Promise<SkillCategory | null>;
  updateById(id: number, data: Prisma.SkillCategoryUpdateInput): Promise<SkillCategory | null>;
  softDelete(id: number): Promise<void>;
}

export class SkillCategoryRepository implements ISkillCategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Tạo nhóm kỹ năng mới
  async create(data: Prisma.SkillCategoryCreateInput): Promise<SkillCategory> {
    return this.prisma.skillCategory.create({ data });
  }

  // Lấy danh sách nhóm kỹ năng
  async findAll(query: SkillCategoryQuery): Promise<IPaginatedResult<SkillCategory>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    const where: Prisma.SkillCategoryWhereInput = {
      ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
      ...(query.search && {
        name: {
          contains: getSearchPattern(query.search),
          mode: "insensitive",
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.skillCategory.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: query.sort === "sortOrder" ? { sortOrder: "asc" } : { createdAt: "desc" },
      }),
      this.prisma.skillCategory.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết nhóm kỹ năng
  async findById(id: number): Promise<SkillCategory | null> {
    return this.prisma.skillCategory.findUnique({
      where: { id },
    });
  }

  // Tìm nhóm kỹ năng theo slug
  async findBySlug(slug: string): Promise<SkillCategory | null> {
    return this.prisma.skillCategory.findUnique({
      where: { slug },
    });
  }

  // Cập nhật nhóm kỹ năng
  async updateById(id: number, data: Prisma.SkillCategoryUpdateInput): Promise<SkillCategory | null> {
    try {
      return await this.prisma.skillCategory.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  // Xóa mềm nhóm kỹ năng
  async softDelete(id: number): Promise<void> {
    await this.prisma.skillCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
