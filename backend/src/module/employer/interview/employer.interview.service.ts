import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { EmployerInterviewRepository } from "./employer.interview.repository";
import { ScheduleInterviewRequest, CancelInterviewRequest } from "./employer.interview.request";
import AppError from "@/utils/appError";
import { IEmailService } from "@/module/auth/email/email.service";

export class EmployerInterviewService {
  private repository: EmployerInterviewRepository;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly emailService: IEmailService
  ) {
    this.repository = new EmployerInterviewRepository(prisma);
  }

  async getInterviews(userId: string) {
    const company = await this.getCompanyByOwnerId(userId);
    const interviews = await this.repository.findScheduledInterviews(company.id);

    // Map data to parse the JSON note back to object
    return interviews.map(app => {
      let interviewDetails = {};
      if (app.notes.length > 0) {
        try {
          interviewDetails = JSON.parse(app.notes[0].content);
        } catch (e) {
          interviewDetails = { raw: app.notes[0].content };
        }
      }

      return {
        applicationId: app.id,
        jobTitle: app.job.title,
        candidateName: app.candidate.fullName,
        candidateEmail: app.candidate.user?.email,
        candidatePhone: app.candidate.user?.phone,
        interviewDetails,
        appliedAt: app.appliedAt,
      };
    });
  }

  async scheduleInterview(userId: string, data: ScheduleInterviewRequest) {
    const company = await this.getCompanyByOwnerId(userId);
    const application = await this.repository.getApplicationWithCompany(data.applicationId, company.id);

    if (!application) {
      throw new AppError("Không tìm thấy hồ sơ ứng viên hợp lệ", 404);
    }

    if (application.status === ApplicationStatus.interviewed) {
      throw new AppError("Ứng viên này đã được lên lịch phỏng vấn", 400);
    }

    const result = await this.repository.scheduleInterview(
      application.id,
      userId,
      data,
      application.status
    );

    // Fire & Forget Email notification
    const candidateEmail = application.candidate.user?.email;
    if (candidateEmail) {
      // Assume email service has a method for sending custom interview invites
      // Passing data to candidate
      this.emailService.sendInterviewInviteEmail(
        candidateEmail,
        application.candidate.fullName,
        application.job.title,
        company.name
      ).catch(console.error);
    }

    return result;
  }

  async cancelInterview(userId: string, applicationId: string, data: CancelInterviewRequest) {
    const company = await this.getCompanyByOwnerId(userId);
    const application = await this.repository.getApplicationWithCompany(applicationId, company.id);

    if (!application) {
      throw new AppError("Không tìm thấy hồ sơ ứng viên", 404);
    }

    if (application.status !== ApplicationStatus.interviewed) {
      throw new AppError("Ứng viên chưa được lên lịch phỏng vấn", 400);
    }

    const result = await this.repository.cancelInterview(application.id, userId, data.reason);

    // Can add email logic to send cancellation email to candidate here

    return result;
  }

  private async getCompanyByOwnerId(ownerId: string) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId },
      // FIX: select both id and name (name is needed in scheduleInterview email)
      select: { id: true, name: true },
    });

    if (!company) {
      throw new AppError("Không tìm thấy công ty của bạn.", 403);
    }

    return company;
  }
}
