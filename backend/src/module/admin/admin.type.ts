import { AdminLog, JobView, User } from "@prisma/client";

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

export interface DashboardStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  newUsersToday: number;
}
