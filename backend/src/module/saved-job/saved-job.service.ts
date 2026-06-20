import { SavedJobRepository } from "./saved-job.repository";
import { SavedJobPaginationParams } from "./saved-job.type";
import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/error";

export class SavedJobService {
  private repository: SavedJobRepository;

  constructor() {
    this.repository = new SavedJobRepository();
  }

  async getSavedJobs(userId: string, params: SavedJobPaginationParams) {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!candidate) throw new BadRequestError("Candidate profile not found");

    return await this.repository.getSavedJobs(candidate.id, params);
  }

  async isSaved(userId: string, jobId: string) {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!candidate) throw new BadRequestError("Candidate profile not found");

    const saved = await this.repository.isSaved(candidate.id, jobId);
    return { isSaved: saved };
  }

  async saveJob(userId: string, jobId: string) {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!candidate) throw new BadRequestError("Candidate profile not found");

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Job not found");

    const alreadySaved = await this.repository.isSaved(candidate.id, jobId);
    if (alreadySaved) throw new BadRequestError("Job is already saved");

    return await this.repository.saveJob(candidate.id, jobId);
  }

  async unsaveJob(userId: string, jobId: string) {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    if (!candidate) throw new BadRequestError("Candidate profile not found");

    const alreadySaved = await this.repository.isSaved(candidate.id, jobId);
    if (!alreadySaved) throw new BadRequestError("Job is not saved yet");

    await this.repository.unsaveJob(candidate.id, jobId);
  }
}
