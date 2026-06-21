import { Request, Response, NextFunction } from "express";
import { LocationService, locationService } from "./location.service";
import AppError from "@/utils/appError";
import asyncHandler from "@/utils/asyncHandler";

export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Lấy danh mục ngành nghề
  getIndustries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.locationService.getIndustries();
    res.status(200).json({ status: "success", data });
  });

  // Lấy danh mục tỉnh thành
  getProvinces = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.locationService.getProvinces();
    res.status(200).json({ status: "success", data });
  });

  // Lấy danh mục quận huyện
  getDistricts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const provinceId = Number(req.query.provinceId);
    if (!provinceId) throw new AppError("Thiếu provinceId", 400);
    
    const data = await this.locationService.getDistricts(provinceId);
    res.status(200).json({ status: "success", data });
  });
}

// Khởi tạo controller và export để sử dụng
export const locationController = new LocationController(locationService);