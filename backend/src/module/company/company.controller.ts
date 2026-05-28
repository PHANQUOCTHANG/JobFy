import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { companyService } from "@/config/container";
import { normalizeCompanyQuery } from "./company.type";

// ================= COMPANY =================
export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.createCompany((req as any).user.id as string, req.body);
  return res.status(201).json(ApiResponse.success(data, "Tạo công ty thành công"));
});

export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeCompanyQuery(req.query);
  const result = await companyService.findAllCompanies(query);
  return res.status(200).json(ApiResponse.paginate(result));
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.findCompanyById(req.params.id as string);
  return res.status(200).json(ApiResponse.success(data));
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const data = await companyService.updateCompany(req.params.id as string, (req as any).user.id as string, isAdmin, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật thành công"));
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  await companyService.deleteCompany(req.params.id as string, (req as any).user.id as string, isAdmin);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa công ty"));
});

// ================= LOCATION =================
export const getLocations = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.getLocations(req.params.companyId as string);
  return res.status(200).json(ApiResponse.success(data));
});

export const addLocation = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const data = await companyService.addLocation(req.params.companyId as string, (req as any).user.id as string, isAdmin, req.body);
  return res.status(201).json(ApiResponse.success(data, "Thêm địa điểm thành công"));
});

export const updateLocation = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const locationId = Number(req.params.locationId);
  const data = await companyService.updateLocation(req.params.companyId as string, locationId, (req as any).user.id as string, isAdmin, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật địa điểm thành công"));
});

export const deleteLocation = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const locationId = Number(req.params.locationId);
  await companyService.deleteLocation(req.params.companyId as string, locationId, (req as any).user.id as string, isAdmin);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa địa điểm"));
});

// ================= MEMBER =================
export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const data = await companyService.getMembers(req.params.companyId as string);
  return res.status(200).json(ApiResponse.success(data));
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const data = await companyService.addMember(req.params.companyId as string, (req as any).user.id as string, isAdmin, req.body);
  return res.status(201).json(ApiResponse.success(data, "Thêm thành viên thành công"));
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const memberId = Number(req.params.memberId);
  const data = await companyService.updateMember(req.params.companyId as string, memberId, (req as any).user.id as string, isAdmin, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật thành viên thành công"));
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = (req as any).user.role === "admin" || (req as any).user.role === "ADMIN";
  const memberId = Number(req.params.memberId);
  await companyService.removeMember(req.params.companyId as string, memberId, (req as any).user.id as string, isAdmin);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa thành viên"));
});
