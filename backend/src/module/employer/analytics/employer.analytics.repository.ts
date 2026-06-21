import { PrismaClient } from "@prisma/client";

export class EmployerAnalyticsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getMonthlyApplicationTrend(companyId: string, months: number = 12) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get raw data and group in memory (or use raw SQL)
    // We fetch applications within the last `months` and group by month-year
    const applications = await this.prisma.application.findMany({
      where: {
        job: { companyId },
        appliedAt: { gte: startDate, lte: endDate },
      },
      select: { appliedAt: true },
    });

    // We can aggregate this in memory
    return applications;
  }

  async getJobPerformance(companyId: string) {
    return this.prisma.jobs.findMany({
      where: { companyId, deletedAt: null },
      select: {
        id: true,
        title: true,
        viewCount: true,
        applyCount: true,
        status: true,
        createdAt: true,
        applications: {
          select: { status: true },
        },
      },
      orderBy: { applyCount: "desc" },
    });
  }

  async getApplicationsBySource(companyId: string) {
    // Requires standardizing the source field, or just grouping
    return this.prisma.application.groupBy({
      by: ["source"],
      where: { job: { companyId } },
      _count: { source: true },
    });
  }

  async getApplicationsWithTiming(companyId: string) {
    return this.prisma.application.findMany({
      where: {
        job: { companyId },
        status: "offered", // Only measuring time for successful hires
        reviewedAt: { not: null },
      },
      select: {
        appliedAt: true,
        reviewedAt: true,
        job: { select: { title: true } },
      },
    });
  }

  async getTopSkillsInCandidatePool(companyId: string) {
    return this.prisma.resumeSkill.findMany({
      where: {
        resume: {
          applications: {
            some: {
              job: { companyId },
            },
          },
        },
      },
      include: {
        skill: { select: { name: true } },
      },
    });
  }
}
