import { JobAlertRepository } from "./job-alert.repository";
import { CreateJobAlertPayload, UpdateJobAlertPayload, PaginationParams } from "./job-alert.type";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/error/custom.error";
import prisma from "@/config/prisma";

export class JobAlertService {
  private repository: JobAlertRepository;

  constructor() {
    this.repository = new JobAlertRepository();
  }

  async createAlert(userId: string, data: Omit<CreateJobAlertPayload, "candidateId">) {
    const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new BadRequestError("Candidate profile not found");

    return await this.repository.createAlert({
      ...data,
      candidateId: candidate.id
    });
  }

  async getAlerts(userId: string, params: PaginationParams) {
    const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) return { data: [], total: 0, page: params.page || 1, limit: params.limit || 10, totalPages: 0 };

    return await this.repository.getAlerts(candidate.id, params);
  }

  async updateAlert(id: string, userId: string, data: UpdateJobAlertPayload) {
    const alert = await this.repository.getAlertById(id);
    if (!alert) throw new NotFoundError("Job alert not found");

    const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate || alert.candidateId !== candidate.id) {
      throw new ForbiddenError("Not allowed to update this alert");
    }

    return await this.repository.updateAlert(id, data);
  }

  async deleteAlert(id: string, userId: string) {
    const alert = await this.repository.getAlertById(id);
    if (!alert) throw new NotFoundError("Job alert not found");

    const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate || alert.candidateId !== candidate.id) {
      throw new ForbiddenError("Not allowed to delete this alert");
    }

    return await this.repository.deleteAlert(id);
  }

  async toggleAlert(id: string, userId: string) {
    const alert = await this.repository.getAlertById(id);
    if (!alert) throw new NotFoundError("Job alert not found");

    const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate || alert.candidateId !== candidate.id) {
      throw new ForbiddenError("Not allowed to update this alert");
    }

    return await this.repository.toggleAlert(id, !alert.isActive);
  }
}
