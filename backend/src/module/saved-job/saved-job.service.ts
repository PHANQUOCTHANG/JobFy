import { SavedJobRepository } from "./saved-job.repository";
import { SavedJobPaginationParams } from "./saved-job.type";
import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/error";

export class SavedJobService {
  private repository: SavedJobRepository;

  constructor() {
    this.repository = new SavedJobRepository();
  }

  private async ensureCandidate(userId: string) {
    let candidate = await prisma.candidateProfile.findUnique({
      where: { userId }
    });
    
    if (!candidate) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      // Thay vì throw BadRequestError(400), throw Error(401) để frontend tự động bắt interceptor -> logout
      // Nếu user không tồn tại trong DB, phiên làm việc không còn hợp lệ
      if (!user) {
        const error: any = new Error("Phiên làm việc không hợp lệ (User not found)");
        error.statusCode = 401;
        error.isOperational = true;
        throw error;
      }
      
      candidate = await prisma.candidateProfile.create({
        data: { userId, fullName: user.email.split('@')[0] }
      });
    }
    
    return candidate;
  }

  async getSavedJobs(userId: string, params: SavedJobPaginationParams) {
    const candidate = await this.ensureCandidate(userId);
    return await this.repository.getSavedJobs(candidate.id, params);
  }

  async getSavedJobIds(userId: string) {
    const candidate = await this.ensureCandidate(userId);
    const ids = await this.repository.getSavedJobIds(candidate.id);
    return { data: ids };
  }

  async isSaved(userId: string, jobId: string) {
    const candidate = await this.ensureCandidate(userId);
    const saved = await this.repository.isSaved(candidate.id, jobId);
    return { isSaved: saved };
  }

  async saveJob(userId: string, jobId: string) {
    const candidate = await this.ensureCandidate(userId);

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Job not found");

    const alreadySaved = await this.repository.isSaved(candidate.id, jobId);
    if (alreadySaved) throw new BadRequestError("Job is already saved");

    return await this.repository.saveJob(candidate.id, jobId);
  }

  async unsaveJob(userId: string, jobId: string) {
    const candidate = await this.ensureCandidate(userId);

    const alreadySaved = await this.repository.isSaved(candidate.id, jobId);
    if (!alreadySaved) throw new BadRequestError("Job is not saved yet");

    await this.repository.unsaveJob(candidate.id, jobId);
  }
}
