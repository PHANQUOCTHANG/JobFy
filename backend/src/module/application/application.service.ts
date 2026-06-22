import AppError from "@/utils/appError";
import { ApplicationQuery } from "./application.type";
import { IApplicationRepository } from "./application.repository";
import { IJobRepository } from "@/module/job/job.repository";
import { ICandidateProfileRepository } from "@/module/candidate-profile/candidate-profile.repository";
import { IResumeRepository } from "@/module/resume/resume.repository";
import { ICompanyRepository } from "@/module/company/company.repository";
import { NotificationService } from "@/module/notification/notification.service";
import { CreateApplicationRequestDto, UpdateApplicationStatusRequestDto } from "./application.request";
import { ApplicationResponseDto } from "./application.response";

export class ApplicationService {
  constructor(
    private readonly appRepo: IApplicationRepository,
    private readonly jobRepo: IJobRepository,
    private readonly candidateProfileRepo: ICandidateProfileRepository,
    private readonly resumeRepo: IResumeRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly notificationService: NotificationService
  ) { }

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
        fullName: candidate.fullName,
        email: (candidate as any).user?.email || null,
        phone: (candidate as any).user?.phone || null,
      });

      this.notificationService.createNotification({
        userId: job.postedBy,
        type: "system",
        title: "Có ứng viên mới",
        body: `Ứng viên ${candidate.fullName} vừa ứng tuyển vị trí ${job.title}`,
        data: { link: `/employer/applications` },
      }).catch(console.error);

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
        fullName: dto.fullName || candidate.fullName,
        email: dto.email || (candidate as any).user?.email || null,
        phone: dto.phone || (candidate as any).user?.phone || null,
      });

      this.notificationService.createNotification({
        userId: job.postedBy,
        type: "system",
        title: "Có ứng viên mới",
        body: `Ứng viên ${candidate.fullName} vừa ứng tuyển vị trí ${job.title}`,
        data: { link: `/employer/applications` },
      }).catch(console.error);

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
    const app: any = await this.appRepo.findById(id);
    if (!app) throw new AppError("Không tìm thấy đơn ứng tuyển", 404);
    
    const company = await this.companyRepo.findById(app.job.companyId);
    if (!company || company.ownerId !== userId) {
      throw new AppError("Bạn không có quyền thao tác trên đơn ứng tuyển này", 403);
    }
    
    const updated = await this.appRepo.updateStatus(id, dto.status, userId, dto.note ?? undefined);

    this.notificationService.createNotification({
      userId: app.candidate.userId,
      type: "system",
      title: "Cập nhật trạng thái ứng tuyển",
      body: `Đơn ứng tuyển của bạn cho vị trí ${app.job.title} đã chuyển sang trạng thái: ${dto.status}`,
      data: { link: `/my-applications` },
    }).catch(console.error);

    return ApplicationResponseDto.from(updated);
  }

  async addNote(id: string, userId: string, dto: any): Promise<any> {
    const app: any = await this.appRepo.findById(id);
    if (!app) throw new AppError("Không tìm thấy đơn ứng tuyển", 404);

    const company = await this.companyRepo.findById(app.job.companyId);
    if (!company || company.ownerId !== userId) {
      throw new AppError("Bạn không có quyền thao tác trên đơn ứng tuyển này", 403);
    }

    const note = await this.appRepo.addNote({
      application: { connect: { id } },
      author: { connect: { id: userId } },
      content: dto.content,
      isInternal: dto.isInternal
    });

    return note;
  }
}
