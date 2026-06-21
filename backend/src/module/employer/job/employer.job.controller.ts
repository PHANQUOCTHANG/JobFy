import { Request, Response, NextFunction } from "express";
import { EmployerJobService } from "./employer.job.service";
import { createJobSchema, updateJobSchema, changeJobStatusSchema, getJobsQuerySchema } from "./employer.job.request";

export class EmployerJobController {
  constructor(private readonly jobService: EmployerJobService) {}

  getMyJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const query = getJobsQuerySchema.parse(req.query);
      const result = await this.jobService.getMyJobs(userId, query);

      res.status(200).json({
        status: "success",
        data: result.jobs,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getJobDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const job = await this.jobService.getJobDetail(userId, id as string);

      res.status(200).json({
        status: "success",
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };

  createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const data = createJobSchema.parse(req.body);
      const newJob = await this.jobService.createJob(userId, data);

      res.status(201).json({
        status: "success",
        message: "Tạo tin tuyển dụng thành công",
        data: newJob,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const data = updateJobSchema.parse(req.body);
      
      const updatedJob = await this.jobService.updateJob(userId, id as string, data);

      res.status(200).json({
        status: "success",
        message: "Cập nhật tin tuyển dụng thành công",
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  };

  changeJobStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { status } = changeJobStatusSchema.parse(req.body);
      
      const updatedJob = await this.jobService.changeJobStatus(userId, id as string, status);

      res.status(200).json({
        status: "success",
        message: "Cập nhật trạng thái tin thành công",
        data: updatedJob,
      });
    } catch (error) {
      next(error);
    }
  };

  duplicateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      
      const newJob = await this.jobService.duplicateJob(userId, id as string);

      res.status(201).json({
        status: "success",
        message: "Nhân bản tin tuyển dụng thành công",
        data: newJob,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      
      await this.jobService.deleteJob(userId, id as string);

      res.status(200).json({
        status: "success",
        message: "Xóa tin tuyển dụng thành công",
      });
    } catch (error) {
      next(error);
    }
  };
}
