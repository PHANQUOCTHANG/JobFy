import { Report, ReportType, ReportStatus, User } from "@prisma/client";

export type ReportUserPreview = Pick<User, "id" | "email">;

export interface IReport extends Report {
  reporter?: ReportUserPreview | null;
  reviewer?: ReportUserPreview | null;
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
