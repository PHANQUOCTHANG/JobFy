import { PrismaClient } from "@prisma/client";
import { EmployerAnalyticsRepository } from "./employer.analytics.repository";
import AppError from "@/utils/appError";

export class EmployerAnalyticsService {
  private repository: EmployerAnalyticsRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.repository = new EmployerAnalyticsRepository(prisma);
  }

  async getApplicationTrends(userId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const applications = await this.repository.getMonthlyApplicationTrend(company.id, 12);

    const trendMap = new Map<string, number>();
    
    // Initialize last 12 months with 0
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      trendMap.set(key, 0);
    }

    // Populate actual counts
    applications.forEach((app) => {
      const key = `${app.appliedAt.getFullYear()}-${String(app.appliedAt.getMonth() + 1).padStart(2, "0")}`;
      if (trendMap.has(key)) {
        trendMap.set(key, trendMap.get(key)! + 1);
      }
    });

    return Array.from(trendMap.entries()).map(([month, count]) => ({ month, count }));
  }

  async getJobPerformance(userId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const jobs = await this.repository.getJobPerformance(company.id);

    return jobs.map((job) => {
      const acceptedCount = job.applications.filter((a) => a.status === "offered").length;
      const conversionRate = job.viewCount > 0 ? ((job.applyCount / job.viewCount) * 100).toFixed(2) : 0;

      return {
        id: job.id,
        title: job.title,
        status: job.status,
        views: job.viewCount,
        applies: job.applyCount,
        accepted: acceptedCount,
        conversionRate: `${conversionRate}%`,
        createdAt: job.createdAt,
      };
    });
  }

  async getApplicationSources(userId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const sources = await this.repository.getApplicationsBySource(company.id);

    // FIX: source field doesn't exist; we repurpose this to show status distribution
    let total = 0;
    sources.forEach((s) => total += s._count.status);

    return sources.map((s) => ({
      source: s.status, // using status as the grouping dimension
      count: s._count.status,
      percentage: total > 0 ? ((s._count.status / total) * 100).toFixed(2) : 0,
    }));
  }

  async getTimeToHire(userId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const applications = await this.repository.getApplicationsWithTiming(company.id);

    if (applications.length === 0) return { averageDays: 0, detail: [] };

    let totalDays = 0;
    const detail = applications.map((app) => {
      const diffTime = Math.abs(app.reviewedAt!.getTime() - app.appliedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;

      return {
        jobTitle: app.job.title,
        daysToHire: diffDays,
      };
    });

    return {
      averageDays: Math.round(totalDays / applications.length),
      detail,
    };
  }

  async getTopSkills(userId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const resumeSkills = await this.repository.getTopSkillsInCandidatePool(company.id);

    const skillCounts: Record<string, number> = {};
    resumeSkills.forEach((rs) => {
      const name = rs.skill.name;
      skillCounts[name] = (skillCounts[name] || 0) + 1;
    });

    const sortedSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    return sortedSkills;
  }

  private async getCompanyByOwnerId(ownerId: string) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Không tìm thấy công ty của bạn.", 403);
    }

    return company;
  }
}
