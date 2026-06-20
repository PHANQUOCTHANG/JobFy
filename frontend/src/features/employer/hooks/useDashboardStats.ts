import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface DashboardOverview {
  totalApplications: number;
  totalJobs: number;
  activeJobs: number;
  totalViews: number;
}

export interface PipelineItem {
  status: string;
  count: number;
}

export interface RecentJob {
  id: string;
  title: string;
  jobType: string;
  status: string;
  viewCount: number;
  applyCount: number;
  createdAt: string;
  _count: { applications: number };
}

export interface DashboardData {
  overview: DashboardOverview;
  pipeline: PipelineItem[];
  recentJobs: RecentJob[];
  aiSuggestion?: string;
}

export const useDashboardStats = (timeRange: string = "all") =>
  useQuery<DashboardData>({
    queryKey: ["employer", "dashboard", timeRange],
    queryFn: () =>
      api.get("/employer/dashboard", { params: { range: timeRange } }).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
