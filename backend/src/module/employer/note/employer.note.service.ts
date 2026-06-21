import { PrismaClient } from "@prisma/client";
import { AddNoteRequest, UpdateNoteRequest } from "./employer.note.request";
import AppError from "@/utils/appError";

export class EmployerNoteService {
  constructor(private readonly prisma: PrismaClient) {}

  async getNotes(userId: string, applicationId: string) {
    const company = await this.getCompanyByOwnerId(userId);

    // Verify application belongs to this company
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, job: { companyId: company.id } },
      select: { id: true },
    });

    if (!application) {
      throw new AppError("Không tìm thấy hồ sơ ứng viên", 404);
    }

    return this.prisma.applicationNote.findMany({
      where: { applicationId },
      include: {
        author: { select: { email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async addNote(userId: string, data: AddNoteRequest) {
    const company = await this.getCompanyByOwnerId(userId);

    // Verify application belongs to this company
    const application = await this.prisma.application.findFirst({
      where: { id: data.applicationId, job: { companyId: company.id } },
      select: { id: true },
    });

    if (!application) {
      throw new AppError("Không tìm thấy hồ sơ ứng viên", 404);
    }

    return this.prisma.applicationNote.create({
      data: {
        applicationId: data.applicationId,
        authorId: userId,
        content: data.content,
        isInternal: data.isInternal,
      },
      include: {
        author: { select: { email: true, avatarUrl: true } },
      },
    });
  }

  async updateNote(userId: string, noteId: number, data: UpdateNoteRequest) {
    const company = await this.getCompanyByOwnerId(userId);
    
    // Check if note exists and belongs to a valid application for this company
    const note = await this.prisma.applicationNote.findFirst({
      where: { id: noteId, application: { job: { companyId: company.id } } },
    });

    if (!note) {
      throw new AppError("Không tìm thấy ghi chú", 404);
    }

    if (note.authorId !== userId) {
      throw new AppError("Bạn không có quyền sửa ghi chú của người khác", 403);
    }

    return this.prisma.applicationNote.update({
      where: { id: noteId },
      data: { content: data.content },
      include: {
        author: { select: { email: true, avatarUrl: true } },
      },
    });
  }

  async deleteNote(userId: string, noteId: number) {
    const company = await this.getCompanyByOwnerId(userId);
    
    const note = await this.prisma.applicationNote.findFirst({
      where: { id: noteId, application: { job: { companyId: company.id } } },
    });

    if (!note) {
      throw new AppError("Không tìm thấy ghi chú", 404);
    }

    // Usually only the author or an admin can delete
    if (note.authorId !== userId) {
      throw new AppError("Bạn không có quyền xóa ghi chú của người khác", 403);
    }

    return this.prisma.applicationNote.delete({
      where: { id: noteId },
    });
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
