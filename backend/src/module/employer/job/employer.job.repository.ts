import { PrismaClient, JobStatus, Jobs, Prisma } from "@prisma/client";
import { CreateJobRequest, UpdateJobRequest, GetJobsQueryRequest } from "./employer.job.request";
import slugify from "slugify";

export class EmployerJobRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findManyByCompany(companyId: string, query: GetJobsQueryRequest) {
    const { page, limit, status, keyword, categoryId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobsWhereInput = {
      companyId,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const [total, jobs] = await Promise.all([
      this.prisma.jobs.count({ where }),
      this.prisma.jobs.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          _count: { select: { applications: true, jobViews: true } },
        },
      }),
    ]);

    return { total, jobs, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByIdAndCompany(id: string, companyId: string) {
    return this.prisma.jobs.findFirst({
      where: { id, companyId, deletedAt: null },
      include: {
        category: true,
        jobSkills: { include: { skill: true } },
        jobTags: { include: { tag: true } },
        province: true,
        district: true,
      },
    });
  }

  async createWithRelations(companyId: string, postedBy: string, data: CreateJobRequest) {
    const { skillIds, tagIds, ...jobData } = data;
    
    let slug = slugify(jobData.title, { lower: true, strict: true, locale: "vi" });
    const isSlugExist = await this.prisma.jobs.findFirst({ where: { slug } });
    if (isSlugExist) slug = `${slug}-${Date.now()}`;

    // Use transaction to ensure job, skills and tags are created together
    return this.prisma.$transaction(async (tx) => {
      const job = await tx.jobs.create({
        data: {
          ...jobData,
          companyId,
          postedBy,
          slug,
        },
      });

      if (skillIds && skillIds.length > 0) {
        await tx.jobSkill.createMany({
          data: skillIds.map(skillId => ({
            jobId: job.id,
            skillId,
            isRequired: true,
          })),
        });
      }

      if (tagIds && tagIds.length > 0) {
        await tx.jobTag.createMany({
          data: tagIds.map(tagId => ({
            jobId: job.id,
            tagId,
          })),
        });
      }

      return job;
    });
  }

  async update(id: string, data: UpdateJobRequest) {
    const { skillIds, tagIds, ...jobData } = data;

    return this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.jobs.update({
        where: { id },
        data: jobData,
      });

      // Update skills if provided
      if (skillIds !== undefined) {
        await tx.jobSkill.deleteMany({ where: { jobId: id } });
        if (skillIds.length > 0) {
          await tx.jobSkill.createMany({
            data: skillIds.map(skillId => ({ jobId: id, skillId, isRequired: true })),
          });
        }
      }

      // Update tags if provided
      if (tagIds !== undefined) {
        await tx.jobTag.deleteMany({ where: { jobId: id } });
        if (tagIds.length > 0) {
          await tx.jobTag.createMany({
            data: tagIds.map(tagId => ({ jobId: id, tagId })),
          });
        }
      }

      return updatedJob;
    });
  }

  async updateStatus(id: string, status: JobStatus) {
    const updateData: Prisma.JobsUpdateInput = { status };
    
    // Set publishedAt if changing to published or pending
    if (status === JobStatus.published || status === JobStatus.pending) {
      updateData.publishedAt = new Date();
      // Default expires in 30 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      updateData.expiresAt = expiresAt;
    }

    return this.prisma.jobs.update({
      where: { id },
      data: updateData,
    });
  }

  async duplicateJob(originalJobId: string, companyId: string, postedBy: string) {
    const originalJob = await this.prisma.jobs.findUnique({
      where: { id: originalJobId },
      include: { jobSkills: true, jobTags: true },
    });

    if (!originalJob) throw new Error("Job not found");

    const newTitle = `[Copy] ${originalJob.title}`;
    let slug = slugify(newTitle, { lower: true, strict: true, locale: "vi" });
    slug = `${slug}-${Date.now()}`;

    return this.prisma.$transaction(async (tx) => {
      const newJob = await tx.jobs.create({
        data: {
          categoryId: originalJob.categoryId,
          title: newTitle,
          slug,
          description: originalJob.description,
          requirements: originalJob.requirements,
          benefits: originalJob.benefits,
          jobType: originalJob.jobType,
          experienceLevel: originalJob.experienceLevel,
          quantity: originalJob.quantity,
          salaryMin: originalJob.salaryMin,
          salaryMax: originalJob.salaryMax,
          salaryType: originalJob.salaryType,
          salaryCurrency: originalJob.salaryCurrency,
          isSalaryPublic: originalJob.isSalaryPublic,
          provinceId: originalJob.provinceId,
          districtId: originalJob.districtId,
          address: originalJob.address,
          isRemote: originalJob.isRemote,
          metaTitle: originalJob.metaTitle,
          metaDescription: originalJob.metaDescription,
          status: JobStatus.draft,
          postedBy,
          companyId,
        },
      });

      if (originalJob.jobSkills.length > 0) {
        await tx.jobSkill.createMany({
          data: originalJob.jobSkills.map(s => ({
            jobId: newJob.id,
            skillId: s.skillId,
            isRequired: s.isRequired,
          })),
        });
      }

      if (originalJob.jobTags.length > 0) {
        await tx.jobTag.createMany({
          data: originalJob.jobTags.map(t => ({
            jobId: newJob.id,
            tagId: t.tagId,
          })),
        });
      }

      return newJob;
    });
  }

  async softDelete(id: string) {
    return this.prisma.jobs.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countPendingApplications(jobId: string) {
    return this.prisma.application.count({
      where: {
        jobId,
        status: "pending",
      },
    });
  }
}
