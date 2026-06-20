import { Request, Response, NextFunction } from "express";
import { EmployerVerificationService } from "./employer.service";
import { EmployerDashboardService } from "./employer.dashboard";
import { EmployerAIService } from "./employer.ai.service";
import { IOtpService } from "@/module/auth/otp/otp.service";
import AppError from "@/utils/appError";
import { updateCompanyInfoSchema, submitLegalDocsSchema } from "./employer.request";

export class EmployerController {
  constructor(
    private readonly verificationService: EmployerVerificationService,
    private readonly otpService: IOtpService,
    private readonly dashboardService: EmployerDashboardService,
    private readonly aiService: EmployerAIService
  ) {}

  // Lấy trạng thái tiến trình 3 bước
  getProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sửa từ req.user.id thành req.user.userId để khớp với định nghĩa express.ts
      const data = await this.verificationService.getVerificationProgress(req.user!.userId);
      res.status(200).json({ status: "success", data });
    } catch (error) { 
      next(error); 
    }
  };

  // Lấy thông tin công ty hiện tại (dùng để điền form ở Bước 2)
  getCompanyInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.verificationService.getCompanyProfile(req.user!.userId);
      res.status(200).json({ status: "success", data });
    } catch (error) { 
      next(error); 
    }
  };

  // Bước 1: Gửi lại OTP xác thực
  resendEmailOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!this.otpService || typeof this.otpService.send !== 'function') {
        return res.status(500).json({ status: "error", message: "Hệ thống chưa cấu hình OtpService" });
      }

      let email = req.user?.email;

      if (!email) {
        // Fallback: Lấy từ DB nếu token cũ không có email
        email = await this.verificationService.getUserEmail(req.user!.userId);
      }

      await this.otpService.send(email, "VERIFY_ACCOUNT");
      res.status(200).json({ status: "success", message: "Mã OTP đã được gửi" });
    } catch (error) { 
      next(error); 
    }
  };

  // Bước 1: Xác thực mã OTP
  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body;
      if (!otp) throw new AppError("Vui lòng nhập mã OTP", 400);

      // Chuẩn hóa input để tránh lỗi copy-paste
      const trimmedOtp = otp.toString().trim();
      const email = (req.user?.email || await this.verificationService.getUserEmail(req.user!.userId)).toLowerCase().trim();
      console.log('[EmployerController.verifyEmail] userId=', req.user!.userId, 'email=', email, 'otp=', trimmedOtp);


      // 1. Kiểm tra OTP qua OtpService
      await this.otpService.verify(email, trimmedOtp, "VERIFY_ACCOUNT");

      // 2. Cập nhật DB
      await this.verificationService.markEmailAsVerified(req.user!.userId);

      res.status(200).json({ status: "success", message: "Xác thực email thành công" });
    } catch (error) {
      next(error);
    }
  };

  // Bước 2: Cập nhật thông tin công ty
  updateInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log để kiểm tra dữ liệu thực tế nhận từ Frontend
      console.log('[EmployerController.updateInfo] Payload:', req.body);
      const validated = updateCompanyInfoSchema.parse(req.body);
      await this.verificationService.updateCompanyProfile( // requireAuth đảm bảo req.user tồn tại
        req.user!.userId, 
        validated
      );
      res.status(200).json({ status: "success", message: "Cập nhật hồ sơ thành công" });
    } catch (error) { next(error); }
  };

  // Bước 3: Gửi hồ sơ pháp lý
  submitLegal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = submitLegalDocsSchema.parse(req.body);
      await this.verificationService.submitLegalVerification( // requireAuth đảm bảo req.user tồn tại
        req.user!.userId, 
        validated
      );
      res.status(200).json({ 
        status: "success", 
        message: "Hồ sơ đã được gửi và đang chờ quản trị viên phê duyệt" 
      });
    } catch (error) { next(error); }
  };

  // Dashboard: Lấy thống kê tổng quan cho employer
  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { range } = req.query; // e.g., '30d', '7d', 'all'
      
      let startDate: Date | undefined = undefined;
      
      if (range === '7d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === '30d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
      } // 'all' or undefined leaves startDate as undefined

      const [overview, pipeline, recentJobs] = await Promise.all([
        this.dashboardService.getOverview(employerId, startDate),
        this.dashboardService.getPipeline(employerId, startDate),
        this.dashboardService.getRecentJobs(employerId, 6, startDate),
      ]);

      // Gọi AI sau khi đã có dữ liệu overview và pipeline
      const aiSuggestion = await this.aiService.generateRecruitmentAdvice(overview, pipeline);

      res.status(200).json({
        status: "success",
        data: { overview, pipeline, recentJobs, aiSuggestion },
      });
    } catch (error) {
      next(error);
    }
  };

  // Dashboard: Xuất báo cáo CSV
  exportDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.userId;
      const { range } = req.query;
      
      let startDate: Date | undefined = undefined;
      if (range === '7d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === '30d') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
      }

      // Lấy danh sách tin đăng để xuất báo cáo (limit 100)
      const jobs = await this.dashboardService.getRecentJobs(employerId, 100, startDate);
      
      const header = "Tiêu đề công việc,Hình thức,Trạng thái,Lượt xem,Lượt ứng tuyển,Ngày tạo\n";
      const rows = jobs.map(job => {
        const title = `"${job.title.replace(/"/g, '""')}"`;
        const jobType = `"${job.jobType}"`;
        const status = `"${job.status}"`;
        const views = job.viewCount;
        const applies = job._count?.applications || 0;
        const date = `"${new Date(job.createdAt).toLocaleDateString('vi-VN')}"`;
        return `${title},${jobType},${status},${views},${applies},${date}`;
      }).join('\n');

      const csvString = '\uFEFF' + header + rows; // BOM để Excel nhận tiếng Việt
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="bao-cao-jobfy-${Date.now()}.csv"`);
      res.status(200).send(csvString);
    } catch (error) {
      next(error);
    }
  };
}