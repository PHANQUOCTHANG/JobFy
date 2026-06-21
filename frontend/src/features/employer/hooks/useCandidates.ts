import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface CandidateQuery {
  page?: number;
  limit?: number;
  status?: string;
  keyword?: string;
  experience?: string[];
  jobId?: string;
  sort?: string;
}

export interface CandidateResponse {
  data: CandidateItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CandidateItem {
  id: string;
  status: string;
  appliedAt: string;
  jobTitle: string;
  aiScore?: number;
  candidate: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    expectedSalaryMin?: number;
    expectedSalaryMax?: number;
    experienceLevel?: string;
    latestExperience?: {
      companyName: string;
      jobTitle: string;
      endDate: string | null;
    } | null;
    skills: string[];
  };
}

export const useCandidates = (params: CandidateQuery) =>
  useQuery<CandidateResponse>({
    queryKey: ["employer", "candidates", params],
    queryFn: () => {
      // Loại bỏ các param rỗng để không bị lỗi Zod UUID ở Backend
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );
      return api.get("/employer/candidates", { params: cleanedParams }).then((r) => r.data);
    },
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateCandidateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/employer/candidates/${id}/status`, { status }),
    onSuccess: () => {
      // Invalidate queries so that the list refetches
      queryClient.invalidateQueries({ queryKey: ["employer", "candidates"] });
      // Invalidate dashboard as well
      queryClient.invalidateQueries({ queryKey: ["employer", "dashboard"] });
    },
  });
};

export const useCandidateAIInsights = (params: CandidateQuery) =>
  useQuery({
    queryKey: ["employer", "candidates", "ai-insights", params],
    queryFn: () =>
      api.get("/employer/candidates/ai-insights", { params }).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export interface JobDropdownItem {
  id: string;
  title: string;
  status: string;
}

export const useEmployerJobsDropdown = () =>
  useQuery<JobDropdownItem[]>({
    queryKey: ["employer", "jobs", "dropdown"],
    queryFn: () =>
      api.get("/employer/jobs/dropdown").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useCandidateDetail = (applicationId: string | null) =>
  useQuery({
    queryKey: ["employer", "candidates", "detail", applicationId],
    queryFn: () =>
      api.get(`/employer/candidates/${applicationId}/detail`).then((r) => r.data.data),
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateBulkCandidateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { applicationIds: string[]; status: string }) =>
      api.patch("/employer/candidates/bulk-status", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer", "candidates"] });
      queryClient.invalidateQueries({ queryKey: ["employer", "dashboard"] });
    },
  });
};

export const useConversionReport = () =>
  useQuery({
    queryKey: ["employer", "candidates", "conversion-report"],
    queryFn: () =>
      api.get("/employer/candidates/conversion-report").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useRecruitmentHistory = () =>
  useQuery({
    queryKey: ["employer", "candidates", "history"],
    queryFn: () =>
      api.get("/employer/candidates/history").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });
