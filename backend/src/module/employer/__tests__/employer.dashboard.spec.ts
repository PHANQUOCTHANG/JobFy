import { EmployerDashboardService } from "../employer.dashboard";
import { PrismaClient } from "@prisma/client";

// Mock Prisma
const mockPrisma = {
  company: {
    findFirst: jest.fn(),
  },
  application: {
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  jobs: {
    count: jest.fn(),
    aggregate: jest.fn(),
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

describe("EmployerDashboardService", () => {
  let service: EmployerDashboardService;

  beforeEach(() => {
    service = new EmployerDashboardService(mockPrisma);
    jest.clearAllMocks();
  });

  describe("getOverview", () => {
    it("should return zero for all stats if company is not found", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getOverview("test-user-id");

      expect(result).toEqual({
        totalApplications: 0,
        totalJobs: 0,
        activeJobs: 0,
        totalViews: 0,
      });
      expect(mockPrisma.company.findFirst).toHaveBeenCalledWith({
        where: { ownerId: "test-user-id" },
        select: { id: true },
      });
    });

    it("should return correct stats when company exists without date filter", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.application.count as jest.Mock).mockResolvedValue(100);
      (mockPrisma.jobs.count as jest.Mock)
        .mockResolvedValueOnce(50)  // totalJobs
        .mockResolvedValueOnce(20); // activeJobs
      (mockPrisma.jobs.aggregate as jest.Mock).mockResolvedValue({ _sum: { viewCount: 5000 } });

      const result = await service.getOverview("test-user-id");

      expect(result).toEqual({
        totalApplications: 100,
        totalJobs: 50,
        activeJobs: 20,
        totalViews: 5000,
      });
    });

    it("should handle null view count sum gracefully", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.application.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.jobs.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.jobs.aggregate as jest.Mock).mockResolvedValue({ _sum: { viewCount: null } });

      const result = await service.getOverview("test-user-id");

      expect(result.totalViews).toBe(0);
    });

    it("should apply date filter correctly when startDate is provided", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.application.count as jest.Mock).mockResolvedValue(10);
      (mockPrisma.jobs.count as jest.Mock).mockResolvedValue(5);
      (mockPrisma.jobs.aggregate as jest.Mock).mockResolvedValue({ _sum: { viewCount: 100 } });

      const startDate = new Date();
      await service.getOverview("test-user-id", startDate);

      expect(mockPrisma.application.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: { gte: startDate },
          })
        })
      );
    });
  });

  describe("getPipeline", () => {
    it("should return empty array if company is not found", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getPipeline("test-user-id");

      expect(result).toEqual([]);
    });

    it("should map grouped pipeline status correctly", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.application.groupBy as jest.Mock).mockResolvedValue([
        { status: "pending", _count: { status: 10 } },
        { status: "interviewed", _count: { status: 5 } },
        { status: "offered", _count: { status: 2 } },
      ]);

      const result = await service.getPipeline("test-user-id");

      expect(result).toEqual([
        { status: "pending", count: 10 },
        { status: "interviewed", count: 5 },
        { status: "offered", count: 2 },
      ]);
    });
  });

  describe("getRecentJobs", () => {
    it("should return empty array if company not found", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.getRecentJobs("test-user-id");

      expect(result).toEqual([]);
    });

    it("should respect limit parameter", async () => {
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findMany as jest.Mock).mockResolvedValue([]);

      await service.getRecentJobs("test-user-id", 3);

      expect(mockPrisma.jobs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
        })
      );
    });

    it("should return job list correctly formatted", async () => {
      const mockJobs = [
        { id: "job-1", title: "Dev", jobType: "full_time", status: "published", viewCount: 100, applyCount: 10, createdAt: new Date(), _count: { applications: 10 } }
      ];
      (mockPrisma.company.findFirst as jest.Mock).mockResolvedValue({ id: "company-1" });
      (mockPrisma.jobs.findMany as jest.Mock).mockResolvedValue(mockJobs);

      const result = await service.getRecentJobs("test-user-id");

      expect(result).toEqual(mockJobs);
    });
  });
});
