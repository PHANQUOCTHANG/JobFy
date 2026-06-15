import { ReportRepository } from "./report.repository";
import { CreateReportPayload, UpdateReportPayload, ReportPaginationParams } from "./report.type";
import { NotFoundError } from "@/error";

export class ReportService {
  private repository: ReportRepository;

  constructor() {
    this.repository = new ReportRepository();
  }

  async createReport(data: CreateReportPayload) {
    // Basic validation on refId could be added here depending on refType
    return await this.repository.createReport(data);
  }

  async getReports(params: ReportPaginationParams) {
    return await this.repository.getReports(params);
  }

  async getReportById(id: string) {
    const report = await this.repository.getReportById(id);
    if (!report) throw new NotFoundError("Report not found");
    return report;
  }

  async updateReportStatus(id: string, data: UpdateReportPayload) {
    const report = await this.repository.getReportById(id);
    if (!report) throw new NotFoundError("Report not found");

    return await this.repository.updateReportStatus(id, data);
  }
}
