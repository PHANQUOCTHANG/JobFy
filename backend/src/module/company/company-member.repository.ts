import { PrismaClient, Prisma, CompanyMember } from "@prisma/client";

export interface ICompanyMemberRepository {
  create(data: Prisma.CompanyMemberCreateInput): Promise<CompanyMember>;
  findByCompanyId(companyId: string): Promise<any[]>;
  findById(id: number): Promise<CompanyMember | null>;
  findByCompanyAndUser(companyId: string, userId: string): Promise<CompanyMember | null>;
  updateById(id: number, data: Prisma.CompanyMemberUpdateInput): Promise<CompanyMember | null>;
  deleteById(id: number): Promise<void>;
}

export class CompanyMemberRepository implements ICompanyMemberRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.CompanyMemberCreateInput): Promise<CompanyMember> {
    return this.prisma.companyMember.create({ data });
  }

  async findByCompanyId(companyId: string): Promise<any[]> {
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: { select: { id: true, email: true, avatarUrl: true } } },
      orderBy: { createdAt: "asc" }
    });
  }

  async findById(id: number): Promise<CompanyMember | null> {
    return this.prisma.companyMember.findUnique({ where: { id } });
  }

  async findByCompanyAndUser(companyId: string, userId: string): Promise<CompanyMember | null> {
    return this.prisma.companyMember.findUnique({
      where: { companyId_userId: { companyId, userId } }
    });
  }

  async updateById(id: number, data: Prisma.CompanyMemberUpdateInput): Promise<CompanyMember | null> {
    try {
      return await this.prisma.companyMember.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await this.prisma.companyMember.delete({ where: { id } });
    } catch (error: any) {
      if (error.code !== "P2025") throw error;
    }
  }
}
