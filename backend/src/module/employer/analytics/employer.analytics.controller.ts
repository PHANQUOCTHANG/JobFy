import { Request, Response, NextFunction } from "express";
import { EmployerAnalyticsService } from "./employer.analytics.service";

export class EmployerAnalyticsController {
  constructor(private readonly analyticsService: EmployerAnalyticsService) {}

  getApplicationTrends = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = await this.analyticsService.getApplicationTrends(userId);

      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  };

  getJobPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = await this.analyticsService.getJobPerformance(userId);

      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  };

  getApplicationSources = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = await this.analyticsService.getApplicationSources(userId);

      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  };

  getTimeToHire = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = await this.analyticsService.getTimeToHire(userId);

      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  };

  getTopSkills = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = await this.analyticsService.getTopSkills(userId);

      res.status(200).json({ status: "success", data });
    } catch (error) {
      next(error);
    }
  };
}
