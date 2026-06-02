import { PrismaClient, Prisma, Resume, ResumeEducation, ResumeExperience, ResumeSkill } from "@prisma/client";
import { IPaginatedResult } from "@/utils/query";
import { ResumeQuery } from "./resume.type";

export interface IResumeRepository {
  // Resume Base
  create(data: Prisma.ResumeCreateInput): Promise<Resume>;
  findAll(query: ResumeQuery): Promise<IPaginatedResult<Resume>>;
  findById(id: string): Promise<Resume | null>;
  updateById(id: string, data: Prisma.ResumeUpdateInput): Promise<Resume | null>;
  deleteById(id: string): Promise<void>;
  incrementViewCount(id: string): Promise<void>;

  // Education
  addEducation(data: Prisma.ResumeEducationCreateInput): Promise<ResumeEducation>;
  updateEducation(id: number, data: Prisma.ResumeEducationUpdateInput): Promise<ResumeEducation | null>;
  deleteEducation(id: number): Promise<void>;

  // Experience
  addExperience(data: Prisma.ResumeExperienceCreateInput): Promise<ResumeExperience>;
  updateExperience(id: number, data: Prisma.ResumeExperienceUpdateInput): Promise<ResumeExperience | null>;
  deleteExperience(id: number): Promise<void>;

  // Skill
  addSkill(data: Prisma.ResumeSkillCreateInput): Promise<ResumeSkill>;
  updateSkill(resumeId: string, skillId: number, data: Prisma.ResumeSkillUpdateInput): Promise<ResumeSkill | null>;
  deleteSkill(resumeId: string, skillId: number): Promise<void>;
}

export class ResumeRepository implements IResumeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // ================= Resume Base =================
  async create(data: Prisma.ResumeCreateInput): Promise<Resume> {
    return this.prisma.resume.create({ data });
  }

  async findAll(query: ResumeQuery): Promise<IPaginatedResult<Resume>> {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(query.limit ?? 10, 100);

    const where: Prisma.ResumeWhereInput = {
      ...(query.candidateId && { candidateId: query.candidateId }),
      ...(query.isPublic !== undefined && { isPublic: query.isPublic }),
    };

    const [data, total] = await Promise.all([
      this.prisma.resume.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.resume.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<Resume | null> {
    return this.prisma.resume.findUnique({
      where: { id },
      include: {
        educations: { orderBy: { sortOrder: "asc" } },
        experiences: { orderBy: { sortOrder: "asc" } },
        skills: { include: { skill: true } },
        certifications: { orderBy: { sortOrder: "asc" } },
        projects: { orderBy: { sortOrder: "asc" } },
      },
    });
  }

  async updateById(id: string, data: Prisma.ResumeUpdateInput): Promise<Resume | null> {
    try {
      return await this.prisma.resume.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.resume.delete({ where: { id } });
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await this.prisma.resume.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    } catch (e) {}
  }

  // ================= Education =================
  async addEducation(data: Prisma.ResumeEducationCreateInput): Promise<ResumeEducation> {
    return this.prisma.resumeEducation.create({ data });
  }

  async updateEducation(id: number, data: Prisma.ResumeEducationUpdateInput): Promise<ResumeEducation | null> {
    return this.prisma.resumeEducation.update({ where: { id }, data });
  }

  async deleteEducation(id: number): Promise<void> {
    await this.prisma.resumeEducation.delete({ where: { id } });
  }

  // ================= Experience =================
  async addExperience(data: Prisma.ResumeExperienceCreateInput): Promise<ResumeExperience> {
    return this.prisma.resumeExperience.create({ data });
  }

  async updateExperience(id: number, data: Prisma.ResumeExperienceUpdateInput): Promise<ResumeExperience | null> {
    return this.prisma.resumeExperience.update({ where: { id }, data });
  }

  async deleteExperience(id: number): Promise<void> {
    await this.prisma.resumeExperience.delete({ where: { id } });
  }

  // ================= Skill =================
  async addSkill(data: Prisma.ResumeSkillCreateInput): Promise<ResumeSkill> {
    return this.prisma.resumeSkill.create({ data });
  }

  async updateSkill(resumeId: string, skillId: number, data: Prisma.ResumeSkillUpdateInput): Promise<ResumeSkill | null> {
    return this.prisma.resumeSkill.update({
      where: { resumeId_skillId: { resumeId, skillId } },
      data,
    });
  }

  async deleteSkill(resumeId: string, skillId: number): Promise<void> {
    await this.prisma.resumeSkill.delete({
      where: { resumeId_skillId: { resumeId, skillId } },
    });
  }
}
