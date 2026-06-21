import { Router } from "express";
import { EmployerController } from "./employer.controller";
import { EmployerVerificationService } from "./employer.service";
import { OtpService } from "@/module/auth/otp/otp.service";
import { OtpRepository } from "@/module/auth/otp/otp.repository";
import { UserRepository } from "@/module/user/user.repository";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { uploadSettingImage, uploadLegalDocument } from "@/middleware/upload.middleware";
import prisma from "@/lib/prisma";


const router = Router();

// Middleware Debug: Bắt mọi request đi vào router này để kiểm tra URL thực tế
router.use((req, res, next) => {
  next();
});

const service = new EmployerVerificationService(prisma);

// Khởi tạo OtpService thật thay vì dùng {}
const otpRepo = new OtpRepository(prisma);
const userRepo = new UserRepository(prisma);
const otpService = new OtpService(otpRepo, userRepo);
const controller = new EmployerController(service, otpService);

router.use(requireAuth, requireRole("employer"));

router.get("/verification-progress", controller.getProgress);
router.post("/resend-otp", controller.resendEmailOtp);
router.post("/verify-email", controller.verifyEmail);
router.post("/verify-phone", controller.verifyPhone);
router.get("/company-info", controller.getCompanyInfo);
router.patch("/company-info", controller.updateInfo);
router.post("/submit-legal", controller.submitLegal);
router.post("/upload-image", uploadSettingImage, controller.uploadImage);
router.post("/upload-document", uploadLegalDocument, controller.uploadDocument);

export default router;