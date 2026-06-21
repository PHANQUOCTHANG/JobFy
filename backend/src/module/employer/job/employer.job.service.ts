import { JobStatus, PrismaClient } from "@prisma/client";
import { EmployerJobRepository } from "./employer.job.repository";
import { CreateJobRequest, UpdateJobRequest, GetJobsQueryRequest } from "./employer.job.request";
import AppError from "@/utils/appError";

export class EmployerJobService {
  private repository: EmployerJobRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.repository = new EmployerJobRepository(prisma);
  }

  async getMyJobs(userId: string, query: GetJobsQueryRequest) {
    const company = await this.getCompanyByOwnerId(userId);
    return this.repository.findManyByCompany(company.id, query);
  }

  async getJobDetail(userId: string, jobId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const job = await this.repository.findByIdAndCompany(jobId, company.id);
    
    if (!job) {
      throw new AppError("Không tìm thấy tin tuyển dụng", 404);
    }
    
    return job;
  }

  async createJob(userId: string, data: CreateJobRequest) {
    const company = await this.getCompanyByOwnerId(userId);
    
    // Check quota logic here based on subscription plan
    // This is a placeholder for actual quota logic
    const activeJobs = await this.prisma.jobs.count({
      where: { companyId: company.id, status: JobStatus.published, deletedAt: null },
    });

    const currentPlan = await this.prisma.employerSubscription.findFirst({
      where: { companyId: company.id, expiresAt: { gt: new Date() } },
      include: { plan: true },
    });

    const maxJobs = currentPlan ? currentPlan.plan.maxJobs : 1; // Free tier allows 1 job
    
    if (activeJobs >= maxJobs) {
      throw new AppError(`Bạn đã đạt giới hạn đăng tin (${maxJobs} tin) của gói hiện tại. Vui lòng nâng cấp.`, 403);
    }

    return this.repository.createWithRelations(company.id, userId, data);
  }

  async updateJob(userId: string, jobId: string, data: UpdateJobRequest) {
    const company = await this.getCompanyByOwnerId(userId);
    const job = await this.repository.findByIdAndCompany(jobId, company.id);

    if (!job) {
      throw new AppError("Không tìm thấy tin tuyển dụng", 404);
    }

    if (job.status === JobStatus.closed || job.status === JobStatus.expired) {
      throw new AppError("Không thể chỉnh sửa tin tuyển dụng đã đóng hoặc hết hạn", 400);
    }

    return this.repository.update(jobId, data);
  }

  async changeJobStatus(userId: string, jobId: string, status: JobStatus) {
    const company = await this.getCompanyByOwnerId(userId);
    const job = await this.repository.findByIdAndCompany(jobId, company.id);

    if (!job) {
      throw new AppError("Không tìm thấy tin tuyển dụng", 404);
    }

    // Validate workflow transition
    if (job.status === status) {
      return job; // No change needed
    }

    if (job.status === JobStatus.closed && status === JobStatus.draft) {
      throw new AppError("Không thể chuyển tin đã đóng về trạng thái nháp", 400);
    }

    if (job.status === JobStatus.expired && (status === JobStatus.draft || status === JobStatus.paused)) {
      throw new AppError("Tin tuyển dụng đã hết hạn không thể quay về trạng thái nháp hoặc tạm dừng", 400);
    }

    if (job.status === JobStatus.draft && status === JobStatus.closed) {
      throw new AppError("Không thể đóng tin đang ở nháp trực tiếp", 400);
    }

    // Check quota if publishing
    if (status === JobStatus.published) {
      const activeJobs = await this.prisma.jobs.count({
        where: { companyId: company.id, status: JobStatus.published, deletedAt: null },
      });

      const currentPlan = await this.prisma.employerSubscription.findFirst({
        where: { companyId: company.id, expiresAt: { gt: new Date() } },
        include: { plan: true },
      });

      const maxJobs = currentPlan ? currentPlan.plan.maxJobs : 1;
      
      if (activeJobs >= maxJobs) {
        throw new AppError(`Bạn đã đạt giới hạn đăng tin (${maxJobs} tin) của gói hiện tại. Không thể đăng thêm tin này.`, 403);
      }
    }

    return this.repository.updateStatus(jobId, status);
  }

  async duplicateJob(userId: string, jobId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const job = await this.repository.findByIdAndCompany(jobId, company.id);

    if (!job) {
      throw new AppError("Không tìm thấy tin tuyển dụng", 404);
    }

    return this.repository.duplicateJob(jobId, company.id, userId);
  }

  async deleteJob(userId: string, jobId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const job = await this.repository.findByIdAndCompany(jobId, company.id);

    if (!job) {
      throw new AppError("Không tìm thấy tin tuyển dụng", 404);
    }

    const pendingApplicationsCount = await this.repository.countPendingApplications(jobId);
    if (pendingApplicationsCount > 0) {
      throw new AppError("Không thể xóa tin tuyển dụng đang có ứng viên chờ duyệt", 400);
    }

    return this.repository.softDelete(jobId);
  }

  private async getCompanyByOwnerId(ownerId: string) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId },
      select: { id: true },
    });

    if (!company) {
      throw new AppError("Không tìm thấy công ty của bạn. Vui lòng cập nhật hồ sơ công ty trước.", 403);
    }

    return company;
  }
}
