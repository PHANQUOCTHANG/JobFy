import { IReport } from "./report.type";

export const toReportResponse = (report: IReport) => {
  return {
    id: report.id,
    type: report.type,
    refType: report.refType,
    refId: report.refId,
    reason: report.reason,
    status: report.status,
    resolutionNote: report.resolutionNote,
    createdAt: report.createdAt,
    reviewedAt: report.reviewedAt,
    reporter: report.reporter ? {
      id: report.reporter.id,
      email: report.reporter.email,
      fullName: (report.reporter as any).candidateProfile?.fullName,
    } : undefined,
    reviewer: report.reviewer ? {
      id: report.reviewer.id,
      email: report.reviewer.email,
    } : undefined
  };
};

export const toReportListResponse = (reports: IReport[]) => {
  return reports.map(toReportResponse);
};
