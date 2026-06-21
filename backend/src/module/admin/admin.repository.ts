import prisma from "@/lib/prisma";
import { CreateAdminLogPayload, AdminLogPaginationParams, DashboardStats, ChartDataPoint } from "./admin.type";

export class AdminRepository {
  async logAction(data: CreateAdminLogPayload) {
    return await prisma.adminLog.create({ data });
  }

  async getLogs(params: AdminLogPaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.action) where.action = params.action;
    if (params.adminId) where.adminId = params.adminId;

    const [data, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        include: { admin: { select: { id: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.adminLog.count({ where })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getJobViewStats(jobId: string, from?: Date, to?: Date) {
    const where: any = { jobId };
    if (from || to) {
      where.viewedAt = {};
      if (from) where.viewedAt.gte = from;
      if (to) where.viewedAt.lte = to;
    }
    return await prisma.jobView.count({ where });
  }

  private buildDateRange(days: number): { start: Date; dates: Date[] } {
    const dates: Date[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      dates.push(d);
    }
    return { start: dates[0], dates };
  }

  private formatDate(d: Date): string {
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  private async buildUserGrowth(days: number): Promise<ChartDataPoint[]> {
    const { start, dates } = this.buildDateRange(days);
    const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE_TRUNC('day', created_at) as day, COUNT(*) as count
      FROM users
      WHERE created_at >= ${start} AND deleted_at IS NULL
      GROUP BY day ORDER BY day ASC
    `;
    const countMap: Record<string, number> = {};
    for (const row of rows) {
      const key = this.formatDate(new Date(row.day));
      countMap[key] = Number(row.count);
    }
    return dates.map((d) => ({ date: this.formatDate(d), value: countMap[this.formatDate(d)] || 0 }));
  }

  private async buildJobGrowth(days: number): Promise<ChartDataPoint[]> {
    const { start, dates } = this.buildDateRange(days);
    const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE_TRUNC('day', created_at) as day, COUNT(*) as count
      FROM jobs
      WHERE created_at >= ${start} AND deleted_at IS NULL
      GROUP BY day ORDER BY day ASC
    `;
    const countMap: Record<string, number> = {};
    for (const row of rows) {
      const key = this.formatDate(new Date(row.day));
      countMap[key] = Number(row.count);
    }
    return dates.map((d) => ({ date: this.formatDate(d), value: countMap[this.formatDate(d)] || 0 }));
  }

  private async buildApplicationGrowth(days: number): Promise<ChartDataPoint[]> {
    const { start, dates } = this.buildDateRange(days);
    const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE_TRUNC('day', applied_at) as day, COUNT(*) as count
      FROM applications
      WHERE applied_at >= ${start}
      GROUP BY day ORDER BY day ASC
    `;
    const countMap: Record<string, number> = {};
    for (const row of rows) {
      const key = this.formatDate(new Date(row.day));
      countMap[key] = Number(row.count);
    }
    return dates.map((d) => ({ date: this.formatDate(d), value: countMap[this.formatDate(d)] || 0 }));
  }

  private async buildRevenueGrowth(days: number): Promise<ChartDataPoint[]> {
    const { start, dates } = this.buildDateRange(days);
    // Tính tổng doanh thu theo từng ngày
    const rows = await prisma.$queryRaw<{ day: Date; total: bigint }[]>`
      SELECT DATE_TRUNC('day', created_at) as day, SUM(amount) as total
      FROM payments
      WHERE status = 'completed' AND created_at >= ${start}
      GROUP BY day ORDER BY day ASC
    `;
    const amountMap: Record<string, number> = {};
    for (const row of rows) {
      const key = this.formatDate(new Date(row.day));
      amountMap[key] = Number(row.total);
    }
    return dates.map((d) => ({ date: this.formatDate(d), value: amountMap[this.formatDate(d)] || 0 }));
  }

  async getDashboardStats(days: number = 7): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalCandidates,
      totalEmployers,
      totalCompanies,
      pendingCompanyVerifications,
      totalJobs,
      totalApplications,
      totalReports,
      pendingReports,
      newUsersToday,
      userGrowth,
      jobGrowth,
      applicationGrowth,
      revenueGrowth,
      jobStatuses,
      topComps,
      totalRevenueResult
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { role: "candidate", deletedAt: null } }),
      prisma.user.count({ where: { role: "employer", deletedAt: null } }),
      prisma.company.count({ where: { deletedAt: null } }),
      prisma.company.count({ where: { isVerified: false, deletedAt: null } }),
      prisma.jobs.count({ where: { deletedAt: null } }),
      prisma.application.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.user.count({ where: { createdAt: { gte: today }, deletedAt: null } }),
      this.buildUserGrowth(days),
      this.buildJobGrowth(days),
      this.buildApplicationGrowth(days),
      this.buildRevenueGrowth(days),
      
      // Lấy phân bố trạng thái job
      prisma.jobs.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { deletedAt: null }
      }),

      // Lấy Top 5 công ty tuyển dụng nhiều nhất
      prisma.company.findMany({
        where: { deletedAt: null },
        orderBy: { totalJobs: "desc" },
        take: 5,
        select: { id: true, name: true, totalJobs: true, logoUrl: true }
      }),

      // Tổng doanh thu
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed" }
      })
    ]);

    const totalRevenue = Number(totalRevenueResult._sum.amount || 0);

    // Xử lý Role Distribution
    const roleDistribution = [
      { name: "Candidate", value: totalCandidates },
      { name: "Employer", value: totalEmployers },
    ];

    // Xử lý Job Status Distribution
    const jobStatusDistribution = jobStatuses.map(js => ({
      name: js.status.charAt(0).toUpperCase() + js.status.slice(1),
      value: js._count.id
    }));

    return {
      totalUsers,
      totalCandidates,
      totalEmployers,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalReports,
      totalRevenue,
      newUsersToday,
      pendingReports,
      pendingCompanyVerifications,
      userGrowth,
      jobGrowth,
      applicationGrowth,
      revenueGrowth,
      roleDistribution,
      jobStatusDistribution,
      topCompanies: topComps,
    };
  }
}
