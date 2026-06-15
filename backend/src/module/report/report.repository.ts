import prisma from "@/lib/prisma";
import { CreateReportPayload, UpdateReportPayload, ReportPaginationParams } from "./report.type";

export class ReportRepository {
  async createReport(data: CreateReportPayload) {
    return await prisma.report.create({ data });
  }

  async getReports(params: ReportPaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.refType) where.refType = params.refType;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: { select: { id: true, email: true } },
          reviewer: { select: { id: true, email: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.report.count({ where })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getReportById(id: string) {
    return await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, email: true } },
        reviewer: { select: { id: true, email: true } }
      }
    });
  }

  async updateReportStatus(id: string, data: UpdateReportPayload) {
    return await prisma.report.update({
      where: { id },
      data: {
        status: data.status,
        resolutionNote: data.resolutionNote,
        reviewedBy: data.reviewedBy,
        reviewedAt: new Date()
      },
      include: {
        reporter: { select: { id: true, email: true } },
        reviewer: { select: { id: true, email: true } }
      }
    });
  }
}
