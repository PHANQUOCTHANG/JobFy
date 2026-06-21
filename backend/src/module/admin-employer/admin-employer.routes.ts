import { Router } from "express";
import { AdminEmployerController } from "./admin-employer.controller";
import { AdminEmployerService } from "./admin-employer.service";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import prisma from "@/lib/prisma";

const router = Router();
const service = new AdminEmployerService(prisma);
const controller = new AdminEmployerController(service);

// Chỉ Admin mới có quyền truy cập group API này
router.use(requireAuth, requireRole("admin"));

router.get("/pending", controller.getPending);
router.get("/:companyId", controller.getDetail);
router.patch("/:companyId/verify", controller.verify);

export default router;