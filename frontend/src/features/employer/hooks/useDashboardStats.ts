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

export interface SourceItem {
  source: string;
  count: number;
  percent: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  pipeline: PipelineItem[];
  recentJobs: RecentJob[];
  sources?: SourceItem[];
}

export const useDashboardStats = (timeRange: string = "all") =>
  useQuery<DashboardData>({
    queryKey: ["employer", "dashboard", timeRange],
    queryFn: () =>
      api.get("/employer/dashboard", { params: { range: timeRange } }).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

export const useDashboardAI = (timeRange: string = "all") =>
  useQuery<{ aiSuggestion: string }>({
    queryKey: ["employer", "dashboard-ai", timeRange],
    queryFn: () =>
      api.get("/employer/dashboard/ai-advice", { params: { range: timeRange } }).then((r) => r.data.data),
    staleTime: 15 * 60 * 1000, // Cache longer to save Groq API calls
    retry: 1,
  });

export interface TrendItem {
  month: string;
  count: number;
}

export const useApplicationTrends = () =>
  useQuery<TrendItem[]>({
    queryKey: ["employer", "analytics", "trends"],
    queryFn: () =>
      api.get("/employer/analytics/trends").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
