import prisma from "@/lib/prisma";
import { CreateAdminLogPayload, AdminLogPaginationParams, DashboardStats } from "./admin.type";

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

  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalCompanies, totalJobs, totalApplications, newUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.jobs.count(),
      prisma.application.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } })
    ]);

    return {
      totalUsers,
      totalCompanies,
      totalJobs,
      totalApplications,
      newUsersToday
    };
  }
}
