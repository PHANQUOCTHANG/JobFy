import { PrismaClient, Prisma, CompanyLocation } from "@prisma/client";

export interface ICompanyLocationRepository {
  create(data: Prisma.CompanyLocationCreateInput): Promise<CompanyLocation>;
  findByCompanyId(companyId: string): Promise<CompanyLocation[]>;
  findById(id: number): Promise<CompanyLocation | null>;
  updateById(id: number, data: Prisma.CompanyLocationUpdateInput): Promise<CompanyLocation | null>;
  deleteById(id: number): Promise<void>;
}

export class CompanyLocationRepository implements ICompanyLocationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.CompanyLocationCreateInput): Promise<CompanyLocation> {
    return this.prisma.companyLocation.create({ data });
  }

  async findByCompanyId(companyId: string): Promise<CompanyLocation[]> {
    return this.prisma.companyLocation.findMany({
      where: { companyId },
      orderBy: { createdAt: "asc" }
    });
  }

  async findById(id: number): Promise<CompanyLocation | null> {
    return this.prisma.companyLocation.findUnique({ where: { id } });
  }

  async updateById(id: number, data: Prisma.CompanyLocationUpdateInput): Promise<CompanyLocation | null> {
    try {
      return await this.prisma.companyLocation.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await this.prisma.companyLocation.delete({ where: { id } });
    } catch (error: any) {
      if (error.code !== "P2025") throw error;
    }
  }
}
