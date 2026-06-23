import { Request, Response } from 'express';
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { CoverLetterService } from './cover-letter.service';

export class CoverLetterController {
  constructor(private coverLetterService: CoverLetterService) {}

  public create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.coverLetterService.createCoverLetter(req.user!.userId, req.body);
    return res.status(201).json(ApiResponse.success(result, 'Tạo Cover Letter thành công'));
  });

  public getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.coverLetterService.getCoverLetters(req.user!.userId);
    return res.status(200).json(ApiResponse.success(result, 'Lấy danh sách Cover Letter thành công'));
  });

  public getById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.coverLetterService.getCoverLetterById(req.params.id as string, req.user!.userId);
    return res.status(200).json(ApiResponse.success(result, 'Lấy Cover Letter thành công'));
  });

  public update = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.coverLetterService.updateCoverLetter(req.params.id as string, req.user!.userId, req.body);
    return res.status(200).json(ApiResponse.success(result, 'Cập nhật Cover Letter thành công'));
  });

  public delete = asyncHandler(async (req: Request, res: Response) => {
    await this.coverLetterService.deleteCoverLetter(req.params.id as string, req.user!.userId);
    return res.status(200).json(ApiResponse.success(null, 'Xóa Cover Letter thành công'));
  });
}
