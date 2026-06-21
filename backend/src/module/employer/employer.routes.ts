import { Router } from "express";
import { EmployerController } from "./employer.controller";
import { EmployerVerificationService } from "./employer.service";
import { EmployerDashboardService } from "./employer.dashboard";
import { EmployerAIService } from "./employer.ai.service";
import { EmployerCandidateService } from "./employer.candidate.service";
import { EmployerCandidateController } from "./employer.candidate.controller";
import { EmployerJobService } from "./job/employer.job.service";
import { EmployerJobController } from "./job/employer.job.controller";
import { EmployerInterviewService } from "./interview/employer.interview.service";
import { EmployerInterviewController } from "./interview/employer.interview.controller";
import { EmployerNoteService } from "./note/employer.note.service";
import { EmployerNoteController } from "./note/employer.note.controller";
import { EmployerAnalyticsService } from "./analytics/employer.analytics.service";
import { EmployerAnalyticsController } from "./analytics/employer.analytics.controller";
import { OtpService } from "@/module/auth/otp/otp.service";
import { OtpRepository } from "@/module/auth/otp/otp.repository";
import { UserRepository } from "@/module/user/user.repository";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { uploadSettingImage, uploadLegalDocument } from "@/middleware/upload.middleware";
import { EmailService } from "@/module/auth/email/email.service";
import prisma from "@/lib/prisma";


const router = Router();

// Middleware Debug: Bắt mọi request đi vào router này để kiểm tra URL thực tế
router.use((req, res, next) => {
  next();
});

const service = new EmployerVerificationService(prisma);
const dashboardService = new EmployerDashboardService(prisma);
const aiService = new EmployerAIService();
const emailService = new EmailService();
const candidateService = new EmployerCandidateService(prisma, emailService);

// Khởi tạo OtpService thật thay vì dùng {}
const otpRepo = new OtpRepository(prisma);
const userRepo = new UserRepository(prisma);
const otpService = new OtpService(otpRepo, userRepo);

const controller = new EmployerController(service, otpService, dashboardService, aiService);
const candidateController = new EmployerCandidateController(candidateService, aiService);

const jobService = new EmployerJobService(prisma);
const jobController = new EmployerJobController(jobService);

const interviewService = new EmployerInterviewService(prisma, emailService);
const interviewController = new EmployerInterviewController(interviewService);

const noteService = new EmployerNoteService(prisma);
const noteController = new EmployerNoteController(noteService);

const analyticsService = new EmployerAnalyticsService(prisma);
const analyticsController = new EmployerAnalyticsController(analyticsService);

router.use(requireAuth, requireRole("employer"));

router.get("/dashboard/export", controller.exportDashboard);
router.get("/dashboard", controller.getDashboard);

// Analytics
router.get("/analytics/trends", analyticsController.getApplicationTrends);
router.get("/analytics/job-performance", analyticsController.getJobPerformance);
router.get("/analytics/source", analyticsController.getApplicationSources);
router.get("/analytics/time-to-hire", analyticsController.getTimeToHire);
router.get("/analytics/top-skills", analyticsController.getTopSkills);

router.get("/verification-progress", controller.getProgress);
router.post("/resend-otp", controller.resendEmailOtp);
router.post("/verify-email", controller.verifyEmail);
router.post("/verify-phone", controller.verifyPhone);
router.get("/company-info", controller.getCompanyInfo);
router.patch("/company-info", controller.updateInfo);
router.post("/submit-legal", controller.submitLegal);
router.post("/upload-image", uploadSettingImage, controller.uploadImage);
router.post("/upload-document", uploadLegalDocument, controller.uploadDocument);

// Candidates
router.get("/jobs/dropdown", candidateController.getJobsDropdown);
router.get("/candidates", candidateController.getCandidates);
router.get("/candidates/export", candidateController.exportCandidates);
router.get("/candidates/ai-insights", candidateController.getAIInsights);
router.get("/candidates/history", candidateController.getRecruitmentHistory);
router.get("/candidates/conversion-report", candidateController.getConversionReport);
router.patch("/candidates/bulk-status", candidateController.bulkUpdateStatus);
router.get("/candidates/:id/detail", candidateController.getCandidateDetail);
router.patch("/candidates/:id/status", candidateController.updateStatus);

// Application Notes
router.get("/candidates/:id/notes", noteController.getNotes);
router.post("/candidates/notes", noteController.addNote); // the body has applicationId
router.patch("/candidates/notes/:noteId", noteController.updateNote);
router.delete("/candidates/notes/:noteId", noteController.deleteNote);

// Job Management
router.get("/jobs", jobController.getMyJobs);
router.post("/jobs", jobController.createJob);
router.get("/jobs/:id", jobController.getJobDetail);
router.patch("/jobs/:id", jobController.updateJob);
router.delete("/jobs/:id", jobController.deleteJob);
router.patch("/jobs/:id/status", jobController.changeJobStatus);
router.post("/jobs/:id/duplicate", jobController.duplicateJob);

// Interview Scheduling
router.get("/interviews", interviewController.getInterviews);
router.post("/interviews", interviewController.scheduleInterview);
router.delete("/interviews/:id", interviewController.cancelInterview);

export default router;