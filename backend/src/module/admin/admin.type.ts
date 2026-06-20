import { AdminLog, User } from "@prisma/client";

export interface IAdminLog extends AdminLog {
  admin?: Pick<User, "id" | "email">;
}

export type CreateAdminLogPayload = {
  adminId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
};

export interface AdminLogPaginationParams {
  page?: number;
  limit?: number;
  action?: string;
  adminId?: string;
}

export interface ChartDataPoint {
  date: string; // "MM/DD" format
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  totalReports: number;
  newUsersToday: number;
  pendingReports: number;
  pendingCompanyVerifications: number;
  userGrowth: ChartDataPoint[];       // last 7 days
  jobGrowth: ChartDataPoint[];        // last 7 days
  applicationGrowth: ChartDataPoint[]; // last 7 days
}
