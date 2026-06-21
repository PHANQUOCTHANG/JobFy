import { EmployerCandidateService } from "../employer.candidate.service";
import { PrismaClient, ApplicationStatus } from "@prisma/client";
import { IEmailService } from "@/module/auth/email/email.service";

const mockPrisma = {
  company: {
    findFirst: jest.fn(),
  },
  application: {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    groupBy: jest.fn(),
  },
  jobs: {
    findMany: jest.fn(),
  }
} as unknown as PrismaClient;

const mockEmailService: IEmailService = {
  sendInterviewInviteEmail: jest.fn().mockResolvedValue(true),
  sendRejectionEmail: jest.fn().mockResolvedValue(true),
  sendJobOfferEmail: jest.fn().mockResolvedValue(true),
} as any;

describe("EmployerCandidateService", () => {
  let service: EmployerCandidateService;

  beforeEach(() => {
    service = new EmployerCandidateService(mockPrisma, mockEmailService);
    jest.clearAllMocks();
  });

  describe("getCandidates", () => {
    it("should throw error if company not found", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue(null);
      
      await expect(service.getCandidates("user-1", { page: 1, limit: 10 }))
        .rejects.toThrow("Không tìm thấy công ty");
    });

    it("should apply filters correctly to where clause", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.application.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.application.findMany as jest.Mock).mockResolvedValue([]);

      await service.getCandidates("user-1", { 
        page: 2, 
        limit: 15,
        status: ApplicationStatus.pending,
        keyword: "John",
        jobId: "job-1"
      });

      expect(mockPrisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 15, // (page 2 - 1) * 15
          take: 15,
          where: expect.objectContaining({
            jobId: "job-1",
            status: ApplicationStatus.pending,
            candidate: expect.objectContaining({
              fullName: { contains: "John", mode: "insensitive" }
            })
          })
        })
      );
    });
  });

  describe("updateApplicationStatus", () => {
    it("should throw if application not found in company", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1", name: "Company" });
      (mockPrisma.application.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.updateApplicationStatus("user-1", "app-1", ApplicationStatus.interviewed))
        .rejects.toThrow("Không tìm thấy hồ sơ");
    });

    it("should update status and trigger email for interview", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1", name: "Tech Corp" });
      (mockPrisma.application.findFirst as jest.Mock).mockResolvedValue({ 
        id: "app-1",
        job: { title: "Dev" },
        candidate: { fullName: "John Doe", user: { email: "john@example.com" } }
      });
      (mockPrisma.application.update as jest.Mock).mockResolvedValue({ id: "app-1" });

      await service.updateApplicationStatus("user-1", "app-1", ApplicationStatus.interviewed);

      expect(mockPrisma.application.update).toHaveBeenCalledWith({
        where: { id: "app-1" },
        data: expect.objectContaining({
          status: ApplicationStatus.interviewed,
          reviewedBy: "user-1",
        })
      });

      expect(mockEmailService.sendInterviewInviteEmail).toHaveBeenCalledWith(
        "john@example.com", "John Doe", "Dev", "Tech Corp"
      );
    });

    it("should trigger rejection email when status is rejected", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1", name: "Tech Corp" });
      (mockPrisma.application.findFirst as jest.Mock).mockResolvedValue({ 
        id: "app-1",
        job: { title: "Dev" },
        candidate: { fullName: "John Doe", user: { email: "john@example.com" } }
      });

      await service.updateApplicationStatus("user-1", "app-1", ApplicationStatus.rejected);

      expect(mockEmailService.sendRejectionEmail).toHaveBeenCalledWith(
        "john@example.com", "John Doe", "Dev", "Tech Corp"
      );
    });
  });

  describe("getConversionReport", () => {
    it("should parse report funnel correctly", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.application.groupBy as jest.Mock).mockResolvedValue([
        { status: "pending", _count: { id: 15 } },
        { status: "interviewed", _count: { id: 5 } },
        { status: "offered", _count: { id: 2 } },
      ]);

      const result = await service.getConversionReport("user-1");

      expect(result.total).toBe(22);
      expect(result.pending).toBe(15);
      expect(result.interviewed).toBe(5);
      expect(result.offered).toBe(2);
      expect(result.rejected).toBe(0);
    });
  });
});
