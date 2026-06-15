import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { locationService } from "./location.service";

export const getProvinces = asyncHandler(async (req: Request, res: Response) => {
  const data = await locationService.getAllProvinces();
  return res.status(200).json(ApiResponse.success(data));
});
