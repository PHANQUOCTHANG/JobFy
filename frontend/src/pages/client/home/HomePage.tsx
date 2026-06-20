import React from "react";
import { useNavigate } from "react-router-dom";
import { JobLandingSection } from "@/features/jobs/components/JobLandingSection";
import { JobFilterParams } from "@/features/jobs";
import { CLIENT_PATHS } from "@/config/paths";

export function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (filters: Partial<JobFilterParams>) => {
    // Navigate to /jobs with query params
    const searchParams = new URLSearchParams();
    if (filters.keyword) searchParams.set("keyword", filters.keyword);
    if (filters.provinceId)
      searchParams.set("provinceId", filters.provinceId.toString());
    if (filters.categorySlug)
      searchParams.set("categorySlug", filters.categorySlug);

    navigate(`/${CLIENT_PATHS.JOBS}?${searchParams.toString()}`);
  };

  return (
    <div>
      <JobLandingSection onSearch={handleSearch} />
    </div>
  );
}

export default HomePage;
