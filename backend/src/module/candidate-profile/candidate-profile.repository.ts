import { PrismaClient, Prisma, CandidateProfile } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { CandidateProfileQuery } from "./candidate-profile.type";

export interface ICandidateProfileRepository {
  create(data: Prisma.CandidateProfileUncheckedCreateInput): Promise<CandidateProfile>;
  findAll(query: CandidateProfileQuery): Promise<IPaginatedResult<CandidateProfile>>;
  findById(id: string): Promise<CandidateProfile | null>;
  findByUserId(userId: string): Promise<CandidateProfile | null>;
  updateById(id: string, data: Prisma.CandidateProfileUncheckedUpdateInput): Promise<CandidateProfile | null>;
  incrementViewCount(id: string): Promise<void>;
  deleteById(id: string): Promise<void>;
}

export class CandidateProfileRepository implements ICandidateProfileRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async create(data: Prisma.CandidateProfileUncheckedCreateInput): Promise<CandidateProfile> {
    return this.prisma.candidateProfile.create({ data });
  }

  async findAll(query: CandidateProfileQuery): Promise<IPaginatedResult<CandidateProfile>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    const where: Prisma.CandidateProfileWhereInput = {
      ...(query.provinceId !== undefined && { provinceId: query.provinceId }),
      ...(query.experienceLevel !== undefined && { experienceLevel: query.experienceLevel }),
      ...(query.isLooking !== undefined && { isLooking: query.isLooking }),
      isProfilePublic: true, // Only public profiles in list
    };

    const [data, total] = await Promise.all([
      this.prisma.candidateProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CandidateProfile | null> {
    return this.prisma.candidateProfile.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<CandidateProfile | null> {
    return this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: { user: true }
    });
  }

  async updateById(id: string, data: Prisma.CandidateProfileUncheckedUpdateInput): Promise<CandidateProfile | null> {
    try {
      return await this.prisma.candidateProfile.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.prisma.candidateProfile.update({
        where: { id },
        data: { profileViews: { increment: 1 } },
      });
    } catch (error) {
      // Ignore if profile doesn't exist
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.prisma.candidateProfile.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === "P2025") return; // Not found
      throw error;
    }
  }
}
