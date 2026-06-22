import { PrismaClient, Prisma, Jobs } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { JobQuery } from "./job.type";
import { getSearchPattern } from "@/utils/searchUtils";

export interface IJobRepository {
  create(data: Prisma.JobsCreateInput): Promise<Jobs>;
  findAll(query: JobQuery): Promise<IPaginatedResult<Jobs>>;
  findById(id: string): Promise<Jobs | null>;
  findBySlug(companyId: string, slug: string): Promise<Jobs | null>;
  updateById(id: string, data: Prisma.JobsUpdateInput): Promise<Jobs | null>;
  deleteById(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;
}

export class JobRepository implements IJobRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.JobsCreateInput): Promise<Jobs> {
    return this.prisma.jobs.create({
      data,
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
        category: { select: { id: true, name: true } },
        jobSkills: { include: { skill: true } },
        jobTags: { include: { tag: true } },
      },
    });
  }

  async findAll(query: JobQuery): Promise<IPaginatedResult<Jobs>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    // Resolve categorySlug to categoryId if needed
    let categoryId = query.categoryId;
    if (query.categorySlug && !categoryId) {
      const category = await this.prisma.jobCategory.findUnique({
        where: { slug: query.categorySlug },
        select: { id: true },
      });
      categoryId = category?.id;
    }

    const where: Prisma.JobsWhereInput = {
      ...(query.companyId && { companyId: query.companyId }),
      ...(categoryId && { categoryId }),
      ...(query.industryId && { company: { industryId: query.industryId } }),
      ...(query.provinceId && { provinceId: query.provinceId }),
      ...(query.districtId && { districtId: query.districtId }),
      ...(query.districtIds && {
        districtId: { in: query.districtIds.split(',').map(Number).filter(n => !isNaN(n)) }
      }),
      ...(query.jobType && { jobType: query.jobType }),
      ...(query.experienceLevel && { experienceLevel: query.experienceLevel }),
      ...(query.salaryType && { salaryType: query.salaryType }),
      ...(query.status && { status: query.status }),
      ...(query.isRemote !== undefined && { isRemote: query.isRemote }),
      ...(query.search && {
        OR: (() => {
          const titleCondition = {
            title: {
              contains: getSearchPattern(query.search),
              mode: "insensitive" as Prisma.QueryMode,
            },
          };
          const companyCondition = {
            company: {
              name: {
                contains: getSearchPattern(query.search),
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          };

          if (query.searchMode === 'title') return [titleCondition];
          if (query.searchMode === 'company') return [companyCondition];
          return [titleCondition, companyCondition]; // Default 'both'
        })(),
      }),
    };

    if (query.salaryMin || query.salaryMax) {
      where.AND = [
        ...(query.salaryMin ? [{ salaryMax: { gte: query.salaryMin } }] : []),
        ...(query.salaryMax ? [{ salaryMin: { lte: query.salaryMax } }] : []),
      ];
    }

    let orderBy: Prisma.JobsOrderByWithRelationInput = { publishedAt: "desc" };
    if (query.sort === "salary_desc") {
      orderBy = { salaryMax: "desc" };
    } else if (query.sort === "latest") {
      orderBy = { publishedAt: "desc" };
    } else if (query.sort === "relevant") {
      // Basic relevance sorting could be left as newest for now, or if Prisma full-text search was used.
      orderBy = { publishedAt: "desc" };
    }

    const [data, total] = await Promise.all([
      this.prisma.jobs.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          company: {
            select: { id: true, name: true, slug: true, logoUrl: true, provinceId: true, isVerified: true },
          },
          province: true,
          district: true,
          category: true,
          jobSkills: { include: { skill: true } },
          jobTags: { include: { tag: true } },
        },
      }),
      this.prisma.jobs.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(idOrSlug: string): Promise<Jobs | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where = isUuid ? { id: idOrSlug } : { slug: idOrSlug };

    return this.prisma.jobs.findFirst({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            size: true,
            website: true,
            isVerified: true,
            avgRating: true,
            totalReviews: true,
            industry: true,
            locations: {
              include: {
                province: true,
                district: true,
              },
            },
          },
        },
        category: true,
        province: true,
        district: true,
        jobSkills: { include: { skill: true } },
        jobTags: { include: { tag: true } },
      },
    });
  }

  async findBySlug(companyId: string, slug: string): Promise<Jobs | null> {
    return this.prisma.jobs.findUnique({
      where: { companyId_slug: { companyId, slug } },
    });
  }

  async updateById(
    id: string,
    data: Prisma.JobsUpdateInput,
  ): Promise<Jobs | null> {
    try {
      return await this.prisma.jobs.update({
        where: { id },
        data,
        include: {
          jobSkills: { include: { skill: true } },
          jobTags: { include: { tag: true } },
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.jobs.delete({ where: { id } });
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.prisma.jobs.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    } catch (e) {}
  }
}
