import { PrismaClient, Prisma, User } from "@prisma/client";
import { BaseQuery, IPaginatedResult } from "@/utils/query";
import { getSearchPattern } from "@/utils/searchUtils";

export interface IUserRepository {
  create(data: any): Promise<any>;
  findAll(query: BaseQuery): Promise<IPaginatedResult<any>>;
  findById(id: string): Promise<any | null>;
  findByEmail(email: string): Promise<any | null>;
  updateById(id: string, data: any): Promise<any | null>;
  updateByEmail(email: string, data: any): Promise<any>;
  softDelete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Tạo người dùng mới và tạo CandidateProfile nếu vai trò là candidate
  async create(data: any): Promise<any> {
    const { fullName, password, avatarUrl, ...rest } = data;
    const passwordHash = password; // Mật khẩu đã được hash từ Service

    return this.prisma.user.create({
      data: {
        ...rest,
        email: rest.email.toLowerCase(),
        passwordHash,
        avatarUrl,
        status: rest.status ?? "pending_verification",
        ...(rest.role === "candidate" && fullName && {
          candidateProfile: {
            create: {
              fullName,
            },
          },
        }),
      },
      include: {
        candidateProfile: true,
      },
    });
  }

  // Lấy danh sách người dùng (phân trang + tìm kiếm theo CandidateProfile.fullName / email)
  async findAll(query: BaseQuery): Promise<IPaginatedResult<any>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    // Xây dựng điều kiện tìm kiếm (không phân biệt hoa thường)
    const where: Prisma.UserWhereInput = {
      deletedAt: null, // Chỉ lấy user chưa bị xóa mềm
      ...(query.search && {
        OR: [
          {
            candidateProfile: {
              fullName: {
                contains: getSearchPattern(query.search),
                mode: "insensitive",
              },
            },
          },
          { email: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    };

    // Lấy dữ liệu song song
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          candidateProfile: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy chi tiết người dùng theo ID (không lấy bị xóa mềm)
  async findById(id: string): Promise<any | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        candidateProfile: true,
      },
    });
  }

  // Lấy người dùng theo email (không lấy bị xóa mềm)
  async findByEmail(email: string): Promise<any | null> {
    return this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), deletedAt: null },
      include: {
        candidateProfile: true,
      },
    });
  }

  // Cập nhật người dùng theo ID và CandidateProfile nếu có fullName
  async updateById(
    id: string,
    data: any,
  ): Promise<any | null> {
    try {
      const { fullName, password, avatarUrl, ...rest } = data;
      const passwordHash = password; // Mật khẩu mới đã được hash từ Service (nếu có)

      // Kiểm tra xem đã có CandidateProfile chưa
      const hasCandidateProfile = await this.prisma.candidateProfile.findUnique({
        where: { userId: id },
      });

      const updatePayload: Prisma.UserUpdateInput = {
        ...rest,
        ...(passwordHash && { passwordHash }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      };

      return await this.prisma.$transaction(async (tx) => {
        // Nếu có fullName thì cập nhật hoặc tạo mới CandidateProfile
        if (fullName) {
          if (hasCandidateProfile) {
            await tx.candidateProfile.update({
              where: { userId: id },
              data: { fullName },
            });
          } else {
            await tx.candidateProfile.create({
              data: { userId: id, fullName },
            });
          }
        }

        return tx.user.update({
          where: { id },
          data: updatePayload,
          include: {
            candidateProfile: true,
          },
        });
      });
    } catch (error: any) {
      if (error.code === "P2025") return null; // User không tồn tại
      throw error;
    }
  }

  // Cập nhật người dùng theo email (dùng cho Reset Password)
  async updateByEmail(email: string, data: any): Promise<any> {
    const { password, ...rest } = data;
    const passwordHash = password;

    return this.prisma.user.update({
      where: { email },
      data: {
        ...rest,
        ...(passwordHash && { passwordHash }),
      },
      include: {
        candidateProfile: true,
      },
    });
  }

  // Xóa mềm người dùng (đánh dấu xóa, không xóa cứng)
  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "inactive",
      },
    });
  }
}
