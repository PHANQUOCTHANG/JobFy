import { EmployerJobService } from "../job/employer.job.service";
import { PrismaClient, JobStatus } from "@prisma/client";

const mockPrisma = {
  company: {
    findFirst: jest.fn(),
  },
  jobs: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  employerSubscription: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrisma)),
  jobSkill: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  jobTag: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  application: {
    count: jest.fn(),
  }
} as unknown as PrismaClient;

describe("EmployerJobService", () => {
  let service: EmployerJobService;

  beforeEach(() => {
    service = new EmployerJobService(mockPrisma);
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("should throw error if company not found", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue(null);
      
      await expect(service.createJob("user-1", {
        categoryId: 1, title: "Job 1", description: "Desc",
      })).rejects.toThrow("Không tìm thấy công ty");
    });

    it("should throw error if active jobs exceed quota", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.count as jest.Mock).mockResolvedValue(2); // Has 2 active jobs
      (mockPrisma.employerSubscription.findFirst as jest.Mock).mockResolvedValue({
        plan: { maxJobs: 1 } // Limit is 1
      });

      await expect(service.createJob("user-1", {
        categoryId: 1, title: "Job 1", description: "Desc",
      })).rejects.toThrow("đã đạt giới hạn đăng tin");
    });

    it("should create job successfully", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.employerSubscription.findFirst as jest.Mock).mockResolvedValue(null); // Fallback to limit 1
      (mockPrisma.jobs.findFirst as jest.Mock).mockResolvedValue(null); // Slug not exist
      (mockPrisma.jobs.create as jest.Mock).mockResolvedValue({ id: "new-job-id" });

      const result = await service.createJob("user-1", {
        categoryId: 1, title: "Backend Developer", description: "Mô tả công việc",
        skillIds: [1, 2],
      });

      expect(result).toHaveProperty("id", "new-job-id");
      expect(mockPrisma.jobSkill.createMany).toHaveBeenCalled();
    });
  });

  describe("changeJobStatus", () => {
    it("should throw error if job not found", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.changeJobStatus("user-1", "job-1", JobStatus.published))
        .rejects.toThrow("Không tìm thấy tin tuyển dụng");
    });

    it("should throw error if trying to close a draft job directly", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findFirst as jest.Mock).mockResolvedValue({ id: "job-1", status: JobStatus.draft });

      await expect(service.changeJobStatus("user-1", "job-1", JobStatus.closed))
        .rejects.toThrow("Không thể đóng tin đang ở nháp");
    });

    it("should set publishedAt when status is published", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findFirst as jest.Mock).mockResolvedValue({ id: "job-1", status: JobStatus.draft });
      (mockPrisma.jobs.update as jest.Mock).mockResolvedValue({ id: "job-1", status: JobStatus.published });

      await service.changeJobStatus("user-1", "job-1", JobStatus.published);

      expect(mockPrisma.jobs.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: JobStatus.published,
            publishedAt: expect.any(Date),
            expiresAt: expect.any(Date),
          })
        })
      );
    });
  });

  describe("deleteJob", () => {
    it("should soft delete if no pending applications", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findFirst as jest.Mock).mockResolvedValue({ id: "job-1" });
      (mockPrisma.application.count as jest.Mock).mockResolvedValue(0);

      await service.deleteJob("user-1", "job-1");

      expect(mockPrisma.jobs.update).toHaveBeenCalledWith({
        where: { id: "job-1" },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it("should throw error if job has pending applications", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findFirst as jest.Mock).mockResolvedValue({ id: "job-1" });
      (mockPrisma.application.count as jest.Mock).mockResolvedValue(5);

      await expect(service.deleteJob("user-1", "job-1"))
        .rejects.toThrow("đang có ứng viên chờ duyệt");
    });
  });
});
