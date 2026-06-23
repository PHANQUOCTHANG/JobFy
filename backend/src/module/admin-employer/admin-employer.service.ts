import { PrismaClient } from "@prisma/client";
import AppError from "@/utils/appError";
import { VerifyCompanyRequest } from "./admin-employer.request";

export class AdminEmployerService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Lấy danh sách công ty đang chờ duyệt (Có mã số thuế nhưng chưa verified)
   */
  async getPendingCompanies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, companies] = await Promise.all([
      this.prisma.company.count({
        where: { taxCode: { not: null }, isVerified: false },
      }),
      this.prisma.company.findMany({
        where: { taxCode: { not: null }, isVerified: false },
        include: {
          owner: {
            select: { id: true, email: true, phone: true }
          },
          industry: true
        },
        skip,
        take: limit,
        orderBy: { updatedAt: "asc" }, // Ưu tiên hồ sơ nộp trước
      }),
    ]);

    return {
      companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy chi tiết hồ sơ công ty để review
   */
  async getCompanyDetail(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        owner: {
          select: { id: true, email: true, phone: true }
        },
        industry: true,
        province: true,
        district: true,
      },
    });

    if (!company) throw new AppError("Không tìm thấy thông tin công ty", 404);
    return company;
  }

  /**
   * Phê duyệt hoặc Từ chối hồ sơ
   */
  async verifyCompany(companyId: string, adminId: string, data: VerifyCompanyRequest) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { owner: true }
    });

    if (!company) throw new AppError("Không tìm thấy công ty", 404);

    const isApproved = data.status === "approved";

    return this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái công ty
      const updatedCompany = await tx.company.update({
        where: { id: companyId },
        data: {
          isVerified: isApproved,
          rejectedReason: isApproved ? null : data.reason || "Không có lý do cụ thể.",
        },
      });

      // 2. Ghi log hoạt động của Admin
      await tx.adminLog.create({
        data: {
          adminId,
          action: isApproved ? "APPROVE_COMPANY" : "REJECT_COMPANY",
          targetType: "company",
          targetId: companyId,
          newValue: { reason: data.reason } as any,
        },
      });

      return updatedCompany;
    });
  }
}