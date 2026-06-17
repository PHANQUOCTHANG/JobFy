import { Request, Response, NextFunction } from "express";
import { AdminEmployerService } from "./admin-employer.service";
import { verifyCompanySchema } from "./admin-employer.request";

export class AdminEmployerController {
  constructor(private readonly adminService: AdminEmployerService) {}

  getPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.adminService.getPendingCompanies(page, limit);
      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };

  getDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.params;
      const result = await this.adminService.getCompanyDetail(companyId as string);
      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId } = req.params;
      const validated = verifyCompanySchema.parse(req.body);
      
      const result = await this.adminService.verifyCompany(
        companyId as string,
        req.user!.userId,
        validated
      );

      res.status(200).json({
        status: "success",
        message: validated.status === "approved" ? "Đã phê duyệt hồ sơ" : "Đã từ chối hồ sơ",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}