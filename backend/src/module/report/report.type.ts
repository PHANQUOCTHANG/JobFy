import { Report, ReportType, ReportStatus, User } from "@prisma/client";

export interface IReport extends Report {
  reporter?: User;
  reviewer?: User;
}

export type CreateReportPayload = {
  reporterId: string;
  type: ReportType;
  refType: string;
  refId: string;
  reason: string;
};

export type UpdateReportPayload = {
  status: ReportStatus;
  resolutionNote?: string;
  reviewedBy: string;
};

export interface ReportPaginationParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  refType?: string;
}
