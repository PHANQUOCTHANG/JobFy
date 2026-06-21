import { Request, Response, NextFunction } from "express";
import { EmployerCandidateService } from "./employer.candidate.service";
import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const getCandidatesSchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val) : 10)),
  status: z.nativeEnum(ApplicationStatus).optional(),
  keyword: z.string().optional(),
  experience: z.union([z.string(), z.array(z.string())]).optional().transform(val => {
    if (!val) return undefined;
    return Array.isArray(val) ? val : [val];
  }),
  jobId: z.string().uuid().optional(),
  sort: z.string().optional(),
});

import { EmployerAIService } from "./employer.ai.service";

export class EmployerCandidateController {
  constructor(
    private readonly candidateService: EmployerCandidateService,
    private readonly aiService: EmployerAIService
  ) {}

  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const params = getCandidatesSchema.parse(req.query);

      const result = await this.candidateService.getCandidates(employerId, params);

      res.status(200).json({
        status: "success",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getCandidateDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { id } = req.params;

      const detail = await this.candidateService.getCandidateDetail(employerId, id as string);

      res.status(200).json({
        status: "success",
        data: detail,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(ApplicationStatus).includes(status)) {
        return res.status(400).json({ status: "fail", message: "Trạng thái không hợp lệ." });
      }

      await this.candidateService.updateApplicationStatus(employerId, id as string, status as ApplicationStatus);

      res.status(200).json({
        status: "success",
        message: "Cập nhật trạng thái thành công.",
      });
    } catch (error) {
      next(error);
    }
  };

  getAIInsights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      
      // FIX (Bug 5 & 8): Use getRawCandidatesForAI to get data with full resumes/skills
      // getCandidates() maps away the skills structure that AI service needs
      const rawCandidates = await this.candidateService.getRawCandidatesForAI(employerId, 50);
      
      // Pass raw candidates (with resumes.skills intact) to AI Service
      const insights = await this.aiService.generateCandidateInsights(rawCandidates as any[]);

      res.status(200).json({
        status: "success",
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  };

  getJobsDropdown = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const jobs = await this.candidateService.getJobsForDropdown(employerId);
      
      res.status(200).json({
        status: "success",
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  };

  exportCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const params = getCandidatesSchema.parse(req.query);
      
      const csvData = await this.candidateService.exportCandidatesAsCSV(employerId, params);
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="candidates.csv"');
      
      // Adding BOM for excel
      res.status(200).send('\uFEFF' + csvData);
    } catch (error) {
      next(error);
    }
  };

  bulkUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { applicationIds, status } = req.body;

      if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
        return res.status(400).json({ status: "error", message: "Danh sách ứng viên không hợp lệ" });
      }

      if (!status) {
        return res.status(400).json({ status: "error", message: "Trạng thái không hợp lệ" });
      }

      const result = await this.candidateService.bulkUpdateApplicationStatus(employerId, applicationIds, status as any);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getConversionReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const result = await this.candidateService.getConversionReport(employerId);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecruitmentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const result = await this.candidateService.getRecruitmentHistory(employerId);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAIQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { id } = req.params;

      const detail = await this.candidateService.getCandidateDetail(employerId, id as string);
      
      const primaryResume = detail.candidate.resumes.find(r => r.isPrimary) || detail.candidate.resumes[0];
      const skills = primaryResume?.skills.map(s => s.skill.name) || [];
      
      const questions = await this.aiService.generateInterviewQuestions(detail.job.title, skills);

      res.status(200).json({
        status: "success",
        data: { questions },
      });
    } catch (error) {
      next(error);
    }
  };

  getAIFitAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { id } = req.params;

      const detail = await this.candidateService.getCandidateDetail(employerId, id as string);
      
      const primaryResume = detail.candidate.resumes.find(r => r.isPrimary) || detail.candidate.resumes[0];
      
      const skills = primaryResume?.skills.map(s => s.skill.name).join(", ") || "Không có";
      const experiences = primaryResume?.experiences.map(exp => 
        `- Vị trí: ${exp.jobTitle} tại ${exp.companyName}. Mô tả: ${exp.description || 'Không có'}`
      ).join("\n") || "Không có";
      
      const educations = primaryResume?.educations.map(edu => 
        `- Trường: ${edu.schoolName}, Ngành: ${edu.fieldOfStudy || 'Không có'}, Bằng cấp: ${edu.degree}`
      ).join("\n") || "Không có";

      const candidateResumeText = `
Tên ứng viên: ${detail.candidate.fullName}
Tiêu đề: ${detail.candidate.headline || 'Không có'}
Cấp bậc kinh nghiệm: ${detail.candidate.experienceLevel}
Kỹ năng: ${skills}
Kinh nghiệm làm việc:
${experiences}
Học vấn:
${educations}
      `.trim();

      const fitAnalysis = await this.aiService.analyzeApplicationFit(
        detail.job.description || "",
        candidateResumeText
      );

      res.status(200).json({
        status: "success",
        data: fitAnalysis,
      });
    } catch (error) {
      next(error);
    }
  };
}
