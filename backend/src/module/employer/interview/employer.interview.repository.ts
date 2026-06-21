import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { ScheduleInterviewRequest } from "./employer.interview.request";

export class EmployerInterviewRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findScheduledInterviews(companyId: string, startDate?: Date, endDate?: Date) {
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {}; // We will filter based on the Note creation or JSON content
      // Note: In a real system, you'd add an explicit scheduledAt column.
      // Here we parse the ApplicationNote content as a workaround since we use the existing schema.
    }

    return this.prisma.application.findMany({
      where: {
        job: { companyId },
        status: ApplicationStatus.interviewed,
      },
      include: {
        job: { select: { title: true } },
        candidate: { select: { fullName: true, user: { select: { email: true, phone: true } } } },
        notes: {
          where: { isInternal: false }, // Using public notes to store interview details temporarily
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  }

  async getApplicationWithCompany(applicationId: string, companyId: string) {
    return this.prisma.application.findFirst({
      where: {
        id: applicationId,
        job: { companyId },
      },
      include: {
        job: { select: { title: true, companyId: true } },
        candidate: { select: { fullName: true, user: { select: { email: true } } } },
      },
    });
  }

  async scheduleInterview(
    applicationId: string,
    authorId: string,
    data: ScheduleInterviewRequest,
    oldStatus: ApplicationStatus
  ) {
    const interviewContent = JSON.stringify({
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      type: data.type,
      location: data.location,
      note: data.note,
      isInterviewRecord: true,
    });

    return this.prisma.$transaction(async (tx) => {
      // 1. Update Application Status
      const application = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: ApplicationStatus.interviewed,
          reviewedAt: new Date(),
          reviewedBy: authorId,
        },
      });

      // 2. Add Status History
      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          oldStatus,
          newStatus: ApplicationStatus.interviewed,
          changedBy: authorId,
          note: `Lên lịch phỏng vấn: ${data.scheduledAt}`,
        },
      });

      // 3. Add Application Note containing Interview details
      const note = await tx.applicationNote.create({
        data: {
          applicationId,
          authorId,
          content: interviewContent,
          isInternal: false, // We use this flag to distinguish from purely internal HR notes
        },
      });

      return { application, note };
    });
  }

  async cancelInterview(applicationId: string, authorId: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      // Revert to pending or rejected depending on logic. Here we revert to pending.
      const application = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: ApplicationStatus.pending,
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          oldStatus: ApplicationStatus.interviewed,
          newStatus: ApplicationStatus.pending,
          changedBy: authorId,
          note: `Hủy phỏng vấn: ${reason}`,
        },
      });

      // Add a note about the cancellation
      await tx.applicationNote.create({
        data: {
          applicationId,
          authorId,
          content: `Hủy lịch phỏng vấn. Lý do: ${reason}`,
          isInternal: true,
        },
      });

      return application;
    });
  }
}
