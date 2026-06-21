import { AdminRepository } from "./admin.repository";
import { CreateAdminLogPayload, AdminLogPaginationParams } from "./admin.type";

export class AdminService {
  private repository: AdminRepository;

  constructor() {
    this.repository = new AdminRepository();
  }

  async logAction(data: CreateAdminLogPayload) {
    return await this.repository.logAction(data);
  }

  async getLogs(params: AdminLogPaginationParams) {
    return await this.repository.getLogs(params);
  }

  async getJobViewStats(jobId: string) {
    // We could accept from/to dates in params
    const count = await this.repository.getJobViewStats(jobId);
    return { jobId, totalViews: count };
  }

  async getDashboardStats(days: number) {
    return await this.repository.getDashboardStats(days);
  }
}
