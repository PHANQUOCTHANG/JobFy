import { PrismaClient } from "@prisma/client";

export class EmployerDashboardService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Lấy thống kê tổng quan (StatCards)
   */
  async getOverview(userId: string, startDate?: Date) {
    // Tìm company của employer
    const company = await this.prisma.company.findFirst({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (!company) {
      return {
        totalApplications: 0,
        totalJobs: 0,
        activeJobs: 0,
        totalViews: 0,
      };
    }

    const jobDateFilter = startDate ? { createdAt: { gte: startDate } } : {};
    const appDateFilter = startDate ? { appliedAt: { gte: startDate } } : {};

    const [totalApplications, totalJobs, activeJobs, viewsAgg] =
      await Promise.all([
        // Tổng CV nhận được
        this.prisma.application.count({
          where: { job: { companyId: company.id }, ...appDateFilter },
        }),
        // Tổng tin đã đăng
        this.prisma.jobs.count({
          where: { companyId: company.id, deletedAt: null, ...jobDateFilter },
        }),
        // Tin đang tuyển (published)
        this.prisma.jobs.count({
          where: {
            companyId: company.id,
            status: "published",
            deletedAt: null,
            ...jobDateFilter,
          },
        }),
        // Tổng lượt xem
        this.prisma.jobs.aggregate({
          where: { companyId: company.id, deletedAt: null, ...jobDateFilter },
          _sum: { viewCount: true },
        }),
      ]);

    return {
      totalApplications,
      totalJobs,
      activeJobs,
      totalViews: viewsAgg._sum.viewCount ?? 0,
    };
  }

  /**
   * Lấy dữ liệu phễu tuyển dụng (Pipeline/Funnel)
   * Gom nhóm applications theo status
   */
  async getPipeline(userId: string, startDate?: Date) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (!company) return [];

    // FIX: Use appliedAt (not createdAt) for filtering applications
    const appDateFilter = startDate ? { appliedAt: { gte: startDate } } : {};

    const grouped = await this.prisma.application.groupBy({
      by: ["status"],
      where: { job: { companyId: company.id }, ...appDateFilter },
      _count: { status: true },
    });

    // Map sang format chuẩn
    return grouped.map((g) => ({
      status: g.status,
      count: g._count.status,
    }));
  }

  /**
   * Lấy danh sách tin tuyển dụng gần đây (Recent Jobs Table)
   */
  async getRecentJobs(userId: string, limit = 6, startDate?: Date) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (!company) return [];

    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    return this.prisma.jobs.findMany({
      where: {
        companyId: company.id,
        deletedAt: null,
        ...dateFilter,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        jobType: true,
        status: true,
        viewCount: true,
        applyCount: true,
        createdAt: true,
        _count: {
          select: { applications: true },
        },
      },
    });
  }

  /**
   * Lấy dữ liệu Nguồn CV (Application Sources)
   */
  async getApplicationSources(userId: string, startDate?: Date) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (!company) return [];

    const appDateFilter = startDate ? { appliedAt: { gte: startDate } } : {};

    const grouped = await this.prisma.application.groupBy({
      by: ["source"],
      where: { job: { companyId: company.id }, ...appDateFilter },
      _count: { source: true },
    });

    const total = grouped.reduce((sum, g) => sum + g._count.source, 0);

    return grouped
      .map((g) => ({
        source: g.source || "Khác",
        count: g._count.source,
        percent: total > 0 ? Math.round((g._count.source / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }
}
