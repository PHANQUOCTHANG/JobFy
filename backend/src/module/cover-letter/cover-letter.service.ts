import { PrismaClient } from '@prisma/client';
import AppError from "@/utils/appError";

export class CoverLetterService {
  constructor(private prisma: PrismaClient) {}

  async createCoverLetter(userId: string, data: { title: string; content: string; jobId?: string; isAiGenerated?: boolean }) {
    return await this.prisma.coverLetter.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        jobId: data.jobId,
        isAiGenerated: data.isAiGenerated || false,
      },
    });
  }

  async getCoverLetters(userId: string) {
    return await this.prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: { id: true, title: true, company: { select: { name: true, logoUrl: true } } },
        },
      },
    });
  }

  async getCoverLetterById(id: string, userId: string) {
    const cl = await this.prisma.coverLetter.findFirst({
      where: { id, userId },
      include: { job: true },
    });
    if (!cl) throw new AppError('Cover Letter not found', 404);
    return cl;
  }

  async updateCoverLetter(id: string, userId: string, data: { title?: string; content?: string }) {
    const cl = await this.getCoverLetterById(id, userId);
    return await this.prisma.coverLetter.update({
      where: { id: cl.id },
      data,
    });
  }

  async deleteCoverLetter(id: string, userId: string) {
    const cl = await this.getCoverLetterById(id, userId);
    await this.prisma.coverLetter.delete({
      where: { id: cl.id },
    });
    return { success: true };
  }
}
