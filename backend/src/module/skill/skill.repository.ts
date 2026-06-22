import { PrismaClient, Prisma, Skill } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { SkillQuery } from "./skill.type";
import { getSearchPattern } from "@/utils/searchUtils";

export interface ISkillRepository {
  create(data: Prisma.SkillCreateInput): Promise<Skill>;
  findAll(query: SkillQuery): Promise<IPaginatedResult<Skill>>;
  findById(id: number): Promise<Skill | null>;
  findBySlug(slug: string): Promise<Skill | null>;
  updateById(id: number, data: Prisma.SkillUpdateInput): Promise<Skill | null>;
  softDelete(id: number): Promise<void>;
}

export class SkillRepository implements ISkillRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Tạo kỹ năng mới
  async create(data: Prisma.SkillCreateInput): Promise<Skill> {
    return this.prisma.skill.create({ data });
  }

  // Lấy danh sách kỹ năng
  async findAll(query: SkillQuery): Promise<IPaginatedResult<Skill>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    const where: Prisma.SkillWhereInput = {
      ...(query.isActive !== undefined ? { isActive: String(query.isActive) === "true" } : { isActive: true }),
      ...(query.isVerified !== undefined && { isVerified: String(query.isVerified) === "true" }),
      ...(query.categoryId !== undefined && { categoryId: Number(query.categoryId) }),
      ...(query.search && {
        name: {
          contains: getSearchPattern(query.search),
          mode: "insensitive",
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { usageCount: "desc" },
          { createdAt: "desc" }
        ],
      }),
      this.prisma.skill.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết kỹ năng
  async findById(id: number): Promise<Skill | null> {
    return this.prisma.skill.findUnique({
      where: { id },
    });
  }

  // Tìm kỹ năng theo slug
  async findBySlug(slug: string): Promise<Skill | null> {
    return this.prisma.skill.findUnique({
      where: { slug },
    });
  }

  // Cập nhật kỹ năng
  async updateById(id: number, data: Prisma.SkillUpdateInput): Promise<Skill | null> {
    try {
      return await this.prisma.skill.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  // Xóa mềm kỹ năng
  async softDelete(id: number): Promise<void> {
    await this.prisma.skill.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
