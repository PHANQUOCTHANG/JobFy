export interface IAdminLog {
  id: bigint;
  adminId: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string | null;
  createdAt: Date;
  admin?: {
    id: string;
    email: string;
  } | null;
}

export interface CreateAdminLogPayload {
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminLogPaginationParams {
  page?: number;
  limit?: number;
  action?: string;
  adminId?: string;
}

export interface ChartDataPoint {
  date: string;
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
  totalRevenue: number;
  newUsersToday: number;
  pendingReports: number;
  pendingCompanyVerifications: number;
  userGrowth: ChartDataPoint[];
  jobGrowth: ChartDataPoint[];
  applicationGrowth: ChartDataPoint[];
  revenueGrowth: ChartDataPoint[];
  roleDistribution: { name: string; value: number }[];
  jobStatusDistribution: { name: string; value: number }[];
  topCompanies: { id: string; name: string; totalJobs: number; logoUrl: string | null }[];
}
