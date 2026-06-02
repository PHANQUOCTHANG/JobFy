import { PrismaClient, Prisma, Application, ApplicationNote, ApplicationStatusHistory } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { ApplicationQuery } from "./application.type";

export interface IApplicationRepository {
  create(data: Prisma.ApplicationCreateInput): Promise<Application>;
  findAll(query: ApplicationQuery): Promise<IPaginatedResult<Application>>;
  findById(id: string): Promise<Application | null>;
  updateStatus(id: string, newStatus: any, changedBy: string, note?: string): Promise<Application>;
  addNote(data: Prisma.ApplicationNoteCreateInput): Promise<ApplicationNote>;
}

export class ApplicationRepository implements IApplicationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.ApplicationCreateInput): Promise<Application> {
    // Increment apply count for job using transaction
    return this.prisma.$transaction(async (tx) => {
      const app = await tx.application.create({ data });
      await tx.jobs.update({
        where: { id: app.jobId },
        data: { applyCount: { increment: 1 } }
      });
      return app;
    });
  }

  async findAll(query: ApplicationQuery): Promise<IPaginatedResult<Application>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    const where: Prisma.ApplicationWhereInput = {
      ...(query.jobId && { jobId: query.jobId }),
      ...(query.candidateId && { candidateId: query.candidateId }),
      ...(query.status && { status: query.status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { appliedAt: "desc" },
        include: {
          job: { select: { id: true, title: true, company: { select: { id: true, name: true, logoUrl: true } } } },
          candidate: { select: { id: true, fullName: true, headline: true } }
        }
      }),
      this.prisma.application.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<Application | null> {
    return this.prisma.application.findUnique({
      where: { id },
      include: {
        job: { select: { id: true, title: true, companyId: true } },
        candidate: true,
        resume: true,
        reviewer: { select: { id: true, email: true } },
        notes: { orderBy: { createdAt: "desc" } },
        statusHistory: { orderBy: { changedAt: "desc" }, include: { updater: { select: { id: true, email: true } } } }
      }
    });
  }

  async updateStatus(id: string, newStatus: any, changedBy: string, note?: string): Promise<Application> {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new Error("Application not found");

    const data: any = {
      status: newStatus,
      statusHistory: {
        create: {
          oldStatus: app.status,
          newStatus: newStatus,
          changedBy: changedBy,
          note: note
        }
      }
    };

    if (newStatus === "reviewing" && app.status === "pending") {
      data.reviewedAt = new Date();
      data.reviewedBy = changedBy;
    }

    return this.prisma.application.update({
      where: { id },
      data,
      include: { statusHistory: true }
    });
  }

  async addNote(data: Prisma.ApplicationNoteCreateInput): Promise<ApplicationNote> {
    return this.prisma.applicationNote.create({ data });
  }
}
