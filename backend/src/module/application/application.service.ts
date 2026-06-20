import AppError from "@/utils/appError";
import { ApplicationQuery } from "./application.type";
import { IApplicationRepository } from "./application.repository";
import { IJobRepository } from "@/module/job/job.repository";
import { ICandidateProfileRepository } from "@/module/candidate-profile/candidate-profile.repository";
import { IResumeRepository } from "@/module/resume/resume.repository";
import { CreateApplicationRequestDto, UpdateApplicationStatusRequestDto } from "./application.request";
import { ApplicationResponseDto } from "./application.response";

export class ApplicationService {
  constructor(
    private readonly appRepo: IApplicationRepository,
    private readonly jobRepo: IJobRepository,
    private readonly candidateProfileRepo: ICandidateProfileRepository,
    private readonly resumeRepo: IResumeRepository
  ) {}

  async apply(userId: string, dto: CreateApplicationRequestDto): Promise<ApplicationResponseDto> {
    const candidate = await this.candidateProfileRepo.findByUserId(userId);
    if (!candidate) throw new AppError("Bạn chưa có hồ sơ ứng viên", 403);

    const job = await this.jobRepo.findById(dto.jobId);
    if (!job) throw new AppError("Công việc không tồn tại", 404);
    if (job.status !== "published") throw new AppError("Công việc này không nhận ứng tuyển lúc này", 400);

    try {
      const application = await this.appRepo.create({
        job: { connect: { id: dto.jobId } },
        candidate: { connect: { id: candidate.id } },
        ...(dto.resumeId && { resume: { connect: { id: dto.resumeId } } }),
        coverLetter: dto.coverLetter,
        source: dto.source,
      });

      return ApplicationResponseDto.from(application);
    } catch (error: any) {
      if (error.code === "P2002") throw new AppError("Bạn đã ứng tuyển công việc này rồi", 409);
      throw error;
    }
  }

  async applyWithCvUpload(userId: string, dto: any): Promise<ApplicationResponseDto> {
    const candidate = await this.candidateProfileRepo.findByUserId(userId);
    if (!candidate) throw new AppError("Bạn chưa có hồ sơ ứng viên", 403);

    const job = await this.jobRepo.findById(dto.jobId);
    if (!job) throw new AppError("Công việc không tồn tại", 404);
    if (job.status !== "published") throw new AppError("Công việc này không nhận ứng tuyển lúc này", 400);

    try {
      // 1. Tạo Resume mới với fileUrl từ Cloudinary
      const resume = await this.resumeRepo.create({
        candidate: { connect: { id: candidate.id } },
        title: dto.fileName || "CV Upload",
        fileUrl: dto.fileUrl,
        isPrimary: false,
      });

      // 2. Tạo Application liên kết Resume
      const application = await this.appRepo.create({
        job: { connect: { id: dto.jobId } },
        candidate: { connect: { id: candidate.id } },
        resume: { connect: { id: resume.id } },
        coverLetter: dto.coverLetter,
        source: "upload",
      });

      return ApplicationResponseDto.from(application);
    } catch (error: any) {
      if (error.code === "P2002") throw new AppError("Bạn đã ứng tuyển công việc này rồi", 409);
      throw error;
    }
  }

  async findAll(query: ApplicationQuery): Promise<any> {
    const result = await this.appRepo.findAll(query);
    return { ...result, data: ApplicationResponseDto.fromList(result.data) };
  }

  async findById(id: string): Promise<ApplicationResponseDto> {
    const app = await this.appRepo.findById(id);
    if (!app) throw new AppError("Không tìm thấy đơn ứng tuyển", 404);
    return ApplicationResponseDto.from(app);
  }

  async updateStatus(id: string, userId: string, dto: UpdateApplicationStatusRequestDto): Promise<ApplicationResponseDto> {
    const app = await this.appRepo.findById(id);
    if (!app) throw new AppError("Không tìm thấy đơn ứng tuyển", 404);
    
    // In real app: check if userId belongs to company that posted the job
    
    const updated = await this.appRepo.updateStatus(id, dto.status, userId, dto.note ?? undefined);
    return ApplicationResponseDto.from(updated);
  }

  async addNote(id: string, userId: string, dto: any): Promise<any> {
    const app = await this.appRepo.findById(id);
    if (!app) throw new AppError("Không tìm thấy đơn ứng tuyển", 404);
    
    const note = await this.appRepo.addNote({
      application: { connect: { id } },
      author: { connect: { id: userId } },
      content: dto.content,
      isInternal: dto.isInternal
    });

    return note;
  }
}
