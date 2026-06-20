import prisma from "@/lib/prisma";
import { CreateJobAlertPayload, UpdateJobAlertPayload, PaginationParams } from "./job-alert.type";

export class JobAlertRepository {
  async createAlert(data: CreateJobAlertPayload) {
    return await prisma.jobAlert.create({ data });
  }

  async getAlerts(candidateId: string, params: PaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.jobAlert.findMany({
        where: { candidateId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.jobAlert.count({ where: { candidateId } })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAlertById(id: string) {
    return await prisma.jobAlert.findUnique({ where: { id } });
  }

  async updateAlert(id: string, data: UpdateJobAlertPayload) {
    return await prisma.jobAlert.update({
      where: { id },
      data
    });
  }

  async deleteAlert(id: string) {
    return await prisma.jobAlert.delete({ where: { id } });
  }

  async toggleAlert(id: string, isActive: boolean) {
    return await prisma.jobAlert.update({
      where: { id },
      data: { isActive }
    });
  }
}
