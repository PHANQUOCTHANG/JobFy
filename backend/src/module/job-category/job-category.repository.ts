import { PrismaClient, Prisma, JobCategory } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { JobCategoryQuery } from "./job-category.type";
import { getSearchPattern } from "@/utils/searchUtils";

export interface IJobCategoryRepository {
  create(data: Prisma.JobCategoryCreateInput): Promise<JobCategory>;
  findAll(query: JobCategoryQuery): Promise<IPaginatedResult<JobCategory>>;
  findById(id: number): Promise<JobCategory | null>;
  findBySlug(slug: string): Promise<JobCategory | null>;
  updateById(id: number, data: Prisma.JobCategoryUpdateInput): Promise<JobCategory | null>;
  softDelete(id: number): Promise<void>;
}

export class JobCategoryRepository implements IJobCategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Tạo danh mục mới
  async create(data: Prisma.JobCategoryCreateInput): Promise<JobCategory> {
    return this.prisma.jobCategory.create({ data });
  }

  // Lấy danh sách danh mục (phân trang + tìm kiếm theo tên)
  async findAll(query: JobCategoryQuery): Promise<IPaginatedResult<JobCategory>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    // Xây dựng điều kiện tìm kiếm (không phân biệt hoa thường)
    const where: Prisma.JobCategoryWhereInput = {
      ...(query.isActive !== undefined && { isActive: String(query.isActive) === "true" }),
      ...(query.industryId !== undefined && { industryId: Number(query.industryId) }),
      ...(query.parentId !== undefined && { parentId: Number(query.parentId) }),
      ...(query.search && {
        name: {
          contains: getSearchPattern(query.search),
          mode: "insensitive",
        },
      }),
    };

    // Lấy dữ liệu song song
    const [data, total] = await Promise.all([
      this.prisma.jobCategory.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: query.sort === "sortOrder" ? { sortOrder: "asc" } : { createdAt: "desc" },
      }),
      this.prisma.jobCategory.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết danh mục theo ID
  async findById(id: number): Promise<JobCategory | null> {
    return this.prisma.jobCategory.findUnique({
      where: { id },
    });
  }

  // Tìm danh mục theo slug
  async findBySlug(slug: string): Promise<JobCategory | null> {
    return this.prisma.jobCategory.findUnique({
      where: { slug },
    });
  }

  // Cập nhật danh mục theo ID
  async updateById(id: number, data: Prisma.JobCategoryUpdateInput): Promise<JobCategory | null> {
    try {
      return await this.prisma.jobCategory.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === "P2025") return null; // Không tồn tại
      throw error;
    }
  }

  // Xóa mềm danh mục (đánh dấu isActive = false)
  async softDelete(id: number): Promise<void> {
    await this.prisma.jobCategory.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
