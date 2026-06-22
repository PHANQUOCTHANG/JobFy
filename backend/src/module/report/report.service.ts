import { ReportRepository } from "./report.repository";
import { CreateReportPayload, UpdateReportPayload, ReportPaginationParams } from "./report.type";
import { NotFoundError, BadRequestError } from "@/error";
import prisma from "@/lib/prisma";

export class ReportService {
  private repository: ReportRepository;

  constructor() {
    this.repository = new ReportRepository();
  }

  async createReport(data: CreateReportPayload) {
    const existing = await prisma.report.findFirst({
      where: { reporterId: data.reporterId, refType: data.refType, refId: data.refId }
    });
    if (existing) throw new BadRequestError("You have already reported this item");

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
