import { Request, Response, NextFunction } from "express";
import { EmployerInterviewService } from "./employer.interview.service";
import { scheduleInterviewSchema, cancelInterviewSchema } from "./employer.interview.request";

export class EmployerInterviewController {
  constructor(private readonly interviewService: EmployerInterviewService) {}

  getInterviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.interviewService.getInterviews(userId);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  scheduleInterview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = scheduleInterviewSchema.parse(req.body);
      
      const result = await this.interviewService.scheduleInterview(userId, data);

      res.status(201).json({
        status: "success",
        message: "Lên lịch phỏng vấn thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  cancelInterview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params; // applicationId
      const data = cancelInterviewSchema.parse(req.body);
      
      await this.interviewService.cancelInterview(userId, id as string, data);

      res.status(200).json({
        status: "success",
        message: "Hủy lịch phỏng vấn thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}
