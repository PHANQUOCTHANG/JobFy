import { PrismaClient, Prisma, Industry } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { IndustryQuery } from "./industry.type";
import { getSearchPattern } from "@/utils/searchUtils";

export interface IIndustryRepository {
  create(data: Prisma.IndustryCreateInput): Promise<Industry>;
  findAll(query: IndustryQuery): Promise<IPaginatedResult<Industry>>;
  findById(id: number): Promise<Industry | null>;
  findBySlug(slug: string): Promise<Industry | null>;
  updateById(id: number, data: Prisma.IndustryUpdateInput): Promise<Industry | null>;
  softDelete(id: number): Promise<void>;
}

export class IndustryRepository implements IIndustryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Tạo ngành nghề mới
  async create(data: Prisma.IndustryCreateInput): Promise<Industry> {
    return this.prisma.industry.create({ data });
  }

  // Lấy danh sách ngành nghề (phân trang + tìm kiếm theo tên)
  async findAll(query: IndustryQuery): Promise<IPaginatedResult<Industry>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    // Xây dựng điều kiện tìm kiếm (không phân biệt hoa thường)
    const where: Prisma.IndustryWhereInput = {
      ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
      ...(query.search && {
        name: {
          contains: getSearchPattern(query.search),
          mode: "insensitive",
        },
      }),
    };

    // Lấy dữ liệu song song
    const [data, total] = await Promise.all([
      this.prisma.industry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: query.sort === "sortOrder" ? { sortOrder: "asc" } : { createdAt: "desc" },
      }),
      this.prisma.industry.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết ngành nghề theo ID
  async findById(id: number): Promise<Industry | null> {
    return this.prisma.industry.findUnique({
      where: { id },
    });
  }

  // Tìm ngành nghề theo slug
  async findBySlug(slug: string): Promise<Industry | null> {
    return this.prisma.industry.findUnique({
      where: { slug },
    });
  }

  // Cập nhật ngành nghề theo ID
  async updateById(id: number, data: Prisma.IndustryUpdateInput): Promise<Industry | null> {
    try {
      return await this.prisma.industry.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === "P2025") return null; // Không tồn tại
      throw error;
    }
  }

  // Xóa mềm ngành nghề (đánh dấu isActive = false)
  async softDelete(id: number): Promise<void> {
    await this.prisma.industry.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
