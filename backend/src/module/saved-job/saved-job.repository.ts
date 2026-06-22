import prisma from "@/lib/prisma";
import { SavedJobPaginationParams } from "./saved-job.type";

export class SavedJobRepository {
  async isSaved(candidateId: string, jobId: string) {
    const saved = await prisma.savedJob.findUnique({
      where: { candidateId_jobId: { candidateId, jobId } }
    });
    return !!saved;
  }

  async saveJob(candidateId: string, jobId: string) {
    // Transaction to create saved job and increment job saveCount
    return await prisma.$transaction(async (tx) => {
      const savedJob = await tx.savedJob.create({
        data: { candidateId, jobId }
      });
      await tx.jobs.update({
        where: { id: jobId },
        data: { saveCount: { increment: 1 } }
      });
      return savedJob;
    });
  }

  async unsaveJob(candidateId: string, jobId: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.savedJob.delete({
        where: { candidateId_jobId: { candidateId, jobId } }
      });
      await tx.jobs.update({
        where: { id: jobId },
        data: { saveCount: { decrement: 1 } }
      });
    });
  }

  async getSavedJobs(candidateId: string, params: SavedJobPaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where = { candidateId };

    const [data, total] = await Promise.all([
      prisma.savedJob.findMany({
        where,
        include: {
          job: {
            include: {
              company: {
                select: { id: true, name: true, slug: true, logoUrl: true, provinceId: true, isVerified: true },
              },
              province: true,
              district: true,
              category: true,
              jobSkills: { include: { skill: true } },
              jobTags: { include: { tag: true } },
            }
          }
        },
        orderBy: { savedAt: "desc" },
        skip,
        take: limit
      }),
      prisma.savedJob.count({ where })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getSavedJobIds(candidateId: string): Promise<string[]> {
    const savedJobs = await prisma.savedJob.findMany({
      where: { candidateId },
      select: { jobId: true },
    });
    return savedJobs.map(sj => sj.jobId);
  }
}
